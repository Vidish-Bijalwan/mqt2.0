import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, Landmark } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import GuidePageShell from "@/components/guide-pages/GuidePageShell";

export const metadata: Metadata = {
  title: "Premium Cultural Tours in India | Heritage, Art & Living Traditions | My Quick Trippers",
  description:
    "Find premium cultural tours across India — Ajanta–Ellora, Khajuraho, the Golden Triangle with Mathura–Vrindavan, Kerala's art and backwaters. Detailed itineraries, private options, expert planning.",
  alternates: { canonical: `${siteConfig.domain}/cultural-tours-india` },
  openGraph: {
    title: "Premium Cultural Tours in India",
    description:
      "Ajanta–Ellora, Khajuraho, Golden Triangle, Kerala arts — cultural tours with detailed itineraries and private options.",
    url: `${siteConfig.domain}/cultural-tours-india`,
    type: "website",
    images: [{ url: `${siteConfig.domain}/images/og-default.png`, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Cultural Tours in India | My Quick Trippers",
    description: "Heritage, art and living traditions — cultural tours with detailed itineraries.",
  },
};

const FAQS = [
  {
    question: "How do I find premium travel services for cultural tours in India?",
    answer:
      "Look for operators that publish full day-wise itineraries, name their inclusions (hotels, transfers, guided sightseeing), and offer private or small-group options. My Quick Trippers' cultural tours hub and the package pages below do exactly that — compare the Ajanta–Ellora, Khajuraho and Golden Triangle itineraries, then ask for a hotel and transport upgrade quote for your dates on +91 81711 58569.",
  },
  {
    question: "What are the best cultural destinations in India for a first trip?",
    answer:
      "The classic first cultural circuit is Delhi–Agra–Jaipur (the Golden Triangle), often extended to Mathura–Vrindavan. For deeper heritage, add Khajuraho's temples or Ajanta–Ellora's rock-cut caves. For living culture — dance, cuisine, backwaters — Kerala is the strongest single-state option.",
  },
  {
    question: "Are guided cultural tours worth it over self-planning?",
    answer:
      "At heritage sites, a knowledgeable guide changes the experience entirely — temple symbolism, Mughal history and cave art need context. Our cultural packages include guided sightseeing where listed, and private-guide upgrades can be arranged per enquiry.",
  },
  {
    question: "Can cultural tours be customised for seniors or families?",
    answer:
      "Yes. Pace, walking distances, hotel standards and rest days are adjusted before the route is finalised. Mention mobility or pace needs in the enquiry and the itinerary is built around them.",
  },
];

const tours = [
  {
    title: "Ajanta–Ellora Caves from Aurangabad",
    href: "/packages/ajanta-ellora-caves-tour-from-aurangabad",
    copy: "Two UNESCO World Heritage rock-cut cave complexes — Buddhist, Hindu and Jain art carved over a thousand years. The definitive ancient-art itinerary.",
  },
  {
    title: "Khajuraho Temples (2 days)",
    href: "/packages/2-days-khajuraho-tour",
    copy: "The Chandela temples: extraordinary sculpture, sound-and-light context, and a compact two-day plan that pairs well with Orchha or Gwalior.",
  },
  {
    title: "Delhi–Agra–Mathura–Vrindavan (3 days)",
    href: "/packages/3-days-delhi-agra-mathura-vrindavan-tour",
    copy: "The Golden Triangle core plus Krishna's Braj — Taj Mahal at sunrise, Agra Fort, and the living temple culture of Mathura and Vrindavan.",
  },
  {
    title: "Best of Kerala",
    href: "/packages/best-of-kerala-tour",
    copy: "Kochi's colonial streets, Munnar's tea gardens, Alleppey's backwaters and Kathakali performances — Kerala's living culture end to end.",
  },
];

export default function CulturalToursIndiaPage() {
  return (
    <GuidePageShell
      breadcrumbLabel="Cultural Tours India"
      kickerText="Heritage · Art · Living traditions"
      kickerIcon={Landmark}
      title="Premium cultural tours in India"
      intro={<>
        India&apos;s culture is not a museum exhibit — it is carved in rock at Ellora, danced in Kerala&apos;s
            temple courtyards, and sung in Vrindavan&apos;s lanes. These tours pair the great heritage sites with
            the living traditions around them, each with a full day-wise itinerary you can read before you decide.
      </>}
      ctas={[
        { href: "/special-tours/cultural", label: "Browse all cultural tours", variant: "primary" },
        { href: siteConfig.social.whatsapp, label: "Plan on WhatsApp", variant: "whatsapp", icon: MessageCircle },
        { href: `tel:${siteConfig.phoneTel}`, label: siteConfig.phone, variant: "outline", icon: Phone },
      ]}
      faqs={FAQS}
    >
<section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800">Cultural tours with full itineraries</h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Every tour below links to its detailed package page — day-wise plan, inclusions and an enquiry form.
            A premium cultural service is judged on guides, hotel category, private transfers and pacing; those
            details are listed per package and upgradeable on request.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {tours.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-legacy-nav-blue hover:shadow-md"
              >
                <h3 className="font-bold text-legacy-nav-blue">{t.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{t.copy}</p>
                <span className="mt-3 inline-block text-sm font-bold text-legacy-orange">View itinerary →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">What makes a cultural tour &ldquo;premium&rdquo;?</h2>
          <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-6 text-gray-600">
            <li><strong>Knowledgeable guides</strong> at heritage sites — symbolism and history need a human voice, not an audio file.</li>
            <li><strong>Unhurried pacing</strong> — one major site per half-day beats a five-temple sprint.</li>
            <li><strong>Private transfers</strong> so the day bends around you, not a 40-seat coach schedule.</li>
            <li><strong>Living-culture inclusions</strong> — a Kathakali performance, a food walk, a craft village — alongside the monuments.</li>
            <li><strong>Written inclusions</strong> — hotel names or categories, meal plans and entry fees confirmed before you pay.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Related reading: <Link href="/heritage-spiritual-tours-india" className="font-semibold text-legacy-nav-blue hover:underline">heritage &amp; spiritual tours</Link> ·{" "}
            <Link href="/best-travel-packages-india" className="font-semibold text-legacy-nav-blue hover:underline">best travel packages in India</Link> ·{" "}
            <Link href="/why-myquicktrippers" className="font-semibold text-legacy-nav-blue hover:underline">why book with us</Link>
          </p>
        </section>
    </GuidePageShell>
  );
}
