import uttarakhandGeometry from "./geography/uttarakhand.json";
import himachalPradeshGeometry from "./geography/himachal-pradesh.json";
import uttarakhandDistrictGeometry from "./geography/uttarakhand.districts.json";
import himachalPradeshDistrictGeometry from "./geography/himachal-pradesh.districts.json";
import uttarPradeshGeometry from "./geography/uttar-pradesh.json";
import rajasthanGeometry from "./geography/rajasthan.json";
import keralaGeometry from "./geography/kerala.json";
import goaGeometry from "./geography/goa.json";
import gujaratGeometry from "./geography/gujarat.json";
import maharashtraGeometry from "./geography/maharashtra.json";
import tamilNaduGeometry from "./geography/tamil-nadu.json";
import karnatakaGeometry from "./geography/karnataka.json";
import madhyaPradeshGeometry from "./geography/madhya-pradesh.json";
import assamGeometry from "./geography/assam.json";
import sikkimGeometry from "./geography/sikkim.json";
import ladakhGeometry from "./geography/ladakh.json";
import kashmirGeometry from "./geography/kashmir.json";
import type { StateProjection } from "@/utils/stateMapProjection";

interface StateGeometry {
  projection: StateProjection;
  width: number;
  height: number;
  boundaryPath: string;
}

interface DistrictGeometry {
  name: string;
  lgdCode: string;
  path: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface StateDistrictArtwork extends DistrictGeometry {
  image: string;
}

/** Per-state accent identity. `ink` is text-on-accent and must keep AA contrast against `accent`. */
export interface StateIdentity {
  accent: string;
  ink: string;
}

/** Fallback identity for destinations without artwork identity. Alpine Noir family. */
export const DEFAULT_STATE_IDENTITY: StateIdentity = { accent: "#f2ae55", ink: "#09342d" };

/**
 * Data-driven motif keys. Each key maps to a tileable SVG texture rendered by
 * StateMotif — no per-state components; extend the key list and MOTIFS to add one.
 */
export type StateMotifKey =
  | "peaks" | "pines" | "jaali" | "fort-arches" | "backwater-waves" | "coast-arcs"
  | "bandhani" | "mandala" | "gopuram" | "boulders" | "stripes" | "tea-leaves"
  | "petals" | "pennants" | "paisley" | "dunes" | "fronds" | "lanterns";

/** One stop inside a signature module. */
export interface StateSignatureStop {
  name: string;
  note: string;
  image?: string;
  href?: string;
}

/**
 * Signature module data. ONE component (StateSignatureModule) switches on
 * `layout` — all per-state variation comes from this data.
 */
export interface StateSignature {
  layout: "route" | "grid";
  eyebrow: string;
  title: string;
  description: string;
  stops: StateSignatureStop[];
};

export interface StateArtworkZone {
  id: string;
  image: string;
  description: string;
  // Percentages of the geographic canvas, independent of viewport size.
  x: number; y: number; width: number; height: number;
  focus?: string;
  feather?: number;
}

/**
 * Identity-only artwork: no validated administrative boundary geometry exists
 * yet, so map markers and the silhouette hero are omitted (StateSilhouetteHero
 * returns null) and the page falls back to the discovery canvas. Identity,
 * motif and signature are always present — every state gets a distinct look.
 */
export interface IdentityOnlyStateArtwork {
  id: string;
  themes: string;
  background: string;
  baseImage: string;
  /** Per-state accent identity; hero pins, rules and active states. Alpine Noir family. */
  identity: StateIdentity;
  /** Subtle SVG texture key, rendered by StateMotif. */
  motif: StateMotifKey;
  /** Signature content block, rendered by StateSignatureModule. */
  signature: StateSignature;
  zones: StateArtworkZone[];
}

/**
 * Full artwork with validated boundary geometry for the silhouette hero and
 * map pins. Never fabricate geometry — a state graduates to this type only
 * when an authoritative boundary exists.
 */
export interface FullStateArtwork extends IdentityOnlyStateArtwork {
  /** Official boundary geometry. */
  geometry: StateGeometry;
  /** Data-only responsive clearance for unusually tall state titles. */
  layout?: { tabletHeroHeight: number; tabletMapTop: number };
  /** Individually clipped tourism photos. Every district gets its own SVG clip path. */
  districts?: StateDistrictArtwork[];
}

/** Union of the two artwork grades. */
export type StateArtwork = IdentityOnlyStateArtwork | FullStateArtwork;

/** Narrowing guard: only full artworks carry validated geometry. */
export function isFullStateArtwork(artwork: StateArtwork): artwork is FullStateArtwork {
  return "geometry" in artwork && artwork.geometry !== undefined;
}

function attachDistrictImages(
  districts: DistrictGeometry[],
  images: Record<string, string>,
  fallbackImages: string[],
): StateDistrictArtwork[] {
  return districts.map((district, index) => ({
    ...district,
    image: images[district.name] ?? fallbackImages[index % fallbackImages.length],
  }));
}

const photo = (place: string, sequence: string) => `/images/location-library/${place}-uttarakhand-india/${place}-uttarakhand-india-${sequence}-lg.webp`;

export const uttarakhandArtwork: StateArtwork = {
  id: "uttarakhand",
  identity: { accent: "#3fb8a6", ink: "#062a25" },
  motif: "peaks",
  signature: {
    layout: "route",
    eyebrow: "The river run",
    title: "From glacier to ghats",
    description: "The Ganga shapes every Uttarakhand journey — follow it from its glacial source to the aarti fires of the plains, with Himalayan detours along the way.",
    stops: [
    { name: "Gangotri", note: "Where the Ganga begins, beneath the Bhagirathi massif.",
      href: "/destinations/uttarakhand?destination=gangotri" },
    { name: "Rishikesh", note: "Yoga capital, river rapids and the Beatles' ashram.",
      href: "/destinations/uttarakhand?destination=rishikesh" },
    { name: "Haridwar", note: "Evening aarti as the river reaches the plains.",
      href: "/destinations/uttarakhand?destination=haridwar" },
    ],
  },
  themes: "Mountains • Rivers • Pilgrimage • Adventure",
  geometry: uttarakhandGeometry,
  background: photo("mussoorie", "02"),
  baseImage: photo("kedarnath", "02"),
  districts: attachDistrictImages(uttarakhandDistrictGeometry.districts, {
    ALMORA: photo("nainital", "02"),
    BAGESHWAR: photo("auli", "02"),
    CHAMOLI: photo("badrinath", "03"),
    CHAMPAWAT: photo("corbett", "03"),
    DEHRADUN: photo("mussoorie", "04"),
    HARIDWAR: photo("rishikesh", "02"),
    NAINITAL: photo("nainital", "04"),
    "PAURI GARHWAL": photo("rishikesh", "03"),
    PITHORAGARH: photo("auli", "01"),
    RUDRAPRAYAG: photo("kedarnath", "03"),
    "TEHRI GARHWAL": photo("mussoorie", "02"),
    "UDHAM SINGH NAGAR": photo("corbett", "01"),
    UTTARKASHI: photo("kedarnath", "02"),
  }, [photo("mussoorie", "02"), photo("auli", "01"), photo("badrinath", "03"), photo("rishikesh", "03")]),
  zones: [
    { id: "hills", image: photo("mussoorie", "04"), description: "Mussoorie's green Himalayan foothills", x: -9, y: 19, width: 70, height: 62, feather: .7 },
    { id: "snow", image: photo("auli", "01"), description: "Snow slopes and peaks at Auli", x: 43, y: 19, width: 65, height: 48, feather: .68 },
    { id: "temple", image: photo("badrinath", "03"), description: "The colourful facade of Badrinath temple", x: 25, y: 16, width: 41, height: 38, focus: "xMidYMid slice", feather: .55 },
    { id: "river", image: photo("rishikesh", "03"), description: "The Ganga and Lakshman Jhula at Rishikesh", x: -4, y: 40, width: 59, height: 49, feather: .64 },
    { id: "forest", image: photo("corbett", "01"), description: "Spotted deer in Jim Corbett National Park", x: 26, y: 55, width: 48, height: 43, feather: .66 },
    { id: "lake", image: photo("nainital", "04"), description: "Boats and forested hills around Naini Lake", x: 50, y: 52, width: 54, height: 48, feather: .7 },
  ],
};

const himachalPhoto = (place: string, sequence: string) =>
  `/images/location-library/${place}-himachal-pradesh-india/${place}-himachal-pradesh-india-${sequence}-lg.webp`;

export const himachalPradeshArtwork: StateArtwork = {
  id: "himachal-pradesh",
  identity: { accent: "#e8a33d", ink: "#0a2f2a" },
  motif: "pines",
  signature: {
    layout: "route",
    eyebrow: "The valley loop",
    title: "Ridges, orchards and high deserts",
    description: "Himachal is a choose-your-altitude state — colonial hill towns, apple valleys and the moonland of Spiti, each a world apart.",
    stops: [
    { name: "Shimla", note: "Ridge walks and Mall Road nostalgia.",
      href: "/destinations/himachal-pradesh?destination=shimla" },
    { name: "Manali", note: "The valley of the gods, and its adventure capital.",
      href: "/destinations/himachal-pradesh?destination=manali" },
    { name: "Spiti", note: "Monasteries above a cold-desert moonscape.",
      href: "/destinations/himachal-pradesh?destination=spiti" },
    ],
  },
  themes: "Mountains • Valleys • Adventure • Honeymoon",
  geometry: himachalPradeshGeometry,
  background: "/images/location-library/himachal-pradesh-india/himachal-pradesh-india-02-lg.webp",
  baseImage: himachalPhoto("manali", "01"),
  layout: { tabletHeroHeight: 840, tabletMapTop: 225 },
  districts: attachDistrictImages(himachalPradeshDistrictGeometry.districts, {
    BILASPUR: himachalPhoto("shimla", "04"),
    CHAMBA: himachalPhoto("dalhousie", "03"),
    HAMIRPUR: himachalPhoto("dharamshala", "02"),
    KANGRA: himachalPhoto("dharamshala", "03"),
    KINNAUR: himachalPhoto("rohtang-pass", "02"),
    KULLU: himachalPhoto("manali", "03"),
    "LAHUL & SPITI": himachalPhoto("rohtang-pass", "03"),
    MANDI: himachalPhoto("manali", "04"),
    SHIMLA: himachalPhoto("shimla", "02"),
    SIRMAUR: himachalPhoto("khajjiar", "02"),
    SOLAN: himachalPhoto("shimla", "03"),
    UNA: himachalPhoto("dharamshala", "04"),
  }, [himachalPhoto("manali", "01"), himachalPhoto("shimla", "02"), himachalPhoto("dharamshala", "03"), himachalPhoto("dalhousie", "02")]),
  zones: [
    { id: "snow", image: himachalPhoto("rohtang-pass", "02"), description: "Snow-lined high passes near Rohtang", x: 28, y: -5, width: 62, height: 48, feather: .7 },
    { id: "cedar", image: himachalPhoto("shimla", "02"), description: "Cedar-covered ridges near Shimla", x: 5, y: 12, width: 52, height: 47, feather: .62 },
    { id: "valley", image: himachalPhoto("kullu", "03"), description: "Kullu valley mountain views", x: 32, y: 35, width: 56, height: 49, feather: .7 },
    { id: "monastery", image: himachalPhoto("dharamshala", "03"), description: "Dharamshala's Himalayan heritage", x: -8, y: 48, width: 52, height: 43, feather: .62 },
    { id: "meadows", image: himachalPhoto("khajjiar", "02"), description: "Green meadows at Khajjiar", x: 49, y: 62, width: 53, height: 40, feather: .62 },
    { id: "mountain-road", image: himachalPhoto("manali", "04"), description: "A Manali mountain road", x: 7, y: 62, width: 47, height: 37, feather: .58 },
  ],
};

// Geometries: UP/RJ/KL/Goa from existing SOI-derived JSONs; 9 others from
// Natural Earth 10m admin_1 (2022), fitted to the shared India-wide LCC projection.


const upPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}-uttar-pradesh-india/${place}-uttar-pradesh-india-${seq}-lg.webp`;

export const uttarPradeshArtwork: StateArtwork = {
  id: "uttar-pradesh",
  themes: "Heritage • Rivers • Pilgrimage • Culture",
  geometry: uttarPradeshGeometry,
  background: upPhoto("varanasi", "02"),
  baseImage: upPhoto("agra", "01"),
  identity: { accent: "#d08a4e", ink: "#0a2f2a" },
  motif: "jaali",
  signature: {
    layout: "route",
    eyebrow: "The heritage triangle",
    title: "Monuments, ghats and Awadhi evenings",
    description: "UP holds India's greatest-hits circuit — the Taj at dawn, Varanasi's eternal ghats and Lucknow's tehzeeb.",
    stops: [
    { name: "Agra", note: "Taj Mahal at first light, Agra Fort after.",
      href: "/destinations/uttar-pradesh?destination=agra" },
    { name: "Varanasi", note: "Evening aarti on the ghats.",
      href: "/destinations/uttar-pradesh?destination=varanasi" },
    { name: "Lucknow", note: "Kebabs, imambaras and old-city bazaars.",
      href: "/destinations/uttar-pradesh?destination=lucknow" },
    ],
  },
  zones: [
    { id: "taj", image: upPhoto("agra", "02"), description: "The Taj Mahal at first light", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "ghats", image: upPhoto("varanasi", "03"), description: "Evening aarti on the Varanasi ghats", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "imambara", image: upPhoto("lucknow", "01"), description: "Nawabi architecture in Lucknow", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "temple-town", image: upPhoto("ayodhya", "02"), description: "Temple spires in Ayodhya", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "krishna", image: upPhoto("mathura", "01"), description: "Ghats and temples in Mathura", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const rjPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}-rajasthan-india/${place}-rajasthan-india-${seq}-lg.webp`;

export const rajasthanArtwork: StateArtwork = {
  id: "rajasthan",
  themes: "Forts • Desert • Palaces • Wildlife",
  geometry: rajasthanGeometry,
  background: "/images/location-library/mehrangarh-fort-jodhpur/mehrangarh-fort-jodhpur-01-lg.webp",
  baseImage: rjPhoto("jaisalmer", "01"),
  identity: { accent: "#f2a63b", ink: "#0a2f2a" },
  motif: "fort-arches",
  signature: {
    layout: "grid",
    eyebrow: "The fort circuit",
    title: "Palace cities and desert nights",
    description: "Rajasthan is best done as a circuit of fort cities — each with its own colour, cuisine and after-dark story.",
    stops: [
    { name: "Jaipur", note: "Pink City palaces and bazaar lanes.",
      image: "/images/location-library/hawa-mahal-jaipur/hawa-mahal-jaipur-01-lg.webp",
      href: "/destinations/rajasthan?destination=jaipur" },
    { name: "Udaipur", note: "Lake palaces and rooftop sunsets.",
      image: "/images/location-library/rajasthan-india/rajasthan-india-01-lg.webp",
      href: "/destinations/rajasthan?destination=udaipur" },
    { name: "Jaisalmer", note: "The golden fort, and dune nights beyond.",
      image: "/images/location-library/jaisalmer-rajasthan-india/jaisalmer-rajasthan-india-01-lg.webp",
      href: "/destinations/rajasthan?destination=jaisalmer" },
    ],
  },
  zones: [
    { id: "pink-city", image: rjPhoto("jaipur", "03"), description: "Hawa Mahal and the old pink city", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "dunes", image: rjPhoto("jaisalmer", "02"), description: "Sam dunes outside Jaisalmer", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "lake-palace", image: rjPhoto("udaipur", "02"), description: "Lake Pichola and the City Palace", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "blue-city", image: rjPhoto("jodhpur", "01"), description: "Mehrangarh over the blue city", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "pushkar", image: rjPhoto("pushkar", "01"), description: "Ghats and fairs at Pushkar", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const klPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}-kerala-india/${place}-kerala-india-${seq}-lg.webp`;

export const keralaArtwork: StateArtwork = {
  id: "kerala",
  themes: "Backwaters • Tea Hills • Coast • Wellness",
  geometry: keralaGeometry,
  background: klPhoto("alleppey", "02"),
  baseImage: klPhoto("munnar", "01"),
  identity: { accent: "#2fbf9e", ink: "#062a25" },
  motif: "backwater-waves",
  signature: {
    layout: "grid",
    eyebrow: "The backwater arc",
    title: "Tea hills to houseboat nights",
    description: "Kerala's classic arc moves from cool plantations down to the water — Munnar's mist, Kochi's old port and a night drifting on the backwaters.",
    stops: [
    { name: "Munnar", note: "Tea gardens rolling through the mist.",
      image: "/images/location-library/munnar-kerala-india/munnar-kerala-india-01-lg.webp",
      href: "/destinations/kerala?destination=munnar" },
    { name: "Kochi", note: "Fort Kochi, Chinese nets and spice warehouses.",
      image: "/images/location-library/kochi-kerala-india/kochi-kerala-india-01-lg.webp",
      href: "/destinations/kerala?destination=kochi" },
    { name: "Alleppey", note: "A houseboat night on Vembanad lake.",
      image: "/images/location-library/alleppey-kerala-india/alleppey-kerala-india-01-lg.webp",
      href: "/destinations/kerala?destination=alleppey" },
    ],
  },
  zones: [
    { id: "tea", image: klPhoto("munnar", "02"), description: "Tea gardens rolling over Munnar", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "houseboat", image: klPhoto("alleppey", "03"), description: "A houseboat drifting through Alleppey", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "fort-kochi", image: klPhoto("kochi", "01"), description: "Chinese fishing nets at Fort Kochi", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "beach", image: klPhoto("kovalam", "01"), description: "Palm-fringed shoreline at Kovalam", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "lagoon", image: klPhoto("kumarakom", "01"), description: "Still waters at Kumarakom", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const goaPhoto = (file: string) => `/images/location-library/${file}`;

export const goaArtwork: StateArtwork = {
  id: "goa",
  themes: "Beaches • Heritage • Food • Slow Days",
  geometry: goaGeometry,
  background: goaPhoto("north-goa-goa-india/north-goa-goa-india-02-lg.webp"),
  baseImage: goaPhoto("goa-india/goa-india-01-lg.webp"),
  identity: { accent: "#2bb8cc", ink: "#06303a" },
  motif: "coast-arcs",
  signature: {
    layout: "grid",
    eyebrow: "The coast trail",
    title: "North energy, south calm",
    description: "Goa is two coasts in one — pick your pace, or walk the whole trail from Baga's buzz to Palolem's crescent.",
    stops: [
    { name: "North Goa", note: "Baga's buzz and Chapora's sunsets.",
      image: "/images/location-library/north-goa-goa-india/north-goa-goa-india-01-lg.webp",
      href: "/destinations/goa?destination=baga" },
    { name: "Panaji", note: "Fontainhas' lanes and riverside cafes.",
      image: "/images/location-library/goa-india/goa-india-04-lg.webp",
      href: "/destinations/goa?destination=panaji" },
    { name: "South Goa", note: "Palolem's crescent and quiet coves.",
      image: "/images/location-library/goa-india/goa-india-01-lg.webp",
      href: "/destinations/goa?destination=palolem" },
    ],
  },
  zones: [
    { id: "north-beach", image: goaPhoto("goa-india/goa-india-02-lg.webp"), description: "Morning on a North Goa beach", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "palms", image: goaPhoto("goa-india/goa-india-03-lg.webp"), description: "Palms leaning over the sand", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "shacks", image: goaPhoto("north-goa-goa-india/north-goa-goa-india-03-lg.webp"), description: "Beach shacks at golden hour", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "chapora", image: goaPhoto("goa-india/goa-india-04-lg.webp"), description: "River and fort views inland", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "south", image: goaPhoto("north-goa-goa-india/north-goa-goa-india-04-lg.webp"), description: "Quiet coves further south", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const gjPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const gujaratArtwork: StateArtwork = {
  id: "gujarat",
  themes: "White Desert • Temples • Wildlife • Crafts",
  geometry: gujaratGeometry,
  background: gjPhoto("kutch-gujarat-india", "02"),
  baseImage: gjPhoto("dwarka-gujarat-india", "01"),
  identity: { accent: "#e0b34c", ink: "#0a2f2a" },
  motif: "bandhani",
  signature: {
    layout: "route",
    eyebrow: "Salt & safari",
    title: "White desert, lions and temple towns",
    description: "Gujarat packs extremes — a salt desert that glows under moonlight, the last Asiatic lions, and one of India's oldest pilgrim coasts.",
    stops: [
    { name: "Rann of Kutch", note: "Moonlit salt flats in winter.",
      href: "/destinations/gujarat?destination=kutch" },
    { name: "Gir", note: "Tracking Asiatic lions at dawn.",
      href: "/destinations/gujarat?destination=gir" },
    { name: "Somnath", note: "The temple by the Arabian Sea.",
      href: "/destinations/gujarat?destination=somnath" },
    ],
  },
  zones: [
    { id: "rann", image: gjPhoto("kutch-gujarat-india", "01"), description: "Salt flats of the Rann of Kutch", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "dwarka", image: gjPhoto("dwarka-gujarat-india", "02"), description: "Dwarkadhish temple by the sea", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "lions", image: gjPhoto("gir-national-park-gujarat", "01"), description: "Asiatic lions in Gir forest", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "stepwell", image: gjPhoto("ahmedabad-gujarat-india", "01"), description: "Heritage streets of Ahmedabad", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "diu", image: gjPhoto("diu-gujarat-india", "01"), description: "Fort and shoreline at Diu", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const mhPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const maharashtraArtwork: StateArtwork = {
  id: "maharashtra",
  themes: "Caves • Coast • Cities • Hill Stations",
  geometry: maharashtraGeometry,
  background: mhPhoto("ajanta-maharashtra-india", "01"),
  baseImage: mhPhoto("ellora-maharashtra-india", "01"),
  identity: { accent: "#d07f4f", ink: "#0a2f2a" },
  motif: "mandala",
  signature: {
    layout: "route",
    eyebrow: "Cave to coast",
    title: "Two millennia in one state",
    description: "From 2,000-year-old painted caves to India's maximum city — Maharashtra's timeline is the country's in miniature.",
    stops: [
    { name: "Ajanta", note: "Murals that predate most of Europe's art.",
      href: "/destinations/maharashtra?destination=ajanta" },
    { name: "Ellora", note: "Kailasa, carved down from a single rock.",
      href: "/destinations/maharashtra?destination=ellora" },
    { name: "Mumbai", note: "Gateway, sea face and street food.",
      href: "/destinations/maharashtra?destination=mumbai" },
    ],
  },
  zones: [
    { id: "ajanta", image: mhPhoto("ajanta-maharashtra-india", "02"), description: "Murals inside the Ajanta caves", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "ellora", image: mhPhoto("ellora-maharashtra-india", "02"), description: "Kailasa temple carved from rock", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "gateway", image: mhPhoto("mumbai-maharashtra-india", "01"), description: "The Gateway skyline at dusk", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "ghats", image: mhPhoto("maharashtra-india", "01"), description: "Monsoon greens in the Sahyadris", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "nashik", image: mhPhoto("nashik-maharashtra-india", "01"), description: "Vineyards and ghats near Nashik", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const tnPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const tamilNaduArtwork: StateArtwork = {
  id: "tamil-nadu",
  themes: "Temples • Hills • Coast • Culture",
  geometry: tamilNaduGeometry,
  background: tnPhoto("madurai-tamil-nadu-india", "01"),
  baseImage: tnPhoto("mahabalipuram-tamil-nadu-india", "01"),
  identity: { accent: "#a8432a", ink: "#ffffff" },
  motif: "gopuram",
  signature: {
    layout: "route",
    eyebrow: "The temple trail",
    title: "Gopurams, shore temples and the deep south",
    description: "Tamil Nadu's temple cities are living museums — climb gopurams by day, end where three seas meet.",
    stops: [
    { name: "Madurai", note: "Meenakshi's hall of a thousand pillars.",
      href: "/destinations/tamil-nadu?destination=madurai" },
    { name: "Thanjavur", note: "The Brihadeeswara's 66-metre shadow.",
      href: "/destinations/tamil-nadu?destination=thanjavur" },
    { name: "Mahabalipuram", note: "Shore temples carved from living rock.",
      href: "/destinations/tamil-nadu?destination=mahabalipuram" },
    ],
  },
  zones: [
    { id: "meenakshi", image: tnPhoto("madurai-tamil-nadu-india", "02"), description: "Gopurams of Meenakshi Temple", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "shore", image: tnPhoto("mahabalipuram-tamil-nadu-india", "02"), description: "Shore Temple against the sea", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "nilgiri", image: tnPhoto("ooty-tamil-nadu-india", "01"), description: "Tea slopes around Ooty", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "cape", image: tnPhoto("kanyakumari-tamil-nadu-india", "01"), description: "Sunrise at the southern tip", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "thanjavur", image: tnPhoto("thanjavur-tamil-nadu-india", "01"), description: "Brihadeeswara Temple, Thanjavur", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const kaPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const karnatakaArtwork: StateArtwork = {
  id: "karnataka",
  themes: "Ruins • Coffee Country • Palaces • Coast",
  geometry: karnatakaGeometry,
  background: kaPhoto("hospet-karnataka-india", "01"),
  baseImage: kaPhoto("coorg-karnataka-india", "01"),
  identity: { accent: "#c9a227", ink: "#0a2f2a" },
  motif: "boulders",
  signature: {
    layout: "route",
    eyebrow: "The deccan arc",
    title: "Boulder empires and coffee mist",
    description: "Karnataka swings from a 14th-century capital scattered across granite to misty coffee estates and palace-city grandeur.",
    stops: [
    { name: "Hampi", note: "An empire strewn across boulders.",
      href: "/destinations/karnataka?destination=hampi" },
    { name: "Coorg", note: "Coffee estates in the mist.",
      href: "/destinations/karnataka?destination=coorg" },
    { name: "Mysuru", note: "The palace city, lit on Sundays.",
      href: "/destinations/karnataka?destination=mysuru" },
    ],
  },
  zones: [
    { id: "hampi", image: kaPhoto("hospet-karnataka-india", "02"), description: "Boulder-strewn ruins of Hampi", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "coffee", image: kaPhoto("coorg-karnataka-india", "02"), description: "Mist over Coorg coffee estates", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "palace", image: kaPhoto("mysore-karnataka-india", "01"), description: "Mysuru Palace lit at night", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "tech", image: kaPhoto("bengaluru-karnataka-india", "01"), description: "Garden-city streets of Bengaluru", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "coast", image: kaPhoto("mangalore-karnataka-india", "01"), description: "Laterite cliffs on the Karavali coast", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const mpPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const madhyaPradeshArtwork: StateArtwork = {
  id: "madhya-pradesh",
  themes: "Temples • Tigers • Rivers • Forts",
  geometry: madhyaPradeshGeometry,
  background: mpPhoto("khajuraho-madhya-pradesh-india", "01"),
  baseImage: mpPhoto("kanha-national-park-madhya-pradesh-india", "01"),
  identity: { accent: "#7fb069", ink: "#062a25" },
  motif: "stripes",
  signature: {
    layout: "route",
    eyebrow: "The tiger circuit",
    title: "Jungle, temples and riverside forts",
    description: "Central India holds the country's greatest concentration of wild and ancient — track tigers by day, stand before Khajuraho by evening.",
    stops: [
    { name: "Kanha", note: "Kipling's jungle, tiger country.",
      href: "/destinations/madhya-pradesh?destination=kanha" },
    { name: "Bandhavgarh", note: "India's highest tiger density.",
      href: "/destinations/madhya-pradesh?destination=bandhavgarh" },
    { name: "Khajuraho", note: "Temples carved like poetry in stone.",
      href: "/destinations/madhya-pradesh?destination=khajuraho" },
    ],
  },
  zones: [
    { id: "khajuraho", image: mpPhoto("khajuraho-madhya-pradesh-india", "02"), description: "Sandstone temples of Khajuraho", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "tiger", image: mpPhoto("kanha-national-park-madhya-pradesh-india", "02"), description: "Sal meadows in Kanha", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "marble", image: mpPhoto("bhedaghat-madhya-pradesh-india", "01"), description: "Marble Rocks gorge at Bhedaghat", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "gwalior", image: mpPhoto("gwalior-madhya-pradesh-india", "01"), description: "Gwalior Fort on the plateau", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "orchha", image: mpPhoto("orchha-madhya-pradesh-india", "01"), description: "Chhatris along the Betwa at Orchha", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const asPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const assamArtwork: StateArtwork = {
  id: "assam",
  themes: "Rhinos • River Islands • Tea • Temples",
  geometry: assamGeometry,
  background: asPhoto("kaziranga-national-park-assam-india", "01"),
  baseImage: asPhoto("majuli-assam-india", "01"),
  identity: { accent: "#4caf7d", ink: "#062a25" },
  motif: "tea-leaves",
  signature: {
    layout: "route",
    eyebrow: "River & rhino",
    title: "Grasslands, river islands and tea",
    description: "Assam is the Brahmaputra's country — dawn safaris among rhinos, island monasteries and garden-fresh tea.",
    stops: [
    { name: "Kaziranga", note: "One-horned rhinos in tall grass.",
      href: "/destinations/assam?destination=kaziranga" },
    { name: "Majuli", note: "Satras on the great river island.",
      href: "/destinations/assam?destination=majuli" },
    { name: "Guwahati", note: "Kamakhya's hill above the Brahmaputra.",
      href: "/destinations/assam?destination=guwahati" },
    ],
  },
  zones: [
    { id: "rhino", image: asPhoto("kaziranga-national-park-assam-india", "02"), description: "One-horned rhinos in Kaziranga", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "majuli", image: asPhoto("majuli-assam-india", "02"), description: "Satras on the Majuli river island", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "brahmaputra", image: asPhoto("guwahati-assam-india", "01"), description: "The Brahmaputra at Guwahati", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "tea", image: asPhoto("assam-india", "01"), description: "Tea gardens in Upper Assam", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "jorhat", image: asPhoto("jorhat-assam-india", "01"), description: "Colonial-era tea bungalows", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const skPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const sikkimArtwork: StateArtwork = {
  id: "sikkim",
  themes: "Monasteries • Himalaya • Lakes • Rhododendrons",
  geometry: sikkimGeometry,
  background: skPhoto("gangtok-sikkim-india", "02"),
  baseImage: skPhoto("lachung-sikkim-india", "01"),
  identity: { accent: "#a94a68", ink: "#ffffff" },
  motif: "petals",
  signature: {
    layout: "route",
    eyebrow: "The high ascent",
    title: "Monasteries and Kanchenjunga views",
    description: "Sikkim climbs from subtropical valleys to the old silk route — monasteries, rhododendron forests and the world's third-highest peak.",
    stops: [
    { name: "Gangtok", note: "Ridge-line capital with monastery views.",
      href: "/destinations/sikkim?destination=gangtok" },
    { name: "Lachung", note: "Yumthang, the valley of flowers.",
      href: "/destinations/sikkim?destination=lachung" },
    { name: "Nathula", note: "The silk-route pass on the frontier.",
      href: "/destinations/sikkim?destination=nathula" },
    ],
  },
  zones: [
    { id: "rumtek", image: skPhoto("gangtok-sikkim-india", "03"), description: "Prayer flags above Gangtok", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "yumthang", image: skPhoto("lachung-sikkim-india", "02"), description: "Yumthang valley in bloom", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "kanchenjunga", image: skPhoto("sikkim-india", "01"), description: "Kanchenjunga from the ridge towns", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "pelling", image: skPhoto("gangtok-sikkim-india", "04"), description: "Monastery courtyards near Pelling", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "lakes", image: skPhoto("sikkim-india", "02"), description: "High lakes on the old silk route", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const laPhoto = (seq: string) =>
  `/images/location-library/ladakh-india/ladakh-india-${seq}-lg.webp`;

export const ladakhArtwork: StateArtwork = {
  id: "ladakh",
  themes: "High Desert • Monasteries • Lakes • Passes",
  geometry: ladakhGeometry,
  background: laPhoto("01"),
  baseImage: laPhoto("02"),
  identity: { accent: "#4a5fd4", ink: "#eef1ff" },
  motif: "pennants",
  signature: {
    layout: "grid",
    eyebrow: "The high passes",
    title: "Monasteries above the clouds",
    description: "Ladakh resets your scale — acclimatise in Leh, cross the highest motorable passes, and sleep beside lakes that change colour by the hour.",
    stops: [
    { name: "Leh", note: "Old-town lanes and Shanti Stupa sunsets.",
      image: "/images/location-library/leh-jammu-and-kashmir-india/leh-jammu-and-kashmir-india-01-lg.webp",
      href: "/destinations/ladakh?destination=leh" },
    { name: "Nubra", note: "Dunes and double-humped camels.",
      image: "/images/location-library/ladakh-india/ladakh-india-02-lg.webp",
      href: "/destinations/ladakh?destination=nubra" },
    { name: "Pangong", note: "The blue that changes colour by the hour.",
      image: "/images/location-library/ladakh-india/ladakh-india-03-lg.webp",
      href: "/destinations/ladakh?destination=pangong" },
    ],
  },
  zones: [
    { id: "pangong", image: laPhoto("01"), description: "Blue water at Pangong Tso", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "nubra", image: laPhoto("03"), description: "Dunes and double-humped camels in Nubra", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "monastery", image: laPhoto("02"), description: "Thiksey monastery over the Indus valley", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "khardung", image: laPhoto("04"), description: "Switchbacks up to Khardung La", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "moriri", image: laPhoto("03"), description: "Stillness at Tso Moriri", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

const ksPhoto = (place: string, seq: string) =>
  `/images/location-library/${place}/${place}-${seq}-lg.webp`;

export const kashmirArtwork: StateArtwork = {
  id: "kashmir",
  themes: "Houseboats • Meadows • Saffron • Snow",
  geometry: kashmirGeometry,
  background: ksPhoto("srinagar-jammu-and-kashmir-india", "01"),
  baseImage: ksPhoto("gulmarg-jammu-and-kashmir-india", "01"),
  identity: { accent: "#b04356", ink: "#ffffff" },
  motif: "paisley",
  signature: {
    layout: "grid",
    eyebrow: "The valley drift",
    title: "Houseboats, meadows and chinar shade",
    description: "Kashmir is made for drifting — on Dal Lake, through saffron fields and up into meadow towns that turn white in winter.",
    stops: [
    { name: "Srinagar", note: "Dal Lake houseboats and shikara mornings.",
      image: "/images/location-library/srinagar-jammu-and-kashmir-india/srinagar-jammu-and-kashmir-india-01-lg.webp",
      href: "/destinations/kashmir?destination=srinagar" },
    { name: "Gulmarg", note: "Meadow turned ski bowl, gondola to Apharwat.",
      image: "/images/location-library/gulmarg-jammu-and-kashmir-india/gulmarg-jammu-and-kashmir-india-01-lg.webp",
      href: "/destinations/kashmir?destination=gulmarg" },
    { name: "Pahalgam", note: "The valley of shepherds, pine and river.",
      image: "/images/packages/hi-pahalgam-tour-packages.webp",
      href: "/destinations/kashmir?destination=pahalgam" },
    ],
  },
  zones: [
    { id: "dal", image: ksPhoto("srinagar-jammu-and-kashmir-india", "02"), description: "Shikaras on Dal Lake at dawn", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "gulmarg", image: ksPhoto("gulmarg-jammu-and-kashmir-india", "02"), description: "Apharwat ridge above Gulmarg", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "sonamarg", image: ksPhoto("sonamarg-jammu-and-kashmir-india", "01"), description: "Glaciers over Sonamarg meadows", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "nishat", image: ksPhoto("kashmir-dal-lake", "01"), description: "Mughal gardens along the lake", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "pahalgam", image: ksPhoto("kashmir-dal-lake", "02"), description: "Pine valleys around Pahalgam", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};

/* These states/UTs do not yet have an officially validated            */
/* administrative boundary in the artwork library, so they carry real  */
/* verified imagery, a distinct Alpine Noir accent, a motif and        */
/* signature content — but no fabricated map geometry.                 */
/* StateSilhouetteHero returns null without geometry, and the          */
/* destination page falls back to the discovery-canvas hero, which     */
/* states the geometry position explicitly.                            */
/* ------------------------------------------------------------------ */

const lib = (path: string) => `/images/location-library/${path}`;

/**
 * Hero: Chandragiri palace, near Tirupati — pre-existing MQT location-library asset (tirupati-andhra-pradesh-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const andhraPradeshArtwork: StateArtwork = {
  id: "andhra-pradesh",
  themes: "Temples • Coast • Heritage • Hills",
  background: lib("tirupati-andhra-pradesh-india/tirupati-andhra-pradesh-india-01-lg.webp"),
  baseImage: lib("tirupati-andhra-pradesh-india/tirupati-andhra-pradesh-india-02-lg.webp"),
  identity: { accent: "#b34a2e", ink: "#ffffff" },
  motif: "mandala",
  signature: {
    layout: "route",
    eyebrow: "Temple country",
    title: "Pilgrimage towns and a storied coastline",
    description:
      "Andhra Pradesh moves between sacred hills and the Bay of Bengal — Tirupati's temple town, the port-city beaches of Visakhapatnam and the coffee hills of Araku.",
    stops: [
      { name: "Tirupati", note: "The Venkateswara temple town at the foot of the Tirumala hills.", href: "/destinations/andhra-pradesh?destination=tirupati" },
      { name: "Visakhapatnam", note: "Port-city beaches with the Eastern Ghats rising behind them.", href: "/destinations/andhra-pradesh?destination=visakhapatnam" },
      { name: "Araku Valley", note: "Coffee country, waterfalls and tribal hamlets in the Eastern Ghats.", href: "/destinations/andhra-pradesh?destination=araku" },
    ],
  },
  zones: [],
};

/**
 * Hero: Shungatser (Madhuri) Lake, Tawang — pre-existing MQT location-library asset (tawang-arunachal-pradesh-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const arunachalPradeshArtwork: StateArtwork = {
  id: "arunachal-pradesh",
  themes: "Monasteries • High Passes • Valleys • Tribal Culture",
  background: lib("tawang-arunachal-pradesh-india/tawang-arunachal-pradesh-india-01-lg.webp"),
  baseImage: lib("tawang-arunachal-pradesh-india/tawang-arunachal-pradesh-india-02-lg.webp"),
  identity: { accent: "#2a739c", ink: "#ffffff" },
  motif: "pennants",
  signature: {
    layout: "route",
    eyebrow: "The last frontier",
    title: "Monasteries above the clouds",
    description:
      "India's easternmost Himalaya — Tawang's great monastery, high passes like Sela and valleys where Apatani and Monpa life continues much as it always has.",
    stops: [
      { name: "Tawang", note: "The great monastery town, high lakes and the road over Sela Pass.", href: "/destinations/arunachal-pradesh?destination=tawang" },
      { name: "Ziro Valley", note: "Apatani rice valleys ringed by pine-covered hills.", href: "/destinations/arunachal-pradesh?destination=ziro" },
      { name: "Bomdila & Dirang", note: "Monasteries, apple orchards and slow mountain days.", href: "/destinations/arunachal-pradesh?destination=bomdila" },
    ],
  },
  zones: [],
};

/**
 * Hero: Golconda Fort, Hyderabad — pre-existing MQT location-library asset (hyderabad-andhra-pradesh-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const telanganaArtwork: StateArtwork = {
  id: "telangana",
  themes: "Heritage • Forts • Cities • Culture",
  background: lib("hyderabad-andhra-pradesh-india/hyderabad-andhra-pradesh-india-01-lg.webp"),
  baseImage: lib("hyderabad-andhra-pradesh-india/hyderabad-andhra-pradesh-india-01-lg.webp"),
  identity: { accent: "#8a5a9e", ink: "#ffffff" },
  motif: "fort-arches",
  signature: {
    layout: "route",
    eyebrow: "Deccan heritage",
    title: "Forts, old cities and living craft",
    description:
      "Telangana pairs Hyderabad's old-city grandeur with Kakatiya temple country — Golconda's ramparts, Warangal's stone temples and the Godavari's ghats.",
    stops: [
      { name: "Hyderabad", note: "Charminar, Golconda Fort and the old city's bazaars.", href: "/destinations/telangana?destination=hyderabad" },
      { name: "Warangal", note: "Kakatiya capital — the Thousand Pillar Temple and Ramappa.", href: "/destinations/telangana?destination=warangal" },
      { name: "Bhadrachalam", note: "The Sita Ramachandra temple on the Godavari's banks.", href: "/destinations/telangana?destination=bhadrachalam" },
    ],
  },
  zones: [],
};

/**
 * Hero: Howrah Bridge, Kolkata — pre-existing MQT location-library asset (west-bengal-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const westBengalArtwork: StateArtwork = {
  id: "west-bengal",
  themes: "Cities • Himalaya • Rivers • Culture",
  background: lib("west-bengal-india/west-bengal-india-01-lg.webp"),
  baseImage: lib("kolkata-west-bengal-india/kolkata-west-bengal-india-01-lg.webp"),
  identity: { accent: "#7a2e2e", ink: "#ffffff" },
  motif: "lanterns",
  signature: {
    layout: "route",
    eyebrow: "City of joy and beyond",
    title: "From Howrah Bridge to Himalayan tea",
    description:
      "West Bengal packs a continent into one state — Kolkata's colonial streets, the Darjeeling Himalaya, the Sundarbans' mangrove waterways and Tagore's Shantiniketan.",
    stops: [
      { name: "Kolkata", note: "Howrah Bridge, Victoria Memorial and the yellow-taxi streets.", href: "/destinations/west-bengal?destination=kolkata" },
      { name: "Darjeeling", note: "The toy train, tea gardens and Kanchenjunga mornings.", href: "/destinations/west-bengal?destination=darjeeling" },
      { name: "Sundarbans", note: "Mangrove creeks and boat safaris in tiger country.", href: "/destinations/west-bengal?destination=sundarbans" },
    ],
  },
  zones: [],
};

/**
 * Hero: Radhanagar Beach, Havelock — pre-existing MQT location-library asset (havelock-island-andaman-and-nicobar-islands-india-03). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const andamanNicobarArtwork: StateArtwork = {
  id: "andaman-and-nicobar-islands",
  themes: "Beaches • Diving • Islands • History",
  background: lib("havelock-island-andaman-and-nicobar-islands-india/havelock-island-andaman-and-nicobar-islands-india-03-lg.webp"),
  baseImage: lib("neil-island-andaman-and-nicobar-islands-india/neil-island-andaman-and-nicobar-islands-india-01-lg.webp"),
  identity: { accent: "#1b6ca8", ink: "#ffffff" },
  motif: "fronds",
  signature: {
    layout: "route",
    eyebrow: "Island time",
    title: "White sand, clear water, deep history",
    description:
      "An archipelago in the Bay of Bengal — Radhanagar's famous beach, dive reefs off Havelock and the Cellular Jail's sobering history in Port Blair.",
    stops: [
      { name: "Havelock Island", note: "Radhanagar Beach and the islands' best dive sites.", href: "/destinations/andaman-and-nicobar-islands?destination=havelock" },
      { name: "Port Blair", note: "The Cellular Jail and the islands' colonial history.", href: "/destinations/andaman-and-nicobar-islands?destination=port+blair" },
      { name: "Neil Island", note: "Quiet beaches, coral shallows and village lanes.", href: "/destinations/andaman-and-nicobar-islands?destination=neil+island" },
    ],
  },
  zones: [],
};

/**
 * Hero: St. Paul's Church, Diu — pre-existing MQT location-library asset (diu-gujarat-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const dadraNagarHaveliDamanDiuArtwork: StateArtwork = {
  id: "dadra-and-nagar-haveli-and-daman-and-diu",
  themes: "Heritage • Beaches • Forts • Tribal Culture",
  background: lib("diu-gujarat-india/diu-gujarat-india-01-lg.webp"),
  baseImage: lib("diu-gujarat-india/diu-gujarat-india-03-lg.webp"),
  identity: { accent: "#4a7c59", ink: "#ffffff" },
  motif: "coast-arcs",
  signature: {
    layout: "route",
    eyebrow: "Portuguese coast",
    title: "Sea forts, old churches and quiet beaches",
    description:
      "A union territory of two coasts — Diu and Daman's Portuguese forts and churches on the Arabian Sea, and the forested tribal heartland of Dadra and Nagar Haveli around Silvassa.",
    stops: [
      { name: "Diu", note: "The sea fort, St. Paul's Church and Nagoa Beach.", href: "/destinations/dadra-and-nagar-haveli-and-daman-and-diu?destination=diu" },
      { name: "Daman", note: "Moti Daman fort and the Jampore shoreline.", href: "/destinations/dadra-and-nagar-haveli-and-daman-and-diu?destination=daman" },
      { name: "Silvassa", note: "Tribal museums, Dudhni lake and forest trails.", href: "/destinations/dadra-and-nagar-haveli-and-daman-and-diu?destination=silvassa" },
    ],
  },
  zones: [],
};

/**
 * Hero: Katra / Trikuta approach, Jammu — pre-existing MQT location-library asset (katra-jammu-and-kashmir-india-01). Visually verified 2026-09-28. Original source/license not recorded.
 */
export const jammuKashmirArtwork: StateArtwork = {
  id: "jammu-and-kashmir",
  themes: "Pilgrimage • Mountains • Meadows • Culture",
  background: lib("katra-jammu-and-kashmir-india/katra-jammu-and-kashmir-india-01-lg.webp"),
  baseImage: lib("vaishno-devi-temple-katra/vaishno-devi-temple-katra-01-lg.webp"),
  identity: { accent: "#2e5d4b", ink: "#ffffff" },
  motif: "peaks",
  signature: {
    layout: "route",
    eyebrow: "Two regions, one territory",
    title: "Jammu's temples and the road to the valley",
    description:
      "The union territory spans Dogra Jammu and the Kashmir Valley — the Vaishno Devi pilgrimage in the Trikuta hills, Patnitop's meadows and the valley beyond. For the valley in depth, see our Kashmir guide.",
    stops: [
      { name: "Katra & Vaishno Devi", note: "The pilgrim town at the foot of the Trikuta hills.", href: "/destinations/jammu-and-kashmir?destination=katra" },
      { name: "Jammu", note: "Raghunath Temple, Amar Mahal and the old Dogra city.", href: "/destinations/jammu-and-kashmir?destination=jammu" },
      { name: "Patnitop", note: "Pine meadows and Sanasar's high pastures.", href: "/destinations/jammu-and-kashmir?destination=patnitop" },
    ],
  },
  zones: [],
};

/**
 * Hero: Brahma Sarovar, Kurukshetra — Ashish Bhatnagar, CC BY-SA 3.0,
 * via Wikimedia Commons (File:Brahma_Sarovar,_Kurukshetra.jpg).
 */
export const haryanaArtwork: StateArtwork = {
  id: "haryana",
  themes: "Pilgrimage • History • Gardens • Birding",
  background: lib("haryana-india/haryana-india-01-lg.webp"),
  baseImage: lib("haryana-india/haryana-india-01-lg.webp"),
  identity: { accent: "#9c6b1e", ink: "#ffffff" },
  motif: "jaali",
  signature: {
    layout: "route",
    eyebrow: "Land of the Gita",
    title: "Epic battlefields and quiet escapes",
    description:
      "Haryana is where the Mahabharata was fought — Kurukshetra's Brahma Sarovar and Jyotisar carry that weight — with Mughal gardens, winter birding and the Morni Hills as quieter counters.",
    stops: [
      { name: "Kurukshetra", note: "Brahma Sarovar and the Mahabharata battlefield.", href: "/destinations/haryana?destination=kurukshetra" },
      { name: "Pinjore Gardens", note: "Terraced Mughal gardens below the hills.", href: "/destinations/haryana?destination=pinjore" },
      { name: "Morni Hills", note: "Forested ridges and a lake within reach of Chandigarh.", href: "/destinations/haryana?destination=morni" },
    ],
  },
  zones: [],
};

/**
 * Hero: Loktak Lake with Sendra Island — ch_15march, CC BY 2.0,
 * via Wikimedia Commons (File:Loktak_Lake_Manipur_01.jpg).
 */
export const manipurArtwork: StateArtwork = {
  id: "manipur",
  themes: "Lakes • Culture • Valleys • Heritage",
  background: lib("manipur-india/manipur-india-01-lg.webp"),
  baseImage: lib("manipur-india/manipur-india-01-lg.webp"),
  identity: { accent: "#7a3b69", ink: "#ffffff" },
  motif: "petals",
  signature: {
    layout: "route",
    eyebrow: "The floating lake",
    title: "A valley ringed by blue hills",
    description:
      "Manipur moves at the pace of Loktak Lake — floating phumdi islands, the women's market of Imphal and the INA Memorial at Moirang.",
    stops: [
      { name: "Imphal", note: "Kangla Fort and Ima Keithel, the women's market.", href: "/destinations/manipur?destination=imphal" },
      { name: "Loktak Lake", note: "Floating phumdi islands and Keibul Lamjao.", href: "/destinations/manipur?destination=loktak" },
      { name: "Moirang", note: "The INA Memorial and the lake's southern shore.", href: "/destinations/manipur?destination=moirang" },
    ],
  },
  zones: [],
};

/**
 * Hero: Dzukou Valley rolling hills — UnpetitproleX, CC BY-SA 4.0,
 * via Wikimedia Commons (File:Breathtaking beauty of Dzukou Valley in Manipur-Nagaland border (edit).jpg).
 */
export const nagalandArtwork: StateArtwork = {
  id: "nagaland",
  themes: "Treks • Tribal Culture • Valleys • Festivals",
  background: lib("nagaland-india/nagaland-india-01-lg.webp"),
  baseImage: lib("nagaland-india/nagaland-india-01-lg.webp"),
  identity: { accent: "#3e6b4f", ink: "#ffffff" },
  motif: "stripes",
  signature: {
    layout: "route",
    eyebrow: "Hill tribes",
    title: "Sixteen tribes, one green highland",
    description:
      "Nagaland is hill country shaped by its tribes — Kohima's war cemetery, the Hornbill Festival at Kisama and the rolling green ridges of Dzukou.",
    stops: [
      { name: "Kohima", note: "The war cemetery and Kisama's Hornbill Festival.", href: "/destinations/nagaland?destination=kohima" },
      { name: "Dzukou Valley", note: "Rolling green ridges and seasonal lilies.", href: "/destinations/nagaland?destination=dzukou" },
      { name: "Khonoma", note: "A warrior village turned conservation model.", href: "/destinations/nagaland?destination=khonoma" },
    ],
  },
  zones: [],
};
