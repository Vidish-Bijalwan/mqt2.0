import type { Metadata } from "next";
import Image from "next/image";
import { BriefcaseBusiness, Check, IndianRupee, MapPin, MessageCircle, PhoneCall } from "lucide-react";
import SocialFollowLinks from "@/components/ui/SocialFollowLinks";
import { siteConfig } from "@/data/siteConfig";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore current job openings at My Quick Trippers, including our Backend Support & Marketing Executive role in Dehradun.",
  alternates: { canonical: `${siteConfig.domain}/careers` },
};

const responsibilities = [
  "Respond to inbound customer calls and understand travel enquiries",
  "Support the sales team with lead updates, follow-ups and customer records",
  "Assist with WhatsApp, email and social-media marketing campaigns",
  "Coordinate package information with operations and destination teams",
  "Maintain clear, professional communication with prospective travellers",
];

export default function CareersPage() {
  const applySubject = encodeURIComponent("Application: Backend Support & Marketing Executive — Dehradun");
  return (
    <div className="heritage-surface min-h-screen">
      <section className="relative isolate overflow-hidden bg-[#092f2a] text-white">
        <Image src="/images/blog/places-to-eat-in-dehradun.jpg" alt="Green Dehradun valley, location of the listed My Quick Trippers role" fill preload sizes="100vw" placeholder={IMAGE_SKELETON} className="z-0 object-cover opacity-55" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,35,31,.96),rgba(5,35,31,.72),rgba(5,35,31,.34))]" />
        <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">Careers at MQT</p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Help people begin journeys they will remember.</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">Join a growing travel team where customer care, clear communication and practical problem-solving matter every day.</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-14 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#b6541d]">Current opening</p><h2 className="font-display mt-2 text-3xl font-bold text-[#123c35] sm:text-4xl">Build your career in travel support.</h2></div>
          <span className="hidden rounded-full bg-[#eaf5f1] px-4 py-2 text-sm font-bold text-[#176554] sm:inline">1 open role</span>
        </div>
        <article className="overflow-hidden rounded-[30px] border border-[#d5e3df] bg-white/95 shadow-[0_24px_70px_rgba(11,48,44,.12)] backdrop-blur">
          <div className="border-b border-[#dce8e4] bg-[#f1f7f5] p-6 sm:p-9">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div><span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#176554]"><BriefcaseBusiness aria-hidden="true" className="h-4 w-4" /> Full-time</span><h2 className="font-display mt-3 text-3xl font-bold text-[#103b34]">Backend Support & Marketing Executive</h2><p className="mt-3 max-w-2xl leading-7 text-[#60766f]">A customer-focused operations role combining backend coordination, marketing support and inbound call handling.</p></div>
              <div className="grid shrink-0 gap-2 text-sm font-bold text-[#274e46] sm:grid-cols-2 lg:grid-cols-1"><span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4"><MapPin aria-hidden="true" className="h-4 w-4 text-[#d76320]" /> Dehradun</span><span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4"><IndianRupee aria-hidden="true" className="h-4 w-4 text-[#d76320]" /> ₹20,000–₹30,000/month</span></div>
            </div>
          </div>
          <div className="grid gap-10 p-6 sm:p-9 lg:grid-cols-[1fr_320px]">
            <div>
              <h3 className="text-lg font-extrabold text-[#173f38]">What you will do</h3>
              <ul className="mt-5 space-y-4">{responsibilities.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-[#526b65]"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e9f5f0] text-[#147057]"><Check aria-hidden="true" className="h-3.5 w-3.5" /></span>{item}</li>)}</ul>
              <h3 className="mt-9 text-lg font-extrabold text-[#173f38]">What will help you succeed</h3>
              <p className="mt-3 text-sm leading-7 text-[#526b65]">Confident spoken Hindi and English, patient call handling, basic computer skills, organised follow-up habits and an interest in digital marketing. Travel-industry experience is helpful but not essential.</p>
            </div>
            <aside className="h-fit rounded-3xl bg-[#0e4037] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">Apply now</p><h3 className="font-display mt-3 text-2xl font-bold">Tell us why this role fits you.</h3><p className="mt-3 text-sm leading-6 text-white/72">Email your CV with the role name in the subject, or start a WhatsApp conversation.</p>
              <div className="mt-6 space-y-3"><a href={`mailto:${siteConfig.email}?subject=${applySubject}`} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#e96822] px-5 text-sm font-extrabold transition-colors hover:bg-[#c95116]">Email Your CV</a><a href={`${siteConfig.social.whatsapp}?text=${encodeURIComponent("Hello My Quick Trippers, I am interested in the Backend Support & Marketing Executive role in Dehradun.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-extrabold transition-colors hover:bg-white/20"><MessageCircle aria-hidden="true" className="h-4 w-4" /> Apply on WhatsApp</a><a href={`tel:${siteConfig.phoneRaw}`} className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-bold text-white/80 hover:text-white"><PhoneCall aria-hidden="true" className="h-4 w-4" /> {siteConfig.phone}</a></div>
            </aside>
          </div>
        </article>
        <section className="mt-12 rounded-[28px] border border-[#d5e3df] bg-white/92 p-7 sm:p-9"><h2 className="font-display text-2xl font-bold text-[#123c35]">Meet us before you apply.</h2><p className="mt-3 max-w-2xl leading-7 text-[#5f756f]">Follow our official channels to understand the destinations, packages and customer conversations our team works with.</p><div className="mt-6"><SocialFollowLinks /></div></section>
      </main>
    </div>
  );
}
