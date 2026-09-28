import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SpinGame from "@/components/games/SpinGame";
import { spinTheHimalayas } from "@/data/commercial/games";
import { formatRupees } from "@/lib/games/gameEngine";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "Spin the Himalayas — Win Real Travel Vouchers",
  description:
    "Spin the wheel once a day and win real MyQuickTrippers travel vouchers — up to ₹5,000 off your booking. Published odds, honest terms, no sign-up.",
  alternates: { canonical: `${siteConfig.domain}/games` },
  openGraph: {
    title: "Spin the Himalayas | MyQuickTrippers",
    description:
      "One spin a day. Win real travel vouchers up to ₹5,000 — with published odds and honest terms.",
    type: "website",
  },
};

export default function GamesPage() {
  const cfg = spinTheHimalayas;
  const voucherTiers = cfg.prizes.filter((p) => p.value > 0);

  return (
    <main className="min-h-screen bg-surface-canvas">
      <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-md px-4 pt-5 text-sm">
        <ol className="flex items-center gap-1 text-ink-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="font-semibold text-ink">
            Games
          </li>
        </ol>
      </nav>

      <SpinGame />

      {/* ── Full terms (server-rendered, same source of truth as the game) ── */}
      <section aria-label="Game terms and conditions" className="mx-auto w-full max-w-md px-4 pb-16">
        <div className="rounded-3xl border border-line bg-surface-card p-5">
          <h2 className="font-display text-xl font-extrabold text-ink">
            Terms &amp; prize budget
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted">
            {cfg.terms.map((term, i) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
          <h3 className="mt-5 font-display text-base font-extrabold text-ink">
            Monthly prize budget
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            We set aside {formatRupees(cfg.monthlyPrizeBudget)} per month for this
            game. That&apos;s exactly what the winner caps add up to:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink-muted">
            {voucherTiers.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>
                  {p.maxWinners.toLocaleString("en-IN")} × {p.label}
                </span>
                <span className="font-semibold text-ink">
                  {formatRupees(p.value * p.maxWinners)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            When a tier&apos;s winners reach its cap, we mark it{" "}
            <strong className="text-ink">“Fully claimed”</strong> on this page — we
            never silently remove prizes or change odds without saying so.
          </p>
          <h3 className="mt-5 font-display text-base font-extrabold text-ink">
            About the vouchers
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            Every voucher is a genuine discount on a real booking, applied by our
            team before you pay. Vouchers are valid {cfg.expiryDays} days from the
            day you win. Have a question?{" "}
            <Link href="/contact-us" className="font-semibold text-brand-secondary underline">
              Talk to us
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
