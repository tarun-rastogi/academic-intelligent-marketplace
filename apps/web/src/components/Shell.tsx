import Link from "next/link";

const shellLinks = [
  { href: "/search", label: "Search exams" },
  { href: "/exams", label: "All exams" },
  { href: "/fields", label: "Fields" },
  { href: "/account", label: "Account" },
] as const;

function LogoMark() {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#b01f24] to-[#0c226b] text-sm font-bold text-white shadow-md"
      aria-hidden
    >
      M
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
      <header className="sticky top-0 z-40 border-b border-[var(--m-border)] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl min-w-0 flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <Link href="/" className="group flex min-w-0 max-w-[min(100%,14rem)] shrink items-center gap-2 sm:max-w-none sm:gap-3">
            <LogoMark />
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-xs font-bold tracking-tight text-[var(--m-navy)] transition group-hover:text-[var(--m-burgundy)] sm:text-sm">
                Digital Academic Marketplace
              </span>
              <span className="hidden text-[11px] font-medium text-[var(--muted)] md:block">
                Exams · Institutes · Applications
              </span>
            </div>
          </Link>
          <nav className="hidden min-w-0 flex-wrap items-center justify-end gap-0.5 md:flex lg:gap-2" aria-label="App">
            {shellLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-2 py-2 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)] lg:px-3 lg:text-sm"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/india#login"
              className="ml-0.5 rounded-lg bg-gradient-to-r from-[#b01f24] to-[#8b1a2a] px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105 lg:ml-1 lg:px-3 lg:text-sm"
            >
              Sign in
            </Link>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/india#login"
              className="rounded-lg bg-gradient-to-r from-[#b01f24] to-[#8b1a2a] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              Sign in
            </Link>
            <details className="shell-mobile-nav relative">
              <summary className="cursor-pointer rounded-lg border border-[var(--m-border)] bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-[var(--m-ink)] shadow-sm">
                Menu
              </summary>
              <nav
                className="absolute right-0 z-50 mt-2 w-[min(calc(100vw-1rem),15rem)] rounded-lg border border-[var(--m-border)] bg-white py-2 shadow-xl"
                aria-label="App mobile"
              >
                {shellLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block px-4 py-2.5 text-sm font-medium text-[var(--muted)] no-underline hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-3 py-6 sm:px-4 sm:py-8">{children}</main>
      <footer className="mt-auto border-t border-[var(--m-navy-deep)] bg-gradient-to-b from-[#0c226b] to-[#071a47] py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 sm:flex-row sm:items-start sm:justify-between sm:px-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#e39632]">Marketplace</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/75">
              © {new Date().getFullYear()} Digital Academic Marketplace. Guidance for India&apos;s competitive exam and
              institute journey.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <span className="inline-flex w-fit rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs font-medium text-[#f0d9a8]">
              English (India)
            </span>
            <span className="text-xs text-white/55">Secure payments · Razorpay</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
