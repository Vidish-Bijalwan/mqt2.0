import { uttarakhandArtwork, type StateArtwork } from "./stateArtwork";

export interface ExplorerPlace {
  name: string;
  image: string;
  themes: string[];
}

export interface ExplorerMapMarker {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  priority: number;
  mobilePriority?: number;
  labelDirection?: "left" | "right" | "above" | "below";
  coordinateSource?: string;
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
      { name: "Gangotri", slug: "gangotri", latitude: 30.994, longitude: 78.941, priority: 7, labelDirection: "above" },
      { name: "Yamunotri", slug: "yamunotri", latitude: 31.01, longitude: 78.45, priority: 9, labelDirection: "left" },
      { name: "Badrinath", slug: "badrinath", latitude: 30.744, longitude: 79.493, priority: 5, mobilePriority: 5, labelDirection: "right" },
      { name: "Joshimath", slug: "joshimath", latitude: 30.555, longitude: 79.565, priority: 13, labelDirection: "right" },
      { name: "Kedarnath", slug: "kedarnath", latitude: 30.73, longitude: 79.07, priority: 3, mobilePriority: 3, labelDirection: "left" },
      { name: "Auli", slug: "auli", latitude: 30.52892, longitude: 79.57026, priority: 2, mobilePriority: 2, labelDirection: "right" },
      { name: "Chopta", slug: "chopta", latitude: 30.3461908, longitude: 79.0485059, priority: 12, labelDirection: "below", coordinateSource: "https://uttarakhandtourism.gov.in/destination/chopta" },
      { name: "Mussoorie", slug: "mussoorie", latitude: 30.45, longitude: 78.08, priority: 6, mobilePriority: 6, labelDirection: "left" },
      { name: "Dehradun", slug: "dehradun", latitude: 30.345, longitude: 78.029, priority: 11, labelDirection: "left" },
      { name: "Rishikesh", slug: "rishikesh", latitude: 30.10833333, longitude: 78.29722222, priority: 1, mobilePriority: 1, labelDirection: "right" },
      { name: "Haridwar", slug: "haridwar", latitude: 29.945, longitude: 78.163, priority: 8, labelDirection: "left" },
      { name: "Ranikhet", slug: "ranikhet", latitude: 29.65, longitude: 79.42, priority: 14, labelDirection: "left" },
      { name: "Almora", slug: "almora", latitude: 29.5971, longitude: 79.6591, priority: 10, labelDirection: "right" },
      { name: "Nainital", slug: "nainital", latitude: 29.39194444, longitude: 79.45416667, priority: 4, mobilePriority: 4, labelDirection: "below" },
      { name: "Pithoragarh", slug: "pithoragarh", latitude: 29.58, longitude: 80.22, priority: 15, labelDirection: "right" },
    ],
    places: [
      { name: "Rishikesh", image: "/images/packages/hi-rishikesh.webp", themes: ["Adventure", "Wellness"] },
      { name: "Auli", image: "/images/packages/hi-auli.webp", themes: ["Mountains", "Snow"] },
      { name: "Nainital", image: "/images/packages/hi-nainital.webp", themes: ["Lakes", "Family"] },
      { name: "Mussoorie", image: "/images/packages/hi-mussoorie.webp", themes: ["Mountains", "Weekend"] },
      { name: "Haridwar", image: "/images/packages/hi-haridwar.webp", themes: ["Pilgrimage", "Culture"] },
    ],
  },
  "himachal-pradesh": { eyebrow: "Himalayan escapes", tagline: "Slow roads, cedar valleys and snow-framed stays.", description: "Choose between familiar mountain towns, high valleys and quiet routes that make Himachal a year-round escape.", bestTime: "Mar–Jun · Oct–Feb", themes: ["Mountains", "Adventure", "Honeymoon", "Snow", "Road trip"], places: [{ name: "Manali", image: "/images/packages/hi-manali.webp", themes: ["Snow", "Adventure"] }, { name: "Shimla", image: "/images/packages/hi-shimla.webp", themes: ["Heritage", "Family"] }, { name: "Kasauli", image: "/images/packages/hi-kasauli-tour-packages.webp", themes: ["Weekend", "Mountains"] }] },
  rajasthan: { eyebrow: "Royal Rajasthan", tagline: "Fort cities, desert horizons and stories after sundown.", description: "Build a journey around palace cities, living heritage, desert camps and wildlife country.", bestTime: "Oct–Mar", themes: ["Heritage", "Desert", "Wildlife", "Family", "Luxury"], places: [{ name: "Jaipur", image: "/images/packages/hi-jaipur.webp", themes: ["Heritage", "Culture"] }, { name: "Udaipur", image: "/images/packages/hi-udaipur-tour-packages.webp", themes: ["Lakes", "Romance"] }, { name: "Jaisalmer", image: "/images/packages/hi-rajasthan-safari-tour.webp", themes: ["Desert", "Adventure"] }] },
  kerala: { eyebrow: "God's own country", tagline: "Backwaters, tea hills and coastlines with room to breathe.", description: "Move from cool plantations to spice country and water-bound villages at an unhurried pace.", bestTime: "Sep–Mar", themes: ["Backwaters", "Honeymoon", "Wellness", "Beaches", "Family"], places: [{ name: "Munnar", image: "/images/packages/hi-munnar-tour-packages.webp", themes: ["Hills", "Tea country"] }, { name: "Kochi", image: "/images/packages/hi-kochi-tour-packages.webp", themes: ["Culture", "Coast"] }, { name: "Alleppey", image: "/images/packages/hi-munnar-alleppey-tour-package.webp", themes: ["Backwaters", "Houseboats"] }] },
  goa: { eyebrow: "Coastal Goa", tagline: "Beach days, old quarters and the easy rhythm of the coast.", description: "Find the right balance of shoreline, heritage streets, food and time to simply slow down.", bestTime: "Nov–Feb", themes: ["Beaches", "Honeymoon", "Family", "Weekend", "Culture"], places: [{ name: "North Goa", image: "/images/packages/hi-goa-tour-packages.webp", themes: ["Beaches", "Nightlife"] }, { name: "South Goa", image: "/images/packages/hi-goa.webp", themes: ["Beaches", "Leisure"] }, { name: "Panaji", image: "/images/packages/hi-goa-weekend-trip.webp", themes: ["Culture", "Food"] }] },
  ladakh: { eyebrow: "High Himalaya", tagline: "Monasteries, high passes and landscapes that reset your scale.", description: "Plan for acclimatisation and allow the roads, lakes and monasteries to set the pace.", bestTime: "May–Sep", themes: ["Adventure", "Road trip", "Monasteries", "Nature", "Photography"], places: [{ name: "Leh", image: "/images/packages/ladakh.jpg", themes: ["Culture", "Monasteries"] }, { name: "Nubra Valley", image: "/images/packages/ladakh-tourist-places.jpg", themes: ["Adventure", "Nature"] }, { name: "Pangong", image: "/images/packages/ladakh-tour-packages.jpg", themes: ["Lakes", "Photography"] }] },
};
