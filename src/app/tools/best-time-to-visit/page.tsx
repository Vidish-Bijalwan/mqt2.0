import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CloudSun,
  MapPin,
  MessageCircle,
  Phone,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";
import {
  DESTINATIONS,
  MONTH_LABELS,
  destinationsForMonth,
} from "@/data/bestTimeToVisit";
import type { Metadata } from "next";

const PAGE_URL = `${siteConfig.domain}/tools/best-time-to-visit`;

export const metadata: Metadata = {
  title: "Best Time to Visit India by Destination (2026–27 Guide) | My Quick Trippers",
  description:
    "When is the best time to visit Rajasthan, Kerala, Goa, Kashmir, Himachal, Ladakh and more? Honest month-by-month season guidance — weather, crowds and costs — from My Quick Trippers.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Best Time to Visit India by Destination | My Quick Trippers",
    description:
      "Pick a destination, see its best months, and browse a month-by-month guide to where is in season across India.",
    url: PAGE_URL,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.domain}/images/home/mqt-india-hero.webp`,
        width: 1200,
        height: 630,
        alt: "Best time to visit India — season guide by My Quick Trippers",
      },
    ],
  },
};

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const QUICK_FAQS: { question: string; answer: string }[] = [
  {
    question: "When is the best time to visit India overall?",
    answer:
      "For most of the country — Rajasthan, Kerala, Goa, Agra, Varanasi — the sweet spot is October to March, when the weather is dry and comfortable. The Himalayan regions flip this around: Himachal, Uttarakhand and Kashmir are best from April to June and again in September–November, while Ladakh is only accessible roughly May to September.",
  },
  {
    question: "When is the cheapest time to travel in India?",
    answer:
      "The monsoon months (June–September) and the peak-summer shoulder (April–May in the hills, excluding holidays) usually bring the lowest hotel rates. The trade-off is real: heavy rain can disrupt hill roads, beach plans and island ferries, so the discount comes with a weather risk.",
  },
  {
    question: "Which months should I avoid?",
    answer:
      "May and June bring extreme heat across the northern plains — sightseeing in Rajasthan, Agra or Varanasi is genuinely difficult midday. July and August bring heavy monsoon rain that makes Himalayan hill roads risky and shuts down most beach and island activities.",
  },
  {
    question: "Is it worth visiting Goa in the monsoon?",
    answer:
      "Honestly, not for a beach holiday. From June to September the sea is rough, beaches are red-flagged and most beach shacks are closed. Goa is at its best from November to February, when the weather is dry and sunny.",
  },
  {
    question: "When is the best time for a Himalayan trip?",
    answer:
      "For Shimla, Manali, Nainital and Mussoorie: April–June for a summer escape, or September–November for the clearest mountain views. Kashmir is lovely March–October. Ladakh has a short window — May to September — when the high passes are open.",
  },
  {
    question: "How far in advance should I book for peak season?",
    answer:
      "For December–January (Christmas–New Year) and the May–June hill-station rush, book stays 6–8 weeks ahead — popular hotels and houseboats sell out. Travelling in the shoulder months (October–November, February–March) usually means easier bookings and better prices with nearly as good weather.",
  },
];

export default function BestTimeToVisitPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUICK_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-surface-canvas pb-16 text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      {/* CSS-only destination picker: :target shows a panel, :has keeps the
          first panel visible when nothing is targeted. No client JS needed. */}
      <style>{`
        .btv-panels .btv-panel { display: none; }
        .btv-panels .btv-panel:target { display: block; }
        .btv-panels:not(:has(.btv-panel:target)) .btv-panel:first-of-type { display: block; }
      `}</style>

      {/* Breadcrumb */}
      <div className="bg-brand-navy px-4 py-2 text-xs text-white">
        <div className="container mx-auto flex w-full max-w-[1920px] items-center px-2 md:px-4">
          <Link href="/" className="transition-colors hover:text-brand-orange">Home</Link>
          <ChevronRight className="mx-1 h-3 w-3 opacity-70" />
          <span className="text-brand-orange">Best Time to Visit</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-brand-primary-deep text-white">
        <div className="pointer-events-none absolute inset-4 rounded-[22px] border border-white/10" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center md:py-20">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-secondary-pale">
            Travel tool
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold leading-[1.02] tracking-[-0.04em] md:text-6xl">
            Best Time to Visit India
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
            Pick a destination to see its best months — and the honest reasons why,
            covering weather, crowds and costs. Then browse the month-by-month guide
            to find out where is in season right now.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/75">
            <CalendarDays className="h-4 w-4 text-brand-cta" aria-hidden="true" />
            Based on long-established seasonal patterns — no guesswork, no invented details
          </div>
        </div>
      </div>

      <div className="nit-page">
        {/* ── Destination picker ── */}
        <section aria-label="Pick a destination" className="pt-10">
          <div className="nit-head">
            <h2>Choose your destination</h2>
            <div className="nit-middle-hr" />
            <p className="nit-head-sub">
              Tap a destination to see when to go and when to think twice.
            </p>
          </div>

          <nav aria-label="Destinations" className="mt-6 flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:justify-center md:overflow-visible">
            {DESTINATIONS.map((d) => (
              <a
                key={d.slug}
                href={`#destination-${d.slug}`}
                className="shrink-0 rounded-full border border-line bg-surface-card px-4 py-2 text-[13px] font-bold text-ink shadow-[var(--shadow-xs)] transition-colors hover:border-brand-secondary hover:text-brand-secondary-deep"
              >
                {d.name}
              </a>
            ))}
          </nav>

          <div className="btv-panels mt-6">
            {DESTINATIONS.map((d) => (
              <section
                key={d.slug}
                id={`destination-${d.slug}`}
                aria-label={d.name}
                className="btv-panel animate-fadeIn scroll-mt-28"
              >
                <article className="overflow-hidden rounded-2xl border border-line bg-surface-card shadow-[var(--shadow-card-soft)]">
                  {/* Panel header */}
                  <div className="border-b border-line bg-brand-primary px-6 py-6 text-white md:px-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-secondary-pale">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {d.region}
                        </p>
                        <h3 className="font-display mt-2 text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                          {d.name}
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{d.tagline}</p>
                      </div>
                      <div className="rounded-xl bg-brand-cta px-4 py-3 text-center text-brand-primary-deep">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Best window</p>
                        <p className="font-display text-xl font-extrabold">{d.bestWindow}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-6 md:px-8 md:py-8">
                    {/* Month grid */}
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-muted">
                      Season calendar
                    </p>
                    <div className="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-12" role="img" aria-label={`Best months for ${d.name}: ${d.bestWindow}`}>
                      {MONTH_SHORT.map((label, i) => {
                        const month = i + 1;
                        const isBest = d.bestMonths.includes(month);
                        const isAvoid = d.avoidMonths.includes(month);
                        return (
                          <div
                            key={label}
                            className={[
                              "rounded-lg border px-1 py-2 text-center text-[11px] font-bold",
                              isBest
                                ? "border-brand-secondary bg-brand-secondary text-white"
                                : isAvoid
                                  ? "border-line bg-surface-canvas text-ink-muted/70"
                                  : "border-line bg-surface-card text-ink-muted",
                            ].join(" ")}
                          >
                            {label}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-brand-secondary" aria-hidden="true" />
                        Best time to visit
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-surface-canvas ring-1 ring-line" aria-hidden="true" />
                        Fine, with trade-offs
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-ink-muted/25 ring-1 ring-line" aria-hidden="true" />
                        Approach with caution
                      </span>
                    </div>

                    {/* Reasons */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-state-success/25 bg-state-success/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-extrabold text-state-success">
                          <Check className="h-4 w-4" aria-hidden="true" />
                          Why go in {d.bestWindow}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink">{d.bestReason}</p>
                      </div>
                      <div className="rounded-xl border border-state-warning/25 bg-state-warning/5 p-5">
                        <p className="flex items-center gap-2 text-sm font-extrabold text-state-warning">
                          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
                          Think twice about {d.avoidMonths.map((mo) => MONTH_SHORT[mo - 1]).join(", ")}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink">{d.avoidReason}</p>
                      </div>
                    </div>

                    {/* Weather / crowds / cost */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-line p-5">
                        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary-deep">
                          <CloudSun className="h-4 w-4" aria-hidden="true" />
                          Weather
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{d.weather}</p>
                      </div>
                      <div className="rounded-xl border border-line p-5">
                        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary-deep">
                          <Users className="h-4 w-4" aria-hidden="true" />
                          Crowds
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{d.crowds}</p>
                      </div>
                      <div className="rounded-xl border border-line p-5">
                        <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-secondary-deep">
                          <Wallet className="h-4 w-4" aria-hidden="true" />
                          Cost
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">{d.cost}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                      <Link
                        href={`/packages?destination=${encodeURIComponent(d.name)}`}
                        className="btn-shine inline-flex items-center gap-2 rounded-lg bg-brand-cta px-5 py-2.5 text-sm font-bold text-brand-primary-deep transition hover:bg-brand-cta-deep"
                      >
                        Browse {d.name} packages
                        <span aria-hidden="true">→</span>
                      </Link>
                      <a
                        href={siteConfig.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-card px-5 py-2.5 text-sm font-bold text-ink transition hover:border-brand-secondary hover:text-brand-secondary-deep"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        Ask about {d.name} on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              </section>
            ))}
          </div>
        </section>

        {/* ── Month-by-month strip ── */}
        <section aria-label="Month by month guide" className="pt-14" id="month-guide">
          <div className="nit-head">
            <h2>Where is in season, month by month</h2>
            <div className="nit-middle-hr" />
            <p className="nit-head-sub">
              Planning around fixed dates? Start from the month and see which destinations are at their best.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MONTH_LABELS.map((month, i) => {
              const good = destinationsForMonth(i + 1);
              return (
                <div
                  key={month}
                  className="rounded-2xl border border-line bg-surface-card p-5 shadow-[var(--shadow-card-soft)]"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-extrabold text-ink">{month}</h3>
                    <span className="rounded-full bg-brand-secondary/10 px-2.5 py-0.5 text-[11px] font-bold text-brand-secondary-deep">
                      {good.length} in season
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {good.map((d) => (
                      <li key={d.slug} className="flex items-center justify-between gap-2 text-sm">
                        <a
                          href={`#destination-${d.slug}`}
                          className="font-semibold text-ink transition-colors hover:text-brand-secondary-deep"
                        >
                          {d.name}
                        </a>
                        <span className="shrink-0 text-xs text-ink-muted">{d.bestWindow}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Quick answers ── */}
        <section aria-label="Quick answers" className="pt-14">
          <div className="nit-head">
            <h2>Quick answers</h2>
            <div className="nit-middle-hr" />
          </div>
          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {QUICK_FAQS.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-line bg-surface-card shadow-[var(--shadow-xs)] transition-shadow open:shadow-[var(--shadow-md)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-ink hover:text-brand-secondary-deep [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronRight className="h-5 w-5 shrink-0 text-brand-cta transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-sm leading-6 text-ink-muted">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA band ── */}
        <section className="pt-14" aria-label="Talk to a travel expert">
          <div className="overflow-hidden rounded-2xl bg-brand-primary-deep text-white">
            <div className="mx-auto max-w-3xl px-6 py-12 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-secondary-pale">
                Still unsure when to go?
              </p>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.02em] md:text-4xl">
                Tell us your dates — we will tell you honestly where to go
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
                Our travel experts plan around real seasonal conditions every day. No obligation, no pushy sales talk.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-cta px-6 py-3 text-sm font-bold text-brand-primary-deep transition hover:bg-brand-cta-deep"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {siteConfig.phone}
                </a>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
