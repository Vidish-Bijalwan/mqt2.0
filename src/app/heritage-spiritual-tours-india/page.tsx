import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import GuidePageShell from "@/components/guide-pages/GuidePageShell";

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
    name: "Ayodhya",
    href: "/packages/ayodhya",
    copy: "Ram Janmabhoomi, Hanuman Garhi and the Saryu aarti — the Ramayana circuit's heart, easy to combine with Varanasi.",
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
  return (
    <GuidePageShell
      breadcrumbLabel="Heritage & Spiritual Tours"
      kickerText="Pilgrimage · Temples · Sacred circuits"
      kickerIcon={Sparkles}
      title="Heritage &amp; spiritual tours in India"
      intro={<>
        India&apos;s sacred geography is vast — twelve Jyotirlingas, four Dhams, the Buddha&apos;s footsteps,
            and temple towns two thousand years old. These are organized journeys with real logistics behind them:
            darshan planning, stays near the shrines, road and helicopter sectors, and teams reachable throughout.
            Every circuit below links to its full day-wise itinerary.
      </>}
      ctas={[
        { href: "/campaigns/buddhist-tours-india", label: "Buddhist circuits", variant: "primary" },
        { href: siteConfig.social.whatsapp, label: "Plan your yatra", variant: "whatsapp", icon: MessageCircle },
        { href: `tel:${siteConfig.phoneTel}`, label: siteConfig.phone, variant: "outline", icon: Phone },
      ]}
      faqs={FAQS}
    >
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
    </GuidePageShell>
  );
}
