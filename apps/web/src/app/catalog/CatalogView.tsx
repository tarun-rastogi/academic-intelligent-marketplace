"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DiscoverySurface } from "@/components/DiscoverySurface";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";
import { getStoredUserLocation } from "@/lib/user-location";

type ListingKind = "COMPETITIVE_EXAM" | "NON_DEGREE_COURSE";
type StudyMode = "ONLINE" | "OFFLINE" | "HYBRID";

type InstituteRow = {
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
  matchedExams: { id: string; name: string; listingKind: ListingKind }[];
  distanceKm: number | null;
  feeMinPaise: number | null;
  feeMaxPaise: number | null;
  studyModes: StudyMode[];
};

type OfferingsResponse = {
  query: string;
  kind: ListingKind | "ALL";
  sortedBy: "distance" | "city";
  rows: InstituteRow[];
};

function metroLabel(city: string): boolean {
  const c = city.toLowerCase();
  return (
    c.includes("delhi") ||
    c.includes("mumbai") ||
    c.includes("bengaluru") ||
    c.includes("bangalore") ||
    c.includes("hyderabad") ||
    c.includes("pune") ||
    c.includes("ncr") ||
    c.includes("gurgaon") ||
    c.includes("chennai") ||
    c.includes("kolkata")
  );
}

type FeeBand = "ANY" | "UNDER_50K" | "RANGE_50_100K" | "OVER_100K";
type NaacKey = "A" | "APLUS" | "APLUSPLUS" | "NONE";

function naacKeyFromTag(tag: string | null): NaacKey {
  if (!tag) return "NONE";
  if (tag.includes("A++")) return "APLUSPLUS";
  if (tag.includes("A+")) return "APLUS";
  if (tag.includes("A")) return "A";
  return "NONE";
}

function formatFeeRange(minP: number | null, maxP: number | null): string {
  if (minP == null && maxP == null) return "—";
  const minR = minP != null ? minP / 100 : null;
  const maxR = maxP != null ? maxP / 100 : null;
  const minL = minR != null ? Math.round((minR / 100000) * 10) / 10 : null;
  const maxL = maxR != null ? Math.round((maxR / 100000) * 10) / 10 : null;
  if (minL != null && maxL != null && minL !== maxL) return `₹${minL} L – ${maxL} L`;
  const v = maxL ?? minL;
  return v != null ? `₹${v} L` : "—";
}

function feeBandMatches(band: FeeBand, minP: number | null, maxP: number | null): boolean {
  if (band === "ANY") return true;
  const minR = (minP ?? maxP ?? 0) / 100;
  const maxR = (maxP ?? minP ?? 0) / 100;
  const hi = Math.max(minR, maxR);
  const lo = Math.min(minR, maxR);
  if (band === "UNDER_50K") return hi <= 50_000;
  if (band === "RANGE_50_100K") return hi >= 50_000 && lo <= 100_000;
  if (band === "OVER_100K") return hi >= 100_000;
  return true;
}

export function CatalogView() {
  const router = useRouter();
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").trim();
  const kindRaw = sp.get("kind") ?? "COMPETITIVE_EXAM";
  const kind = (["COMPETITIVE_EXAM", "NON_DEGREE_COURSE", "ALL"].includes(kindRaw) ? kindRaw : "COMPETITIVE_EXAM") as
    | ListingKind
    | "ALL";

  const [data, setData] = useState<OfferingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftQ, setDraftQ] = useState(q);
  const [draftKind, setDraftKind] = useState<ListingKind | "ALL">(kind);

  const [partnerOnly, setPartnerOnly] = useState(false);
  const [metroOnly, setMetroOnly] = useState(false);
  const [nearby25, setNearby25] = useState(false);
  const [feeBand, setFeeBand] = useState<FeeBand>("ANY");
  const [minRating, setMinRating] = useState<0 | 4 | 4.5>(0);
  const [naacFilter, setNaacFilter] = useState<Set<NaacKey>>(new Set());
  const [studyFilter, setStudyFilter] = useState<Set<StudyMode>>(new Set());

  useEffect(() => {
    setDraftQ(q);
    setDraftKind(kind);
  }, [q, kind]);

  const load = useCallback(async () => {
    if (!q) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ query: q, kind });
      const loc = getStoredUserLocation();
      if (loc) {
        params.set("userLat", String(loc.lat));
        params.set("userLng", String(loc.lng));
      }
      const res = await api<OfferingsResponse>(`/catalog/institute-offerings?${params.toString()}`);
      setData(res);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Could not load catalogue");
    } finally {
      setLoading(false);
    }
  }, [q, kind]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleNaac = (k: NaacKey) => {
    setNaacFilter((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const toggleStudy = (m: StudyMode) => {
    setStudyFilter((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  };

  const clearFilters = () => {
    setPartnerOnly(false);
    setMetroOnly(false);
    setNearby25(false);
    setFeeBand("ANY");
    setMinRating(0);
    setNaacFilter(new Set());
    setStudyFilter(new Set());
  };

  const filteredRows = useMemo(() => {
    if (!data?.rows) return [];
    return data.rows.filter((r) => {
      const ins = r.institute;
      if (partnerOnly && !ins.isPartner) return false;
      if (metroOnly && !metroLabel(ins.city)) return false;
      if (nearby25 && (r.distanceKm == null || r.distanceKm > 25)) return false;
      if (minRating > 0 && ins.averageRating < minRating - 0.001) return false;
      if (!feeBandMatches(feeBand, r.feeMinPaise, r.feeMaxPaise)) return false;
      if (naacFilter.size > 0) {
        const tier = naacKeyFromTag(ins.accreditationTag);
        if (!naacFilter.has(tier)) return false;
      }
      if (studyFilter.size > 0) {
        const modes = r.studyModes;
        const ok = [...studyFilter].some((m) => modes.includes(m));
        if (!ok) return false;
      }
      return true;
    });
  }, [data, partnerOnly, metroOnly, nearby25, minRating, feeBand, naacFilter, studyFilter]);

  const kindLabel =
    kind === "NON_DEGREE_COURSE" ? "Non-degree offerings" : kind === "ALL" ? "Exams & courses" : "Competitive exams";

  const runRefine = (e: React.FormEvent) => {
    e.preventDefault();
    const next = draftQ.trim();
    if (!next) return;
    router.push(`/catalog?q=${encodeURIComponent(next)}&kind=${draftKind}`);
  };

  const topChrome = (
    <header className="flex flex-wrap items-center gap-3 rounded-t-xl border border-white/15 border-b-0 bg-[#000016]/90 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-5">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b01f24] to-[#8b181c] text-sm font-bold text-white shadow-md"
        aria-hidden
      >
        M
      </div>
      <form
        className="min-w-0 flex-1 basis-full sm:flex-1 sm:basis-auto"
        role="search"
        aria-label="Refine catalogue search"
        onSubmit={runRefine}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={draftQ}
            onChange={(e) => setDraftQ(e.target.value)}
            placeholder="Refine keywords…"
            className="w-full min-w-0 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-[#f0d9a8] focus:ring-2 focus:ring-[#f0d9a8]/30"
            aria-label="Search keywords"
          />
          <div className="flex shrink-0 gap-2">
            <label htmlFor="cat-kind" className="sr-only">
              Listing type
            </label>
            <select
              id="cat-kind"
              value={draftKind}
              onChange={(e) => setDraftKind(e.target.value as ListingKind | "ALL")}
              className="rounded-full border border-white/25 bg-[#0c226b] px-3 py-2 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-[#f0d9a8]/40"
            >
              <option value="COMPETITIVE_EXAM">Competitive exams</option>
              <option value="NON_DEGREE_COURSE">Non-degree courses</option>
              <option value="ALL">All listings</option>
            </select>
            <button type="submit" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[var(--m-navy)] shadow">
              Update
            </button>
          </div>
        </div>
      </form>
    </header>
  );

  return (
    <Shell>
      <DiscoverySurface className="!pb-12 sm:!pb-16">
        {!q ? (
          <>
            {topChrome}
            <div className="rounded-b-xl border border-white/15 border-t-0 bg-white/95 p-8 text-center text-[var(--m-ink)] shadow-xl">
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[var(--m-burgundy)]">Catalogue</p>
              <h1 className="mt-2 text-xl font-bold text-[var(--m-navy)]">No search term</h1>
              <p className="mt-2 text-sm text-[var(--muted)]">Start from discovery with an exam or programme name.</p>
              <Link href="/search" className="dam-btn-primary mt-6 inline-block no-underline">
                Go to search
              </Link>
            </div>
          </>
        ) : (
          <>
            {topChrome}

            <div className="flex flex-wrap items-baseline gap-3 border border-b-0 border-white/15 bg-white/95 px-4 py-3 text-[var(--m-ink)] sm:px-5">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#6b7280]">
                {loading ? "…" : `${filteredRows.length} institutes`}
              </span>
              <h1 className="min-w-0 flex-1 text-lg font-bold leading-tight text-[#000016] sm:text-xl">
                Institutions offering {kindLabel.toLowerCase()} matching &ldquo;{q}&rdquo;
              </h1>
              <span className="rounded-md border border-[#e4e4e7] bg-[#f4f4f5] px-3 py-1.5 text-xs font-semibold text-[#000016]">
                {data?.sortedBy === "distance" ? "Sort: nearest first" : "Sort: A–Z by city"}
              </span>
            </div>

            <div className="grid min-h-[420px] grid-cols-1 gap-0 rounded-b-xl border border-white/15 bg-[#fafafa] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)] lg:grid-cols-[minmax(220px,0.3fr)_1fr]">
              <aside className="border-b border-[#e4e4e7] bg-white p-4 text-[var(--m-ink)] lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2">
                  <span className="text-xs font-bold text-[#000016]">Filters</span>
                  <button type="button" className="text-[0.65rem] font-semibold uppercase tracking-wide text-[#b01f24]" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>

                <fieldset className="mt-4 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Location</legend>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                    <input type="checkbox" checked={metroOnly} onChange={(e) => setMetroOnly(e.target.checked)} className="accent-[#b01f24]" />
                    Metro &amp; major hubs
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                    <input type="checkbox" checked={nearby25} onChange={(e) => setNearby25(e.target.checked)} className="accent-[#b01f24]" />
                    Within 25 km (needs saved location)
                  </label>
                </fieldset>

                <fieldset className="mt-5 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Fees (program range)</legend>
                  {(
                    [
                      ["ANY", "Any"],
                      ["UNDER_50K", "Under ₹50k"],
                      ["RANGE_50_100K", "₹50k – ₹1 L"],
                      ["OVER_100K", "Above ₹1 L"],
                    ] as const
                  ).map(([val, label]) => (
                    <label key={val} className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                      <input
                        type="radio"
                        name="fee-band"
                        checked={feeBand === val}
                        onChange={() => setFeeBand(val)}
                        className="accent-[#b01f24]"
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="mt-5 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Rating</legend>
                  {(
                    [
                      [0, "Any rating"],
                      [4, "4.0+ stars"],
                      [4.5, "4.5+ stars"],
                    ] as const
                  ).map(([val, label]) => (
                    <label key={val} className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                      <input
                        type="radio"
                        name="min-rating"
                        checked={minRating === val}
                        onChange={() => setMinRating(val)}
                        className="accent-[#b01f24]"
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="mt-5 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Accreditation</legend>
                  <p className="text-[0.6rem] text-[#6b7280]">Match any selected tier (none = show all).</p>
                  {(
                    [
                      ["A", "NAAC A"],
                      ["APLUS", "NAAC A+"],
                      ["APLUSPLUS", "NAAC A++"],
                      ["NONE", "Unlisted / other"],
                    ] as const
                  ).map(([k, label]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                      <input
                        type="checkbox"
                        checked={naacFilter.has(k)}
                        onChange={() => toggleNaac(k)}
                        className="accent-[#b01f24]"
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="mt-5 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Study format</legend>
                  {(["ONLINE", "HYBRID", "OFFLINE"] as const).map((m) => (
                    <label key={m} className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                      <input type="checkbox" checked={studyFilter.has(m)} onChange={() => toggleStudy(m)} className="accent-[#b01f24]" />
                      {m === "ONLINE" ? "Online" : m === "HYBRID" ? "Hybrid" : "Classroom"}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="mt-5 space-y-2">
                  <legend className="text-[0.65rem] font-bold uppercase tracking-wide text-[#6b7280]">Institute</legend>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-[#1f2937]">
                    <input type="checkbox" checked={partnerOnly} onChange={(e) => setPartnerOnly(e.target.checked)} className="accent-[#b01f24]" />
                    Partner institutes only
                  </label>
                </fieldset>

                <p className="mt-6 text-[0.65rem] leading-relaxed text-[#6b7280]">
                  Up to ten institutes load per search. Distance uses your last saved browser location when available.
                </p>
              </aside>

              <div className="p-4 text-[var(--m-ink)] sm:p-5">
                {error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
                {loading && !data ? <p className="text-sm text-[#6b7280]">Loading catalogue…</p> : null}
                {!loading && data && filteredRows.length === 0 ? (
                  <p className="text-sm text-[#6b7280]">No institutes match these filters. Try clearing filters or refining your search.</p>
                ) : null}

                <ul className="space-y-4">
                  {filteredRows.map((row) => (
                    <li key={row.institute.id}>
                      <article className="relative overflow-hidden rounded-xl border border-[#e4e4e7] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                        {row.institute.isPartner ? (
                          <div className="absolute right-0 top-0 z-[1] origin-top-right translate-x-[38%] -translate-y-[22%] rotate-45 bg-gradient-to-r from-[#e39632] to-[#ffaf02] px-10 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#000016] shadow-sm">
                            Partner
                          </div>
                        ) : null}
                        <div className="p-5 pt-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <Link
                                href={`/institutes/${row.institute.id}`}
                                className="text-lg font-bold text-[#35519e] no-underline hover:underline"
                              >
                                {row.institute.logoEmoji} {row.institute.name}
                              </Link>
                              <p className="mt-1 text-xs text-[#6b7280]">
                                {row.institute.city}
                                {row.institute.typeLabel ? ` · ${row.institute.typeLabel}` : ""}
                                {row.institute.accreditationTag ? ` · ${row.institute.accreditationTag}` : ""}
                                {row.distanceKm != null ? ` · ${row.distanceKm} km` : ""}
                              </p>
                              <p className="mt-1 text-xs font-medium text-[#92400e]">
                                {row.institute.averageRating.toFixed(1)} ★ ({row.institute.reviewCount.toLocaleString("en-IN")} reviews)
                              </p>
                              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#4b5563]">{row.institute.shortBio}</p>
                              <p className="mt-2 text-xs font-medium text-[#6b7280]">
                                Listings matched: {row.matchedExams.map((e) => e.name).join(" · ")}
                              </p>
                            </div>
                            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                              <Link href={`/institutes/${row.institute.id}`} className="dam-btn-secondary text-center text-xs no-underline">
                                View profile
                              </Link>
                              <Link
                                href={`/exams/${row.matchedExams[0]?.id ?? ""}/institutes`}
                                className="dam-btn-primary text-center text-xs no-underline"
                              >
                                Programmes
                              </Link>
                            </div>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:max-w-3xl">
                            <div className="rounded-md bg-[#f4f4f5] px-2 py-2 text-center">
                              <span className="block text-[0.65rem] font-bold text-[#111827]">{row.programCount}</span>
                              <span className="text-[0.6rem] text-[#6b7280]">Programmes</span>
                            </div>
                            <div className="rounded-md bg-[#f4f4f5] px-2 py-2 text-center">
                              <span className="block truncate text-[0.65rem] font-bold text-[#111827]">{formatFeeRange(row.feeMinPaise, row.feeMaxPaise)}</span>
                              <span className="text-[0.6rem] text-[#6b7280]">Fees</span>
                            </div>
                            <div className="rounded-md bg-[#f4f4f5] px-2 py-2 text-center">
                              <span className="block text-[0.65rem] font-bold text-[#111827]">
                                {row.studyModes
                                  .map((m) => (m === "ONLINE" ? "Online" : m === "HYBRID" ? "Hybrid" : "Classroom"))
                                  .join(" · ")}
                              </span>
                              <span className="text-[0.6rem] text-[#6b7280]">Modes</span>
                            </div>
                            <div className="rounded-md bg-[#f4f4f5] px-2 py-2 text-center">
                              <span className="block text-[0.65rem] font-bold text-[#111827]">{row.distanceKm != null ? `${row.distanceKm} km` : "—"}</span>
                              <span className="text-[0.6rem] text-[#6b7280]">Distance</span>
                            </div>
                          </div>
                          <div className="mt-4 border-l-4 border-[#ffaf02] bg-[rgba(255,175,2,0.12)] px-3 py-2 text-xs text-[#1f2937]">
                            {row.institute.isPartner
                              ? "Partner institute — guided application flow on this demo."
                              : "Explore programmes and contact options from the institute profile."}
                          </div>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </DiscoverySurface>
    </Shell>
  );
}
