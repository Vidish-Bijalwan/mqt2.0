import { allPackages } from "@/data/allPackages";
import { siteConfig } from "@/data/siteConfig";
import PackageCard from "@/components/ui/PackageCard";
import SectionHeader from "@/components/ui/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import PosterMarquee from "@/components/ui/PosterMarquee";
import ThemeFilter from "@/components/home/ThemeFilter";
import ExperienceExplorer from "@/components/home/ExperienceExplorer";
import { experiencesWithCounts } from "@/utils/experienceCounts";
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

/* Curated international flagships — packages with real durations, prices and on-disk images. */
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
  { name: "Uttarakhand", sub: "Land of the Gods", href: "/destinations/uttarakhand", img: "/images/blog/glaciers-in-uttarakhand.jpg" },
  { name: "Uttar Pradesh", sub: "Heritage of India", href: "/destinations/uttar-pradesh", img: "/images/blog/agra.jpg" },
  { name: "Rajasthan", sub: "The Royal State", href: "/destinations/rajasthan", img: "/images/blog/5-star-hotels-in-jaipur.jpg" },
  { name: "Gujarat", sub: "Vibrant Culture, Timeless Charm", href: "/destinations/gujarat", img: "/images/blog/stepwells-in-gujarat.jpg" },
  { name: "Kashmir", sub: "Paradise on Earth", href: "/destinations/kashmir", img: "/images/blog/kashmir-places-to-visit.jpg" },
  { name: "Kerala", sub: "God's Own Country", href: "/destinations/kerala", img: "/images/blog/waterfalls-in-kerala.webp" },
  { name: "Tamil Nadu", sub: "Cultural Heart of South India", href: "/destinations/tamil-nadu", img: "/images/blog/places-to-visit-in-chennai.jpg" },
  { name: "Karnataka", sub: "Silicon Valley of India", href: "/destinations/karnataka", img: "/images/blog/tourist-places-in-bangalore.jpg" },
  { name: "Odisha", sub: "India's Best-Kept Secret", href: "/destinations/orissa", img: "/images/blog/konark-sun-temple.jpeg" },
  { name: "Madhya Pradesh", sub: "The Heart of Incredible India", href: "/destinations/madhya-pradesh", img: "/images/packages/places-to-visit-in-madhya-pradesh.webp" },
  { name: "Sikkim", sub: "Nature's Paradise", href: "/destinations/sikkim", img: "/images/blog/festivals-in-sikkim.jpg" },
  { name: "Himachal Pradesh", sub: "Abode of the Himalayas", href: "/destinations/himachal-pradesh", img: "/images/blog/adventure-sports-in-manali-shimla.webp" },
  { name: "Maharashtra", sub: "Gateway to the West", href: "/destinations/maharashtra", img: "/images/blog/hotels-in-matheran.webp" },
  { name: "Andaman", sub: "Islands of Adventure", href: "/destinations/andaman", img: "/images/packages/andaman.webp" },
];

const EXPERIENCE_ITEMS = experiencesWithCounts();

/* ─── Reusable section component (reference .prc_row_grid style) ─── */
function PackageSection({
  title,
  subtitle,
  packages,
  marginTop,
}: {
  title: string;
  subtitle?: string;
  packages: typeof allPackages;
  marginTop?: boolean;
}) {
  if (packages.length === 0) return null;
  return (
    <section className="bg-white">
      <div className="nit-page">
        <SectionHeader title={title} subtitle={subtitle} marginTop={marginTop} />
        <div className="nit-grid">
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
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* 1. Hero Banner with Poster Marquee */}
      <section className="w-full bg-brand-navy relative">
         <div className="pt-10 pb-2 text-center px-4">
           <div className="inline-flex items-center gap-2.5 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur px-4 py-1.5 mb-4">
             <Image
               src="/images/mqt-logo-256.webp"
               alt=""
               width={22}
               height={22}
               className="w-[22px] h-[22px] rounded-full object-cover border border-white/30"
             />
             <span className="text-[11px] md:text-xs font-bold text-orange-300 uppercase tracking-[0.18em]">
               My Quick Trippers · Govt. Approved Travel Agency
             </span>
           </div>
           <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">Discover the Magic of India</h1>
           <p className="text-base md:text-lg text-gray-300 font-medium drop-shadow-md">Explore authentic experiences with our expert guides</p>
         </div>
         <PosterMarquee />
      </section>

      {/* 2. Top Trending Tour Packages — 30 packages, 5-col grid */}
      <PackageSection
        title="Top Trending Tour Packages"
        packages={TRENDING_PACKAGES}
      />

      {/* 3. Top Holiday Destinations In India — image tiles, 7-up */}
      <section className="bg-white">
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
                  className="object-cover"
                />
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

      {/* 6. Book International Tour Packages From India */}
      {INTL_CARDS.length > 0 && (
        <section className="bg-white">
          <div className="nit-page">
            <SectionHeader
              title="Book International Tour Packages From India"
              marginTop
              subtitle={
                <>
                  Handpicked journeys to the world&apos;s most-loved destinations — curated itineraries, expert
                  guides and seamless planning from India.
                </>
              }
            />
            <div className="nit-grid">
              {INTL_CARDS.map((pkg: any) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. International Tours grid — 10 packages */}
      <PackageSection
        title="International Tour Packages"
        subtitle="Explore the world with curated international tour packages"
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
      <section className="bg-white">
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
      <section className="bg-white">
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
      <section className="py-10 bg-white">
        <div className="text-center">
          <Link href="/packages" className="inline-block bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-10 py-4 rounded-sm transition-colors text-base">
            View All {allPackages.length}+ Packages
          </Link>
        </div>
      </section>

    </div>
  );
}
