"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shell } from "@/components/Shell";
import { api } from "@/lib/api";

export default function AccountPage() {
  const [user, setUser] = useState<{ phone: string; name: string | null; email: string | null } | null>(null);
  const [apps, setApps] = useState<
    {
      id: string;
      status: string;
      program: { name: string; institute: { name: string }; exam: { name: string } };
      paymentDetails: { status: string; razorpayPaymentId: string | null }[];
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const u = await api<{ user: typeof user }>("/auth/me");
        setUser(u.user);
        const a = await api<{ applications: typeof apps }>("/applications/mine");
        setApps(a.applications);
      } catch {
        setError("You are not signed in.");
      }
    })();
  }, []);

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    setApps([]);
    setError("You are not signed in.");
  }

  if (error && !user) {
    return (
      <Shell>
        <div className="dam-card-static max-w-md p-6">
          <p className="font-medium text-[var(--danger)]">{error}</p>
          <Link href="/" className="dam-btn-primary mt-5 inline-flex no-underline">
            Sign in from home
          </Link>
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <p className="text-[var(--muted)]">Loading…</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="dam-card-static flex flex-wrap items-start justify-between gap-6 p-6 sm:p-8">
        <div>
          <p className="dam-eyebrow">Profile</p>
          <h1 className="dam-page-title mt-2">Your account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            <span className="font-semibold text-[var(--m-navy)]">{user.phone}</span>
            {user.email ? (
              <>
                <span className="mx-2 text-[var(--border-strong)]">·</span>
                {user.email}
              </>
            ) : null}
          </p>
        </div>
        <button type="button" className="dam-btn-secondary" onClick={() => void logout()}>
          Log out
        </button>
      </div>

      <h2 className="dam-page-title mt-12">My applications</h2>
      <p className="dam-lead">Track status and continue payment where needed.</p>
      {apps.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--m-cream)] px-6 py-10 text-center">
          <p className="text-sm text-[var(--muted)]">
            No applications yet.{" "}
            <Link href="/fields" className="font-semibold text-[var(--m-burgundy)] hover:underline">
              Browse fields
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {apps.map((a) => {
            const pay = a.paymentDetails[0];
            return (
              <li key={a.id} className="dam-card-static p-5 sm:p-6">
                <p className="font-bold text-[var(--m-navy)]">{a.program.name}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {a.program.institute.name} · {a.program.exam.name}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-lg bg-[var(--m-cream)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--m-navy)]">
                    {a.status.replace(/_/g, " ")}
                  </span>
                  {pay ? (
                    <span className="rounded-lg bg-[var(--m-burgundy-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--m-burgundy-dark)]">
                      Payment: {pay.status}
                    </span>
                  ) : null}
                </div>
                {["SUBMITTED", "PAYMENT_PENDING"].includes(a.status) ? (
                  <Link
                    href={`/payment/${a.id}`}
                    className="dam-btn-primary mt-5 inline-flex no-underline"
                  >
                    Continue to payment
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </Shell>
  );
}
