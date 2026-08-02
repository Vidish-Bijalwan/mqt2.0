import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Utensils, CarFront, Navigation, Star } from "lucide-react";

export interface PackageCardProps {
  slug: string;
  title: string;
  image: string;
  image2?: string;
  duration: string;
  route: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  highlights: string[];
  destination?: string; // Ported from InternationalPackageCard
  rating?: number; // Ported from InternationalPackageCard
}

export default function PackageCard({ pkg }: { pkg: PackageCardProps }) {
  // Extract number of days from duration string (e.g. "5 Nights / 6 Days" -> "6 Days")
  const durationMatch = pkg.duration.match(/(\d+)\s*Days/i);
  const days = durationMatch ? durationMatch[1] + " Days" : pkg.duration.split('/')[0] || pkg.duration;
  const nightsMatch = pkg.duration.match(/(\d+)\s*Nights/i);
  const nights = nightsMatch ? nightsMatch[1] + " Nights" : "";
  const durationPill = days + (nights ? ` / ${nights}` : "");

  /* ─── Pricing logic ───
     In the scraped data the fields are swapped:
       • pkg.price   = the higher MRP / original price
       • pkg.oldPrice = the actual deal / current price
  */
  const parseINR = (s: string) => {
    const cleaned = s.replace(/[^\d]/g, '');
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

  const mrpValue = pkg.price ? parseINR(pkg.price) : 0;
  const dealValue = pkg.oldPrice ? parseINR(pkg.oldPrice) : 0;

  // The actual displayed price is oldPrice (the deal); the crossed-out price is price (the MRP)
  const displayPrice = dealValue > 0 ? dealValue.toLocaleString('en-IN') : (mrpValue > 0 ? mrpValue.toLocaleString('en-IN') : '');
  const crossedOutPrice = dealValue > 0 && mrpValue > dealValue ? mrpValue.toLocaleString('en-IN') : '';
  const discountAmount = dealValue > 0 && mrpValue > dealValue ? (mrpValue - dealValue).toLocaleString('en-IN') : '';
  
  // Flag state: if the scraper pulled a known fallback (like INR 2), we treat it as no price
  const isFallbackPrice = dealValue === 2 || mrpValue === 2 || dealValue === 24750;
  const showPrice = displayPrice && !isFallbackPrice;

  return (
    <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-shadow duration-300 overflow-hidden flex flex-col relative w-full h-full group/card">
      
      {/* ── Image Area ── */}
      <div className="relative h-[220px] w-full overflow-hidden shrink-0 group block bg-gray-200">
        <Link href={`/packages/${pkg.slug}`} className="block w-full h-full relative" tabIndex={-1}>
          
          {/* Diagonal Two-Photo Collage */}
          {pkg.image2 ? (
            <>
              <Image
                src={pkg.image2}
                alt={`${pkg.title} - image 2`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
              <div 
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: "polygon(0 0, 70% 0, 35% 100%, 0 100%)" }}
              >
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              {/* White divider line between the two images */}
              <div 
                className="absolute inset-0 w-[4px] bg-white h-[150%] origin-bottom-left"
                style={{ transform: "rotate(24.5deg) translate(-28%, -15%)" }} 
              />
            </>
          ) : (
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Dark gradient overlay at the bottom third */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

          {/* Corner Ribbon Badge (Brand Orange) */}
          <div className="absolute top-0 left-0">
             <div className="w-10 h-10 bg-brand-orange rounded-br-full flex items-start justify-start pt-1.5 pl-1.5 shadow-md">
               <span className="text-white text-[10px] font-bold tracking-tight">MQT</span>
             </div>
          </div>

          {/* Overlay text: Title and Duration pill */}
          <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end">
             <h3 className="text-white text-lg font-bold leading-tight drop-shadow-md mb-2 line-clamp-1">{pkg.title}</h3>
             <div className="inline-flex">
                <span className="bg-brand-orange text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-sm">
                   {durationPill}
                </span>
             </div>
          </div>

        </Link>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-grow flex flex-col pt-4 pb-0 px-0">
        <div className="px-4">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <Link href={`/packages/${pkg.slug}`}>
              <h4 className="text-[15px] font-bold text-legacy-nav-blue hover:text-legacy-orange transition-colors line-clamp-2 leading-snug">
                {pkg.title}
              </h4>
            </Link>
            {pkg.rating && (
              <div className="flex items-center gap-0.5 mt-0.5 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-bold text-gray-700">{pkg.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center text-[12px] text-gray-600 mb-3">
            <span className="w-1.5 h-1.5 rounded-full border border-legacy-orange flex items-center justify-center mr-2">
               <span className="w-1 h-1 bg-legacy-orange rounded-full"></span>
            </span>
            Multi-day tours available
          </div>

          {/* Route line with Map Pin */}
          <div className="flex items-start text-[12px] text-gray-700 mb-4">
            <MapPin strokeWidth={2} className="w-4 h-4 mr-1.5 text-brand-orange shrink-0 mt-[1px]" />
            <span className="line-clamp-2 leading-relaxed">
               {pkg.route ? pkg.route : <span className="italic text-gray-500">Route details on request</span>}
            </span>
          </div>

          {/* Amenity Icons Row (Exactly 4 icons) */}
          <div className="flex justify-between items-center pt-2 pb-4">
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover/card:text-brand-orange transition-colors duration-300">
              <BedDouble strokeWidth={1.5} className="w-6 h-6 mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Hotel Stay</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover/card:text-brand-orange transition-colors duration-300">
              <Utensils strokeWidth={1.5} className="w-6 h-6 mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Meals</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover/card:text-brand-orange transition-colors duration-300">
              <CarFront strokeWidth={1.5} className="w-6 h-6 mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Transfers</span>
            </div>
            <div className="flex flex-col items-center justify-center text-gray-400 group-hover/card:text-brand-orange transition-colors duration-300">
              <Navigation strokeWidth={1.5} className="w-6 h-6 mb-1" />
              <span className="text-[10px] text-gray-500 font-medium">Sightseeing</span>
            </div>
          </div>
        </div>

        {/* ── Price Block ── */}
        <div className="bg-[#f8f9fa] px-4 py-3 text-center border-t border-gray-100 mt-auto flex flex-col items-center">
           <div className="h-5 flex items-center justify-center mb-1">
             {showPrice && crossedOutPrice ? (
               <div className="flex items-center gap-2">
                 <span className="bg-[#4CAF50] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                   INR {discountAmount} off
                 </span>
                 <span className="text-[12px] text-gray-400 line-through font-medium">INR {crossedOutPrice}</span>
               </div>
             ) : (
                <div className="h-5"></div>
             )}
           </div>
           
           <div className="text-2xl font-bold text-gray-800 leading-none mb-1">
             {showPrice ? (
                <span>INR {displayPrice}</span>
             ) : (
                <span className="text-xl text-brand-orange font-bold">Pricing on request</span>
             )}
           </div>
           
           <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Starting price per person</div>
        </div>

        {/* ── CTA Buttons ── */}
        <div className="flex w-full border-t border-gray-100">
          <Link 
            href={`/packages/${pkg.slug}#enquiry`}
            className="w-1/2 flex items-center justify-center text-gray-600 text-[13px] font-bold bg-white hover:bg-gray-50 hover:text-gray-900 py-3 transition-colors border-r border-gray-100"
          >
            Quick enquiry
          </Link>
          <Link 
            href={`/packages/${pkg.slug}`}
            className="w-1/2 flex items-center justify-center text-white text-[13px] font-bold bg-brand-orange hover:bg-[#e0501a] py-3 transition-colors"
          >
            View Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
