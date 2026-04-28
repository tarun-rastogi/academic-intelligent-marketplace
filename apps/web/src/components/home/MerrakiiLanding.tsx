"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const destinations = [
  "Australia",
  "UAE",
  "New Zealand",
  "Canada",
  "USA",
  "Europe",
  "Georgia",
  "Ireland",
  "Germany",
  "UK",
];

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    alt: "Students collaborating around a laptop on campus",
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&h=600&q=80",
    alt: "Students studying together in a bright study space",
  },
  {
    src: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    alt: "Graduates celebrating academic achievement",
  },
  {
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=600&q=80",
    alt: "Historic university building facade",
  },
];

const HOMEPAGE_NAV: [string, string][] = [
  ["Home", "/#top"],
  ["About", "/#about"],
  ["Who we are", "/#who"],
  ["Study abroad", "/#international"],
  ["Study in India", "/#domestic"],
  ["Services", "/#services"],
  ["Contact", "/#contact"],
];

export function MerrakiiLanding() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.querySelectorAll(".mk-home-reveal").forEach((el) => el.classList.add("mk-home-reveal--visible"));
      return;
    }
    const els = root.querySelectorAll(".mk-home-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("mk-home-reveal--visible");
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="mk-home min-h-screen max-w-full min-w-0 overflow-x-hidden bg-[#fff] text-[#1c1410]">
      <a
        href="#mk-main"
        className="mk-home-skip focus:outline-none fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-[#b01f24] px-4 py-2 text-sm font-semibold text-white opacity-0 transition focus:translate-y-0 focus:opacity-100"
      >
        Skip to content
      </a>

      <header className="mk-home-header sticky top-0 z-50 w-full max-w-full border-b border-black/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-full min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-5 lg:px-8 xl:px-12 2xl:px-14">
          <Link href="/" className="group flex min-w-0 shrink items-center gap-2 no-underline">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b01f24] to-[#8b181c] text-sm font-bold text-white shadow-md transition group-hover:brightness-105 sm:h-10 sm:w-10"
              aria-hidden
            >
              M
            </span>
            <span className="mk-home-serif truncate text-base font-semibold tracking-tight text-[#1c1410] group-hover:text-[#b01f24] sm:text-lg">
              Merrakii
            </span>
          </Link>
          <nav
            className="mk-home-nav mx-auto hidden min-w-0 max-w-[min(100%,48rem)] flex-1 flex-wrap items-center justify-center gap-x-0 gap-y-1 lg:flex xl:max-w-none xl:justify-end xl:gap-x-0.5"
            aria-label="Primary"
          >
            {HOMEPAGE_NAV.map(([label, href]) => (
              <a
                key={String(label)}
                href={href}
                className="rounded-md px-1.5 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#44403c] no-underline transition hover:bg-[#f7f4ed] hover:text-[#b01f24] xl:px-2.5 xl:text-xs xl:tracking-wider"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/india#login"
              className="mk-home-btn-primary rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white no-underline shadow-sm sm:px-4 sm:py-2.5 sm:text-xs"
            >
              Get started
            </Link>
            <details className="mk-home-mobile-nav relative lg:hidden">
              <summary className="cursor-pointer rounded-md border border-black/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#44403c] shadow-sm">
                Menu
              </summary>
              <nav
                className="absolute right-0 z-[60] mt-2 w-[min(calc(100vw-1.5rem),16rem)] rounded-lg border border-black/10 bg-white py-2 shadow-xl"
                aria-label="Primary mobile"
              >
                {HOMEPAGE_NAV.map(([label, href]) => (
                  <a
                    key={`m-${label}`}
                    href={href}
                    className="block px-4 py-2.5 text-sm font-medium text-[#44403c] no-underline hover:bg-[#f7f4ed] hover:text-[#b01f24]"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="mk-main">
        <section
          id="top"
          className="mk-home-section mk-home-section--muted w-full scroll-mt-20 border-b border-black/5"
          aria-labelledby="about"
        >
          <div className="grid w-full items-stretch gap-0 lg:grid-cols-2">
            <div className="mk-home-reveal flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-12 xl:px-16 lg:py-16 xl:py-20">
              <div className="max-w-xl">
                <h1 id="about" className="mk-home-serif text-[clamp(1.75rem,5vw+0.25rem,3.25rem)] font-semibold leading-[1.15] text-[#1c1410]">
                  About
                  <span className="mt-3 block h-1 w-16 rounded-full bg-[#e39632]" />
                </h1>
                <p className="mt-6 text-base leading-relaxed text-[#57534e] sm:text-lg">
                  Merrakii, the flagship brand of Munjal Universal Consultancy, connects ambitious students with
                  world-class international destinations and a disciplined India pathway — from first conversation to
                  enrollment — with transparent guidance at every step.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/abroad"
                    className="mk-home-btn-primary inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white no-underline shadow-md transition hover:brightness-110"
                  >
                    Study abroad
                  </Link>
                  <Link
                    href="/india"
                    className="mk-home-btn-outline inline-flex items-center justify-center rounded-md border-2 border-[#b01f24] bg-white px-6 py-3 text-sm font-semibold text-[#b01f24] no-underline transition hover:bg-[#fdf5f5]"
                  >
                    Study in India
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative min-h-[280px] lg:min-h-[420px]">
              <Image
                src="https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=1200&h=900&fit=crop"
                alt="Student reaching for books in a library"
                fill
                unoptimized
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </section>

        <section
          id="who"
          className="mk-home-section mk-home-section--muted w-full scroll-mt-20 border-b border-black/5 py-14 sm:py-16 lg:py-20"
          aria-labelledby="mk-who-heading"
        >
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="mx-auto max-w-4xl text-center mk-home-reveal">
              <h2 id="mk-who-heading" className="mk-home-serif text-3xl font-semibold text-[#1c1410] sm:text-4xl">
                Who we are
                <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#e39632]" />
              </h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-7xl min-w-0 gap-10 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14 xl:gap-20">
              <div className="min-w-0 space-y-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md bg-[#e7e5e4]">
                  {/* Native img: avoids next/image wrapper issues; URL verified HTTP 200 */}
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
                    alt="Students learning in an academic setting"
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <p className="mk-home-reveal mk-home-serif text-base leading-relaxed text-[#44403c] sm:text-lg">
                  We foster an inclusive mentorship mindset — personalised advice, clear milestones, and strategic
                  support so learners can aim higher and reach their goals with confidence.
                </p>
              </div>
              <div className="mk-home-reveal relative min-w-0 overflow-hidden">
                <span className="mk-home-watermark pointer-events-none select-none" aria-hidden>
                  M
                </span>
                <div className="relative z-[1] space-y-8">
                  <article>
                    <h3 className="mk-home-serif text-xl font-semibold text-[#1c1410]">
                      We have an international academic community
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#57534e] sm:text-base">
                      Study abroad at your dream destination — Australia, UAE, New Zealand, Canada, USA, Europe, and
                      many more. Merrakii empowers students with access to curated global opportunities, fostering
                      leadership and nurturing global citizens through a unified counselling approach.
                    </p>
                  </article>
                  <article id="domestic" className="scroll-mt-24">
                    <h3 className="mk-home-serif text-xl font-semibold text-[#1c1410]">
                      India pathway: fields, exams, and enrolment
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#57534e] sm:text-base">
                      Browse eight academic fields from medical to defence, explore forty-plus competitive exams, compare
                      institutes and programmes, then move through structured application steps with secure payments —
                      the same clarity you expect from premium counselling, built into one guided flow.
                    </p>
                  </article>
                  <article>
                    <h3 className="mk-home-serif text-xl font-semibold text-[#1c1410]">What we deliver end-to-end</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#57534e] sm:text-base">
                      Premium counselling, study abroad admissions guidance, events and community learning, test
                      readiness, and summer-school access — designed as a holistic ladder from exploration to a
                      confident offer, without hidden steps.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="international"
          className="mk-home-section w-full scroll-mt-20 border-b border-black/5 bg-white py-12 sm:py-14"
          aria-labelledby="mk-intl-heading"
        >
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="mk-home-reveal mx-auto max-w-4xl text-center">
              <h2 id="mk-intl-heading" className="mk-home-serif text-2xl font-semibold text-[#1c1410] sm:text-3xl">
                Study abroad at your dream destination
              </h2>
              <p className="mt-4 text-[#57534e]">
                Destinations and guidance aligned with how{" "}
                <a href="https://merrakii.co.in/" className="font-semibold text-[#b01f24] underline-offset-2 hover:underline">
                  Merrakii
                </a>{" "}
                serves families today.
              </p>
              <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                {destinations.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-black/10 bg-[#f7f4ed] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#44403c]"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="gallery"
          className="mk-home-section mk-home-section--muted w-full border-b border-black/5 py-10 sm:py-12"
          aria-label="Student life gallery"
        >
          <div className="relative px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="mk-home-reveal flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#78716c]">Journey snapshots</span>
              <span className="h-px flex-1 bg-black/10" aria-hidden />
            </div>
            <div className="mk-home-carousel mt-6 flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
              {galleryImages.map((img) => (
                <div
                  key={img.src}
                  className="relative h-48 w-48 shrink-0 overflow-hidden rounded-lg shadow-md sm:h-56 sm:w-56"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    unoptimized
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 192px, 224px"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="stats"
          className="mk-home-section w-full scroll-mt-20 border-b border-black/5 bg-white py-14 sm:py-16"
          aria-labelledby="mk-stats-heading"
        >
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="mk-home-reveal mx-auto max-w-3xl text-center">
              <h2 id="mk-stats-heading" className="mk-home-serif text-3xl font-semibold text-[#1c1410] sm:text-4xl">
                Reach higher with Merrakii
                <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#e39632]" />
              </h2>
              <p className="mt-4 text-[#57534e]">
                Milestones that mirror both our global programmes and your India study experience in this app.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4 lg:gap-0">
              {[
                { n: "10+", l: "Study regions & pathways" },
                { n: "8", l: "Academic fields covered" },
                { n: "40+", l: "Competitive exams surfaced" },
                { n: "1", l: "Guided apply & pay flow" },
              ].map((s, i) => (
                <div
                  key={s.l}
                  className={`mk-home-reveal px-1 text-center sm:px-2 lg:px-6 ${i > 0 ? "lg:border-l lg:border-black/10" : ""}`}
                >
                  <p className="mk-home-stat-num mk-home-serif text-4xl font-bold text-[#b01f24] sm:text-5xl">{s.n}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#57534e] sm:text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="success" className="relative w-full" aria-label="Celebrating student success">
          <div className="relative aspect-[4/3] min-h-[200px] w-full sm:aspect-[16/9] md:aspect-[21/9] md:min-h-[280px] lg:min-h-[340px]">
            <Image
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2000&q=85"
              alt="Graduates celebrating success"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
          </div>
        </section>

        <section
          id="cta"
          className="mk-home-section mk-home-section--muted w-full scroll-mt-20 py-16 sm:py-20"
          aria-labelledby="mk-cta-heading"
        >
          <div className="mk-home-reveal px-4 text-center sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b01f24]">Change your trajectory</p>
            <h2 id="mk-cta-heading" className="mk-home-serif mt-4 text-3xl font-semibold text-[#1c1410] sm:text-4xl md:text-[2.75rem] md:leading-tight">
              Start your new chapter with us
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#57534e]">
              Whether you are aiming overseas or doubling down on India, sign in with your mobile to continue your
              guided journey.
            </p>
            <Link
              href="/india#login"
              className="mk-home-btn-primary mt-8 inline-flex items-center justify-center rounded-md px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white no-underline shadow-lg transition hover:brightness-110"
            >
              Get started
            </Link>
          </div>
        </section>

        <section
          id="services"
          className="mk-home-section w-full border-t border-black/5 bg-white py-14 sm:py-16"
          aria-labelledby="mk-services-heading"
        >
          <div className="px-4 sm:px-8 lg:px-12 xl:px-16">
            <h2 id="mk-services-heading" className="mk-home-reveal mk-home-serif text-center text-2xl font-semibold text-[#1c1410] sm:text-3xl">
              Why families choose Merrakii
            </h2>
            <ul className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Seamless, transparent process — clear steps without confusion.",
                "Global university access across key regions worldwide.",
                "Expert study abroad counsellors from shortlist to final admission.",
                "Tailored academic support and profile-building guidance.",
                "End-to-end transition help: accommodation, insurance, paperwork context.",
                "India app: search exams and institutes, compare options, apply and pay securely.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="mk-home-reveal flex gap-3 rounded-lg border border-black/10 bg-[#f7f4ed] p-5 text-sm leading-relaxed text-[#44403c]"
                >
                  <span className="mk-home-serif mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b01f24] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer id="contact" className="w-full border-t border-black/10 bg-white scroll-mt-20">
          <div className="grid gap-10 px-4 py-14 sm:px-8 lg:grid-cols-4 lg:gap-8 lg:px-12 xl:px-16">
            <div className="mk-home-reveal">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#b01f24] to-[#8b181c] text-xs font-bold text-white">M</span>
                <span className="mk-home-serif text-lg font-semibold">Merrakii</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#57534e]">
                Munjal Universal Consultancy flagship — international education and disciplined India pathways for
                ambitious students.
              </p>
            </div>
            <div className="mk-home-reveal">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1410]">Explore</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/abroad" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Study abroad
                  </Link>
                </li>
                <li>
                  <Link href="/india" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Study in India
                  </Link>
                </li>
                <li>
                  <Link href="/fields" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Academic fields
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mk-home-reveal">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1410]">Programmes</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/exams" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Exams
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Search institutes
                  </Link>
                </li>
                <li>
                  <Link href="/catalog" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="text-[#57534e] no-underline hover:text-[#b01f24]">
                    Account
                  </Link>
                </li>
              </ul>
            </div>
            <div className="mk-home-reveal">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1410]">Contact</h3>
              <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-[#57534e]">
                <p>
                  <a href="mailto:info@merrakii.co.in" className="text-[#b01f24] hover:underline">
                    info@merrakii.co.in
                  </a>
                </p>
                <p>
                  <a href="tel:+919899088710" className="hover:text-[#b01f24]">
                    +91 98990 88710
                  </a>
                </p>
                <p>
                  <a href="https://merrakii.co.in/" className="hover:text-[#b01f24]">
                    merrakii.co.in
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="border-t border-black/10 px-4 py-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="flex flex-col items-center justify-between gap-2 text-xs text-[#78716c] sm:flex-row">
              <p>© {new Date().getFullYear()} Merrakii · Munjal Universal Consultancy. All rights reserved.</p>
              <p>Designed for student success — India and the world.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
