import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function StudyAbroadPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-xl text-center">
        <p className="dam-eyebrow">Study abroad</p>
        <h1 className="dam-page-title mt-4">We&apos;re building this journey</h1>
        <p className="dam-lead mt-4 text-balance">
          Country guides, partner institutions, and application support for international study will appear here. For
          now, explore the India marketplace or return to choose your path again.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="dam-btn-secondary no-underline">
            ← Choose path again
          </Link>
          <Link href="/india" className="dam-btn-primary no-underline">
            Study in India
          </Link>
        </div>
      </div>
    </Shell>
  );
}
