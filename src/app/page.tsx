import { type Package } from "@/data/allPackages";
import { getPublicPackages, isInternationalPackage } from "@/utils/packageCatalog";
import PackageCard from "@/components/ui/PackageCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import PosterMarquee from "@/components/ui/PosterMarquee";
import ThemeFilter from "@/components/home/ThemeFilter";
import ExperienceExplorer from "@/components/home/ExperienceExplorer";
import { experiencesWithCounts } from "@/utils/experienceCounts";
import { groupPackagesByDestination } from "@/utils/packageGroups";
import { IMAGE_SKELETON } from "@/utils/imagePlaceholder";

/* ─── Smart package filtering ───
   Only show packages on the homepage that have:
   1. A valid image path from the verified package catalog
   This prevents broken/empty cards from appearing. */

function getValidPackages() {
  const usedImages = new Set<string>();
  return getPublicPackages().filter((pkg) => {
    if (!pkg.image?.trim() || usedImages.has(pkg.image)) return false;
    usedImages.add(pkg.image);
    return true;
  });
}
const validPackages = getValidPackages();
const publicPackageCount = getPublicPackages().length;

/* ─── Category sections for homepage ─── */
const TRENDING_DESTINATIONS = ["Kashmir", "Kerala", "Rajasthan", "Goa", "Andaman", "Char Dham", "Manali", "Bali", "Nepal", "Dubai"];
const allDestinationGroups = groupPackagesByDestination(validPackages);
const TRENDING_PACKAGES = TRENDING_DESTINATIONS.flatMap(
  (destination) => allDestinationGroups.find((group) => group.label === destination)?.packages || [],
);

const PILGRIMAGE_PACKAGES = validPackages.filter(p => p.category === "Pilgrimage");

const NORTH_INDIA_PACKAGES = validPackages.filter(p => p.category === "North India");

const SOUTH_INDIA_PACKAGES = validPackages.filter(p => p.category === "South India");

const INTERNATIONAL_PACKAGES = validPackages.filter(isInternationalPackage);

const WEST_INDIA_PACKAGES = validPackages.filter(p => p.category === "West India");

const HELICOPTER_PACKAGES = validPackages.filter(p => p.category === "Helicopter");

const DESTINATIONS = [
  { name: "Uttarakhand", sub: "Land of the Gods", href: "/destinations/uttarakhand", img: "/images/packages/hi-uttarakhand.webp" },
  { name: "Uttar Pradesh", sub: "Heritage of India", href: "/destinations/uttar-pradesh", img: "/images/packages/taj-mahal.jpg" },
  { name: "Rajasthan", sub: "The Royal State", href: "/destinations/rajasthan", img: "/images/packages/rajasthan.jpg" },
  { name: "Gujarat", sub: "Vibrant culture", href: "/destinations/gujarat", img: "/images/packages/gujarat.jpg" },
  { name: "Kashmir", sub: "Paradise on Earth", href: "/destinations/kashmir", img: "/images/packages/kashmir.jpg" },
  { name: "Kerala", sub: "God's Own Country", href: "/destinations/kerala", img: "/images/packages/kerala.jpg" },
  { name: "Tamil Nadu", sub: "Temple country", href: "/destinations/tamil-nadu", img: "/images/packages/south-india.jpg" },
  { name: "Karnataka", sub: "Heritage and nature", href: "/destinations/karnataka", img: "/images/packages/karnataka.jpg" },
  { name: "Odisha", sub: "Coast and culture", href: "/destinations/orissa", img: "/images/packages/odisha.jpg" },
  { name: "Madhya Pradesh", sub: "The heart of India", href: "/destinations/madhya-pradesh", img: "/images/packages/madhya-pradesh.jpg" },
  { name: "Sikkim", sub: "Nature's paradise", href: "/destinations/sikkim", img: "/images/packages/sikkim.jpg" },
  { name: "Himachal Pradesh", sub: "Himalayan escapes", href: "/destinations/himachal-pradesh", img: "/images/packages/himachal-pradesh.jpg" },
  { name: "Maharashtra", sub: "Coast, caves and cities", href: "/destinations/maharashtra", img: "/images/packages/maharashtra.jpg" },
  { name: "Andaman", sub: "Islands of Adventure", href: "/destinations/andaman", img: "/images/packages/andaman.webp" },
];

const EXPERIENCE_ITEMS = experiencesWithCounts();

/* ─── Reusable section component (reference .prc_row_grid style) ─── */
function PackageSection({
  title,
  subtitle,
  packages,
  marginTop,
  maxGroups = 5,
}: {
  title: string;
  subtitle?: string;
  packages: Package[];
  marginTop?: boolean;
  maxGroups?: number;
}) {
  if (packages.length === 0) return null;
  const groups = groupPackagesByDestination(packages).slice(0, maxGroups);
  return (
    <section className="home-deferred-section bg-[#fbfaf6]/96">
      <div className="nit-page">
        <SectionHeader title={title} subtitle={subtitle} marginTop={marginTop} />
        <div className="nit-grid">
          {groups.map((group) => (
            <PackageCard
              key={group.key}
              pkg={{ ...group.representative, title: group.label }}
              href={group.packages.length > 1 ? `/packages?destination=${encodeURIComponent(group.label)}` : undefined}
              variantCount={group.packages.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      
      {/* 1. Brand-led travel hero followed by the lightweight poster rail */}
      <section className="w-full bg-brand-navy relative">
         <div className="home-brand-hero">
           <h1 className="sr-only">Explore India with My Quick Trippers</h1>
           <div className="home-brand-hero__media">
             <picture>
               <source media="(max-width: 767px)" srcSet="/images/home/mqt-india-hero-mobile.webp" />
               <img
                 src="/images/home/mqt-india-hero.webp"
                 alt="Explore India with My Quick Trippers: mountains, heritage, wildlife, beaches and adventure journeys"
                 width="2056"
                 height="765"
                 loading="eager"
                 decoding="async"
                 fetchPriority="high"
               />
             </picture>
           </div>
           <form action="/packages" method="get" className="home-hero-search">
             <label className="sr-only" htmlFor="home-destination">Where do you want to go?</label>
             <input id="home-destination" name="q" placeholder="Where do you want to go?" />
             <label className="sr-only" htmlFor="home-travelers">Travelers</label>
             <select id="home-travelers" name="travelers" defaultValue="2">
               <option value="1">1 traveler</option>
               <option value="2">2 travelers</option>
               <option value="3">3 travelers</option>
               <option value="4">4+ travelers</option>
             </select>
             <button type="submit">Search packages</button>
           </form>
         </div>
         <div className="border-t border-white/10 bg-brand-navy py-5 sm:py-7">
           <div className="mb-4 text-center px-4">
             <p className="text-[10px] sm:text-xs font-bold text-orange-300 uppercase tracking-[0.16em]">Featured destinations</p>
             <p className="mt-1 text-sm sm:text-base text-gray-300">Find your next unforgettable journey</p>
           </div>
           <PosterMarquee />
         </div>
      </section>

      {/* 2. Top Trending Tour Packages — 30 packages, 5-col grid */}
      <PackageSection
        title="Top Trending Tour Packages"
        packages={TRENDING_PACKAGES}
        maxGroups={10}
      />

      {/* 3. Top Holiday Destinations In India — image tiles, 7-up */}
      <section className="home-deferred-section bg-[#fbfaf6]/96">
        <div className="nit-page">
          <SectionHeader title="Top Holiday Destinations In India" marginTop />
          <div className="nit-inxBt">
            {DESTINATIONS.slice(0, 14).map((dest, i) => (
              <Link key={i} href={dest.href} className="nit-cdxBt" title={dest.name}>
                <Image
                  src={dest.img}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 700px) 46vw, 13vw"
                  quality={65}
                  loading="lazy"
                  decoding="async"
                  placeholder={IMAGE_SKELETON}
                  className="object-cover"
                />
                <span className="nit-cdxBt-copy"><strong>{dest.name}</strong><small>{dest.sub}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pilgrimage Tours — 10 packages */}
      <PackageSection
        title="Pilgrimage Tour Packages"
        subtitle="Sacred journeys to India's most revered spiritual destinations"
        packages={PILGRIMAGE_PACKAGES}
        marginTop
      />

      {/* 5. North India Tours — 10 packages */}
      <PackageSection
        title="North India Tour Packages"
        subtitle="From the Himalayas to the Ganges plains — discover North India"
        packages={NORTH_INDIA_PACKAGES}
        marginTop
      />

      {/* 6. International destinations grouped into trip options */}
      <PackageSection
        title="International Journeys"
        subtitle="Choose a destination, then compare every available itinerary in one place"
        packages={INTERNATIONAL_PACKAGES}
        marginTop
      />

      {/* 8. South India Tours — 10 packages */}
      <PackageSection
        title="South India Tour Packages"
        subtitle="Temples, backwaters, beaches and beyond — explore South India"
        packages={SOUTH_INDIA_PACKAGES}
        marginTop
      />

      {/* 9. West India Tours — up to 10 packages */}
      <PackageSection
        title="West India Tour Packages"
        subtitle="From Rajasthan forts to Gujarat's cultural heritage"
        packages={WEST_INDIA_PACKAGES}
        marginTop
      />

      {/* 10. Helicopter Tours */}
      {HELICOPTER_PACKAGES.length > 0 && (
        <PackageSection
          title="Helicopter Tour Packages"
          subtitle="Premium aerial pilgrimage and scenic experiences"
          packages={HELICOPTER_PACKAGES}
          marginTop
        />
      )}

      {/* 11. Choose Your Style Of Themes Holiday */}
        <section className="home-deferred-section bg-[#fbfaf6]/96">
        <div className="nit-page">
          <SectionHeader
            title="Choose Your Style Of Themes Holiday"
            marginTop
            subtitle={
              <>
                Are you looking forward to visiting the exquisite wildlife sanctuaries{" "}
                <Link href="/special-tours" className="text-brand-orange font-semibold hover:underline">Read More</Link>
              </>
            }
          />
          <div className="max-md:-mx-[5px]">
            <ThemeFilter />
          </div>
        </div>
      </section>

      {/* 12. Experience The Best Of India — interactive discovery */}
        <section className="home-deferred-section bg-[#fbfaf6]/96">
        <div className="nit-page">
          <SectionHeader
            title="Experience The Best Of India"
            marginTop
            subtitle="Discover unforgettable journeys, thrilling adventures, spiritual escapes, luxury travel, wellness retreats, wildlife safaris, cruises, cultural experiences, and much more across India."
          />

          <ExperienceExplorer
            experiences={EXPERIENCE_ITEMS.map((e) => ({
              slug: e.slug,
              name: e.name,
              group: e.group,
              image: e.image,
              tagline: e.tagline,
              packageCount: e.packageCount,
            }))}
            showToolbar={false}
            limit={8}
          />

          <div className="mt-10 text-center">
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-orange-dark transition-colors"
            >
              Browse all {EXPERIENCE_ITEMS.length} experience categories
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* View All CTA */}
        <section className="home-deferred-section bg-[#fbfaf6]/96 py-10">
        <div className="text-center">
          <Link href="/packages" className="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-10 py-4 rounded-sm transition-colors text-base">
            View All {publicPackageCount}+ Packages
          </Link>
        </div>
      </section>

    </div>
  );
}
