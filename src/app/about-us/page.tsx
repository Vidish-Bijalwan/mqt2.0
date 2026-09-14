import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Compass, Headphones, MapPin, Route, ShieldCheck, Sparkles } from "lucide-react";
import SocialFollowLinks from "@/components/ui/SocialFollowLinks";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet My Quick Trippers and learn how our India-based travel team designs thoughtful, personalised journeys.",
  alternates: { canonical: `${siteConfig.domain}/about-us` },
};

const values = [
  { icon: Route, title: "Trips shaped around you", copy: "Dates, pace, hotel style and budget are discussed before the route is finalised." },
  { icon: MapPin, title: "Local route knowledge", copy: "Our team plans practical transfers, seasonal access and realistic sightseeing days." },
  { icon: Headphones, title: "A human team stays close", copy: "From the first idea to the return journey, support remains available by phone and WhatsApp." },
];

export default function AboutUsPage() {
  return (
    <div className="heritage-surface min-h-screen">
      <section className="relative isolate overflow-hidden bg-[#0a332d] text-white">
        <Image src="/images/blog/royal-palaces-in-india.jpg" alt="Historic Indian palace representing the living heritage behind journeys across India" fill preload sizes="100vw" className="z-0 object-cover object-center opacity-85" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,35,31,.94),rgba(5,35,31,.68)_55%,rgba(5,35,31,.2))]" />
        <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">Our story</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">India is not a checklist. It is a story best travelled with care.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">My Quick Trippers helps families, couples, pilgrims and explorers turn an idea into a well-paced journey—with clear advice, flexible planning and people to call when plans change.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/packages" className="inline-flex min-h-12 items-center rounded-full bg-[#e96822] px-6 font-extrabold text-white transition-colors hover:bg-[#c95116]">Explore Tour Packages</Link>
            <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center rounded-full border border-white/35 bg-white/10 px-6 font-extrabold text-white backdrop-blur hover:bg-white/20">Plan on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b6541d]">How we work</p>
            <h2 className="font-display mt-3 text-3xl font-bold text-[#123c35] sm:text-5xl">A travel company built around conversations, not templates.</h2>
            <p className="mt-5 text-base leading-8 text-[#556d67]">Every good itinerary starts with the people taking it. We learn who is travelling, what matters most, how quickly the group likes to move and where comfort is essential. That context shapes the route—not the other way around.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-[#d7e5e1] bg-white/92 p-6 shadow-[0_16px_45px_rgba(11,48,44,.08)] backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eaf4f1] text-[#166252]"><Icon aria-hidden="true" className="h-5 w-5" /></span>
                <h3 className="mt-5 text-lg font-extrabold text-[#173e37]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#657a74]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#d9e6e2] bg-[#0d3e36]/95 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3 text-orange-300"><Compass aria-hidden="true" className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-[0.22em]">Where to find us</span></div>
            <h2 className="font-display mt-4 text-3xl font-bold">A team connected across 5 Indian cities.</h2>
            <p className="mt-4 max-w-lg leading-7 text-white/75">Our office network keeps support close to travellers while the same central team maintains consistent planning and service.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {siteConfig.offices.branches.map((office, index) => (
              <li key={office} className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/15 bg-white/[.07] px-5 backdrop-blur">
                <span className="font-display text-xl font-bold text-orange-300">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-bold">{office}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 rounded-[32px] border border-[#d6e3df] bg-white/95 p-7 shadow-[0_22px_65px_rgba(11,48,44,.1)] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex gap-3 text-[#176554]"><ShieldCheck aria-hidden="true" /><Sparkles aria-hidden="true" /></div>
            <h2 className="font-display mt-4 text-3xl font-bold text-[#123c35]">Follow the journeys between the journeys.</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#5f756f]">Travel updates, destination ideas, seasonal guidance and new package announcements are shared through our official social channels.</p>
          </div>
          <SocialFollowLinks />
        </div>
      </section>
    </div>
  );
}
