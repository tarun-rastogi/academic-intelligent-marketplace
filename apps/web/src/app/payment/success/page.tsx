"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

type ApplicationDetail = {
  id: string;
  status: string;
  name: string;
  program: {
    name: string;
    exam: { name: string };
    institute: { name: string; city: string; isPartner: boolean };
    paymentPlans: { amountPaise: number; currency: string; name: string }[];
  };
  paymentDetails: { status: string; amountPaise: number; currency: string }[];
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [row, setRow] = useState<ApplicationDetail | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) {
      setRow(null);
      return;
    }
    void (async () => {
      try {
        const res = await api<{ application: ApplicationDetail }>(`/applications/${applicationId}`);
        setRow(res.application);
      } catch {
        setError("We could not load your enrollment details. Check My applications.");
        setRow(null);
      }
    })();
  }, [applicationId]);

  if (row === undefined) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[var(--muted)]">Loading confirmation…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dam-card-static mx-auto max-w-md p-6 text-center">
        <p className="text-[var(--danger)]">{error}</p>
        <Link href="/account" className="dam-btn-primary mt-5 inline-flex no-underline">
          My applications
        </Link>
      </div>
    );
  }

  const partner = row?.program.institute.isPartner;
  const feePlan = row?.program.paymentPlans[0];
  const paid = row?.paymentDetails[0]?.status === "CAPTURED";

  return (
    <div className="mx-auto max-w-lg">
      <div className="dam-card-static overflow-hidden border-t-4 border-t-[#e39632] p-0">
        <div className="bg-gradient-to-br from-[#0c226b] via-[#163269] to-[#8b1a2a] px-8 pb-2 pt-10 text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e39632]/25 text-3xl shadow-lg">
            ✓
          </div>
          <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-white">
            You&apos;re enrolled
          </h1>
          <p className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-white/80">
            {partner
              ? "Your course fee is recorded. The institute will finalize seat confirmation and next steps on email or phone."
              : "Your interest and payment are on record. The institute team will reach out with program details — your application was routed as a qualified lead."}
          </p>
        </div>

        {row ? (
          <div className="space-y-4 border-t border-[var(--border)] bg-white px-6 py-6 text-left text-sm text-[var(--m-ink)]">
            <div className="rounded-lg bg-[var(--m-cream)]/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Course</p>
              <p className="mt-1 font-bold text-[var(--m-navy)]">{row.program.name}</p>
              <p className="text-[var(--muted)]">{row.program.exam.name}</p>
            </div>
            <div className="rounded-lg bg-[var(--m-cream)]/50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Institute</p>
              <p className="mt-1 font-semibold text-[var(--m-navy)]">{row.program.institute.name}</p>
              <p className="text-[var(--muted)]">{row.program.institute.city}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--border)] px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">Student</p>
                <p className="mt-1 font-medium text-[var(--m-navy)]">{row.name}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] px-4 py-3">
                <p className="text-xs font-semibold text-[var(--muted)]">Enrollment reference</p>
                <p className="mt-1 break-all font-mono text-xs text-[var(--m-navy)]">{row.id}</p>
              </div>
            </div>
            {feePlan && paid ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#e39632]/40 bg-[#fff9ed] px-4 py-3">
                <span className="text-xs font-semibold text-[var(--m-navy)]">Amount paid</span>
                <span className="text-lg font-extrabold text-[var(--m-burgundy)]">
                  ₹{(feePlan.amountPaise / 100).toLocaleString("en-IN")} {feePlan.currency}
                </span>
              </div>
            ) : null}
            <p className="text-xs text-[var(--muted)]">
              Status in your account: <span className="font-semibold text-[var(--m-navy)]">{row.status}</span>
            </p>
          </div>
        ) : (
          <div className="border-t border-[var(--border)] bg-[var(--m-cream)]/40 px-6 py-6 text-center text-sm text-[var(--muted)]">
            Save your application reference from your account if you did not arrive here from checkout.
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 border-t border-[var(--border)] bg-[var(--m-cream)]/40 px-6 py-6">
          <Link href="/account" className="dam-btn-primary no-underline">
            My applications
          </Link>
          <Link href="/fields" className="dam-btn-secondary no-underline">
            Browse programs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Shell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg text-center">
            <p className="text-[var(--muted)]">Loading…</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </Shell>
  );
}
