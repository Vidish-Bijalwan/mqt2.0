import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";

export const metadata: Metadata = {
  title: "Heritage & Spiritual Tours in India | Jyotirlinga, Char Dham, Buddhist Circuits | My Quick Trippers",
  description:
    "Organized heritage and spiritual trips across India — 12 Jyotirlinga, Char Dham, Ayodhya, Ujjain, Madurai–Rameshwaram, Amarnath Yatra and Buddhist circuits, each with a full itinerary.",
  alternates: { canonical: `${siteConfig.domain}/heritage-spiritual-tours-india` },
  openGraph: {
    title: "Heritage & Spiritual Tours in India",
    description:
      "12 Jyotirlinga, Char Dham, Ayodhya, Buddhist circuits — organized spiritual journeys with full day-wise itineraries.",
    url: `${siteConfig.domain}/heritage-spiritual-tours-india`,
    type: "website",
    images: [{ url: `${siteConfig.domain}/images/og-default.png`, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heritage & Spiritual Tours in India | My Quick Trippers",
    description: "Jyotirlinga, Char Dham, Buddhist circuits — organized spiritual journeys with full itineraries.",
  },
};

const FAQS = [
  {
    question: "What organized trips cover heritage and spiritual sites in India?",
    answer:
      "The main organized circuits are: the 12 Jyotirlinga yatra (Shiva shrines across India), Char Dham (Yamunotri, Gangotri, Kedarnath, Badrinath in Uttarakhand), the Ramayana circuit (Ayodhya), Buddhist circuits (Bodh Gaya, Sarnath, Kushinagar), and South Indian temple circuits (Madurai–Rameshwaram, Srisailam). Each section below links to a detailed package page with a day-wise itinerary.",
  },
  {
    question: "When is the best time for Char Dham Yatra?",
    answer:
      "The Char Dham temples generally open around late April–May and close around October–November (dates vary by temple and year). May–June and September–October are the most comfortable windows. Helicopter options exist for Kedarnath for those who cannot trek.",
  },
  {
    question: "How long does the 12 Jyotirlinga circuit take?",
    answer:
      "Visiting all twelve shrines — spread from Gujarat to Tamil Nadu to Uttarakhand — is a multi-week undertaking, usually done in segments. Our 12 Jyotirlinga tour page lays out the full routing; many travellers cover it across two or three trips.",
  },
  {
    question: "Are these spiritual tours suitable for senior citizens?",
    answer:
      "Many are, with the right pacing. Helicopter options reduce trekking at Kedarnath; temple towns like Madurai, Ayodhya and Ujjain are low-exertion. Tell us about mobility needs in the enquiry and the itinerary is adjusted — slower days, closer stays, and rest built in.",
  },
];

const circuits = [
  {
    name: "The 12 Jyotirlinga Circuit",
    href: "/packages/12-jyotirlinga-tour-package",
    copy: "Somnath to Rameshwaram, Mahakaleshwar to Kedarnath — all twelve Jyotirlinga shrines in one organised journey. The definitive Shiva pilgrimage.",
  },
  {
    name: "Badrinath–Kedarnath (Char Dham)",
    href: "/packages/badrinath-kedarnath-tour",
    copy: "The heart of Char Dham: Kedarnath's ancient shrine and Badrinath's temple town, with road logistics, stays and darshan planning handled.",
  },
  {
    name: "Badri–Kedar by Helicopter",
    href: "/packages/badri-kedar-yatra-by-helicopter",
    copy: "The same sacred circuit without the treks — helicopter sectors for travellers short on time or unable to walk long distances.",
  },
  {
    name: "Ayodhya (2 days)",
    href: "/packages/2-days-ayodhya-tour-package",
    copy: "Ram Janmabhoomi, Hanuman Garhi and the Saryu aarti — a focused two-day Ramayana circuit, easy to combine with Varanasi.",
  },
  {
    name: "Ujjain–Omkareshwar (3 days)",
    href: "/packages/3-days-ujjain-omkareshwar-tour",
    copy: "Mahakaleshwar's Bhasma Aarti and the island temple of Omkareshwar — Madhya Pradesh's great Shiva circuit.",
  },
  {
    name: "Madurai–Rameshwaram (3 days)",
    href: "/packages/3-days-madurai-rameshwaram-tour",
    copy: "Meenakshi Temple's thousand pillars and Rameshwaram's sacred island — Tamil Nadu's temple heritage at its grandest.",
  },
  {
    name: "Srisailam Mallikarjuna (3 days)",
    href: "/packages/3-days-srisailam-mallikarjuna-jyotirlinga-tour",
    copy: "One of the twelve Jyotirlingas in the Nallamala hills — a Jyotirlinga shrine that is also a Shakti Peetha.",
  },
  {
    name: "Kainchi Dham (2 days)",
    href: "/packages/2-days-kainchi-dham-tour",
    copy: "Neem Karoli Baba's beloved ashram in the Kumaon hills — a short, serene pilgrimage from the Delhi region.",
  },
  {
    name: "Amarnath Yatra with Kashmir",
    href: "/packages/amarnath-yatra-with-kashmir-tour",
    copy: "The holy cave shrine combined with Kashmir's valleys — pilgrimage and paradise in a single journey during yatra season.",
  },
];

export default function HeritageSpiritualToursIndiaPage() {
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
          <span className="text-legacy-orange">Heritage &amp; Spiritual Tours</span>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white py-10">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-legacy-orange">
            <Sparkles className="h-4 w-4" /> Pilgrimage · Temples · Sacred circuits
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold text-gray-800 sm:text-4xl">
            Heritage &amp; spiritual tours in India
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600">
            India&apos;s sacred geography is vast — twelve Jyotirlingas, four Dhams, the Buddha&apos;s footsteps,
            and temple towns two thousand years old. These are organized journeys with real logistics behind them:
            darshan planning, stays near the shrines, road and helicopter sectors, and teams reachable throughout.
            Every circuit below links to its full day-wise itinerary.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/campaigns/buddhist-tours-india"
              className="inline-flex items-center gap-2 rounded-lg bg-legacy-nav-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Buddhist circuits
            </Link>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Plan your yatra
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
          <h2 className="text-2xl font-bold text-gray-800">Organized spiritual circuits</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Pilgrimage logistics — temple timings, queues, mountain roads, seasonal closures — are where organized
            trips earn their keep. Pick your circuit; each page carries the full plan.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {circuits.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-legacy-nav-blue hover:shadow-md"
              >
                <h3 className="font-bold text-legacy-nav-blue">{c.name}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{c.copy}</p>
                <span className="mt-3 inline-block text-sm font-bold text-legacy-orange">View itinerary →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">Planning notes for yatras</h2>
          <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            <li><strong>Seasons matter.</strong> Char Dham and Amarnath run in specific months; South Indian temple circuits run year-round.</li>
            <li><strong>Registrations.</strong> Several yatras require pilgrim registration — our team handles the paperwork per the current rules.</li>
            <li><strong>Fitness honesty.</strong> High-altitude shrines demand real walking. Helicopter sectors exist for Kedarnath and Amarnath where available.</li>
            <li><strong>Festival crowds.</strong> Shravan, Navratri and Kumbh-adjacent periods transform queues — plan dates with the team, not against them.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Related: <Link href="/cultural-tours-india" className="font-semibold text-legacy-nav-blue hover:underline">cultural tours</Link> ·{" "}
            <Link href="/best-travel-packages-india" className="font-semibold text-legacy-nav-blue hover:underline">best travel packages in India</Link> ·{" "}
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
