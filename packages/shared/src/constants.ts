/** Canonical academic field slugs (English-only MVP). */
export const FIELD_SLUGS = [
  "medical",
  "law",
  "engineering",
  "management",
  "design",
  "civil-services",
  "commerce",
  "defence",
] as const;

export type FieldSlug = (typeof FIELD_SLUGS)[number];
