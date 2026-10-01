import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Dices, Gift, PiggyBank } from "lucide-react";
import SpinGame from "@/components/games/SpinGame";
import VoucherWallet from "@/components/games/VoucherWallet";
import ComingSoonGames from "@/components/games/ComingSoonGames";
import NextSpinCountdown from "@/components/games/NextSpinCountdown";
import { spinTheHimalayas } from "@/data/commercial/games";
import { formatRupees } from "@/lib/games/gameEngine";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "MQT Game Zone — Win Real Travel Vouchers",
  description:
    "Play Spin the Himalayas once a day and win real MyQuickTrippers travel vouchers — up to ₹5,000 off your booking. Published odds, honest terms, no sign-up.",
  alternates: { canonical: `${siteConfig.domain}/games` },
  openGraph: {
    title: "MQT Game Zone | MyQuickTrippers",
    description:
      "One spin a day. Win real travel vouchers up to ₹5,000 — with published odds and honest terms.",
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

/** Existing repo photography (location-library). Attribution strings follow
 *  the repo's "Name — Author, License" caption convention. */
const HERO_IMAGE = {
  src: "/images/location-library/auli-uttarakhand-india/auli-uttarakhand-india-01-lg.webp",
  alt: "Snow-covered Nanda Devi massif rising above the meadows of Auli, Uttarakhand",
  caption: "Auli — Amit Shaw, CC0",
};

export default function GamesPage() {
  const cfg = spinTheHimalayas;
  const voucherTiers = cfg.prizes.filter((p) => p.value > 0);
  const topPrize = Math.max(...voucherTiers.map((p) => p.value));

  const stats = [
    {
      icon: Gift,
      label: "Top prize",
      value: formatRupees(topPrize),
    },
    {
      icon: PiggyBank,
      label: "Prizes every month",
      value: formatRupees(cfg.monthlyPrizeBudget),
    },
    {
      icon: Dices,
      label: "Free spin",
      value: `${cfg.spinsPerDay} / day`,
    },
  ];

  return (
    <main className="min-h-screen bg-surface-canvas">
      {/* ── Hero: arcade band ── */}
      <header className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={HERO_IMAGE.src}
            alt=""
            fill
            // Next 16: `preload` replaces the deprecated `priority` prop.
            preload
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071525] via-[#071525]/72 to-[#071525]/25" />
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-5 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-sm">
            <ol className="flex items-center gap-1 text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li aria-current="page" className="font-semibold text-white">
                Game Zone
              </li>
            </ol>
          </nav>

          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            MQT Game Zone · Pilot
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Play games. Win real travel vouchers.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 sm:text-base">
            {cfg.tagline} Every prize is a genuine discount on a real booking —
            applied by our team before you pay.
          </p>

          <dl className="mt-6 flex flex-wrap gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm"
              >
                <s.icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                    {s.label}
                  </dt>
                  <dd className="font-display text-lg font-extrabold leading-tight text-white">
                    {s.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <Link
            href="#play"
            className="btn-shine mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-cta px-7 py-3.5 font-display text-lg font-extrabold text-[#0B1F33] shadow-[var(--shadow-cta-orange)] transition-transform active:scale-[0.98]"
          >
            <Dices className="h-5 w-5" aria-hidden="true" />
            Play now — it&apos;s free
          </Link>
        </div>

        <p className="absolute bottom-2 right-4 text-[11px] text-white/60">
          {HERO_IMAGE.caption}
        </p>
      </header>

      {/* ── Game arena ── */}
      <div id="play" className="scroll-mt-24">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 pt-10">
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">
            ● Live
          </span>
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Game 01 — {cfg.name}
          </h2>
        </div>
        <NextSpinCountdown />
        <SpinGame />
      </div>

      {/* ── Voucher wallet ── */}
      <div className="mt-4">
        <VoucherWallet />
      </div>

      {/* ── Coming soon ── */}
      <div className="mt-12">
        <ComingSoonGames />
      </div>

      {/* ── Full terms (server-rendered, same source of truth as the game) ── */}
      <section
        aria-label="Game terms and conditions"
        className="mx-auto w-full max-w-6xl px-4 py-14"
      >
        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Terms &amp; prize budget
        </h2>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Terms list */}
          <div className="rounded-3xl border border-line bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-7">
            <h3 className="font-display text-lg font-extrabold text-ink">
              Game terms
            </h3>
            <ol className="mt-4 space-y-3">
              {cfg.terms.map((term, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-display text-xs font-extrabold text-brand-primary"
                  >
                    {i + 1}
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Prize budget */}
          <div className="rounded-3xl border border-line bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-7">
            <h3 className="font-display text-lg font-extrabold text-ink">
              Monthly prize budget
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              We set aside {formatRupees(cfg.monthlyPrizeBudget)} per month for this
              game. That&apos;s exactly what the winner caps add up to:
            </p>
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line text-sm">
              {voucherTiers.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 bg-surface-canvas/60 px-4 py-2.5">
                  <span className="text-ink-muted">
                    <strong className="font-bold text-ink">
                      {p.maxWinners.toLocaleString("en-IN")}
                    </strong>{" "}
                    × {p.label}
                  </span>
                  <span className="font-bold text-ink">
                    {formatRupees(p.value * p.maxWinners)}
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 bg-brand-primary px-4 py-2.5">
                <span className="font-bold text-white">Total monthly budget</span>
                <span className="font-display font-extrabold text-white">
                  {formatRupees(cfg.monthlyPrizeBudget)}
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              When a tier&apos;s winners reach its cap, we mark it{" "}
              <strong className="text-ink">“Fully claimed”</strong> on this page — we
              never silently remove prizes or change odds without saying so.
            </p>
          </div>
        </div>

        {/* About the vouchers */}
        <div className="mt-5 rounded-3xl border border-line bg-surface-card p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h3 className="font-display text-lg font-extrabold text-ink">
            About the vouchers
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
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
