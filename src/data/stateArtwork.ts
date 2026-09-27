import uttarakhandGeometry from "./geography/uttarakhand.json";
import himachalPradeshGeometry from "./geography/himachal-pradesh.json";
import uttarakhandDistrictGeometry from "./geography/uttarakhand.districts.json";
import himachalPradeshDistrictGeometry from "./geography/himachal-pradesh.districts.json";
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
  background: himachalPhoto("himachal-pradesh", "02"),
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
