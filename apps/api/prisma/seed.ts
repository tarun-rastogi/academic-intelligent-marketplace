import { PrismaClient, type StudyMode } from "@prisma/client";

const prisma = new PrismaClient();

type ExamSeed = {
  slug: string;
  name: string;
  sortOrder: number;
  /** Default: competitive national / entrance-style listings. */
  listing?: "COMPETITIVE_EXAM" | "NON_DEGREE_COURSE";
};

type FieldSeed = { slug: string; name: string; sortOrder: number; exams: ExamSeed[] };

const FIELDS: FieldSeed[] = [
  {
    slug: "medical",
    name: "Medical",
    sortOrder: 1,
    exams: [
      { slug: "neet-ug", name: "NEET-UG", sortOrder: 1 },
      { slug: "aiims-mbbs", name: "AIIMS MBBS", sortOrder: 2 },
      { slug: "neet-pg", name: "NEET-PG", sortOrder: 3 },
      { slug: "ini-cet", name: "INI-CET", sortOrder: 4 },
      { slug: "fmge", name: "FMGE", sortOrder: 5 },
    ],
  },
  {
    slug: "law",
    name: "Law",
    sortOrder: 2,
    exams: [
      { slug: "clat-ug", name: "CLAT (UG)", sortOrder: 1 },
      { slug: "ailet", name: "AILET", sortOrder: 2 },
      { slug: "lsat-india", name: "LSAT India", sortOrder: 3 },
      { slug: "cuet-pg-law", name: "CUET PG (Law)", sortOrder: 4 },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    sortOrder: 3,
    exams: [
      { slug: "jee-main", name: "JEE Main", sortOrder: 1 },
      { slug: "jee-advanced", name: "JEE Advanced", sortOrder: 2 },
      { slug: "bitsat", name: "BITSAT", sortOrder: 3 },
      { slug: "viteee", name: "VITEEE", sortOrder: 4 },
      { slug: "met", name: "MET (Manipal)", sortOrder: 5 },
    ],
  },
  {
    slug: "management",
    name: "Management",
    sortOrder: 4,
    exams: [
      { slug: "cat", name: "CAT", sortOrder: 1 },
      { slug: "xat", name: "XAT", sortOrder: 2 },
      { slug: "nmat", name: "NMAT", sortOrder: 3 },
      { slug: "snap", name: "SNAP", sortOrder: 4 },
      { slug: "cmat", name: "CMAT", sortOrder: 5 },
    ],
  },
  {
    slug: "design",
    name: "Design",
    sortOrder: 5,
    exams: [
      { slug: "nid-dat", name: "NID DAT", sortOrder: 1 },
      { slug: "nift", name: "NIFT", sortOrder: 2 },
      { slug: "uceed", name: "UCEED", sortOrder: 3 },
      { slug: "ceed", name: "CEED", sortOrder: 4 },
    ],
  },
  {
    slug: "civil-services",
    name: "Civil Services",
    sortOrder: 6,
    exams: [
      { slug: "upsc-cse", name: "UPSC CSE (IAS)", sortOrder: 1 },
      { slug: "upsc-cds", name: "UPSC CDS", sortOrder: 2 },
      { slug: "upsc-capf", name: "UPSC CAPF", sortOrder: 3 },
      { slug: "state-psc", name: "State PSC (General)", sortOrder: 4 },
    ],
  },
  {
    slug: "commerce",
    name: "Commerce",
    sortOrder: 7,
    exams: [
      { slug: "ca-foundation", name: "CA Foundation", sortOrder: 1 },
      { slug: "ca-inter", name: "CA Intermediate", sortOrder: 2 },
      { slug: "cma-foundation", name: "CMA Foundation", sortOrder: 3 },
      { slug: "cuet-ug-commerce", name: "CUET UG (Commerce)", sortOrder: 4 },
    ],
  },
  {
    slug: "defence",
    name: "Defence",
    sortOrder: 8,
    exams: [
      { slug: "nda", name: "NDA", sortOrder: 1 },
      { slug: "cds", name: "CDS", sortOrder: 2 },
      { slug: "afcat", name: "AFCAT", sortOrder: 3 },
      { slug: "inet-officer", name: "INET (Officer Entry)", sortOrder: 4 },
    ],
  },
  {
    slug: "professional",
    name: "Professional programmes",
    sortOrder: 9,
    exams: [
      {
        slug: "digital-marketing-cert",
        name: "Digital Marketing Certificate",
        sortOrder: 1,
        listing: "NON_DEGREE_COURSE",
      },
      {
        slug: "data-analytics-bootcamp",
        name: "Data Analytics Bootcamp",
        sortOrder: 2,
        listing: "NON_DEGREE_COURSE",
      },
      {
        slug: "full-stack-intensive",
        name: "Full-Stack Web Intensive (non-degree)",
        sortOrder: 3,
        listing: "NON_DEGREE_COURSE",
      },
    ],
  },
];

type ProgramSeed = {
  examSlug: string;
  fieldSlug: string;
  name: string;
  description: string;
  feeInr: number;
  studyMode: StudyMode;
};

const INSTITUTES: {
  name: string;
  shortBio: string;
  city: string;
  latitude: number;
  longitude: number;
  isPartner: boolean;
  logoEmoji: string;
  averageRating: number;
  reviewCount: number;
  accreditationTag: string | null;
  typeLabel: string | null;
  establishedYear: number | null;
  programs: ProgramSeed[];
}[] = [
  {
    name: "Apex Prep Institute",
    shortBio: "Partner institute — structured cohorts and mentor check-ins.",
    city: "Delhi NCR",
    latitude: 28.62,
    longitude: 77.21,
    isPartner: true,
    logoEmoji: "🎓",
    averageRating: 4.6,
    reviewCount: 842,
    accreditationTag: "NAAC A",
    typeLabel: "Private",
    establishedYear: 2012,
    programs: [
      {
        fieldSlug: "engineering",
        examSlug: "jee-main",
        name: "JEE Main — 12 Month Classroom",
        description: "Full syllabus coverage with weekly tests and doubt labs.",
        feeInr: 85000,
        studyMode: "OFFLINE",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Intensive Batch",
        description: "Biology-forward schedule with NCERT mastery modules.",
        feeInr: 92000,
        studyMode: "HYBRID",
      },
    ],
  },
  {
    name: "Horizon Law Academy",
    shortBio: "CLAT-focused curriculum with legal reasoning drills.",
    city: "Bengaluru",
    latitude: 12.97,
    longitude: 77.59,
    isPartner: false,
    logoEmoji: "⚖️",
    averageRating: 4.3,
    reviewCount: 412,
    accreditationTag: "NAAC A+",
    typeLabel: "Private",
    establishedYear: 2008,
    programs: [
      {
        fieldSlug: "law",
        examSlug: "clat-ug",
        name: "CLAT UG — Weekend Hybrid",
        description: "Hybrid study mode with recorded + live weekend classes.",
        feeInr: 55000,
        studyMode: "HYBRID",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — PCB Bridge + Test Series",
        description: "For dual-track aspirants — PCB rigour with compact weekend blocks.",
        feeInr: 48000,
        studyMode: "ONLINE",
      },
    ],
  },
  {
    name: "Catalyst Management School",
    shortBio: "Quant + DILR pods for CAT aspirants.",
    city: "Mumbai",
    latitude: 19.08,
    longitude: 72.88,
    isPartner: true,
    logoEmoji: "📊",
    averageRating: 4.5,
    reviewCount: 1205,
    accreditationTag: "NAAC A++",
    typeLabel: "Deemed",
    establishedYear: 2005,
    programs: [
      {
        fieldSlug: "management",
        examSlug: "cat",
        name: "CAT — Flagship Program",
        description: "Mock series, GD-PI prep, and analytics dashboard.",
        feeInr: 65000,
        studyMode: "HYBRID",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Foundation (Evenings)",
        description: "Structured evening batches for working repeaters.",
        feeInr: 72000,
        studyMode: "OFFLINE",
      },
    ],
  },
  {
    name: "Stride Civil Services",
    shortBio: "UPSC foundation and mains answer writing studio.",
    city: "Hyderabad",
    latitude: 17.41,
    longitude: 78.48,
    isPartner: false,
    logoEmoji: "🏛️",
    averageRating: 4.4,
    reviewCount: 633,
    accreditationTag: "NAAC A",
    typeLabel: "Private",
    establishedYear: 2010,
    programs: [
      {
        fieldSlug: "civil-services",
        examSlug: "upsc-cse",
        name: "UPSC CSE — Integrated Foundation",
        description: "Prelims + mains integrated plan with essay mentorship.",
        feeInr: 125000,
        studyMode: "OFFLINE",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Crash + Mock Capsule",
        description: "High-intensity drills for last-mile revision.",
        feeInr: 38000,
        studyMode: "ONLINE",
      },
    ],
  },
  {
    name: "Skills Bridge Pune",
    shortBio: "Short-form professional programmes — cohort-based, employer-linked projects.",
    city: "Pune",
    latitude: 18.52,
    longitude: 73.86,
    isPartner: false,
    logoEmoji: "🛠️",
    averageRating: 4.2,
    reviewCount: 289,
    accreditationTag: null,
    typeLabel: "Private",
    establishedYear: 2019,
    programs: [
      {
        fieldSlug: "professional",
        examSlug: "digital-marketing-cert",
        name: "Digital Marketing — 16-week cohort",
        description: "Performance marketing, SEO/SEM, analytics dashboards, and portfolio reviews.",
        feeInr: 42000,
        studyMode: "ONLINE",
      },
      {
        fieldSlug: "professional",
        examSlug: "data-analytics-bootcamp",
        name: "Data Analytics Bootcamp — Evenings",
        description: "SQL, Python, visualization, and capstone with mentor office hours.",
        feeInr: 58000,
        studyMode: "HYBRID",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Biology-only booster",
        description: "Focused Zoology & Botany sprint for late joiners.",
        feeInr: 28000,
        studyMode: "ONLINE",
      },
    ],
  },
  {
    name: "MedWin Institute of Sciences",
    shortBio: "Chennai-based medical entrance studio with hospital tie-ups for observerships.",
    city: "Chennai",
    latitude: 13.08,
    longitude: 80.27,
    isPartner: true,
    logoEmoji: "🩺",
    averageRating: 4.7,
    reviewCount: 1560,
    accreditationTag: "NAAC A++",
    typeLabel: "Deemed",
    establishedYear: 2003,
    programs: [
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Residential Programme",
        description: "Six-day week with micro-tests and mentor pods.",
        feeInr: 110000,
        studyMode: "OFFLINE",
      },
      {
        fieldSlug: "medical",
        examSlug: "neet-pg",
        name: "NEET-PG — Clinical reasoning lab",
        description: "Case-led prep with senior residents as coaches.",
        feeInr: 95000,
        studyMode: "HYBRID",
      },
    ],
  },
  {
    name: "BrightSpark NEET Academy",
    shortBio: "Kota-style rigour with wellness blocks and counsellor-on-call.",
    city: "Kota",
    latitude: 25.18,
    longitude: 75.83,
    isPartner: false,
    logoEmoji: "✨",
    averageRating: 4.1,
    reviewCount: 2104,
    accreditationTag: null,
    typeLabel: "Private",
    establishedYear: 2015,
    programs: [
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Two-year Integrated",
        description: "Daily DPPs, rank predictors, and parent connect app.",
        feeInr: 135000,
        studyMode: "OFFLINE",
      },
    ],
  },
  {
    name: "Crystal Medical Prep",
    shortBio: "Eastern India hub for NEET with bilingual faculty and hostel network.",
    city: "Kolkata",
    latitude: 22.57,
    longitude: 88.36,
    isPartner: false,
    logoEmoji: "💎",
    averageRating: 4.35,
    reviewCount: 721,
    accreditationTag: "NAAC A",
    typeLabel: "Private",
    establishedYear: 2011,
    programs: [
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Bengali + English medium",
        description: "Board-aligned bridge into NEET pacing.",
        feeInr: 67000,
        studyMode: "HYBRID",
      },
      {
        fieldSlug: "engineering",
        examSlug: "jee-main",
        name: "JEE Main — Winter revision",
        description: "Short revision camp for PCM students.",
        feeInr: 22000,
        studyMode: "OFFLINE",
      },
    ],
  },
  {
    name: "NorthStar Prep Indore",
    shortBio: "Central India partner for NEET with analytics-led weak-topic maps.",
    city: "Indore",
    latitude: 22.72,
    longitude: 75.86,
    isPartner: true,
    logoEmoji: "⭐",
    averageRating: 4.55,
    reviewCount: 498,
    accreditationTag: "NAAC A+",
    typeLabel: "Private",
    establishedYear: 2014,
    programs: [
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Adaptive learning track",
        description: "AI-assisted practice sheets with human review every week.",
        feeInr: 88000,
        studyMode: "HYBRID",
      },
    ],
  },
  {
    name: "Summit Healthcare Prep",
    shortBio: "NCR campus with metro access — hybrid NEET plus counselling walkthroughs.",
    city: "Gurgaon",
    latitude: 28.46,
    longitude: 77.03,
    isPartner: false,
    logoEmoji: "🏔️",
    averageRating: 4.25,
    reviewCount: 356,
    accreditationTag: "NAAC A",
    typeLabel: "Private",
    establishedYear: 2017,
    programs: [
      {
        fieldSlug: "medical",
        examSlug: "neet-ug",
        name: "NEET-UG — Metro hybrid flagship",
        description: "Weekend labs + weekday live online — counselling desk included.",
        feeInr: 76000,
        studyMode: "HYBRID",
      },
      {
        fieldSlug: "professional",
        examSlug: "digital-marketing-cert",
        name: "Digital Marketing — Parallel certificate",
        description: "Optional add-on for aspirants exploring alternate pathways.",
        feeInr: 35000,
        studyMode: "ONLINE",
      },
    ],
  },
];

function inrToPaise(inr: number) {
  return Math.round(inr * 100);
}

async function main() {
  await prisma.paymentDetail.deleteMany();
  await prisma.application.deleteMany();
  await prisma.paymentPlan.deleteMany();
  await prisma.program.deleteMany();
  await prisma.institute.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.academicField.deleteMany();
  await prisma.activeSession.deleteMany();
  await prisma.user.deleteMany();

  const examIdByComposite = new Map<string, string>();

  for (const f of FIELDS) {
    const field = await prisma.academicField.create({
      data: {
        slug: f.slug,
        name: f.name,
        sortOrder: f.sortOrder,
        exams: {
          create: f.exams.map((e) => ({
            slug: e.slug,
            name: e.name,
            sortOrder: e.sortOrder,
            listingKind: e.listing === "NON_DEGREE_COURSE" ? "NON_DEGREE_COURSE" : "COMPETITIVE_EXAM",
          })),
        },
      },
      include: { exams: true },
    });
    for (const e of field.exams) {
      examIdByComposite.set(`${f.slug}:${e.slug}`, e.id);
    }
  }

  for (const ins of INSTITUTES) {
    const institute = await prisma.institute.create({
      data: {
        name: ins.name,
        shortBio: ins.shortBio,
        city: ins.city,
        latitude: ins.latitude,
        longitude: ins.longitude,
        isPartner: ins.isPartner,
        logoEmoji: ins.logoEmoji,
        averageRating: ins.averageRating,
        reviewCount: ins.reviewCount,
        accreditationTag: ins.accreditationTag,
        typeLabel: ins.typeLabel,
        establishedYear: ins.establishedYear,
      },
    });

    for (const p of ins.programs) {
      const examId = examIdByComposite.get(`${p.fieldSlug}:${p.examSlug}`);
      if (!examId) throw new Error(`Missing exam ${p.fieldSlug}/${p.examSlug}`);

      const program = await prisma.program.create({
        data: {
          instituteId: institute.id,
          examId,
          name: p.name,
          description: p.description,
          studyMode: p.studyMode,
        },
      });

      await prisma.paymentPlan.create({
        data: {
          programId: program.id,
          name: `${p.name} — Program Fee`,
          amountPaise: inrToPaise(p.feeInr),
          currency: "INR",
          active: true,
        },
      });
    }
  }

  console.log("Seed complete: fields, exams, institutes, programs, payment plans.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
