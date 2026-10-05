import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle, Phone, Compass } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";

export const metadata: Metadata = {
  title: "Best Travel Packages for Exploring India (2026 Guide) | My Quick Trippers",
  description:
    "The best travel packages for exploring India by traveller type — first-timers, pilgrims, families, culture lovers and adventurers — each linked to a detailed day-wise itinerary.",
  alternates: { canonical: `${siteConfig.domain}/best-travel-packages-india` },
  openGraph: {
    title: "Best Travel Packages for Exploring India",
    description:
      "First-timers, pilgrims, families, culture lovers, adventurers — the best India packages by traveller type, with full itineraries.",
    url: `${siteConfig.domain}/best-travel-packages-india`,
    type: "website",
    images: [{ url: `${siteConfig.domain}/images/og-default.png`, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Travel Packages for Exploring India | My Quick Trippers",
    description: "The best India packages by traveller type, each with a full day-wise itinerary.",
  },
};

const FAQS = [
  {
    question: "What are the best travel packages for exploring India?",
    answer:
      "It depends on the traveller. First-time visitors usually start with the Golden Triangle (Delhi–Agra–Jaipur) or Kerala. Pilgrims choose Char Dham or the 12 Jyotirlinga circuit. Families pick Goa or Kerala for easy pacing. Culture lovers head to Rajasthan, Khajuraho or Ajanta–Ellora. The sections below map each traveller type to a detailed package page with a full itinerary.",
  },
  {
    question: "How do I choose between similar India tour packages?",
    answer:
      "Compare the day-wise itinerary (not just the destination list), the inclusions (hotels, meals, transfers, guides), the pace (nights per stop), and the exclusions. Two 'Kerala 5-day' packages can differ completely in what you actually experience. Every package page on this site lists these details — read them before comparing prices.",
  },
  {
    question: "Are group departures or private tours better for India?",
    answer:
      "Group departures suit solo travellers and fixed-date pilgrimages like Char Dham, where shared logistics cut costs. Private tours suit families, honeymooners and anyone wanting their own pace. Both are available — ask on +91 81711 58569 which format fits your dates.",
  },
  {
    question: "When is the best time to book an India tour package?",
    answer:
      "October to March is peak season for most of India (pleasant weather, festivals). Char Dham runs roughly May–October, and Kashmir is best April–October for meadows, December–February for snow. Booking 4–8 weeks ahead gives the best hotel choice in peak season.",
  },
];

const picks = [
  {
    audience: "First-time visitors",
    title: "Delhi–Agra–Mathura–Vrindavan (3 days)",
    href: "/packages/3-days-delhi-agra-mathura-vrindavan-tour",
    copy: "The essential first taste of India: the Taj Mahal, Agra Fort, and the temple towns of the Braj region — compact, high-impact, easy to extend.",
  },
  {
    audience: "Pilgrims",
    title: "12 Jyotirlinga Tour",
    href: "/packages/12-jyotirlinga-tour-package",
    copy: "The great Shiva circuit across India — all twelve Jyotirlinga shrines in one organised journey, with logistics handled end to end.",
  },
  {
    audience: "Families & easy pacing",
    title: "Best of Kerala",
    href: "/packages/best-of-kerala-tour",
    copy: "Kochi, Munnar, Alleppey: tea gardens, backwaters and beaches at a relaxed pace. Kerala is the safest all-rounder for mixed-age groups.",
  },
  {
    audience: "Beach & leisure",
    title: "Goa Tour (5 days)",
    href: "/packages/goa-tour-package-5-days",
    copy: "North and South Goa — beaches, Portuguese heritage, flea markets and food. The default recharge trip, done properly.",
  },
  {
    audience: "Culture lovers",
    title: "Khajuraho (2 days)",
    href: "/packages/2-days-khajuraho-tour",
    copy: "A focused heritage deep-dive into the Chandela temples. Pairs beautifully with the cultural tours guide for a longer art-history arc.",
  },
  {
    audience: "Offbeat explorers",
    title: "Assam–Meghalaya–Arunachal (10 days)",
    href: "/packages/10-days-assam-meghalaya-arunachal-pradesh-tour-packages",
    copy: "The Northeast at full depth: living root bridges, monasteries, and landscapes most travellers never see. For those who have done the classics.",
  },
];

export default function BestTravelPackagesIndiaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="bg-legacy-nav-blue py-2 text-xs text-white">
        <div className="container mx-auto flex w-[95%] max-w-[1600px] items-center">
          <Link href="/" className="transition-colors hover:text-legacy-orange">Home</Link>
          <ChevronRight className="mx-1 h-3 w-3 opacity-70" />
          <span className="text-legacy-orange">Best Travel Packages India</span>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white py-10">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-legacy-orange">
            <Compass className="h-4 w-4" /> 2026 guide
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-gray-800 sm:text-4xl">
            The best travel packages for exploring India
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            There is no single &ldquo;best&rdquo; India package — there is the best package <em>for you</em>. This
            guide maps traveller types to real, bookable itineraries. Every pick links to its detailed package page
            with a day-wise plan, so you can compare substance, not slogans.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-lg bg-legacy-nav-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Browse all packages
            </Link>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Get a recommendation
            </a>
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-legacy-nav-blue hover:text-legacy-nav-blue"
            >
              <Phone className="h-4 w-4" /> {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-[95%] max-w-[1600px]">
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800">Best packages by traveller type</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {picks.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-legacy-nav-blue hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-legacy-orange">{p.audience}</p>
                <h3 className="mt-1 font-bold text-legacy-nav-blue">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{p.copy}</p>
                <span className="mt-3 inline-block text-sm font-bold text-legacy-orange">View itinerary →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">How to pick the right one</h2>
          <ol className="mt-3 max-w-3xl list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600">
            <li><strong>Start from your traveller type</strong>, not the destination — a honeymoon and a pilgrimage need completely different pacing.</li>
            <li><strong>Read the day-wise itinerary.</strong> Nights per stop and travel hours per day tell you more than any brochure line.</li>
            <li><strong>Check inclusions and exclusions</strong> — hotels, meals, transfers, guides, entry fees — on the package page itself.</li>
            <li><strong>Match the season</strong> — Char Dham runs roughly May–October; Rajasthan and Kerala shine October–March.</li>
            <li><strong>Ask for the written breakup</strong> before paying. A reliable operator sends it without being chased.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            Related: <Link href="/cultural-tours-india" className="font-semibold text-legacy-nav-blue hover:underline">cultural tours</Link> ·{" "}
            <Link href="/heritage-spiritual-tours-india" className="font-semibold text-legacy-nav-blue hover:underline">heritage &amp; spiritual tours</Link> ·{" "}
            <Link href="/why-myquicktrippers" className="font-semibold text-legacy-nav-blue hover:underline">why book with us</Link>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800">Frequently asked questions</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((f) => (
              <details key={f.question} className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-bold text-gray-800">{f.question}</summary>
                <p className="mt-2 text-sm leading-6 text-gray-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
