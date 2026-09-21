import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Landmark, MapPin, Mountain, Waves } from "lucide-react";

const highlights = [
  { name: "Rishikesh", note: "River, yoga & adventure", image: "/images/location-library/rishikesh-uttarakhand-india/rishikesh-uttarakhand-india-01-lg.webp", href: "/destinations/uttarakhand?destination=rishikesh" },
  { name: "Auli", note: "Snow slopes & Himalayan views", image: "/images/location-library/auli-uttarakhand-india/auli-uttarakhand-india-01-lg.webp", href: "/destinations/uttarakhand?destination=auli" },
  { name: "Nainital", note: "Lakeside escapes", image: "/images/location-library/nainital-uttarakhand-india/nainital-uttarakhand-india-01-lg.webp", href: "/destinations/uttarakhand?destination=nainital" },
];

export default function UttarakhandStateDiagram() {
  return (
    <section className="bg-[#f5f4ee] px-4 pb-10 pt-5 sm:px-6 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-[#5e746d]">
          <Link href="/" className="hover:text-[#16453d]">Home</Link><span>›</span><Link href="/packages" className="hover:text-[#16453d]">India</Link><span>›</span><strong className="text-[#16453d]">Uttarakhand</strong>
        </div>
        <div className="overflow-hidden rounded-[30px] bg-[#082f2a] shadow-[0_25px_70px_rgba(9,42,36,.2)]">
          <div className="grid lg:grid-cols-[1.12fr_.88fr]">
            <div className="relative overflow-hidden p-5 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(118,188,168,.21),transparent_27%),radial-gradient(circle_at_90%_85%,rgba(233,158,61,.18),transparent_32%)]" />
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[.24em] text-[#f0ad58]">The Uttarakhand atlas</p>
                <h1 className="font-display mt-3 text-4xl font-bold tracking-[-.045em] text-white sm:text-6xl">Every route begins with a place.</h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/76 sm:text-base">A travel-first view of Devbhoomi: mountain towns, river gateways and sacred journeys connected to the official state map.</p>
              </div>
              <figure className="relative mt-6 overflow-hidden rounded-2xl border border-white/25 bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,.28)] sm:p-3">
                <div className="relative aspect-[.95] w-full">
                  <Image src="/images/maps/uttarakhand-soi-2026.webp" alt="Official Survey of India Uttarakhand state map, 2026" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain" />
                </div>
                <figcaption className="border-t border-[#dce5df] px-2 pt-2 text-[10px] leading-4 text-[#587069]">Official state map: Survey of India, Uttarakhand English, 1st edition 2026, 1:500,000. Tourism highlights shown alongside are travel guidance, not administrative labels.</figcaption>
              </figure>
            </div>
            <aside className="bg-[#fbf8f0] p-6 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[.22em] text-[#b57830]">Devbhoomi, Uttarakhand</p>
              <h2 className="font-display mt-3 text-3xl font-bold leading-[1.05] tracking-[-.045em] text-[#123c35] sm:text-4xl">Mountains, rivers and sacred journeys—with a story at every stop.</h2>
              <div className="mt-6 grid grid-cols-3 gap-2 border-y border-[#dce5df] py-5 text-center"><DiagramFact icon={<Mountain />} label="High trails"/><DiagramFact icon={<Waves />} label="River towns"/><DiagramFact icon={<Landmark />} label="Sacred routes"/></div>
              <div className="mt-6 space-y-3">
                {highlights.map((place) => <Link key={place.name} href={place.href} className="group flex min-h-20 items-center gap-3 rounded-xl border border-[#dae5df] bg-white p-2 transition hover:-translate-y-0.5 hover:border-[#b57830] hover:shadow-md"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg"><Image src={place.image} alt="" fill sizes="80px" className="object-cover"/></div><div className="min-w-0"><p className="font-display text-lg font-bold text-[#143a35]">{place.name}</p><p className="mt-0.5 text-xs leading-4 text-[#647b74]">{place.note}</p></div><ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#b57830] transition group-hover:translate-x-1"/></Link>)}
              </div>
              <Link href="#packages" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16453d] px-5 text-sm font-bold text-white transition hover:bg-[#0b302c]">Explore Uttarakhand packages <ArrowRight className="h-4 w-4"/></Link>
              <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-[#637970]"><MapPin className="h-4 w-4 shrink-0 text-[#b57830]"/>Select a destination card to narrow the live package list below.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagramFact({ icon, label }: { icon: ReactNode; label: string }) {
  return <div className="flex flex-col items-center gap-1 text-[#16453d]"><span className="text-[#b57830] [&>svg]:h-5 [&>svg]:w-5">{icon}</span><span className="text-[10px] font-black uppercase tracking-[.09em]">{label}</span></div>;
}
