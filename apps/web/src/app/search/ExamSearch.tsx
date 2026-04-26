"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DiscoverySurface } from "@/components/DiscoverySurface";

type SearchKind = "COMPETITIVE_EXAM" | "NON_DEGREE_COURSE";

const CAROUSEL_SLIDES: { src: string; alt: string }[] = [
  { src: "/carousel/medical.svg", alt: "Medical entrance exams — NEET and more" },
  { src: "/carousel/engineering.svg", alt: "Engineering entrance exams — JEE and more" },
  { src: "/carousel/law.svg", alt: "Law entrance exams — CLAT and more" },
  { src: "/carousel/civil.svg", alt: "Civil services and government recruitment exams" },
  { src: "/carousel/management.svg", alt: "Management aptitude tests — CAT and more" },
];

function SearchFilmstrip() {
  const doubled = [...CAROUSEL_SLIDES, ...CAROUSEL_SLIDES];
  return (
    <div
      className="relative w-full overflow-hidden py-6 sm:py-8"
      role="region"
      aria-label="Rotating showcase of exam and programme categories"
    >
      <div className="dam-search-filmstrip-track">
        {doubled.map((slide, i) => (
          <img
            key={`${slide.src}-${i}`}
            src={slide.src}
            alt={slide.alt}
            width={288}
            height={480}
            className="dam-search-slide block h-auto max-h-[min(5in,85vh)] w-[min(3in,85vw)] max-w-none shrink-0 rounded-xl object-cover shadow-2xl ring-1 ring-white/10"
            decoding="async"
            loading={i < 2 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </div>
  );
}

function DiscoveryInfo() {
  return (
    <section className="mt-14 border-t border-white/10 pt-12" aria-labelledby="discovery-heading">
      <h2 id="discovery-heading" className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
        What you can search
      </h2>
      <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.07)] px-5 py-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-[#f0d9a8]">Competitive exams</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            National and university entrance tests — NEET, JEE, CLAT, UPSC, CAT, and more. Results take you to a
            catalogue of institutes running programmes around that listing, sorted by how close they are to you when
            location is available.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.07)] px-5 py-4 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-[#f0d9a8]">Non-degree courses</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Short professional programmes — certificates, bootcamps, and intensives that are not framed as formal
            degree admissions. The same catalogue view lists institutes that publish those offerings in this demo.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ExamSearch() {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [searchKind, setSearchKind] = useState<SearchKind>("COMPETITIVE_EXAM");
  const [touchedSubmit, setTouchedSubmit] = useState(false);

  const runSearch = useCallback(() => {
    setTouchedSubmit(true);
    const next = draft.trim();
    if (!next) return;
    router.push(`/catalog?q=${encodeURIComponent(next)}&kind=${searchKind}`);
  }, [draft, router, searchKind]);

  return (
    <DiscoverySurface>
        <header className="text-center">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#f0d9a8]">Discovery</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Find exams &amp; non-degree programmes
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Choose what you are looking for, then search. You&apos;ll land on a catalogue of institutes offering
            matching programmes — ordered by distance when your browser has saved a location.
          </p>
        </header>

        <div className="mt-8">
          <SearchFilmstrip />
        </div>

        <div className="mx-auto mt-6 flex max-w-md justify-center gap-2 rounded-xl bg-white/10 p-1.5" role="tablist" aria-label="Search type">
          <button
            type="button"
            role="tab"
            aria-selected={searchKind === "COMPETITIVE_EXAM"}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              searchKind === "COMPETITIVE_EXAM" ? "bg-white text-[var(--m-navy)] shadow" : "text-white/85 hover:bg-white/10"
            }`}
            onClick={() => setSearchKind("COMPETITIVE_EXAM")}
          >
            Competitive exams
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={searchKind === "NON_DEGREE_COURSE"}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              searchKind === "NON_DEGREE_COURSE" ? "bg-white text-[var(--m-navy)] shadow" : "text-white/85 hover:bg-white/10"
            }`}
            onClick={() => setSearchKind("NON_DEGREE_COURSE")}
          >
            Non-degree courses
          </button>
        </div>

        <div className="relative z-10 mx-auto mt-6 max-w-2xl">
          <form
            role="search"
            aria-label="Search institutes by exam or programme"
            className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0_24px_64px_-8px_rgba(0,0,0,0.55)] ring-1 ring-black/10 sm:flex-row sm:items-stretch sm:gap-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
          >
            <label htmlFor="exam-search" className="sr-only">
              Search keyword
            </label>
            <input
              id="exam-search"
              type="search"
              name="q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={
                searchKind === "COMPETITIVE_EXAM"
                  ? "e.g. NEET, CLAT, UPSC, JEE…"
                  : "e.g. Digital Marketing, Data Analytics, bootcamp…"
              }
              autoComplete="off"
              autoFocus
              aria-invalid={touchedSubmit && !draft.trim()}
              aria-describedby="search-hint"
              className="min-h-14 w-full flex-1 rounded-xl border-2 border-transparent bg-white px-4 py-3 text-lg font-medium text-[var(--m-navy)] shadow-inner outline-none transition placeholder:text-neutral-400 focus:border-[var(--m-burgundy)] focus:ring-4 focus:ring-[var(--m-burgundy)]/15"
            />
            <button type="submit" className="dam-btn-primary min-h-14 shrink-0 rounded-xl px-8 py-3 text-base font-semibold sm:min-w-[7.5rem]">
              Search
            </button>
          </form>
          <p id="search-hint" className="mt-3 text-center text-xs text-white/60 sm:text-sm">
            Opens the institute catalogue for your keywords. Allow location in the browser for nearest-first sorting.
          </p>
          {touchedSubmit && !draft.trim() ? (
            <p className="mt-2 text-center text-sm font-medium text-[#fecaca]" role="alert">
              Enter a search term, then try again.
            </p>
          ) : null}
        </div>

        <DiscoveryInfo />

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-white/55">
          Catalogue uses the same discovery surface — continue in one flow after you search.
        </p>
    </DiscoverySurface>
  );
}
