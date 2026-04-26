import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type Exam = { id: string; slug: string; name: string };

export default async function FieldExamsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data: { field: { id: string; slug: string; name: string }; exams: Exam[] };
  try {
    data = await api(`/catalog/fields/${slug}/exams`, { cache: "no-store" });
  } catch {
    notFound();
  }

  return (
    <Shell>
      <nav className="text-sm text-[var(--muted)]">
        <Link href="/fields" className="font-semibold text-[var(--m-burgundy)] hover:underline">
          Fields
        </Link>
        <span className="mx-2 text-[var(--border-strong)]">/</span>
        <span className="font-medium text-[var(--m-navy)]">{data.field.name}</span>
      </nav>
      <h1 className="dam-page-title mt-4">Competitive exams</h1>
      <p className="dam-lead">
        Major Indian exams under{" "}
        <strong className="font-semibold text-[var(--m-navy)]">{data.field.name}</strong>. Pick one to see institutes
        and programs.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {data.exams.map((e) => (
          <li key={e.id}>
            <Link href={`/exams/${e.id}/institutes`} className="dam-card block px-5 py-5 no-underline">
              <span className="text-lg font-bold text-[var(--m-navy)]">{e.name}</span>
              <span className="mt-2 flex items-center gap-1 text-sm font-semibold text-[#c27812]">
                Institutes & programs
                <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
