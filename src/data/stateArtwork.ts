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

export interface StateArtwork {
  id: string;
  themes: string;
  geometry: StateGeometry;
  background: string;
  baseImage: string;
  /** Data-only responsive clearance for unusually tall state titles. */
  layout?: { tabletHeroHeight: number; tabletMapTop: number };
  /** Per-state accent identity; hero pins, rules and active states. Alpine Noir family. */
  identity?: { accent: string; ink: string };
  /** Individually clipped tourism photos. Every district gets its own SVG clip path. */
  districts?: StateDistrictArtwork[];
  zones: Array<{
    id: string;
    image: string;
    description: string;
    // Percentages of the geographic canvas, independent of viewport size.
    x: number; y: number; width: number; height: number;
    focus?: string;
    feather?: number;
  }>;
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
  identity: { accent: "#d99a4e", ink: "#0a2f2a" },
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
  background: rjPhoto("jaipur", "02"),
  baseImage: rjPhoto("jaisalmer", "01"),
  identity: { accent: "#e8974a", ink: "#0a2f2a" },
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
  identity: { accent: "#3ec6a8", ink: "#062a25" },
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
  identity: { accent: "#4ab8e8", ink: "#062a25" },
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
  identity: { accent: "#d4a24e", ink: "#0a2f2a" },
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
  identity: { accent: "#c96f4a", ink: "#0a2f2a" },
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
  identity: { accent: "#d1603d", ink: "#0a2f2a" },
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
  identity: { accent: "#c2a14d", ink: "#0a2f2a" },
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
  identity: { accent: "#8e9aaf", ink: "#0a2f2a" },
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
  identity: { accent: "#5b9bd5", ink: "#062a25" },
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
  identity: { accent: "#b76e79", ink: "#0a2f2a" },
  zones: [
    { id: "dal", image: ksPhoto("srinagar-jammu-and-kashmir-india", "02"), description: "Shikaras on Dal Lake at dawn", x: -8, y: 12, width: 62, height: 54, feather: .7 },
    { id: "gulmarg", image: ksPhoto("gulmarg-jammu-and-kashmir-india", "02"), description: "Apharwat ridge above Gulmarg", x: 46, y: 8, width: 62, height: 50, feather: .68 },
    { id: "sonamarg", image: ksPhoto("sonamarg-jammu-and-kashmir-india", "01"), description: "Glaciers over Sonamarg meadows", x: 20, y: 32, width: 60, height: 44, focus: "xMidYMid slice", feather: .6 },
    { id: "nishat", image: ksPhoto("kashmir-dal-lake", "01"), description: "Mughal gardens along the lake", x: -6, y: 56, width: 58, height: 50, feather: .66 },
    { id: "pahalgam", image: ksPhoto("kashmir-dal-lake", "02"), description: "Pine valleys around Pahalgam", x: 48, y: 58, width: 60, height: 50, feather: .66 },
  ],
};
