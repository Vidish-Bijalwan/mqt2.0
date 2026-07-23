import { Package } from "@/data/allPackages";

// Pre-defined mapping of destinations to high-quality fallback images
// We use some existing images in the public folder as fallbacks
const DESTINATION_FALLBACKS: Record<string, string> = {
  "himachal-pradesh": "/images/blog/adventure-sports-in-manali-shimla.webp",
  "uttarakhand": "/images/blog/glaciers-in-uttarakhand.jpg",
  "kashmir": "/images/blog/kashmir-places-to-visit.jpg",
  "kerala": "/images/blog/waterfalls-in-kerala.webp",
  "goa": "/images/blog/places-to-visit-in-goa.jpg",
  "rajasthan": "/images/blog/travel-theme__food.jpg",
  "maharashtra": "/images/blog/hotels-in-matheran.webp",
  "gujarat": "/images/blog/stepwells-in-gujarat.jpg",
  "uttar-pradesh": "/images/blog/agra.jpg",
  "tamil-nadu": "/images/blog/places-to-visit-in-chennai.jpg",
  "karnataka": "/images/blog/best-night-clubs-in-bangalore.jpg",
  "madhya-pradesh": "/images/blog/delhi-to-ujjain-trip.webp",
  "sikkim": "/images/blog/festivals-in-sikkim.jpg",
  "darjeeling": "/images/blog/darjeeling-kalimpong-gangtok.jpg",
  "assam": "/images/blog/wildlife-sanctuaries-in-assam.webp"
};

// Generic ultimate fallback if everything else fails (no helicopter!)
const ULTIMATE_FALLBACK = "/images/hero/hero-bg-2.jpg"; 

/**
 * Smart image mapping system to resolve the best possible image for a package.
 */
export function getPackageImage(pkg: Package, destSlug?: string): string {
  // 1. Check if the package has a valid specific image URL 
  if (pkg.image && pkg.image !== "") {
    return pkg.image;
  }

  // 2. Derive destination from route or title if not explicitly provided
  let destination = destSlug || "";
  if (!destination) {
     const titleLower = pkg.title.toLowerCase();
     const routeLower = (pkg.route || "").toLowerCase();
     
     // Simple heuristic to extract destination from title/route
     for (const key of Object.keys(DESTINATION_FALLBACKS)) {
       const rawName = key.replace("-", " ");
       if (titleLower.includes(rawName) || routeLower.includes(rawName)) {
          destination = key;
          break;
       }
     }
  }

  // 3. Look for a destination-specific fallback
  if (destination && DESTINATION_FALLBACKS[destination]) {
    return DESTINATION_FALLBACKS[destination];
  }

  // 4. Return ultimate fallback
  return ULTIMATE_FALLBACK;
}
