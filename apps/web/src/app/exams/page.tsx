import Link from "next/link";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type Exam = { id: string; slug: string; name: string };
type FieldBlock = { id: string; slug: string; name: string; exams: Exam[] };

export default async function AllExamsPage() {
  const data = await api<{ fields: FieldBlock[] }>("/catalog/exams", { cache: "no-store" });

  return (
    <Shell>
      <p className="dam-eyebrow">Browse</p>
      <h1 className="dam-page-title mt-3">All competitive exams</h1>
      <p className="dam-lead">
        Choose an exam to see institutes and programs. Exams are grouped by academic field.
      </p>

      <div className="mt-10 space-y-12">
        {data.fields.map((field) => (
          <section key={field.id}>
            <h2 className="text-lg font-bold text-[var(--m-navy)]">
              <Link href={`/fields/${field.slug}`} className="hover:text-[var(--m-burgundy)] hover:underline">
                {field.name}
              </Link>
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {field.exams.map((e) => (
                <li key={e.id}>
                  <Link href={`/exams/${e.id}/institutes`} className="dam-card block px-4 py-4 no-underline">
                    <span className="font-semibold text-[var(--m-navy)]">{e.name}</span>
                    <span className="mt-1 block text-xs font-medium text-[var(--muted)]">{field.name}</span>
                    <span className="mt-2 inline-flex text-sm font-semibold text-[var(--m-burgundy)]">
                      View institutes →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}
