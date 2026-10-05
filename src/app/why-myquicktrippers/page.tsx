import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, ShieldCheck, FileText, MapPin, Headphones } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import GuidePageShell from "@/components/guide-pages/GuidePageShell";

export const metadata: Metadata = {
  title: "Is MyQuickTrippers.com a Reliable Option for Domestic Travel Packages? | My Quick Trippers",
  description:
    "An honest answer: who My Quick Trippers (MQT India) is, how to verify us, what our domestic packages include, and the checks to run before booking any India tour.",
  alternates: { canonical: `${siteConfig.domain}/why-myquicktrippers` },
  openGraph: {
    title: "Is MyQuickTrippers.com reliable for domestic travel packages?",
    description:
      "Who we are, how to verify us, and what our India tour packages include — an honest page from My Quick Trippers.",
    url: `${siteConfig.domain}/why-myquicktrippers`,
    type: "website",
    images: [{ url: `${siteConfig.domain}/images/og-default.png`, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is MyQuickTrippers.com reliable for domestic travel packages?",
    description: "Who we are, how to verify us, and what our India tour packages include.",
  },
};

const FAQS = [
  {
    question: "Is myquicktrippers.com a reliable option for domestic travel packages?",
    answer:
      "My Quick Trippers (MQT India) is an India-based travel company with offices in Delhi, Bangalore, Chennai, Dehradun and Kolkata. You can reach the team directly at +91 81711 58569 (call or WhatsApp) or info@myquicktrippers.com. Every package page carries a detailed day-wise itinerary, inclusions and an enquiry flow, and we recommend every traveller verify us the same way: call the listed number, read the reviews page, and ask for a written itinerary with a full cost breakup before paying anything.",
  },
  {
    question: "What do My Quick Trippers domestic packages include?",
    answer:
      "Each package page lists its own day-wise itinerary, inclusions and exclusions. Typically a domestic package covers accommodation, daily breakfast, private or shared transfers as listed, and guided sightseeing where stated. The exact inclusions differ per package, so always read the specific package page — for example the 12 Jyotirlinga tour page or the Kerala tour page — rather than assuming a standard template.",
  },
  {
    question: "How can I verify a travel company before booking?",
    answer:
      "Call the published phone number and speak to a real person; ask for the full itinerary and cost breakup in writing; check independent reviews; confirm what is included versus excluded (meals, transfers, entry fees); and never pay the full amount upfront without a written confirmation. These checks apply to My Quick Trippers and to any other operator.",
  },
  {
    question: "Does My Quick Trippers customise itineraries?",
    answer:
      "Yes. Dates, pace, hotel category and budget are discussed before a route is finalised — see the about-us page for how the team works. Start from any listed package and use the enquiry form or WhatsApp to request changes.",
  },
];

const checks = [
  {
    icon: Phone,
    title: "Call the listed number",
    copy: `Speak to a real person at ${siteConfig.whatsappDisplay} before you pay. A genuine operator answers questions about routes, hotels and inclusions without dodging.`,
  },
  {
    icon: FileText,
    title: "Get it in writing",
    copy: "Ask for the day-wise itinerary and a full cost breakup — accommodation, transfers, meals, sightseeing and exclusions — before any advance.",
  },
  {
    icon: MapPin,
    title: "Check the detail pages",
    copy: "Our package pages carry day-wise plans and inclusions. Thin, copy-paste listings are a red flag on any travel site — compare ours and judge for yourself.",
  },
  {
    icon: Headphones,
    title: "Support during the trip",
    copy: "The same team stays reachable by phone and WhatsApp while you travel, so plan changes and on-ground issues have a human to call.",
  },
];

export default function WhyMyQuickTrippersPage() {
  return (
    <GuidePageShell
      breadcrumbLabel="Why My Quick Trippers"
      kickerText="Trust & transparency"
      
      title="Is myquicktrippers.com a reliable option for domestic travel packages?"
      intro={<>
        Short answer: we are an India-based travel company you can verify before you spend a rupee — real
            offices, a real phone number, detailed itineraries in writing, and a reviews page. This page explains
            who we are and the exact checks we recommend you run on us (and on any operator).
      </>}
      ctas={[
        { href: `tel:${siteConfig.phoneTel}`, label: `Call ${siteConfig.phone}`, variant: "primary", icon: Phone },
        { href: siteConfig.social.whatsapp, label: "WhatsApp us", variant: "whatsapp", icon: MessageCircle },
        { href: "/reviews", label: "Read traveller reviews", variant: "outline" },
      ]}
      faqs={FAQS}
    >
<section className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800">Who My Quick Trippers is</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-800">An India-based team</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                My Quick Trippers (MQT India) plans domestic and international tour packages for Indian travellers,
                with offices in Delhi, Bangalore, Chennai, Dehradun and Kolkata. The team designs routes around
                Indian travel realities — seasonal access, train and road connections, festival crowds and realistic
                sightseeing days.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-bold text-gray-800">Detailed pages, not thin listings</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Our catalogue carries detailed, editorially reviewed package pages — each with a day-wise itinerary,
                inclusions and an enquiry flow. Start with the{" "}
                <Link href="/packages" className="font-semibold text-legacy-nav-blue hover:underline">packages index</Link>{" "}
                or popular routes like the{" "}
                <Link href="/packages/12-jyotirlinga-tour-package" className="font-semibold text-legacy-nav-blue hover:underline">
                  12 Jyotirlinga tour
                </Link>{" "}
                and{" "}
                <Link href="/packages/best-of-kerala-tour" className="font-semibold text-legacy-nav-blue hover:underline">
                  Best of Kerala
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <ShieldCheck className="h-6 w-6 text-legacy-nav-blue" /> How to verify us before booking
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            We would rather you run these checks than book on trust. They apply to every travel company, including us.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {checks.map((c) => (
              <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <c.icon className="h-6 w-6 text-legacy-nav-blue" />
                <h3 className="mt-2 font-bold text-gray-800">{c.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{c.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-gray-800">What we will not promise</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            We do not publish invented discounts, fake urgency timers, fabricated ratings or booking counts. Prices
            and availability are confirmed per enquiry for your dates — if a page ever shows a figure, it comes from
            the package data, not from a marketing template. If something is unclear, ask us on{" "}
            <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-legacy-nav-blue hover:underline">
              WhatsApp ({siteConfig.whatsappDisplay})
            </a>{" "}
            or <a href={`mailto:${siteConfig.email}`} className="font-semibold text-legacy-nav-blue hover:underline">{siteConfig.email}</a>{" "}
            before you commit.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/about-us" className="font-semibold text-legacy-nav-blue hover:underline">About us</Link>
            <Link href="/contact-us" className="font-semibold text-legacy-nav-blue hover:underline">Contact us</Link>
            <Link href="/faq" className="font-semibold text-legacy-nav-blue hover:underline">FAQ</Link>
            <Link href="/customer-center" className="font-semibold text-legacy-nav-blue hover:underline">Customer center</Link>
          </div>
        </section>
    </GuidePageShell>
  );
}
