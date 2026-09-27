import { himachalPradeshArtwork, uttarakhandArtwork, type StateArtwork } from "./stateArtwork";

export interface ExplorerPlace {
  name: string;
  image: string;
  themes: string[];
}

export interface ExplorerMapMarker {
  name: string;
  slug: string;
  tagline?: string;
  latitude: number;
  longitude: number;
  priority: number;
  mobilePriority?: number;
  labelDirection?: "left" | "right" | "above" | "below";
  coordinateSource?: string;
  coordVerified?: boolean;
}

export interface GeographyAsset {
  mapAsset: string;
  boundarySource: string;
  boundaryVersion: string;
  lastVerified: string;
  boundaryLevel: "state" | "district";
  districtCount?: number;
}

export interface ExplorerProfile {
  eyebrow: string;
  tagline: string;
  description: string;
  bestTime: string;
  themes: string[];
  places: ExplorerPlace[];
  mapMarkers?: ExplorerMapMarker[];
  artwork?: StateArtwork;
  geography?: GeographyAsset;
}

// This is the single source of destination-explorer identity data. Package
// counts and starting prices deliberately remain derived from the catalogue.
export const destinationExplorerProfiles: Record<string, ExplorerProfile> = {
  uttarakhand: {
    artwork: uttarakhandArtwork,
    eyebrow: "Devbhoomi",
    tagline: "Sacred rivers, high trails and quiet Himalayan towns.",
    description: "Follow the Ganga from its spiritual gateways to mountain temples, forest stays and high-altitude views.",
    bestTime: "Mar–Jun · Sep–Nov",
    themes: ["Pilgrimage", "Mountains", "Adventure", "Wildlife", "Weekend"],
    geography: {
      mapAsset: "/images/maps/uttarakhand-soi-2026.webp",
      boundarySource: "Survey of India",
      boundaryVersion: "Uttarakhand English, 1st edition 2026, 1:500,000",
      lastVerified: "2026-09-20",
      boundaryLevel: "state",
      districtCount: 13,
    },
    mapMarkers: [
      // WGS84 destination coordinates; see docs/qa/uttarakhand-artwork.md.
      { name: "Gangotri", slug: "gangotri", latitude: 30.994, longitude: 78.941, priority: 7, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Yamunotri", slug: "yamunotri", latitude: 31.01, longitude: 78.45, priority: 9, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Badrinath", slug: "badrinath", latitude: 30.744, longitude: 79.493, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Joshimath", slug: "joshimath", latitude: 30.555, longitude: 79.565, priority: 13, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kedarnath", slug: "kedarnath", latitude: 30.73, longitude: 79.07, priority: 3, mobilePriority: 3, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Auli", slug: "auli", latitude: 30.52892, longitude: 79.57026, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Chopta", slug: "chopta", latitude: 30.3461908, longitude: 79.0485059, priority: 12, labelDirection: "below", coordVerified: true, coordinateSource: "Nominatim: Chopta, Rudraprayag" },
      { name: "Mussoorie", slug: "mussoorie", latitude: 30.45, longitude: 78.08, priority: 6, mobilePriority: 6, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Dehradun", slug: "dehradun", latitude: 30.345, longitude: 78.029, priority: 11, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Rishikesh", slug: "rishikesh", latitude: 30.10833333, longitude: 78.29722222, priority: 1, mobilePriority: 1, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Haridwar", slug: "haridwar", latitude: 29.945, longitude: 78.163, priority: 8, labelDirection: "below", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ranikhet", slug: "ranikhet", latitude: 29.65, longitude: 79.42, priority: 14, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Almora", slug: "almora", latitude: 29.5971, longitude: 79.6591, priority: 10, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Nainital", slug: "nainital", latitude: 29.39194444, longitude: 79.45416667, priority: 4, mobilePriority: 4, labelDirection: "below", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pithoragarh", slug: "pithoragarh", latitude: 29.58, longitude: 80.22, priority: 15, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    places: [
      { name: "Rishikesh", image: "/images/packages/hi-rishikesh.webp", themes: ["Adventure", "Wellness"] },
      { name: "Auli", image: "/images/packages/hi-auli.webp", themes: ["Mountains", "Snow"] },
      { name: "Nainital", image: "/images/packages/hi-nainital.webp", themes: ["Lakes", "Family"] },
      { name: "Mussoorie", image: "/images/packages/hi-mussoorie.webp", themes: ["Mountains", "Weekend"] },
      { name: "Haridwar", image: "/images/packages/hi-haridwar.webp", themes: ["Pilgrimage", "Culture"] },
    ],
  },
  "himachal-pradesh": {
    artwork: himachalPradeshArtwork,
    eyebrow: "Himalayan escapes",
    tagline: "Slow roads, cedar valleys and snow-framed stays.",
    description: "Choose between familiar mountain towns, high valleys and quiet routes that make Himachal a year-round escape.",
    bestTime: "Mar–Jun · Oct–Feb",
    themes: ["Mountains", "Adventure", "Honeymoon"],
    geography: {
      mapAsset: "/images/maps/uttarakhand-soi-2026.webp",
      boundarySource: "Survey of India",
      boundaryVersion: "Administrative Boundary Data Base, 2026",
      lastVerified: "2026-09-23",
      boundaryLevel: "state",
      districtCount: 12,
    },
    mapMarkers: [
      { name: "Manali", tagline: "Valley of the Gods", slug: "manali", latitude: 32.2432, longitude: 77.1892, priority: 1, mobilePriority: 1, labelDirection: "below", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Shimla", tagline: "Queen of Hills", slug: "shimla", latitude: 31.1048, longitude: 77.1734, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Dharamshala", tagline: "Himalayan calm", slug: "dharamshala", latitude: 32.219, longitude: 76.3234, priority: 3, mobilePriority: 3, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Dalhousie", tagline: "Cedar escapes", slug: "dalhousie", latitude: 32.5387, longitude: 75.9700, priority: 4, mobilePriority: 4, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kullu", slug: "kullu", latitude: 31.9579, longitude: 77.1095, priority: 5, mobilePriority: 5, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kasauli", slug: "kasauli", latitude: 30.8986, longitude: 76.9659, priority: 6, mobilePriority: 6, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Khajjiar", slug: "khajjiar", latitude: 32.5539, longitude: 76.0666, priority: 7, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "McLeod Ganj", slug: "mcleodganj", latitude: 32.2426, longitude: 76.3212, priority: 8, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Spiti", slug: "spiti", latitude: 32.2267, longitude: 78.0719, priority: 9, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Manikaran", slug: "manikaran", latitude: 32.0260, longitude: 77.3430, priority: 10, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    places: [
      { name: "Manali", image: "/images/location-library/manali-himachal-pradesh-india/manali-himachal-pradesh-india-03-lg.webp", themes: ["Mountains", "Adventure"] },
      { name: "Shimla", image: "/images/location-library/shimla-himachal-pradesh-india/shimla-himachal-pradesh-india-02-lg.webp", themes: ["Heritage", "Family"] },
      { name: "Kasauli", image: "/images/location-library/kasauli-himachal-pradesh-india/kasauli-himachal-pradesh-india-01-lg.webp", themes: ["Weekend", "Mountains"] },
    ],
  },
  "uttar-pradesh": { eyebrow: "Living heritage", tagline: "River cities, temples and monuments that shaped India's story.", description: "Move through sacred ghats, Mughal landmarks and pilgrimage towns with routes built around history and devotion.", bestTime: "Oct–Mar", themes: ["Heritage", "Pilgrimage", "Family", "Culture", "Weekend"], places: [{ name: "Agra", image: "/images/location-library/agra-uttar-pradesh-india/agra-uttar-pradesh-india-01-lg.webp", themes: ["Heritage", "Monuments"] }, { name: "Varanasi", image: "/images/location-library/varanasi-uttar-pradesh-india/varanasi-uttar-pradesh-india-01-lg.webp", themes: ["Pilgrimage", "River"] }, { name: "Ayodhya", image: "/images/location-library/ayodhya-uttar-pradesh-india/ayodhya-uttar-pradesh-india-01-lg.webp", themes: ["Temples", "Family"] }] },
  rajasthan: { eyebrow: "Royal Rajasthan", tagline: "Fort cities, desert horizons and stories after sundown.", description: "Build a journey around palace cities, living heritage, desert camps and wildlife country.", bestTime: "Oct–Mar", themes: ["Heritage", "Desert", "Wildlife", "Family", "Luxury"], places: [{ name: "Jaipur", image: "/images/location-library/jaipur-rajasthan-india/jaipur-rajasthan-india-01-lg.webp", themes: ["Heritage", "Culture"] }, { name: "Udaipur", image: "/images/location-library/udaipur-rajasthan-india/udaipur-rajasthan-india-01-lg.webp", themes: ["Lakes", "Romance"] }, { name: "Jaisalmer", image: "/images/location-library/jaisalmer-rajasthan-india/jaisalmer-rajasthan-india-01-lg.webp", themes: ["Desert", "Adventure"] }] },
  kerala: { eyebrow: "God's own country", tagline: "Backwaters, tea hills and coastlines with room to breathe.", description: "Move from cool plantations to spice country and water-bound villages at an unhurried pace.", bestTime: "Sep–Mar", themes: ["Backwaters", "Honeymoon", "Wellness", "Beaches", "Family"], places: [{ name: "Munnar", image: "/images/location-library/munnar-kerala-india/munnar-kerala-india-01-lg.webp", themes: ["Hills", "Tea country"] }, { name: "Kochi", image: "/images/location-library/kochi-kerala-india/kochi-kerala-india-01-lg.webp", themes: ["Culture", "Coast"] }, { name: "Alleppey", image: "/images/location-library/alleppey-kerala-india/alleppey-kerala-india-01-lg.webp", themes: ["Backwaters", "Houseboats"] }] },
  goa: { eyebrow: "Coastal Goa", tagline: "Beach days, old quarters and the easy rhythm of the coast.", description: "Find the right balance of shoreline, heritage streets, food and time to simply slow down.", bestTime: "Nov–Feb", themes: ["Beaches", "Honeymoon", "Family", "Weekend", "Culture"], places: [{ name: "North Goa", image: "/images/location-library/north-goa-goa-india/north-goa-goa-india-01-lg.webp", themes: ["Beaches", "Nightlife"] }, { name: "South Goa", image: "/images/location-library/goa-india/goa-india-01-lg.webp", themes: ["Beaches", "Leisure"] }, { name: "Panaji", image: "/images/location-library/goa-india/goa-india-04-lg.webp", themes: ["Culture", "Food"] }] },
  ladakh: { eyebrow: "High Himalaya", tagline: "Monasteries, high passes and landscapes that reset your scale.", description: "Plan for acclimatisation and allow the roads, lakes and monasteries to set the pace.", bestTime: "May–Sep", themes: ["Adventure", "Road trip", "Monasteries", "Nature", "Photography"], places: [{ name: "Leh", image: "/images/location-library/leh-jammu-and-kashmir-india/leh-jammu-and-kashmir-india-01-lg.webp", themes: ["Culture", "Monasteries"] }, { name: "Nubra Valley", image: "/images/location-library/ladakh-india/ladakh-india-02-lg.webp", themes: ["Adventure", "Nature"] }, { name: "Pangong", image: "/images/location-library/ladakh-india/ladakh-india-03-lg.webp", themes: ["Lakes", "Photography"] }] },
};
