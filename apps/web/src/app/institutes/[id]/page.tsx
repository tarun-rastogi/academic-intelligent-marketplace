import Link from "next/link";
import { notFound } from "next/navigation";
import { DiscoverySurface } from "@/components/DiscoverySurface";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

type StudyMode = "ONLINE" | "OFFLINE" | "HYBRID";

export default async function InstitutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let data: {
    institute: {
      id: string;
      name: string;
      shortBio: string;
      city: string;
      isPartner: boolean;
      logoEmoji: string;
      averageRating: number;
      reviewCount: number;
      accreditationTag: string | null;
      typeLabel: string | null;
      establishedYear: number | null;
      programs: {
        id: string;
        name: string;
        description: string;
        studyMode: StudyMode;
        exam: { name: string };
        paymentPlans: { id: string; name: string; amountPaise: number; currency: string }[];
      }[];
    };
  };
  try {
    data = await api(`/catalog/institutes/${id}`, { cache: "no-store" });
  } catch {
    notFound();
  }

  const ins = data.institute;
  const feeRows = ins.programs.map((p) => {
    const fee = p.paymentPlans[0];
    const inr = fee ? fee.amountPaise / 100 : null;
    return { program: p.name, exam: p.exam.name, inr, mode: p.studyMode };
  });
  const feeAmounts = feeRows.map((r) => r.inr).filter((n): n is number => n != null);
  const minFee = feeAmounts.length ? Math.min(...feeAmounts) : 0;
  const maxFee = feeAmounts.length ? Math.max(...feeAmounts) : 0;

  const nav = [
    ["overview", "Overview"],
    ["programs", "Programmes"],
    ["fees", "Fees"],
    ["reviews", "Reviews"],
    ["admissions", "Admissions"],
    ["placements", "Placements"],
  ] as const;

  return (
    <Shell>
      <DiscoverySurface className="!pb-6 sm:!pb-8">
        <header className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b01f24] to-[#8b181c] text-sm font-bold text-white shadow-md"
            aria-hidden
          >
            M
          </div>
          <div
            className="min-w-0 flex-1 truncate rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80 sm:text-sm"
            title={ins.name}
          >
            Institute · {ins.name}
          </div>
        </header>
        <div
          className="relative mt-4 min-h-[120px] overflow-hidden rounded-xl bg-gradient-to-br from-[#163269] via-[#0c226b] to-[#040818] sm:min-h-[160px]"
          role="presentation"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(227,150,50,0.25),transparent_55%)]" />
        </div>
      </DiscoverySurface>

      <div className="relative z-10 -mt-14 sm:-mt-16">
        <div className="dam-card-static overflow-hidden border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="border-b border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-5 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-1 gap-4">
                <span
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--m-cream)] text-4xl shadow-sm sm:h-24 sm:w-24 sm:text-5xl"
                  aria-hidden
                >
                  {ins.logoEmoji}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--m-navy)] sm:text-3xl">{ins.name}</h1>
                    {ins.isPartner ? (
                      <span className="rounded-md bg-gradient-to-r from-[#e39632] to-[#ffaf02] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#000016]">
                        Partner
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    <span className="font-medium text-[var(--m-ink)]">{ins.city}</span>
                    {ins.typeLabel ? ` · ${ins.typeLabel}` : ""}
                    {ins.accreditationTag ? ` · ${ins.accreditationTag}` : ""}
                    {ins.establishedYear ? ` · Est. ${ins.establishedYear}` : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ins.accreditationTag ? (
                      <span className="rounded-full border border-[var(--border)] bg-[var(--m-cream)] px-3 py-1 text-xs font-semibold text-[var(--m-navy)]">
                        {ins.accreditationTag}
                      </span>
                    ) : null}
                    {ins.typeLabel ? (
                      <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                        {ins.typeLabel}
                      </span>
                    ) : null}
                    {ins.establishedYear ? (
                      <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                        Est. {ins.establishedYear}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:shrink-0 sm:flex-col sm:items-stretch">
                <button type="button" className="dam-btn-secondary cursor-default text-sm opacity-90">
                  Save
                </button>
                <button type="button" className="dam-btn-secondary cursor-default text-sm opacity-90">
                  Compare
                </button>
                <button type="button" className="dam-btn-primary cursor-default text-sm">
                  Brochure
                </button>
              </div>
            </div>
          </div>

          <nav
            className="flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[var(--m-cream)]/80 px-2 py-2 sm:px-4"
            aria-label="Profile sections"
          >
            {nav.map(([hash, label]) => (
              <a
                key={hash}
                href={`#${hash}`}
                className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--muted)] transition hover:bg-white hover:text-[var(--m-navy)] sm:text-sm"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="grid gap-0 bg-[var(--m-cream)]/40 lg:grid-cols-[1fr_minmax(240px,320px)]">
            <div className="space-y-0 border-[var(--border)] lg:border-r">
              <section id="overview" className="scroll-mt-28 border-b border-[var(--border)] bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Overview</h2>
                <p className="dam-lead mt-2">{ins.shortBio}</p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                  This demo profile mirrors the structure in the product reference: one surface for discovery, programme
                  depth, fees, reviews, and admissions — aligned with the marketplace theme (navy, burgundy, gold) rather
                  than a separate microsite.
                </p>
              </section>

              <section id="programs" className="scroll-mt-28 border-b border-[var(--border)] bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Programmes</h2>
                <p className="dam-lead mt-2">Select a programme to start your application.</p>
                <ul className="mt-6 space-y-4">
                  {ins.programs.map((p) => {
                    const fee = p.paymentPlans[0];
                    const inr = fee ? fee.amountPaise / 100 : null;
                    const modeLabel = p.studyMode === "ONLINE" ? "Online" : p.studyMode === "HYBRID" ? "Hybrid" : "Classroom";
                    return (
                      <li
                        key={p.id}
                        className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--m-cream)]/50 px-5 py-5 shadow-sm transition hover:border-[var(--m-burgundy)]/25 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--m-navy)]">{p.name}</p>
                          <p className="mt-1 text-sm text-[var(--muted)]">
                            {p.exam.name} · {modeLabel}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                          {inr != null ? (
                            <p className="mt-3 text-sm font-bold text-[var(--m-gold-dark)]">From ₹{inr.toLocaleString("en-IN")}</p>
                          ) : null}
                        </div>
                        <Link href={`/apply/${p.id}`} className="dam-btn-primary shrink-0 self-start text-center no-underline sm:self-center">
                          Select &amp; apply
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section id="fees" className="scroll-mt-28 border-b border-[var(--border)] bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Fees snapshot</h2>
                <p className="dam-lead mt-2">
                  Indicative programme fees in INR. Full breakdown is confirmed at application checkout.
                </p>
                <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
                  <table className="w-full min-w-[280px] text-left text-sm">
                    <thead className="bg-[var(--m-navy)] text-white">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Programme</th>
                        <th className="px-4 py-3 font-semibold">Listing</th>
                        <th className="px-4 py-3 font-semibold">From</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeRows.map((row, i) => (
                        <tr key={i} className="border-t border-[var(--border)] bg-white">
                          <td className="px-4 py-3 text-[var(--m-ink)]">{row.program}</td>
                          <td className="px-4 py-3 text-[var(--muted)]">{row.exam}</td>
                          <td className="px-4 py-3 font-semibold text-[var(--m-gold-dark)]">
                            {row.inr != null ? `₹${row.inr.toLocaleString("en-IN")}` : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {feeAmounts.length > 0 ? (
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    Range across listed programmes: ₹{minFee.toLocaleString("en-IN")} – ₹{maxFee.toLocaleString("en-IN")}{" "}
                    (where applicable).
                  </p>
                ) : null}
              </section>

              <section id="reviews" className="scroll-mt-28 border-b border-[var(--border)] bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Reviews</h2>
                <p className="dam-lead mt-2">Synthetic aggregate for this demo catalogue.</p>
                <div className="mt-4 flex flex-wrap items-baseline gap-3 rounded-xl border border-[var(--border)] bg-[var(--m-cream)]/60 px-5 py-4">
                  <span className="text-3xl font-extrabold text-[var(--m-navy)]">{ins.averageRating.toFixed(1)}</span>
                  <span className="text-lg text-[#92400e]">★★★★☆</span>
                  <span className="text-sm text-[var(--muted)]">
                    Based on {ins.reviewCount.toLocaleString("en-IN")} student &amp; parent ratings (demo).
                  </span>
                </div>
              </section>

              <section id="admissions" className="scroll-mt-28 border-b border-[var(--border)] bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Admissions</h2>
                <p className="dam-lead mt-2">
                  Choose a programme above to open the application flow. Partner institutes route through the marketplace
                  payment and lead hand-off in this prototype.
                </p>
              </section>

              <section id="placements" className="scroll-mt-28 bg-white px-4 py-6 sm:px-8 sm:py-8">
                <h2 className="dam-page-title text-xl">Placements &amp; outcomes</h2>
                <p className="dam-lead mt-2">
                  Outcome stories and recruiter lists would live here in a full deployment — scoped to this institute and
                  refreshed each cycle.
                </p>
              </section>
            </div>

            <aside className="space-y-4 border-t border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:border-t-0">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--m-cream)]/50 p-4">
                <h3 className="text-sm font-bold text-[var(--m-navy)]">Institute updates</h3>
                <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-[var(--muted)]">
                  <li>Scholarship window — rolling review for merit lists.</li>
                  <li>Open day — hybrid campus tour slots this month.</li>
                  <li>New doubt-clearing blocks added to evening batches.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--m-cream)]/30 p-4 text-center">
                <p className="text-xs font-semibold text-[var(--m-navy)]">Campus gallery</p>
                <p className="mt-2 text-[0.65rem] text-[var(--muted)]">Photo grid would render here in production.</p>
              </div>
              <Link href="/search" className="block text-center text-sm font-semibold text-[var(--m-burgundy)] underline-offset-2 hover:underline">
                ← Back to discovery search
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </Shell>
  );
}
