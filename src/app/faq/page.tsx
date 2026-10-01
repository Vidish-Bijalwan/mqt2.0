import Link from "next/link";
import { ChevronRight, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { safeJsonLd } from "@/utils/jsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | My Quick Trippers",
  description:
    "Answers to common questions about booking tour packages with My Quick Trippers — pricing, customization, payments, cancellations, group tours and more.",
  alternates: {
    canonical: `${siteConfig.domain}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | My Quick Trippers",
    description:
      "Answers to common questions about booking tour packages with My Quick Trippers.",
    url: `${siteConfig.domain}/faq`,
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

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How do I book a tour package?",
    answer:
      "Pick any package and tap “Send Query” (or fill the enquiry form at the bottom of the package page) with your name, travel date and number of travellers. Our travel experts confirm availability and pricing with you on call or WhatsApp before anything is finalized — you only pay once your itinerary is locked.",
  },
  {
    question: "Can I customize a package itinerary?",
    answer:
      "Yes — every package is a starting point. You can change hotels, add or remove sightseeing, adjust the pace, or combine destinations. Share what you want in the enquiry form and we will send a tailored quote, usually within a few hours.",
  },
  {
    question: "Are the prices on the website final?",
    answer:
      "Listed prices are per person on a twin-sharing basis for the stated itinerary and season. The final quote depends on your travel dates, hotel category and group size. Festival periods and long weekends can cost more; travelling off-season often costs less.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, bank transfer, and major credit/debit cards through our secure payment link. A token advance confirms your booking; the balance is due before the trip starts as per your payment schedule.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellation terms depend on the package and how close to departure you cancel, because hotels and transport have their own policies. We share the exact cancellation schedule in writing with your quote, before you pay anything.",
  },
  {
    question: "Do you organize group tours and corporate trips?",
    answer:
      "Yes. We run group departures for popular routes and fully customized trips for corporate teams, schools, and large families — including transport, stays, meals and a tour manager on request.",
  },
  {
    question: "Do you handle international tours and visas?",
    answer:
      "Yes — Dubai, Thailand, Bali, Singapore, Europe and more. We assist with the visa documentation and appointment process for the countries we operate in, and flag the timelines honestly so you can plan ahead.",
  },
  {
    question: "Is the Chardham / pilgrimage yatra suitable for senior citizens?",
    answer:
      "Many of our pilgrimage travellers are seniors. We plan shorter driving days, comfortable stays, and assistance where the terrain is demanding (palkis, ponies or helicopter options where available). Tell us about any health considerations and we will design the yatra around them.",
  },
  {
    question: "Do you offer honeymoon packages?",
    answer:
      "Yes — we have dedicated honeymoon itineraries with romantic stays, private transfers, candle-light dinners and flexible pacing. Browse our Special Tours section or ask for a customized honeymoon quote.",
  },
  {
    question: "What is included in the package price?",
    answer:
      "Each package page lists inclusions and exclusions under “The experience”. Typically: stays, daily breakfast, private transfers and sightseeing as per the itinerary. Flights/trains, lunches and dinners (unless stated), entry tickets and personal expenses are usually extra.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "For domestic trips, 3–4 weeks is comfortable; for peak season (May–June, Diwali, Christmas–New Year) and international trips, 6–8 weeks or more. Last-minute bookings are often possible — just ask and we will tell you honestly what is feasible.",
  },
  {
    question: "Do I need travel insurance?",
    answer:
      "It is not mandatory for domestic trips but strongly recommended, especially for adventure activities and high-altitude routes. For international travel, several countries require it for the visa — we can guide you on suitable plans.",
  },
  {
    question: "Will I get support during the trip?",
    answer:
      "Yes. You get a dedicated trip coordinator on call/WhatsApp throughout your journey, plus on-ground assistance at each destination. If anything goes off-plan — a delayed train, a hotel issue — you reach us first, not a call centre queue.",
  },
  {
    question: "How do I contact My Quick Trippers?",
    answer: `Call us at ${siteConfig.phone} or message us on WhatsApp at ${siteConfig.whatsappDisplay}. You can also use the enquiry form on any package page or the Contact Us page.`,
  },
];

export default function FaqPage() {
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

      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">FAQs</span>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-10 mb-8">
        <div className="container mx-auto w-[95%] max-w-[1600px]">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600 max-w-3xl">
            Everything you need to know before booking with My Quick Trippers. Can&apos;t find your answer? Talk to us directly.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-lg bg-legacy-nav-blue px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <Phone className="w-4 h-4" />
              Call {siteConfig.phone}
            </a>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-[95%] max-w-[1600px]">
        <div className="max-w-4xl space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="group bg-white border border-gray-200 rounded-lg shadow-sm open:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-800 hover:text-legacy-orange [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronRight className="w-5 h-5 shrink-0 text-legacy-orange transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 pb-5 text-sm leading-6 text-gray-600">{item.answer}</div>
            </details>
          ))}
        </div>

        <div className="mt-10 max-w-4xl rounded-xl border border-brand-sage/50 bg-brand-paper p-6 text-center">
          <p className="font-bold text-gray-800">Still have questions?</p>
          <p className="mt-1 text-sm text-gray-600">
            Our travel experts reply within a few hours, 7 days a week.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/contact-us" className="rounded-lg bg-legacy-orange px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600">
              Contact Us
            </Link>
            <Link href="/packages" className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:border-legacy-orange hover:text-legacy-orange">
              Browse Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
