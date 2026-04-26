import crypto from "node:crypto";
import type { Env } from "../config.js";
import { prisma } from "./prisma.js";

const COOKIE_NAME = "dam_session";

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createDbSession(
  env: Env,
  userId: string,
  meta?: { userAgent?: string; ip?: string },
) {
  const token = createSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.SESSION_DAYS);

  await prisma.activeSession.create({
    data: {
      userId,
      token,
      expiresAt,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    },
  });

  return { token, expiresAt };
}

export async function getUserFromSessionToken(token: string | undefined) {
  if (!token) return null;
  const session = await prisma.activeSession.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.activeSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
}

export async function deleteSessionToken(token: string | undefined) {
  if (!token) return;
  await prisma.activeSession.deleteMany({ where: { token } });
}

export function cookieOptions(env: Env) {
  const secure = env.NODE_ENV === "production";
  return {
    httpOnly: true as const,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: env.SESSION_DAYS * 24 * 60 * 60,
  };
}
