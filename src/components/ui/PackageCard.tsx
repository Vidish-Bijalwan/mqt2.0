import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Utensils, CarFront, Navigation } from "lucide-react";

export interface PackageCardProps {
  slug: string;
  title: string;
  image: string;
  duration: string;
  route: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  highlights: string[];
}

export default function PackageCard({ pkg }: { pkg: PackageCardProps }) {
  // Extract number of days from duration string (e.g. "5 Nights / 6 Days" -> "6 Days")
  const durationMatch = pkg.duration.match(/(\d+)\s*Days/i);
  const days = durationMatch ? durationMatch[1] + " Days" : pkg.duration.split('/')[0];
  const nightsMatch = pkg.duration.match(/(\d+)\s*Nights/i);
  const nights = nightsMatch ? nightsMatch[1] + " Nights" : "";

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col relative w-full h-full">
      
      {/* Top Left Ribbon */}
      <div className="nit-ribbon z-10"></div>
      <div className="nit-ribbon-text z-10">MQT</div>

      {/* Image Area - Taller as requested (280px) */}
      <div className="relative h-[250px] w-full overflow-hidden shrink-0 group">
        <Link href={`/packages/${pkg.slug}`} className="block w-full h-full relative">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay to make title pop, with custom diagonal cut at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
          
          {/* Title and Duration Overlay (Centered like Image 1) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
             <h3 className="text-2xl md:text-3xl font-bold text-white uppercase drop-shadow-md tracking-wider leading-tight">
               {pkg.title.split(' ').slice(0, 3).join(' ')}
             </h3>
             <p className="text-white font-medium text-sm md:text-base mt-1 drop-shadow-md">
               {pkg.title.split(' ').slice(3).join(' ')}
             </p>
             {days && (
               <div className="mt-3 bg-legacy-orange text-white text-xs font-bold px-4 py-1 rounded shadow-sm">
                 {nights && `${nights} / `}{days}
               </div>
             )}
          </div>
        </Link>
      </div>

      {/* Content Area */}
      <div className="flex-grow flex flex-col pt-3 pb-0 px-0">
        <div className="px-4">
          <Link href={`/packages/${pkg.slug}`}>
            <h4 className="text-base font-semibold text-blue-700 hover:underline mb-1 line-clamp-1">{pkg.title}</h4>
          </Link>
          
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="w-2 h-2 rounded-full border border-legacy-orange flex items-center justify-center mr-1">
               <span className="w-1 h-1 bg-legacy-orange rounded-full"></span>
            </span>
            Multi-day tours <strong className="ml-1 text-black">available</strong>
          </div>

          {/* Route line with Map Pin (Replacing Description) */}
          <div className="flex items-start text-xs text-gray-700 font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 mr-1.5 text-legacy-orange shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-snug">
               {pkg.route.split(' - ').map((r, i, arr) => (
                 <span key={i}>
                   {r} {i < arr.length - 1 && <span className="mx-1 text-gray-400">→</span>}
                 </span>
               ))}
            </span>
          </div>

          {/* Amenities Icons - Grey/Black Outline */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-3 pb-3">
            <div className="flex flex-col items-center justify-center text-gray-600">
              <BedDouble strokeWidth={1.5} className="w-5 h-5 mb-1 text-gray-700" />
              <span className="text-[10px]">Hotel Stay</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600">
              <Utensils strokeWidth={1.5} className="w-5 h-5 mb-1 text-gray-700" />
              <span className="text-[10px]">Meals</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600">
              <CarFront strokeWidth={1.5} className="w-5 h-5 mb-1 text-gray-700" />
              <span className="text-[10px]">Transfers</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-600">
              <Navigation strokeWidth={1.5} className="w-5 h-5 mb-1 text-gray-700" />
              <span className="text-[10px]">Sightseeing</span>
            </div>
          </div>
        </div>

        {/* Pricing Block - Light Background */}
        <div className="bg-[#f4f8fb] px-4 py-3 text-center border-t border-gray-200 mt-auto relative flex flex-col items-center">
           {pkg.discount && pkg.discount.trim() !== '' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[11px] font-bold px-3 py-0.5 rounded shadow-sm z-10 whitespace-nowrap">
                 {pkg.discount} off
              </div>
           )}
           <div className="h-4 flex items-center justify-center mt-1">
             {pkg.oldPrice && pkg.oldPrice.trim() !== '' && (
               <span className="text-xs text-red-500 line-through font-medium">{pkg.oldPrice}</span>
             )}
           </div>
           
           <div className="text-2xl font-bold text-gray-900 leading-none my-1">
             {pkg.price ? pkg.price : "On Request"}
           </div>
           <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Starting price per person</div>
        </div>

        {/* Two-Button Action Area */}
        <div className="flex w-full border-t border-gray-200 h-10">
          <Link 
            href={`/packages/${pkg.slug}#enquiry`}
            className="w-1/2 flex items-center justify-center text-gray-700 text-xs font-bold bg-white hover:bg-gray-50 transition-colors border-r border-gray-200"
          >
            Quick Enquiry
          </Link>
          <Link 
            href={`/packages/${pkg.slug}`}
            className="w-1/2 flex items-center justify-center text-white text-xs font-bold bg-legacy-orange hover:bg-legacy-orange-hover transition-colors"
          >
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
