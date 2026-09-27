/**
 * Non-shipping preparation data for the illustrated state-map rollout.
 * A state is promoted to StateSilhouetteHero only after district geometry,
 * coordinates, imagery, and responsive QA are all verified.
 */
export type MapCategory = "pilgrimage" | "mountains" | "adventure" | "wildlife" | "weekend" | "heritage" | "lakes" | "honeymoon";

export interface RolloutLocation {
  name: string;
  slug: string;
  tagline: string;
  latitude: number;
  longitude: number;
  categories: MapCategory[];
  image: string;
  coordVerified: false;
}

export interface PendingStateMapConfig {
  status: "in-progress";
  districtTarget: number;
  /** Generated from the SOI District Boundary archive; never from sub-district data. */
  districtGeometry: { asset: string; source: "Survey of India Administrative Boundary Database"; tolerancePx: 0.15 };
  /** Location photography is prepared, but no state is released before the per-district mosaic is reviewed. */
  imageryPrepared: true;
  mosaicVerified: false;
  locations: RolloutLocation[];
}

const image = (place: string, state: string, sequence = "01") =>
  `/images/location-library/${place}-${state}-india/${place}-${state}-india-${sequence}-lg.webp`;

export const pendingStateMapConfigs: Record<string, PendingStateMapConfig> = {
  "uttar-pradesh": {
    status: "in-progress", districtTarget: 75,
    districtGeometry: { asset: "src/data/geography/uttar-pradesh.districts.json", source: "Survey of India Administrative Boundary Database", tolerancePx: 0.15 },
    imageryPrepared: true, mosaicVerified: false,
    locations: [
      { name: "Agra", slug: "agra", tagline: "The Taj City", latitude: 27.1767, longitude: 78.0081, categories: ["heritage", "weekend"], image: image("agra", "uttar-pradesh"), coordVerified: false },
      { name: "Varanasi", slug: "varanasi", tagline: "Eternal Ganga", latitude: 25.3176, longitude: 82.9739, categories: ["pilgrimage", "heritage"], image: image("varanasi", "uttar-pradesh"), coordVerified: false },
      { name: "Ayodhya", slug: "ayodhya", tagline: "City of Ram", latitude: 26.7991, longitude: 82.2040, categories: ["pilgrimage", "heritage"], image: image("ayodhya", "uttar-pradesh"), coordVerified: false },
      { name: "Lucknow", slug: "lucknow", tagline: "Nawabi grace", latitude: 26.8467, longitude: 80.9462, categories: ["heritage", "weekend"], image: image("lucknow", "uttar-pradesh"), coordVerified: false },
    ],
  },
  rajasthan: {
    status: "in-progress", districtTarget: 41,
    districtGeometry: { asset: "src/data/geography/rajasthan.districts.json", source: "Survey of India Administrative Boundary Database", tolerancePx: 0.15 },
    imageryPrepared: true, mosaicVerified: false,
    locations: [
      { name: "Jaipur", slug: "jaipur", tagline: "The Pink City", latitude: 26.9124, longitude: 75.7873, categories: ["heritage", "weekend"], image: image("jaipur", "rajasthan"), coordVerified: false },
      { name: "Udaipur", slug: "udaipur", tagline: "City of Lakes", latitude: 24.5854, longitude: 73.7125, categories: ["lakes", "honeymoon"], image: image("udaipur", "rajasthan"), coordVerified: false },
      { name: "Jaisalmer", slug: "jaisalmer", tagline: "Golden desert", latitude: 26.9157, longitude: 70.9083, categories: ["heritage", "adventure"], image: image("jaisalmer", "rajasthan"), coordVerified: false },
    ],
  },
  kerala: {
    status: "in-progress", districtTarget: 14,
    districtGeometry: { asset: "src/data/geography/kerala.districts.json", source: "Survey of India Administrative Boundary Database", tolerancePx: 0.15 },
    imageryPrepared: true, mosaicVerified: false,
    locations: [
      { name: "Munnar", slug: "munnar", tagline: "Tea-country hills", latitude: 10.0889, longitude: 77.0595, categories: ["mountains", "honeymoon"], image: image("munnar", "kerala"), coordVerified: false },
      { name: "Kochi", slug: "kochi", tagline: "Harbour heritage", latitude: 9.9312, longitude: 76.2673, categories: ["heritage", "weekend"], image: image("kochi", "kerala"), coordVerified: false },
      { name: "Alleppey", slug: "alleppey", tagline: "Backwater calm", latitude: 9.4981, longitude: 76.3388, categories: ["lakes", "honeymoon"], image: image("alleppey", "kerala"), coordVerified: false },
    ],
  },
  goa: {
    status: "in-progress", districtTarget: 3,
    districtGeometry: { asset: "src/data/geography/goa.districts.json", source: "Survey of India Administrative Boundary Database", tolerancePx: 0.15 },
    imageryPrepared: true, mosaicVerified: false,
    locations: [
      { name: "North Goa", slug: "north-goa", tagline: "Beachside energy", latitude: 15.5900, longitude: 73.8100, categories: ["weekend", "honeymoon"], image: image("north-goa", "goa"), coordVerified: false },
      { name: "Panaji", slug: "panaji", tagline: "Riverside capital", latitude: 15.4909, longitude: 73.8278, categories: ["heritage", "weekend"], image: "/images/location-library/goa-india/goa-india-04-lg.webp", coordVerified: false },
      { name: "South Goa", slug: "south-goa", tagline: "Quiet coastline", latitude: 15.1394, longitude: 73.9950, categories: ["honeymoon", "weekend"], image: "/images/location-library/goa-india/goa-india-01-lg.webp", coordVerified: false },
    ],
  },
};
