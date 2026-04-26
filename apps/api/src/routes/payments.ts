import type { FastifyPluginAsync } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import Razorpay from "razorpay";
import type { Env } from "../config.js";
import { requireUser } from "../lib/auth-guard.js";
import { prisma } from "../lib/prisma.js";

const createOrderBody = z.object({
  applicationId: z.string().uuid(),
});

const confirmBody = z.object({
  applicationId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

export const paymentRoutes: FastifyPluginAsync<{ env: Env }> = async (app, opts) => {
  const { env } = opts;

  app.get("/payments/capabilities", async (_request, reply) => {
    return reply.send({
      razorpayConfigured: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
      dummyCheckoutAvailable: env.ALLOW_DUMMY_PAYMENTS_ENABLED,
    });
  });

  app.post(
    "/payments/create-order",
    { preHandler: requireUser },
    async (request, reply) => {
      if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
        return reply.status(503).send({
          error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to apps/api/.env",
        });
      }

      const parsed = createOrderBody.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      }
      const user = request.authUser!;

      const application = await prisma.application.findFirst({
        where: { id: parsed.data.applicationId, userId: user.id },
        include: {
          program: { include: { institute: true, paymentPlans: { where: { active: true }, take: 1 } } },
        },
      });

      if (!application) return reply.status(404).send({ error: "Application not found" });
      if (!["SUBMITTED", "PAYMENT_PENDING"].includes(application.status)) {
        return reply.status(400).send({ error: "Application is not payable in its current state" });
      }

      const plan = application.program.paymentPlans[0];
      if (!plan) return reply.status(400).send({ error: "No active payment plan for this program" });

      const razorpay = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });

      const receipt = `app_${application.id.slice(0, 8)}`;
      const order = await razorpay.orders.create({
        amount: plan.amountPaise,
        currency: plan.currency,
        receipt,
        payment_capture: true,
      });

      await prisma.paymentDetail.create({
        data: {
          userId: user.id,
          applicationId: application.id,
          paymentPlanId: plan.id,
          razorpayOrderId: order.id,
          amountPaise: plan.amountPaise,
          currency: plan.currency,
          status: "CREATED",
        },
      });

      await prisma.application.update({
        where: { id: application.id },
        data: { status: "PAYMENT_PENDING" },
      });

      return reply.send({
        orderId: order.id,
        amount: plan.amountPaise,
        currency: plan.currency,
        keyId: env.RAZORPAY_KEY_ID,
        applicationId: application.id,
      });
    },
  );

  app.post(
    "/payments/confirm",
    { preHandler: requireUser },
    async (request, reply) => {
      if (!env.RAZORPAY_KEY_SECRET) {
        return reply.status(503).send({ error: "Razorpay is not configured" });
      }

      const parsed = confirmBody.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      }
      const user = request.authUser!;

      const application = await prisma.application.findFirst({
        where: { id: parsed.data.applicationId, userId: user.id },
        include: { program: { include: { institute: true } } },
      });
      if (!application) return reply.status(404).send({ error: "Application not found" });

      const payment = await prisma.paymentDetail.findFirst({
        where: {
          applicationId: application.id,
          razorpayOrderId: parsed.data.razorpay_order_id,
          userId: user.id,
        },
        orderBy: { createdAt: "desc" },
      });
      if (!payment) return reply.status(404).send({ error: "Payment record not found" });

      const valid = verifyRazorpaySignature(
        parsed.data.razorpay_order_id,
        parsed.data.razorpay_payment_id,
        parsed.data.razorpay_signature,
        env.RAZORPAY_KEY_SECRET,
      );
      if (!valid) return reply.status(400).send({ error: "Invalid signature" });

      const nextStatus = application.program.institute.isPartner ? "ENROLLMENT_PENDING" : "LEAD_SENT";

      await prisma.$transaction([
        prisma.paymentDetail.update({
          where: { id: payment.id },
          data: {
            status: "CAPTURED",
            razorpayPaymentId: parsed.data.razorpay_payment_id,
            razorpaySignature: parsed.data.razorpay_signature,
          },
        }),
        prisma.application.update({
          where: { id: application.id },
          data: { status: nextStatus },
        }),
      ]);

      return reply.send({
        ok: true,
        applicationStatus: nextStatus,
        partner: application.program.institute.isPartner,
      });
    },
  );

  app.post(
    "/payments/dummy-complete",
    { preHandler: requireUser },
    async (request, reply) => {
      if (!env.ALLOW_DUMMY_PAYMENTS_ENABLED) {
        return reply.status(403).send({ error: "Dummy checkout is not enabled in this environment" });
      }

      const parsed = createOrderBody.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: "Invalid payload", details: parsed.error.flatten() });
      }
      const user = request.authUser!;

      const application = await prisma.application.findFirst({
        where: { id: parsed.data.applicationId, userId: user.id },
        include: {
          program: {
            include: {
              institute: true,
              paymentPlans: { where: { active: true }, take: 1 },
            },
          },
        },
      });

      if (!application) return reply.status(404).send({ error: "Application not found" });
      if (!["SUBMITTED", "PAYMENT_PENDING"].includes(application.status)) {
        return reply.status(400).send({ error: "Application is not payable in its current state" });
      }

      const plan = application.program.paymentPlans[0];
      if (!plan) return reply.status(400).send({ error: "No active payment plan for this program" });

      const existing = await prisma.paymentDetail.findFirst({
        where: { applicationId: application.id, userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (existing?.status === "CAPTURED") {
        return reply.status(400).send({ error: "Payment already completed for this application" });
      }

      const nextStatus = application.program.institute.isPartner ? "ENROLLMENT_PENDING" : "LEAD_SENT";
      const payId = `dummy_pay_${crypto.randomUUID()}`;

      await prisma.$transaction(async (tx) => {
        if (existing && existing.status === "CREATED") {
          await tx.paymentDetail.update({
            where: { id: existing.id },
            data: {
              status: "CAPTURED",
              razorpayPaymentId: payId,
              razorpaySignature: "dummy_demo",
            },
          });
        } else {
          await tx.paymentDetail.create({
            data: {
              userId: user.id,
              applicationId: application.id,
              paymentPlanId: plan.id,
              razorpayOrderId: `dummy_${crypto.randomUUID()}`,
              amountPaise: plan.amountPaise,
              currency: plan.currency,
              status: "CAPTURED",
              razorpayPaymentId: payId,
              razorpaySignature: "dummy_demo",
            },
          });
        }

        await tx.application.update({
          where: { id: application.id },
          data: { status: nextStatus },
        });
      });

      return reply.send({
        ok: true,
        applicationStatus: nextStatus,
        partner: application.program.institute.isPartner,
        enrollmentReference: application.id,
      });
    },
  );
};
