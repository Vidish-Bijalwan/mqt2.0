import { himachalPradeshArtwork, uttarakhandArtwork, uttarPradeshArtwork, rajasthanArtwork, keralaArtwork, goaArtwork, gujaratArtwork, maharashtraArtwork, tamilNaduArtwork, karnatakaArtwork, madhyaPradeshArtwork, assamArtwork, sikkimArtwork, ladakhArtwork, kashmirArtwork, andhraPradeshArtwork, arunachalPradeshArtwork, telanganaArtwork, westBengalArtwork, andamanNicobarArtwork, dadraNagarHaveliDamanDiuArtwork, jammuKashmirArtwork, haryanaArtwork, manipurArtwork, nagalandArtwork, type StateArtwork } from "./stateArtwork";

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
  mapAsset?: string;
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
  "uttar-pradesh": {
    artwork: uttarPradeshArtwork,
    geography: { boundarySource: "Survey of India", boundaryVersion: "Administrative Boundary Data Base, 2026", lastVerified: "2026-09-28", boundaryLevel: "state", districtCount: 75 },
    mapMarkers: [
      { name: "Agra", slug: "agra", tagline: "Taj Mahal", latitude: 27.1751, longitude: 78.0421, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Varanasi", slug: "varanasi", tagline: "Ghats & aarti", latitude: 25.3176, longitude: 82.9739, priority: 2, mobilePriority: 2, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Lucknow", slug: "lucknow", latitude: 26.8467, longitude: 80.9462, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ayodhya", slug: "ayodhya", latitude: 26.7922, longitude: 82.1998, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Mathura", slug: "mathura", latitude: 27.4924, longitude: 77.6737, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Prayagraj", slug: "prayagraj", latitude: 25.4358, longitude: 81.8463, priority: 6, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Sarnath", slug: "sarnath", latitude: 25.3811, longitude: 82.9933, priority: 7, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Living heritage", tagline: "River cities, temples and monuments that shaped India's story.", description: "Move through sacred ghats, Mughal landmarks and pilgrimage towns with routes built around history and devotion.", bestTime: "Oct–Mar", themes: ["Heritage", "Pilgrimage", "Family", "Culture", "Weekend"], places: [{ name: "Agra", image: "/images/location-library/agra-uttar-pradesh-india/agra-uttar-pradesh-india-01-lg.webp", themes: ["Heritage", "Monuments"] }, { name: "Varanasi", image: "/images/location-library/varanasi-uttar-pradesh-india/varanasi-uttar-pradesh-india-01-lg.webp", themes: ["Pilgrimage", "River"] }, { name: "Ayodhya", image: "/images/location-library/ayodhya-uttar-pradesh-india/ayodhya-uttar-pradesh-india-01-lg.webp", themes: ["Temples", "Family"] }] },
  rajasthan: {
    artwork: rajasthanArtwork,
    geography: { boundarySource: "Survey of India", boundaryVersion: "Administrative Boundary Data Base, 2026", lastVerified: "2026-09-28", boundaryLevel: "state", districtCount: 41 },
    mapMarkers: [
      { name: "Jaipur", slug: "jaipur", tagline: "Pink City", latitude: 26.9124, longitude: 75.7873, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Udaipur", slug: "udaipur", tagline: "Lake palaces", latitude: 24.5854, longitude: 73.7125, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Jaisalmer", slug: "jaisalmer", tagline: "Golden fort", latitude: 26.9157, longitude: 70.9083, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Jodhpur", slug: "jodhpur", latitude: 26.2389, longitude: 73.0243, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pushkar", slug: "pushkar", latitude: 26.4897, longitude: 74.5511, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Bikaner", slug: "bikaner", latitude: 28.0229, longitude: 73.3119, priority: 6, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ranthambore", slug: "ranthambore", latitude: 26.0173, longitude: 76.5026, priority: 7, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Royal Rajasthan", tagline: "Fort cities, desert horizons and stories after sundown.", description: "Build a journey around palace cities, living heritage, desert camps and wildlife country.", bestTime: "Oct–Mar", themes: ["Heritage", "Desert", "Wildlife", "Family", "Luxury"], places: [{ name: "Jaipur", image: "/images/location-library/hawa-mahal-jaipur/hawa-mahal-jaipur-01-lg.webp", themes: ["Heritage", "Culture"] }, { name: "Udaipur", image: "/images/location-library/udaipur-rajasthan-india/udaipur-rajasthan-india-01-lg.webp", themes: ["Lakes", "Romance"] }, { name: "Jaisalmer", image: "/images/location-library/jaisalmer-rajasthan-india/jaisalmer-rajasthan-india-01-lg.webp", themes: ["Desert", "Adventure"] }] },
  kerala: {
    artwork: keralaArtwork,
    geography: { boundarySource: "Survey of India", boundaryVersion: "Administrative Boundary Data Base, 2026", lastVerified: "2026-09-28", boundaryLevel: "state", districtCount: 14 },
    mapMarkers: [
      { name: "Kochi", slug: "kochi", tagline: "Fort Kochi", latitude: 9.9312, longitude: 76.2673, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Munnar", slug: "munnar", tagline: "Tea gardens", latitude: 10.0889, longitude: 77.0595, priority: 2, mobilePriority: 2, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Alleppey", slug: "alleppey", tagline: "Houseboats", latitude: 9.4981, longitude: 76.3388, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Thiruvananthapuram", slug: "thiruvananthapuram", latitude: 8.5241, longitude: 76.9366, priority: 4, mobilePriority: 4, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Wayanad", slug: "wayanad", latitude: 11.685, longitude: 76.132, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Thekkady", slug: "thekkady", latitude: 9.6031, longitude: 77.1615, priority: 6, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "God's own country", tagline: "Backwaters, tea hills and coastlines with room to breathe.", description: "Move from cool plantations to spice country and water-bound villages at an unhurried pace.", bestTime: "Sep–Mar", themes: ["Backwaters", "Honeymoon", "Wellness", "Beaches", "Family"], places: [{ name: "Munnar", image: "/images/location-library/munnar-kerala-india/munnar-kerala-india-01-lg.webp", themes: ["Hills", "Tea country"] }, { name: "Kochi", image: "/images/location-library/kochi-kerala-india/kochi-kerala-india-01-lg.webp", themes: ["Culture", "Coast"] }, { name: "Alleppey", image: "/images/location-library/alleppey-kerala-india/alleppey-kerala-india-01-lg.webp", themes: ["Backwaters", "Houseboats"] }] },
  goa: {
    artwork: goaArtwork,
    geography: { boundarySource: "Survey of India", boundaryVersion: "Administrative Boundary Data Base, 2026", lastVerified: "2026-09-28", boundaryLevel: "state", districtCount: 3 },
    mapMarkers: [
      { name: "Panaji", slug: "panaji", latitude: 15.4909, longitude: 73.8278, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Calangute", slug: "calangute", latitude: 15.5439, longitude: 73.7553, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Palolem", slug: "palolem", latitude: 15.01, longitude: 74.0233, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Old Goa", slug: "old-goa", latitude: 15.5007, longitude: 73.9113, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Dudhsagar", slug: "dudhsagar", latitude: 15.3144, longitude: 74.3143, priority: 5, mobilePriority: 5, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Coastal Goa", tagline: "Beach days, old quarters and the easy rhythm of the coast.", description: "Find the right balance of shoreline, heritage streets, food and time to simply slow down.", bestTime: "Nov–Feb", themes: ["Beaches", "Honeymoon", "Family", "Weekend", "Culture"], places: [{ name: "North Goa", image: "/images/location-library/north-goa-goa-india/north-goa-goa-india-01-lg.webp", themes: ["Beaches", "Nightlife"] }, { name: "South Goa", image: "/images/location-library/goa-india/goa-india-01-lg.webp", themes: ["Beaches", "Leisure"] }, { name: "Panaji", image: "/images/location-library/goa-india/goa-india-04-lg.webp", themes: ["Culture", "Food"] }] },
  ladakh: {
    artwork: ladakhArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Leh", slug: "leh", tagline: "High desert", latitude: 34.1526, longitude: 77.5771, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Nubra Valley", slug: "nubra-valley", latitude: 34.55123, longitude: 77.55065, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim: Diskit, Nubra Valley" },
      { name: "Pangong Lake", slug: "pangong-lake", latitude: 33.9456, longitude: 78.6569, priority: 3, mobilePriority: 3, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Tso Moriri", slug: "tso-moriri", latitude: 32.9113, longitude: 78.3118, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "High Himalaya", tagline: "Monasteries, high passes and landscapes that reset your scale.", description: "Plan for acclimatisation and allow the roads, lakes and monasteries to set the pace.", bestTime: "May–Sep", themes: ["Adventure", "Road trip", "Monasteries", "Nature", "Photography"], places: [{ name: "Leh", image: "/images/location-library/leh-jammu-and-kashmir-india/leh-jammu-and-kashmir-india-01-lg.webp", themes: ["Culture", "Monasteries"] }, { name: "Nubra Valley", image: "/images/location-library/ladakh-india/ladakh-india-02-lg.webp", themes: ["Adventure", "Nature"] }, { name: "Pangong", image: "/images/location-library/ladakh-india/ladakh-india-03-lg.webp", themes: ["Lakes", "Photography"] }] },
  kashmir: {
    artwork: kashmirArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Srinagar", slug: "srinagar", tagline: "Dal Lake", latitude: 34.0837, longitude: 74.7973, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Gulmarg", slug: "gulmarg", tagline: "Ski slopes", latitude: 34.0484, longitude: 74.3805, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pahalgam", slug: "pahalgam", latitude: 34.0162, longitude: 75.3152, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Sonamarg", slug: "sonamarg", latitude: 34.3057, longitude: 75.2902, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Paradise on earth", tagline: "Houseboats, meadows and Himalayan calm.", description: "Drift on Dal Lake, walk through saffron fields and pine meadows, and take the meadow towns at an unhurried pace.", bestTime: "Mar–Oct", themes: ["Mountains", "Honeymoon", "Family", "Houseboats", "Adventure"], places: [{ name: "Srinagar", image: "/images/location-library/srinagar-jammu-and-kashmir-india/srinagar-jammu-and-kashmir-india-01-lg.webp", themes: ["Lakes", "Houseboats"] }, { name: "Gulmarg", image: "/images/location-library/gulmarg-jammu-and-kashmir-india/gulmarg-jammu-and-kashmir-india-01-lg.webp", themes: ["Snow", "Skiing"] }, { name: "Pahalgam", image: "/images/packages/hi-pahalgam-tour-packages.webp", themes: ["Valleys", "Adventure"] }, { name: "Dal Lake", image: "/images/location-library/kashmir-dal-lake/kashmir-dal-lake-01-lg.webp", themes: ["Houseboats", "Sunsets"] }] },
  "gujarat": {
    // Gujarat: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: gujaratArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Ahmedabad", slug: "ahmedabad", latitude: 23.0225, longitude: 72.5714, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Dwarka", slug: "dwarka", tagline: "Sacred coast", latitude: 22.2394, longitude: 68.9678, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Somnath", slug: "somnath", latitude: 20.888, longitude: 70.4013, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Rann of Kutch", slug: "rann-of-kutch", latitude: 23.7999, longitude: 69.5041, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Gir", slug: "gir", latitude: 21.1359, longitude: 70.7965, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Vadodara", slug: "vadodara", latitude: 22.3072, longitude: 73.1812, priority: 6, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Vibrant Gujarat",
    tagline: "White deserts, sacred coasts and Asiatic lions.",
    description: "Cross the salt flats of the Rann, follow pilgrim trails along the Saurashtra coast, and track lions in Gir — Gujarat packs remarkable variety into one state.",
    bestTime: "Oct–Mar",
    themes: ["Desert", "Pilgrimage", "Wildlife", "Culture", "Family"],
    places: [
      { name: "Dwarka", image: "/images/location-library/dwarka-gujarat-india/dwarka-gujarat-india-01-lg.webp", themes: ["Pilgrimage", "Coast"] },
      { name: "Kutch", image: "/images/location-library/kutch-gujarat-india/kutch-gujarat-india-01-lg.webp", themes: ["Desert", "Crafts"] },
      { name: "Gir", image: "/images/location-library/gir-national-park-gujarat/gir-national-park-gujarat-01-lg.webp", themes: ["Wildlife", "Nature"] },
    ],
  },
  "maharashtra": {
    // Maharashtra: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: maharashtraArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Mumbai", slug: "mumbai", tagline: "Maximum city", latitude: 19.076, longitude: 72.8777, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pune", slug: "pune", latitude: 18.5204, longitude: 73.8567, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Aurangabad", slug: "aurangabad", latitude: 19.8762, longitude: 75.3433, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ajanta", slug: "ajanta", latitude: 20.5519, longitude: 75.7033, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ellora", slug: "ellora", latitude: 20.0239, longitude: 75.3451, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Nashik", slug: "nashik", latitude: 19.9975, longitude: 73.7898, priority: 6, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Mahabaleshwar", slug: "mahabaleshwar", latitude: 17.9235, longitude: 73.6586, priority: 7, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Maratha Heritage",
    tagline: "Rock-cut caves, Sahyadri forts and the buzz of Mumbai.",
    description: "Stand before 2,000-year-old cave murals, trek Deccan forts, and end in Mumbai — Maharashtra moves from ancient to electric in a single journey.",
    bestTime: "Oct–Mar",
    themes: ["Heritage", "Cities", "Hills", "Culture", "Weekend"],
    places: [
      { name: "Ajanta", image: "/images/location-library/ajanta-maharashtra-india/ajanta-maharashtra-india-01-lg.webp", themes: ["Heritage", "Art"] },
      { name: "Mumbai", image: "/images/location-library/mumbai-maharashtra-india/mumbai-maharashtra-india-01-lg.webp", themes: ["Cities", "Food"] },
      { name: "Sahyadris", image: "/images/location-library/maharashtra-india/maharashtra-india-01-lg.webp", themes: ["Hills", "Monsoon"] },
    ],
  },
  "tamil-nadu": {
    // Tamil Nadu: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: tamilNaduArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Chennai", slug: "chennai", latitude: 13.0827, longitude: 80.2707, priority: 1, mobilePriority: 1, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Madurai", slug: "madurai", tagline: "Meenakshi Temple", latitude: 9.9252, longitude: 78.1198, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ooty", slug: "ooty", tagline: "Queen of hills", latitude: 11.4102, longitude: 76.695, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kanyakumari", slug: "kanyakumari", tagline: "Southern tip", latitude: 8.0883, longitude: 77.5385, priority: 4, mobilePriority: 4, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Mahabalipuram", slug: "mahabalipuram", latitude: 12.6269, longitude: 80.1947, priority: 5, mobilePriority: 5, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Thanjavur", slug: "thanjavur", latitude: 10.787, longitude: 79.1378, priority: 6, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Rameshwaram", slug: "rameshwaram", tagline: "Island temple", latitude: 9.2876, longitude: 79.3129, priority: 7, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Temple Country",
    tagline: "Towering gopurams, hill retreats and the Coromandel coast.",
    description: "Circle the great temple cities, climb to tea-country hill stations, and finish where three seas meet — Tamil Nadu is India’s deep south at its richest.",
    bestTime: "Nov–Mar",
    themes: ["Temples", "Hills", "Culture", "Beaches", "Family"],
    places: [
      { name: "Madurai", image: "/images/location-library/madurai-tamil-nadu-india/madurai-tamil-nadu-india-01-lg.webp", themes: ["Temples", "Culture"] },
      { name: "Ooty", image: "/images/location-library/ooty-tamil-nadu-india/ooty-tamil-nadu-india-01-lg.webp", themes: ["Hills", "Tea country"] },
      { name: "Mahabalipuram", image: "/images/location-library/mahabalipuram-tamil-nadu-india/mahabalipuram-tamil-nadu-india-01-lg.webp", themes: ["Heritage", "Coast"] },
    ],
  },
  "karnataka": {
    // Karnataka: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: karnatakaArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Bengaluru", slug: "bengaluru", latitude: 12.9716, longitude: 77.5946, priority: 1, mobilePriority: 1, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Mysuru", slug: "mysuru", tagline: "Palace city", latitude: 12.2958, longitude: 76.6394, priority: 2, mobilePriority: 2, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Coorg", slug: "coorg", latitude: 12.4244, longitude: 75.7382, priority: 3, mobilePriority: 3, labelDirection: "above", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Hampi", slug: "hampi", tagline: "Ancient ruins", latitude: 15.335, longitude: 76.46, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Gokarna", slug: "gokarna", latitude: 14.5479, longitude: 74.3188, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Deccan Odyssey",
    tagline: "Hampi’s boulders, Coorg’s mist and Mysuru’s palaces.",
    description: "Wander a 14th-century capital scattered across granite hills, breathe in coffee country, and close with palace-city grandeur.",
    bestTime: "Oct–Mar",
    themes: ["Heritage", "Hills", "Wildlife", "Culture", "Weekend"],
    places: [
      { name: "Hampi", image: "/images/location-library/hospet-karnataka-india/hospet-karnataka-india-01-lg.webp", themes: ["Heritage", "Ruins"] },
      { name: "Coorg", image: "/images/location-library/coorg-karnataka-india/coorg-karnataka-india-01-lg.webp", themes: ["Hills", "Coffee"] },
      { name: "Mysuru", image: "/images/location-library/mysore-karnataka-india/mysore-karnataka-india-01-lg.webp", themes: ["Palaces", "Culture"] },
    ],
  },
  "madhya-pradesh": {
    // Madhya Pradesh: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: madhyaPradeshArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Bhopal", slug: "bhopal", latitude: 23.2599, longitude: 77.4126, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Khajuraho", slug: "khajuraho", tagline: "Temple art", latitude: 24.8318, longitude: 79.9199, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kanha", slug: "kanha", tagline: "Tiger country", latitude: 22.3345, longitude: 80.6111, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Ujjain", slug: "ujjain", latitude: 23.1765, longitude: 75.7885, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Orchha", slug: "orchha", latitude: 25.3517, longitude: 78.4279, priority: 5, mobilePriority: 5, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pachmarhi", slug: "pachmarhi", latitude: 22.4674, longitude: 78.4342, priority: 6, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Heart of India",
    tagline: "Tiger reserves, temple cities and riverside forts.",
    description: "Track tigers in Kanha and Bandhavgarh, stand before Khajuraho’s temples, and drift past Orchha’s cenotaphs — central India holds the country’s greatest concentrations of wild and ancient.",
    bestTime: "Oct–Mar",
    themes: ["Wildlife", "Heritage", "Temples", "Family", "Adventure"],
    places: [
      { name: "Khajuraho", image: "/images/location-library/khajuraho-madhya-pradesh-india/khajuraho-madhya-pradesh-india-01-lg.webp", themes: ["Temples", "Heritage"] },
      { name: "Kanha", image: "/images/location-library/kanha-national-park-madhya-pradesh-india/kanha-national-park-madhya-pradesh-india-01-lg.webp", themes: ["Wildlife", "Tigers"] },
      { name: "Orchha", image: "/images/location-library/orchha-madhya-pradesh-india/orchha-madhya-pradesh-india-01-lg.webp", themes: ["Heritage", "Rivers"] },
    ],
  },
  "assam": {
    // Assam: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: assamArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Guwahati", slug: "guwahati", latitude: 26.1445, longitude: 91.7362, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Kaziranga", slug: "kaziranga", tagline: "Rhino land", latitude: 26.5775, longitude: 93.1712, priority: 2, mobilePriority: 2, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Majuli", slug: "majuli", latitude: 27.0011, longitude: 94.1678, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Sivasagar", slug: "sivasagar", latitude: 26.9843, longitude: 94.6372, priority: 4, mobilePriority: 4, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Brahmaputra Valley",
    tagline: "Rhino grasslands, river islands and tea gardens.",
    description: "Ride out at dawn in Kaziranga, cross to the satras of Majuli island, and taste garden-fresh tea where it grows.",
    bestTime: "Nov–Apr",
    themes: ["Wildlife", "River", "Tea", "Culture", "Nature"],
    places: [
      { name: "Kaziranga", image: "/images/location-library/kaziranga-national-park-assam-india/kaziranga-national-park-assam-india-01-lg.webp", themes: ["Wildlife", "Rhinos"] },
      { name: "Majuli", image: "/images/location-library/majuli-assam-india/majuli-assam-india-01-lg.webp", themes: ["River", "Culture"] },
      { name: "Guwahati", image: "/images/location-library/guwahati-assam-india/guwahati-assam-india-01-lg.webp", themes: ["Temples", "River"] },
    ],
  },
  "sikkim": {
    // Sikkim: WGS84 destination coordinates, Nominatim-verified 2026-09-28.
    artwork: sikkimArtwork,
    geography: { boundarySource: "Natural Earth", boundaryVersion: "Admin 1 States/Provinces, 1:10m (2022)", lastVerified: "2026-09-28", boundaryLevel: "state" },
    mapMarkers: [
      { name: "Gangtok", slug: "gangtok", tagline: "Himalayan capital", latitude: 27.3389, longitude: 88.6065, priority: 1, mobilePriority: 1, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Lachung", slug: "lachung", latitude: 27.6892, longitude: 88.7416, priority: 2, mobilePriority: 2, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Pelling", slug: "pelling", latitude: 27.3169, longitude: 88.2397, priority: 3, mobilePriority: 3, labelDirection: "right", coordVerified: true, coordinateSource: "Nominatim" },
      { name: "Nathula", slug: "nathula", latitude: 27.3869, longitude: 88.8312, priority: 4, mobilePriority: 4, labelDirection: "left", coordVerified: true, coordinateSource: "Nominatim" },
    ],
    eyebrow: "Himalayan Kingdom",
    tagline: "Monasteries, rhododendron valleys and Kanchenjunga views.",
    description: "Climb from Gangtok’s markets to high valleys below the world’s third-highest peak, with monasteries and mountain lakes along the way.",
    bestTime: "Mar–Jun · Oct–Dec",
    themes: ["Mountains", "Monasteries", "Adventure", "Honeymoon", "Nature"],
    places: [
      { name: "Gangtok", image: "/images/location-library/gangtok-sikkim-india/gangtok-sikkim-india-01-lg.webp", themes: ["Towns", "Views"] },
      { name: "Lachung", image: "/images/location-library/lachung-sikkim-india/lachung-sikkim-india-01-lg.webp", themes: ["Valleys", "Flowers"] },
      { name: "Pelling", image: "/images/location-library/sikkim-india/sikkim-india-01-lg.webp", themes: ["Monasteries", "Views"] },
    ],
  },

  "andhra-pradesh": {
    artwork: andhraPradeshArtwork,
    eyebrow: "Temple country",
    tagline: "Pilgrimage towns, sacred hills and a storied coastline.",
    description: "Move between Tirupati's temple town, the port-city beaches of Visakhapatnam and the coffee hills of Araku — sacred hills on one side, the Bay of Bengal on the other.",
    bestTime: "Oct–Mar",
    themes: ["Pilgrimage", "Heritage", "Beaches", "Culture", "Family"],
    places: [
      { name: "Tirupati", image: "/images/location-library/tirupati-andhra-pradesh-india/tirupati-andhra-pradesh-india-02-lg.webp", themes: ["Temples", "Heritage"] },
      { name: "Chandragiri", image: "/images/location-library/tirupati-andhra-pradesh-india/tirupati-andhra-pradesh-india-01-lg.webp", themes: ["History", "Forts"] },
      { name: "Vijayawada", image: "/images/location-library/andhra-pradesh-india/andhra-pradesh-india-01-lg.webp", themes: ["Temples", "River"] },
    ],
  },
  "arunachal-pradesh": {
    artwork: arunachalPradeshArtwork,
    eyebrow: "The last frontier",
    tagline: "Monasteries, high passes and valleys that time kept.",
    description: "India's easternmost Himalaya — Tawang's great monastery, the road over Sela Pass and valleys where Monpa and Apatani life continues much as it always has. An Inner Line Permit is required.",
    bestTime: "Oct–Apr",
    themes: ["Mountains", "Monasteries", "Adventure", "Culture", "Nature"],
    places: [
      { name: "Tawang", image: "/images/location-library/tawang-arunachal-pradesh-india/tawang-arunachal-pradesh-india-01-lg.webp", themes: ["Monasteries", "Lakes"] },
      { name: "Sela Pass", image: "/images/location-library/tawang-arunachal-pradesh-india/tawang-arunachal-pradesh-india-02-lg.webp", themes: ["High passes", "Lakes"] },
      { name: "Mechuka", image: "/images/location-library/arunachal-pradesh-india/arunachal-pradesh-india-01-lg.webp", themes: ["Valleys", "Culture"] },
    ],
  },
  haryana: {
    artwork: haryanaArtwork,
    eyebrow: "Land of the Gita",
    tagline: "Epic battlefields and quiet green escapes.",
    description: "The land of the Mahabharata — Kurukshetra's Brahma Sarovar and Jyotisar carry that weight — with Pinjore's Mughal gardens, winter birding at Sultanpur and the Morni Hills as quieter counters.",
    bestTime: "Oct–Mar",
    themes: ["Pilgrimage", "History", "Culture", "Weekend", "Nature"],
    places: [
      { name: "Kurukshetra", image: "/images/location-library/haryana-india/haryana-india-01-lg.webp", themes: ["Pilgrimage", "History"] },
    ],
  },
  manipur: {
    artwork: manipurArtwork,
    eyebrow: "The floating lake",
    tagline: "A valley ringed by blue hills.",
    description: "Manipur moves at the pace of Loktak Lake — floating phumdi islands, Imphal's Kangla Fort and Ima Keithel women's market, and Keibul Lamjao, the sangai's last home.",
    bestTime: "Oct–Mar",
    themes: ["Lakes", "Culture", "Nature", "Heritage", "Valleys"],
    places: [
      { name: "Loktak Lake", image: "/images/location-library/manipur-india/manipur-india-01-lg.webp", themes: ["Lakes", "Nature"] },
    ],
  },
  nagaland: {
    artwork: nagalandArtwork,
    eyebrow: "Hill tribes",
    tagline: "Sixteen tribes, one green highland.",
    description: "Hill country shaped by its tribes — Kohima's war cemetery, the Hornbill Festival at Kisama and the rolling green ridges of Dzukou Valley. An Inner Line Permit is required.",
    bestTime: "Oct–May",
    themes: ["Mountains", "Culture", "Treks", "Festivals", "Adventure"],
    places: [
      { name: "Dzukou Valley", image: "/images/location-library/nagaland-india/nagaland-india-01-lg.webp", themes: ["Treks", "Valleys"] },
    ],
  },
  telangana: {
    artwork: telanganaArtwork,
    eyebrow: "Deccan heritage",
    tagline: "Forts, old cities and living craft.",
    description: "Hyderabad's old-city grandeur and Kakatiya temple country — Charminar and Golconda, Warangal's Thousand Pillar Temple and the Godavari's ghats at Bhadrachalam.",
    bestTime: "Oct–Mar",
    themes: ["Heritage", "Culture", "Cities", "Food", "Family"],
    places: [
      { name: "Hyderabad", image: "/images/location-library/hyderabad-andhra-pradesh-india/hyderabad-andhra-pradesh-india-02-lg.webp", themes: ["Heritage", "Forts"] },
      { name: "Old City", image: "/images/location-library/hyderabad-andhra-pradesh-india/hyderabad-andhra-pradesh-india-01-lg.webp", themes: ["Culture", "Bazaars"] },
    ],
  },
  "west-bengal": {
    artwork: westBengalArtwork,
    eyebrow: "City of joy and beyond",
    tagline: "From Howrah Bridge to Himalayan tea.",
    description: "A continent in one state — Kolkata's colonial streets, the Darjeeling Himalaya, the Sundarbans' mangrove waterways and Shantiniketan's artistic soul.",
    bestTime: "Oct–Mar",
    themes: ["Cities", "Mountains", "Culture", "Nature", "Heritage"],
    places: [
      { name: "Kolkata", image: "/images/location-library/kolkata-west-bengal-india/kolkata-west-bengal-india-01-lg.webp", themes: ["Cities", "Culture"] },
      { name: "Darjeeling", image: "/images/location-library/darjeeling-west-bengal-india/darjeeling-west-bengal-india-01-lg.webp", themes: ["Mountains", "Tea country"] },
      { name: "Howrah Bridge", image: "/images/location-library/west-bengal-india/west-bengal-india-01-lg.webp", themes: ["Landmarks", "Rivers"] },
    ],
  },
  "andaman-and-nicobar-islands": {
    artwork: andamanNicobarArtwork,
    eyebrow: "Island time",
    tagline: "White sand, clear water, deep history.",
    description: "An archipelago in the Bay of Bengal — Radhanagar's famous beach, dive reefs off Havelock and the Cellular Jail's sobering history in Port Blair.",
    bestTime: "Nov–Apr",
    themes: ["Beaches", "Diving", "History", "Honeymoon", "Nature"],
    places: [
      { name: "Havelock Island", image: "/images/location-library/havelock-island-andaman-and-nicobar-islands-india/havelock-island-andaman-and-nicobar-islands-india-03-lg.webp", themes: ["Beaches", "Diving"] },
      { name: "Neil Island", image: "/images/location-library/neil-island-andaman-and-nicobar-islands-india/neil-island-andaman-and-nicobar-islands-india-01-lg.webp", themes: ["Beaches", "Nature"] },
      { name: "Port Blair", image: "/images/location-library/port-blair-andaman-and-nicobar-islands-india/port-blair-andaman-and-nicobar-islands-india-01-lg.webp", themes: ["History", "Towns"] },
    ],
  },
  "dadra-and-nagar-haveli-and-daman-and-diu": {
    artwork: dadraNagarHaveliDamanDiuArtwork,
    eyebrow: "Portuguese coast",
    tagline: "Sea forts, old churches and quiet beaches.",
    description: "Two coasts in one territory — Diu and Daman's Portuguese forts and churches on the Arabian Sea, and the forested tribal heartland around Silvassa.",
    bestTime: "Oct–Mar",
    themes: ["Heritage", "Beaches", "Forts", "Culture", "Weekend"],
    places: [
      { name: "Diu", image: "/images/location-library/diu-gujarat-india/diu-gujarat-india-03-lg.webp", themes: ["Forts", "Heritage"] },
      { name: "St. Paul's Church", image: "/images/location-library/diu-gujarat-india/diu-gujarat-india-01-lg.webp", themes: ["Churches", "History"] },
    ],
  },
  "jammu-and-kashmir": {
    artwork: jammuKashmirArtwork,
    eyebrow: "Two regions, one territory",
    tagline: "Jammu's temples and the road to the valley.",
    description: "A union territory of two regions — Dogra Jammu's temples and the Vaishno Devi pilgrimage in the Trikuta hills, with the Kashmir Valley beyond. For the valley in depth, see our Kashmir guide.",
    bestTime: "Mar–Oct",
    themes: ["Pilgrimage", "Mountains", "Culture", "Adventure", "Family"],
    places: [
      { name: "Katra", image: "/images/location-library/katra-jammu-and-kashmir-india/katra-jammu-and-kashmir-india-01-lg.webp", themes: ["Pilgrimage", "Towns"] },
      { name: "Vaishno Devi", image: "/images/location-library/vaishno-devi-temple-katra/vaishno-devi-temple-katra-01-lg.webp", themes: ["Pilgrimage", "Mountains"] },
    ],
  },
};
