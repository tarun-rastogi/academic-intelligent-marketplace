import { z } from "zod";

export const phoneSchema = z
  .string()
  .min(10)
  .max(15)
  .regex(/^\+?[0-9]{10,14}$/, "Enter a valid phone number");

export const otpRequestSchema = z.object({
  phone: phoneSchema,
});

export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().min(4).max(8),
});

const percentagePreprocess = (val: unknown) => {
  if (val === null || val === undefined) return val;
  if (typeof val === "number") {
    return Number.isNaN(val) ? undefined : val;
  }
  if (typeof val === "string") {
    const s = val.trim().replace(/%+\s*$/, "").replace(/,/g, "").trim();
    return s === "" ? undefined : s;
  }
  return val;
};

/** Calendar YYYY-MM-DD parsed at UTC noon to avoid DST edge cases. */
function parseYmdUtc(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
}

/** Latest date of birth so the applicant is at least `minAge` years old (calendar, UTC). */
export function applicationDobMaxIso(minAge = 10): string {
  const now = new Date();
  const u = new Date(Date.UTC(now.getUTCFullYear() - minAge, now.getUTCMonth(), now.getUTCDate()));
  const y = u.getUTCFullYear();
  const mo = String(u.getUTCMonth() + 1).padStart(2, "0");
  const d = String(u.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

/** Earliest allowed date of birth (calendar, UTC). */
export function applicationDobMinIso(maxAge = 100): string {
  const now = new Date();
  const u = new Date(Date.UTC(now.getUTCFullYear() - maxAge, now.getUTCMonth(), now.getUTCDate()));
  const y = u.getUTCFullYear();
  const mo = String(u.getUTCMonth() + 1).padStart(2, "0");
  const d = String(u.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${d}`;
}

export const APPLICATION_LAST_PASSED_CLASS_VALUES = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "UG",
  "PG",
] as const;

export type ApplicationLastPassedClass = (typeof APPLICATION_LAST_PASSED_CLASS_VALUES)[number];

/** Board / university — values stored on the application record. */
export const APPLICATION_BOARD_VALUES = [
  "CBSE",
  "CISCE (ICSE / ISC)",
  "NIOS",
  "IB (International Baccalaureate)",
  "Cambridge (IGCSE / A-Level)",
  "Maharashtra State Board",
  "Karnataka State Board",
  "Tamil Nadu State Board",
  "Delhi State Board",
  "West Bengal Board of Secondary & Higher Secondary Education",
  "Andhra Pradesh State Board",
  "Telangana State Board",
  "Uttar Pradesh Board of High School & Intermediate Education",
  "Rajasthan Board of Secondary Education",
  "Gujarat Secondary & Higher Secondary Education Board",
  "Madhya Pradesh Board of Secondary Education",
  "Bihar School Examination Board",
  "Council of Higher Secondary Education, Odisha",
  "Other recognised board or university",
] as const;

export type ApplicationBoard = (typeof APPLICATION_BOARD_VALUES)[number];

export const applicationCreateSchema = z.object({
  programId: z.string().uuid("Invalid program — go back and choose the program again."),
  name: z.string().trim().min(1, "Enter your full name").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  address: z.string().trim().min(1, "Enter your address").max(500),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose your date of birth")
    .superRefine((s, ctx) => {
      const dob = parseYmdUtc(s);
      if (!dob || Number.isNaN(dob.getTime())) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Choose a valid date of birth" });
        return;
      }
      const maxStr = applicationDobMaxIso(10);
      const minStr = applicationDobMinIso(100);
      const maxDob = parseYmdUtc(maxStr)!;
      const minDob = parseYmdUtc(minStr)!;
      if (dob > maxDob) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You must be at least 10 years old (choose a date of birth on or before " + maxStr + ")",
        });
      }
      if (dob < minDob) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of birth must be on or after " + minStr,
        });
      }
    }),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_SAY"]),
  parentNamePrimary: z.string().trim().min(1, "Enter parent / guardian name").max(200),
  parentNameSecondary: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
  lastPassedClass: z.enum(APPLICATION_LAST_PASSED_CLASS_VALUES, {
    errorMap: () => ({ message: "Select last passed class" }),
  }),
  board: z.enum(APPLICATION_BOARD_VALUES, {
    errorMap: () => ({ message: "Select board or university" }),
  }),
  percentage: z.preprocess(
    percentagePreprocess,
    z.coerce
      .number({ invalid_type_error: "Enter a percentage or CGPA equivalent (0–100)" })
      .min(0, "Must be at least 0")
      .max(100, "Must be at most 100"),
  ),
  studyMode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
});

export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
