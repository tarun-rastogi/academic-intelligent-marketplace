import Link from "next/link";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type Field = { id: string; slug: string; name: string };

export default async function FieldsPage() {
  const data = await api<{ fields: Field[] }>("/catalog/fields", { cache: "no-store" });

  return (
    <Shell>
      <p className="dam-eyebrow">Catalog</p>
      <h1 className="dam-page-title mt-3">Academic fields</h1>
      <p className="dam-lead">
        Choose a discipline to see major competitive exams in India, then explore institutes and programs.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {data.fields.map((f) => (
          <li key={f.id}>
            <Link href={`/fields/${f.slug}`} className="dam-card block px-5 py-5 no-underline">
              <span className="text-lg font-bold tracking-tight text-[var(--m-navy)]">{f.name}</span>
              <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-[var(--m-burgundy)]">
                View exams
                <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
