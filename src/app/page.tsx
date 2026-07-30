import { allPackages } from "@/data/allPackages";
import { siteConfig } from "@/data/siteConfig";
import PackageCard from "@/components/ui/PackageCard";
import Image from "next/image";
import Link from "next/link";
import { Users, Heart, Landmark, Flame, Umbrella, Tent, Snowflake, Sun, CloudRain } from "lucide-react";
import PosterMarquee from "@/components/ui/PosterMarquee";

const PILGRIM_PACKAGES = allPackages.filter(p => p.category === "Pilgrimage").slice(0, 5);
const NORTH_PACKAGES = allPackages.filter(p => p.category === "North India").slice(0, 5);
const INTL_PACKAGES = allPackages.filter(p => p.category === "International").slice(0, 5);
const TRENDING_PACKAGES = allPackages.slice(0, 10);

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

const THEMES = [
  { name: "Family", href: "/special-tours/family", icon: Users },
  { name: "Honeymoon", href: "/special-tours/honeymoon", icon: Heart },
  { name: "Cultural", href: "/special-tours/cultural", icon: Landmark },
  { name: "Pilgrimage", href: "/india-tours/pilgrimage", icon: Flame },
  { name: "Beaches", href: "/special-tours/beaches", icon: Umbrella },
  { name: "Adventure", href: "/special-tours/adventure", icon: Tent },
  { name: "Winter", href: "/special-tours/winter", icon: Snowflake },
  { name: "Summer", href: "/special-tours/summer", icon: Sun },
  { name: "Monsoon", href: "/special-tours/monsoon", icon: CloudRain },
];

const EXPERIENCES = [
  { name: "Medical Treatment in India", img: "/images/packages/andaman.webp" },
  { name: "Bungee Jumping", img: "/images/packages/kashmir.webp" },
  { name: "Trekking", img: "/images/packages/chardham.jpg" },
  { name: "Cruise Packages", img: "/images/packages/kerala.png" },
  { name: "Skiing", img: "/images/packages/kashmir.webp" },
  { name: "Wildlife", img: "/images/packages/andaman.webp" },
];

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

      {/* 2. Top Trending Tour Packages */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          <div className="text-center mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-700">Top Trending Tour Packages</h2>
            <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px]">
            {TRENDING_PACKAGES.slice(0, 10).map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/packages" className="inline-block bg-legacy-nav-blue hover:bg-legacy-nav-blue-hover text-white font-bold px-8 py-3 rounded-sm transition-colors text-sm">
              View All {allPackages.length}+ Packages
            </Link>
          </div>
        </div>
      </section>

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

      {/* 4. Chota Char Dham Section (Pilgrimage) */}
      {PILGRIM_PACKAGES.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
            <div className="text-center mb-4 relative">
              <h2 className="text-2xl font-bold text-gray-700">Chota Char Dham Yatra</h2>
              <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2 mb-3"></div>
              <p className="text-sm text-gray-500">
                Arguably, Char Dham in Uttarakhand is one of the most acclaimed pilgrimages{" "}
                <Link href="/india-tours/chardham" className="text-blue-600 font-semibold">Read More</Link>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px] mt-6">
              {PILGRIM_PACKAGES.slice(0, 5).map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Book International Tour Packages */}
      {INTL_PACKAGES.length > 0 && (
        <section className="py-12 bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
            <div className="text-center mb-4 relative">
              <h2 className="text-2xl font-bold text-gray-700">Book International Tour Packages From India</h2>
              <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2 mb-3"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-[10px] mt-6">
              {INTL_PACKAGES.slice(0, 5).map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Choose Your Style Of Themes Holiday */}
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
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-[10px]">
             {THEMES.map((theme, i) => (
                <Link key={i} href={theme.href} className="border border-gray-200 p-3 flex flex-col items-center justify-center rounded cursor-pointer hover:border-legacy-orange group transition-colors">
                   <div className="w-10 h-10 mb-2 text-brand-orange group-hover:text-black transition-colors flex items-center justify-center">
                     <theme.icon className="w-8 h-8" strokeWidth={1.5} />
                   </div>
                   <span className="text-[10px] text-gray-700 font-medium text-center">{theme.name}</span>
                </Link>
             ))}
          </div>
        </div>
      </section>

      {/* 7. Experience The Best Of India */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 w-full max-w-[1920px] px-2 md:px-4">
          <div className="text-center mb-8 relative">
            <h2 className="text-2xl font-bold text-gray-700">Experience The Best Of India</h2>
            <div className="w-12 h-1 bg-legacy-orange mx-auto mt-2 mb-4"></div>
            <p className="text-sm text-gray-500">
              India has many things to offer and you can enjoy many things in this country.{" "}
              <Link href="/india-tours" className="text-brand-orange font-semibold hover:underline">Read More</Link>
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[10px]">
             {EXPERIENCES.map((exp, i) => (
                <div key={i} className="relative h-[180px] rounded overflow-hidden group cursor-pointer shadow-sm">
                   <Image src={exp.img} alt={exp.name} fill className="object-cover" />
                   <div className="absolute bottom-0 w-full bg-legacy-nav-blue bg-opacity-90 py-2 text-center transition-all group-hover:bg-legacy-orange">
                     <h3 className="text-xs font-semibold text-white px-1">{exp.name}</h3>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

    </div>
  );
}
