import uttarakhandGeometry from "./geography/uttarakhand.json";

export interface StateArtwork {
  id: string;
  themes: string;
  geometry: typeof uttarakhandGeometry;
  background: string;
  baseImage: string;
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

const photo = (place: string, sequence: string) => `/images/location-library/${place}-uttarakhand-india/${place}-uttarakhand-india-${sequence}-lg.webp`;

export const uttarakhandArtwork: StateArtwork = {
  id: "uttarakhand",
  themes: "Mountains • Rivers • Pilgrimage • Adventure",
  geometry: uttarakhandGeometry,
  background: photo("mussoorie", "02"),
  baseImage: photo("kedarnath", "02"),
  zones: [
    { id: "hills", image: photo("mussoorie", "04"), description: "Mussoorie's green Himalayan foothills", x: -9, y: 19, width: 70, height: 62, feather: .7 },
    { id: "snow", image: photo("auli", "01"), description: "Snow slopes and peaks at Auli", x: 43, y: 19, width: 65, height: 48, feather: .68 },
    { id: "temple", image: photo("badrinath", "03"), description: "The colourful facade of Badrinath temple", x: 25, y: 16, width: 41, height: 38, focus: "xMidYMid slice", feather: .55 },
    { id: "river", image: photo("rishikesh", "03"), description: "The Ganga and Lakshman Jhula at Rishikesh", x: -4, y: 40, width: 59, height: 49, feather: .64 },
    { id: "forest", image: photo("corbett", "01"), description: "Spotted deer in Jim Corbett National Park", x: 26, y: 55, width: 48, height: 43, feather: .66 },
    { id: "lake", image: photo("nainital", "04"), description: "Boats and forested hills around Naini Lake", x: 50, y: 52, width: 54, height: 48, feather: .7 },
  ],
};
