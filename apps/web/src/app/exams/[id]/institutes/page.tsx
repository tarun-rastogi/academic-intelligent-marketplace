import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type InstituteCard = {
  id: string;
  name: string;
  shortBio: string;
  city: string;
  isPartner: boolean;
  logoEmoji: string;
  programs: { id: string; name: string; description: string }[];
};

export default async function ExamInstitutesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: { exam: { id: string; name: string }; institutes: InstituteCard[] };
  try {
    data = await api(`/catalog/exams/${id}/institutes`, { cache: "no-store" });
  } catch {
    notFound();
  }

  return (
    <Shell>
      <p className="dam-eyebrow">Institutes</p>
      <h1 className="dam-page-title mt-3">Preparing for {data.exam.name}</h1>
      <p className="dam-lead">
        Partner institutes offer a direct enrollment path after payment. Non-partner listings generate a qualified lead
        for the institute team.
      </p>
      <div className="mt-10 grid gap-6">
        {data.institutes.map((i) => (
          <article key={i.id} className="dam-card-static overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--m-cream)] text-2xl shadow-inner"
                  aria-hidden
                >
                  {i.logoEmoji}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight text-[var(--m-navy)]">{i.name}</h2>
                    <span className={i.isPartner ? "dam-badge" : "dam-badge dam-badge-navy"}>
                      {i.isPartner ? "Partner" : "Lead flow"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--muted)]">{i.city}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{i.shortBio}</p>
                </div>
              </div>
              <Link href={`/institutes/${i.id}`} className="dam-btn-secondary shrink-0 no-underline">
                Institute page
              </Link>
            </div>
            <ul className="grid gap-2 bg-[var(--m-cream)]/50 p-4 sm:grid-cols-2 sm:p-5">
              {i.programs.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/apply/${p.id}`}
                    className="block rounded-xl border border-[var(--border)] bg-white px-4 py-4 no-underline shadow-sm transition hover:border-[var(--m-burgundy)]/35 hover:shadow-md"
                  >
                    <span className="font-semibold text-[var(--m-navy)]">{p.name}</span>
                    <span className="mt-1 block text-xs font-medium text-[var(--m-burgundy)]">Apply to program →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Shell>
  );
}
