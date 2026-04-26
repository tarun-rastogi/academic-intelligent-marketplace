import Link from "next/link";

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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--m-border)] bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <Link href="/" className="group flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-[var(--m-navy)] transition group-hover:text-[var(--m-burgundy)]">
                Digital Academic Marketplace
              </span>
              <span className="hidden text-[11px] font-medium text-[var(--muted)] sm:block">
                Exams · Institutes · Applications
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)]"
            >
              Search exams
            </Link>
            <Link
              href="/exams"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)]"
            >
              All exams
            </Link>
            <Link
              href="/fields"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)]"
            >
              Fields
            </Link>
            <Link
              href="/account"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--m-cream)] hover:text-[var(--m-navy)]"
            >
              Account
            </Link>
            <Link
              href="/#login"
              className="ml-1 rounded-lg bg-gradient-to-r from-[#b01f24] to-[#8b1a2a] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <footer className="mt-auto border-t border-[var(--m-navy-deep)] bg-gradient-to-b from-[#0c226b] to-[#071a47] py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-start sm:justify-between">
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
