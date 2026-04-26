import type { FastifyPluginAsync } from "fastify";
import type { ExamListingKind, Prisma, StudyMode } from "@prisma/client";
import { z } from "zod";
import { distanceKm } from "../lib/geo.js";
import { prisma } from "../lib/prisma.js";

const optionalCoord = z.preprocess((v) => (v === "" || v == null || v === undefined ? undefined : v), z.coerce.number().finite());

const instituteSearchQuerySchema = z.object({
  query: z.string().trim().min(1).max(160),
  kind: z.enum(["COMPETITIVE_EXAM", "NON_DEGREE_COURSE", "ALL"]).default("ALL"),
  userLat: optionalCoord.optional(),
  userLng: optionalCoord.optional(),
});

export const catalogRoutes: FastifyPluginAsync = async (app) => {
  /** All fields with exams — browse every competitive exam in one view */
  app.get("/catalog/exams", async (_request, reply) => {
    const fields = await prisma.academicField.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        exams: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, slug: true, name: true, listingKind: true },
        },
      },
    });
    return reply.send({
      fields: fields.map((f) => ({
        id: f.id,
        slug: f.slug,
        name: f.name,
        exams: f.exams,
      })),
    });
  });

  /**
   * Institutes offering programmes tied to exams / non-degree listings that match `query`.
   * Sorted by distance when userLat & userLng and institute coordinates exist; else by city name.
   */
  app.get("/catalog/institute-offerings", async (request, reply) => {
    const parsed = instituteSearchQuerySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Invalid query", details: parsed.error.flatten() });
    }
    const { query, kind, userLat, userLng } = parsed.data;
    const tokens = query.split(/\s+/).filter(Boolean);

    const where: Prisma.ExamWhereInput = {
      AND: tokens.map((t) => ({
        OR: [
          { name: { contains: t, mode: "insensitive" } },
          { slug: { contains: t, mode: "insensitive" } },
        ],
      })),
    };
    if (kind !== "ALL") {
      where.listingKind = kind as ExamListingKind;
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        programs: {
          include: {
            institute: true,
            paymentPlans: { where: { active: true }, select: { amountPaise: true } },
          },
        },
      },
      take: 40,
    });

    type Row = {
      institute: {
        id: string;
        name: string;
        shortBio: string;
        city: string;
        isPartner: boolean;
        logoEmoji: string;
        latitude: number | null;
        longitude: number | null;
        averageRating: number;
        reviewCount: number;
        accreditationTag: string | null;
        typeLabel: string | null;
        establishedYear: number | null;
      };
      programCount: number;
      programNames: string[];
      matchedExams: { id: string; name: string; listingKind: ExamListingKind }[];
      distanceKm: number | null;
      feeMinPaise: number | null;
      feeMaxPaise: number | null;
      studyModes: StudyMode[];
    };

    const byInstitute = new Map<string, Row>();

    for (const exam of exams) {
      for (const prog of exam.programs) {
        const ins = prog.institute;
        let row = byInstitute.get(ins.id);
        if (!row) {
          row = {
            institute: {
              id: ins.id,
              name: ins.name,
              shortBio: ins.shortBio,
              city: ins.city,
              isPartner: ins.isPartner,
              logoEmoji: ins.logoEmoji,
              latitude: ins.latitude,
              longitude: ins.longitude,
              averageRating: ins.averageRating,
              reviewCount: ins.reviewCount,
              accreditationTag: ins.accreditationTag,
              typeLabel: ins.typeLabel,
              establishedYear: ins.establishedYear,
            },
            programCount: 0,
            programNames: [],
            matchedExams: [],
            distanceKm: null,
            feeMinPaise: null,
            feeMaxPaise: null,
            studyModes: [],
          };
          byInstitute.set(ins.id, row);
        }
        row.programCount += 1;
        if (!row.programNames.includes(prog.name)) {
          row.programNames.push(prog.name);
        }
        const planAmounts = prog.paymentPlans.map((pp) => pp.amountPaise).filter((n) => n > 0);
        if (planAmounts.length) {
          const lo = Math.min(...planAmounts);
          const hi = Math.max(...planAmounts);
          row.feeMinPaise = row.feeMinPaise == null ? lo : Math.min(row.feeMinPaise, lo);
          row.feeMaxPaise = row.feeMaxPaise == null ? hi : Math.max(row.feeMaxPaise, hi);
        }
        if (!row.studyModes.includes(prog.studyMode)) {
          row.studyModes.push(prog.studyMode);
        }
        if (!row.matchedExams.some((e) => e.id === exam.id)) {
          row.matchedExams.push({
            id: exam.id,
            name: exam.name,
            listingKind: exam.listingKind,
          });
        }
      }
    }

    let rows = [...byInstitute.values()];

    const hasUser = userLat != null && userLng != null && Number.isFinite(userLat) && Number.isFinite(userLng);
    let sortedBy: "distance" | "city" = "city";

    if (hasUser) {
      sortedBy = "distance";
      for (const row of rows) {
        const { latitude: lat, longitude: lon } = row.institute;
        if (lat != null && lon != null) {
          row.distanceKm = Math.round(distanceKm(userLat!, userLng!, lat, lon) * 10) / 10;
        } else {
          row.distanceKm = null;
        }
      }
      rows.sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return a.institute.city.localeCompare(b.institute.city);
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      rows.sort((a, b) => a.institute.city.localeCompare(b.institute.city));
    }

    rows = rows.slice(0, 10);

    return reply.send({
      query,
      kind,
      sortedBy,
      rows,
    });
  });

  app.get("/catalog/fields", async (_request, reply) => {
    const fields = await prisma.academicField.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, name: true },
    });
    return reply.send({ fields });
  });

  app.get<{ Params: { slug: string } }>("/catalog/fields/:slug/exams", async (request, reply) => {
    const field = await prisma.academicField.findUnique({
      where: { slug: request.params.slug },
      include: {
        exams: { orderBy: { sortOrder: "asc" }, select: { id: true, slug: true, name: true } },
      },
    });
    if (!field) return reply.status(404).send({ error: "Field not found" });
    return reply.send({ field: { id: field.id, slug: field.slug, name: field.name }, exams: field.exams });
  });

  app.get<{ Params: { id: string } }>("/catalog/exams/:id/institutes", async (request, reply) => {
    const exam = await prisma.exam.findUnique({
      where: { id: request.params.id },
      select: { id: true, name: true, slug: true },
    });
    if (!exam) return reply.status(404).send({ error: "Exam not found" });

    const programs = await prisma.program.findMany({
      where: { examId: exam.id },
      include: {
        institute: {
          select: {
            id: true,
            name: true,
            shortBio: true,
            city: true,
            isPartner: true,
            logoEmoji: true,
          },
        },
      },
    });

    const instituteMap = new Map<
      string,
      {
        id: string;
        name: string;
        shortBio: string;
        city: string;
        isPartner: boolean;
        logoEmoji: string;
        programs: { id: string; name: string; description: string }[];
      }
    >();

    for (const p of programs) {
      const i = p.institute;
      if (!instituteMap.has(i.id)) {
        instituteMap.set(i.id, {
          ...i,
          programs: [],
        });
      }
      instituteMap.get(i.id)!.programs.push({
        id: p.id,
        name: p.name,
        description: p.description,
      });
    }

    return reply.send({
      exam,
      institutes: [...instituteMap.values()],
    });
  });

  app.get<{ Params: { id: string } }>("/catalog/institutes/:id", async (request, reply) => {
    const institute = await prisma.institute.findUnique({
      where: { id: request.params.id },
      include: {
        programs: {
          include: {
            exam: { select: { id: true, name: true, slug: true } },
            paymentPlans: { where: { active: true }, take: 1 },
          },
        },
      },
    });
    if (!institute) return reply.status(404).send({ error: "Institute not found" });
    return reply.send({ institute });
  });

  app.get<{ Params: { id: string } }>("/catalog/programs/:id", async (request, reply) => {
    const program = await prisma.program.findUnique({
      where: { id: request.params.id },
      include: {
        institute: true,
        exam: { include: { field: true } },
        paymentPlans: { where: { active: true } },
      },
    });
    if (!program) return reply.status(404).send({ error: "Program not found" });
    return reply.send({ program });
  });
};
