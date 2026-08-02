import { allPackages } from "@/data/allPackages";
import { siteConfig } from "@/data/siteConfig";
import PackageCard from "@/components/ui/PackageCard";
import Image from "next/image";
import Link from "next/link";
import PosterMarquee from "@/components/ui/PosterMarquee";
import ThemeFilter from "@/components/home/ThemeFilter";
import ExperienceExplorer from "@/components/home/ExperienceExplorer";
import { experiencesWithCounts } from "@/utils/experienceCounts";
import { ArrowRight } from "lucide-react";
import fs from "fs";
import path from "path";

/* ─── Smart package filtering ───
   Only show packages on the homepage that have:
   1. A valid image that actually exists on disk
   This prevents broken/empty cards from appearing. */

function getValidPackages() {
  return allPackages.filter((p) => {
    // Must have a non-empty image path
    if (!p.image || p.image.trim() === '') return false;

    // Check image exists on disk
    const filename = path.basename(p.image);
    const diskPath = path.join(process.cwd(), 'public', 'images', 'packages', filename);
    try {
      return fs.existsSync(diskPath);
    } catch {
      return false;
    }
  });
}

const validPackages = getValidPackages();

/* ─── Category sections for homepage ─── */
const TRENDING_PACKAGES = validPackages.slice(0, 30);

const PILGRIMAGE_PACKAGES = validPackages
  .filter(p => p.category === "Pilgrimage")
  .slice(0, 10);

const NORTH_INDIA_PACKAGES = validPackages
  .filter(p => p.category === "North India")
  .slice(0, 10);

const SOUTH_INDIA_PACKAGES = validPackages
  .filter(p => p.category === "South India")
  .slice(0, 10);

const INTERNATIONAL_PACKAGES = validPackages
  .filter(p => p.category === "International")
  .slice(0, 10);

const WEST_INDIA_PACKAGES = validPackages
  .filter(p => p.category === "West India")
  .slice(0, 10);

const HELICOPTER_PACKAGES = validPackages
  .filter(p => p.category === "Helicopter")
  .slice(0, 10);

/* Curated international flagships — packages with real durations, prices and on-disk images.
   NOTE: ratings are editorial placeholders until real review data is wired in. */
const INTL_CURATED = [
  { slug: "bali-sightseeing-tour", destination: "Bali, Indonesia", rating: 4.8 },
  { slug: "dubai-honeymoon-tour", destination: "Dubai, UAE", rating: 4.9 },
  { slug: "7-days-nepal-tour-packages", destination: "Nepal", rating: 4.7 },
  { slug: "sri-lanka-group-tour-packages", destination: "Sri Lanka", rating: 4.8 },
];
const INTL_CARDS = INTL_CURATED
  .map((c) => {
    const pkg = allPackages.find((p) => p.slug === c.slug);
    if (!pkg) return null;
    return { ...pkg, destination: c.destination, rating: c.rating };
  })
  .filter(Boolean)
  .slice(0, 4);

const DESTINATIONS = [
  { name: "Uttarakhand", sub: "Land of the Gods", href: "/india-tours/uttarakhand", img: "/images/blog/glaciers-in-uttarakhand.jpg" },
  { name: "Uttar Pradesh", sub: "Heritage of India", href: "/india-tours/uttar-pradesh", img: "/images/blog/agra.jpg" },
  { name: "Rajasthan", sub: "The Royal State", href: "/india-tours/rajasthan", img: "/images/blog/travel-theme__food.jpg" },
  { name: "Gujarat", sub: "Vibrant Culture, Timeless Charm", href: "/india-tours/gujarat", img: "/images/blog/stepwells-in-gujarat.jpg" },
  { name: "Kashmir", sub: "Paradise on Earth", href: "/india-tours/kashmir", img: "/images/blog/kashmir-places-to-visit.jpg" },
  { name: "Kerala", sub: "God's Own Country", href: "/india-tours/kerala", img: "/images/blog/waterfalls-in-kerala.webp" },
  { name: "Tamil Nadu", sub: "Cultural Heart of South India", href: "/india-tours/tamil-nadu", img: "/images/blog/places-to-visit-in-chennai.jpg" },
  { name: "Karnataka", sub: "Silicon Valley of India", href: "/india-tours/karnataka", img: "/images/blog/best-night-clubs-in-bangalore.jpg" },
  { name: "Odisha", sub: "India's Best-Kept Secret", href: "/india-tours/orissa", img: "/images/blog/delhi-to-ujjain-trip.webp" },
  { name: "Madhya Pradesh", sub: "The Heart of Incredible India", href: "/india-tours/madhya-pradesh", img: "/images/blog/delhi-to-ujjain-trip.webp" },
  { name: "Sikkim", sub: "Nature's Paradise", href: "/india-tours/sikkim", img: "/images/blog/festivals-in-sikkim.jpg" },
  { name: "Himachal Pradesh", sub: "Abode of the Himalayas", href: "/india-tours/himachal-pradesh", img: "/images/blog/adventure-sports-in-manali-shimla.webp" },
  { name: "Maharashtra", sub: "Gateway to the West", href: "/india-tours/maharashtra", img: "/images/blog/hotels-in-matheran.webp" },
  { name: "Andaman", sub: "Islands of Adventure", href: "/india-tours/andaman", img: "/images/packages/andaman.webp" },
];

const EXPERIENCE_ITEMS = experiencesWithCounts();

/* ─── Reusable section component ─── */
function PackageSection({
  title,
  subtitle,
  packages,
  categoryFilter,
  bgClass = "bg-white",
}: {
  title: string;
  subtitle?: string;
  packages: typeof allPackages;
  categoryFilter?: string;
  bgClass?: string;
}) {
  if (packages.length === 0) return null;
  return (
    <section className={`py-12 ${bgClass} border-t border-gray-200`}>
      <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
            <div className="w-12 h-1 bg-legacy-orange mt-2"></div>
            {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
          </div>
          {categoryFilter && (
            <Link
              href={`/packages?category=${encodeURIComponent(categoryFilter)}`}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-legacy-orange hover:text-orange-700 transition-colors shrink-0"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px]">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. Hero Banner with Poster Marquee */}
      <section className="w-full bg-brand-navy relative">
         <div className="pt-10 pb-2 text-center">
           <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">Discover the Magic of India</h1>
           <p className="text-base md:text-lg text-gray-300 font-medium drop-shadow-md">Explore authentic experiences with our expert guides</p>
         </div>
         <PosterMarquee />
      </section>

      {/* 2. Top Trending Tour Packages — 10 packages, 5×2 grid */}
      <PackageSection
        title="Top Trending Tour Packages"
        packages={TRENDING_PACKAGES}
        bgClass="bg-white"
      />

      {/* 3. Top Holiday Destinations In India */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          <div className="text-center mb-10 relative">
            <h2 className="text-2xl font-bold text-gray-700">Top Holiday Destinations In India</h2>
            <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-[10px]">
             {DESTINATIONS.slice(0, 14).map((dest, i) => (
                <Link key={i} href={dest.href} className="relative h-[220px] rounded overflow-hidden group cursor-pointer shadow-sm block">
                   <Image src={dest.img} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                   <div className="absolute bottom-4 left-0 w-full text-center px-2">
                     <h3 className="text-base font-bold text-white leading-tight">{dest.name}</h3>
                     <p className="text-[9px] text-gray-300 mt-1">{dest.sub}</p>
                   </div>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 4. Pilgrimage Tours — 10 packages, 5×2 grid */}
      <PackageSection
        title="Pilgrimage Tour Packages"
        subtitle="Sacred journeys to India's most revered spiritual destinations"
        packages={PILGRIMAGE_PACKAGES}
        categoryFilter="Pilgrimage"
        bgClass="bg-white"
      />

      {/* 5. North India Tours — 10 packages, 5×2 grid */}
      <PackageSection
        title="North India Tour Packages"
        subtitle="From the Himalayas to the Ganges plains — discover North India"
        packages={NORTH_INDIA_PACKAGES}
        categoryFilter="North India"
        bgClass="bg-gray-50"
      />

      {/* 6. Book International Tour Packages */}
      {INTL_CARDS.length > 0 && (
        <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-gray-50 border-t border-gray-200 overflow-hidden">
          <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
            {/* Editorial header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange-text mb-2">Worldwide Escapes</p>
                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                  Book International Tour Packages From India
                </h2>
                <p className="mt-3 text-sm lg:text-base text-gray-500 leading-relaxed">
                  Handpicked journeys to the world&apos;s most-loved destinations — curated itineraries, expert
                  guides and seamless planning from India.
                </p>
              </div>
              <Link
                href="/packages?category=International"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-brand-orange-text hover:text-brand-orange-dark transition-colors"
              >
                View All International Tours
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            {/* 4-up premium grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px]">
              {INTL_CARDS.map((pkg: any) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. International Tours grid — 10 packages, 5×2 */}
      <PackageSection
        title="International Tour Packages"
        subtitle="Explore the world with curated international tour packages"
        packages={INTERNATIONAL_PACKAGES}
        categoryFilter="International"
        bgClass="bg-white"
      />

      {/* 8. South India Tours — 10 packages, 5×2 grid */}
      <PackageSection
        title="South India Tour Packages"
        subtitle="Temples, backwaters, beaches and beyond — explore South India"
        packages={SOUTH_INDIA_PACKAGES}
        categoryFilter="South India"
        bgClass="bg-gray-50"
      />

      {/* 9. West India Tours — up to 10 packages */}
      <PackageSection
        title="West India Tour Packages"
        subtitle="From Rajasthan forts to Gujarat's cultural heritage"
        packages={WEST_INDIA_PACKAGES}
        categoryFilter="West India"
        bgClass="bg-white"
      />

      {/* 10. Helicopter Tours */}
      {HELICOPTER_PACKAGES.length > 0 && (
        <PackageSection
          title="Helicopter Tour Packages"
          subtitle="Premium aerial pilgrimage and scenic experiences"
          packages={HELICOPTER_PACKAGES}
          categoryFilter="Helicopter"
          bgClass="bg-gray-50"
        />
      )}

      {/* 11. Choose Your Style Of Themes Holiday */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          <div className="text-center mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-700">Choose Your Style Of Themes Holiday</h2>
            <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2 mb-4"></div>
            <p className="text-sm text-gray-500">
              Are you looking forward to visiting the exquisite wildlife sanctuaries{" "}
              <Link href="/special-tours" className="text-brand-orange font-semibold hover:underline">Read More</Link>
            </p>
          </div>
          
          <ThemeFilter />
        </div>
      </section>

      {/* 12. Experience The Best Of India — interactive discovery */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50 to-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          {/* Editorial header + CTA */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange-text mb-2">Experiences</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">Experience The Best Of India</h2>
              <p className="mt-3 text-sm lg:text-base text-gray-500 leading-relaxed">
                Discover unforgettable journeys, thrilling adventures, spiritual escapes, luxury travel, wellness
                retreats, wildlife safaris, cruises, cultural experiences, and much more across India.
              </p>
            </div>
            <Link
              href="/experiences"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-bold text-white shadow-cta-orange transition-all duration-200 hover:bg-brand-orange-dark hover:shadow-cta-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              Explore All Experiences
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Interactive category explorer */}
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
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange-text hover:text-brand-orange-dark transition-colors"
            >
              Browse all {EXPERIENCE_ITEMS.length} experience categories
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* View All CTA */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="text-center">
          <Link href="/packages" className="inline-block bg-legacy-nav-blue hover:bg-legacy-nav-blue-hover text-white font-bold px-10 py-4 rounded-sm transition-colors text-base">
            View All {allPackages.length}+ Packages
          </Link>
        </div>
      </section>

    </div>
  );
}
