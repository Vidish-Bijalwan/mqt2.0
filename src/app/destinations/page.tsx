import Link from "next/link";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { destinations } from "@/data/contentData";
import { destinationExplorerProfiles } from "@/data/destinationExplorer";
import { getPublicPackages } from "@/utils/packageCatalog";
import { siteConfig } from "@/data/siteConfig";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";
import type { Metadata } from "next";

/** States with dedicated destination guide pages. */
const STATE_SLUGS = [
  "uttarakhand",
  "himachal-pradesh",
  "uttar-pradesh",
  "kashmir",
  "rajasthan",
  "gujarat",
  "maharashtra",
  "madhya-pradesh",
  "goa",
  "kerala",
  "karnataka",
  "tamil-nadu",
  "darjeeling",
  "sikkim",
  "assam",
  "ladakh",
];

const FALLBACK_HERO: Record<string, string> = {
  uttarakhand: "/images/location-library/uttarakhand-india/uttarakhand-india-01-lg.webp",
  "himachal-pradesh": "/images/location-library/himachal-pradesh-india/himachal-pradesh-india-02-lg.webp",
  "uttar-pradesh": "/images/location-library/uttar-pradesh-india/uttar-pradesh-india-04-lg.webp",
  rajasthan: "/images/location-library/rajasthan-india/rajasthan-india-02-lg.webp",
  kerala: "/images/location-library/kerala-india/kerala-india-03-lg.webp",
  goa: "/images/location-library/goa-india/goa-india-01-lg.webp",
  ladakh: "/images/location-library/ladakh-india/ladakh-india-02-lg.webp",
};

export const metadata: Metadata = {
  title: "Destinations in India | My Quick Trippers",
  description:
    "Explore every destination we cover — Uttarakhand, Himachal, Rajasthan, Kerala, Kashmir, Goa, Ladakh and more — with curated tour packages for each.",
  alternates: {
    canonical: `${siteConfig.domain}/destinations`,
  },
  openGraph: {
    title: "Destinations in India | My Quick Trippers",
    description: "Explore every destination we cover, with curated tour packages for each.",
    url: `${siteConfig.domain}/destinations`,
    type: "website",
  },
};

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DestinationsIndexPage() {
  const publicPackages = getPublicPackages();

  const cards = STATE_SLUGS.map((slug) => {
    const profile = destinationExplorerProfiles[slug];
    const destination = destinations.find((item) => item.slug.toLowerCase() === slug);
    const name = destination?.name || titleCase(slug.replace(/-/g, " "));
    const image =
      profile?.places?.[0]?.image ||
      FALLBACK_HERO[slug] ||
      destination?.image ||
      "/images/hero/hero-bg-1.svg";
    const term = slug.replace(/-/g, " ");
    const count = publicPackages.filter((pkg) =>
      `${pkg.slug} ${pkg.title} ${pkg.category} ${pkg.route}`.toLowerCase().includes(term)
    ).length;
    return {
      slug,
      name,
      image,
      eyebrow: profile?.eyebrow,
      tagline: profile?.tagline || `Tour packages and travel guides for ${name}.`,
      count,
    };
  });

  return (
    <main className="min-h-screen bg-[#f5f4ee] pb-16 text-[#102f2b]">
      <div className="border-b border-[#d9e3dc] bg-white/85">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-3 text-xs text-[#5e746d] sm:px-6">
          <Link href="/" className="hover:text-[#16453d]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate font-semibold text-[#16453d]">Destinations</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[.22em] text-[#b57830]">Where we go</p>
        <h1 className="font-display mt-2 text-4xl font-bold tracking-[-.04em] text-[#143a35] sm:text-5xl">
          Destinations across India
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#61766f]">
          Pick a region to browse its travel guide, top places and every curated journey we run there.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/destinations/${card.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-[#16453d] shadow-sm transition hover:shadow-xl"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  placeholder={IMAGE_SKELETON}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f1c]/95 via-[#061f1c]/25 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                {card.eyebrow && (
                  <p className="text-[10px] font-black uppercase tracking-[.17em] text-[#f0ad58]">{card.eyebrow}</p>
                )}
                <h2 className="font-display mt-1 text-2xl font-bold">{card.name}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-white/75">{card.tagline}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#f0ad58]">
                  <MapPin className="h-3.5 w-3.5" />
                  {card.count > 0 ? `${card.count} journeys` : "Tailored routes available"} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
