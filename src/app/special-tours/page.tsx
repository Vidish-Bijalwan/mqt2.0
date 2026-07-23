import Link from "next/link";
import { Users, Heart, Landmark, Flame, Umbrella, Tent, Snowflake, Sun, CloudRain, ChevronRight } from "lucide-react";
import Image from "next/image";

const THEMES = [
  { name: "Family", href: "/special-tours/family", icon: Users, desc: "Create unforgettable memories with your loved ones." },
  { name: "Honeymoon", href: "/special-tours/honeymoon", icon: Heart, desc: "Romantic getaways for perfect beginnings." },
  { name: "Cultural", href: "/special-tours/cultural", icon: Landmark, desc: "Explore the rich heritage and history of India." },
  { name: "Pilgrimage", href: "/india-tours/pilgrimage", icon: Flame, desc: "Spiritual journeys to sacred destinations." },
  { name: "Beaches", href: "/special-tours/beaches", icon: Umbrella, desc: "Relaxing escapes on pristine sandy shores." },
  { name: "Adventure", href: "/special-tours/adventure", icon: Tent, desc: "Thrilling treks, safaris, and outdoor expeditions." },
  { name: "Winter", href: "/special-tours/winter", icon: Snowflake, desc: "Snowy retreats and cozy winter holidays." },
  { name: "Summer", href: "/special-tours/summer", icon: Sun, desc: "Cool hill stations to beat the summer heat." },
  { name: "Monsoon", href: "/special-tours/monsoon", icon: CloudRain, desc: "Lush green landscapes coming alive in the rain." },
];

export const metadata = {
  title: "Special Tour Themes | My Quick Trippers",
  description: "Browse our handpicked tour themes. From family vacations to romantic honeymoons, find the perfect travel style for you.",
};

export default function SpecialToursPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-legacy-nav-blue text-white text-xs py-2 px-4">
        <div className="container mx-auto w-[95%] max-w-[1600px] flex items-center">
          <Link href="/" className="hover:text-legacy-orange transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-1 opacity-70" />
          <span className="text-legacy-orange">Special Tours</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[250px] w-full mb-12">
        <Image src="/images/hero/hero-bg-2.jpg" alt="Special Tours" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white capitalize mb-4">Choose Your Travel Style</h1>
          <p className="text-white text-lg max-w-2xl">Find the perfect itinerary customized to your preferred theme and make your dream vacation a reality.</p>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="container mx-auto w-[95%] max-w-[1200px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THEMES.map((theme, i) => (
            <Link key={i} href={theme.href} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-legacy-orange transition-all group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 text-legacy-orange rounded-full flex items-center justify-center mb-4 group-hover:bg-legacy-orange group-hover:text-white transition-colors">
                <theme.icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{theme.name} Tours</h2>
              <p className="text-gray-500 text-sm mb-4">{theme.desc}</p>
              <span className="text-legacy-orange text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                Explore Packages <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
