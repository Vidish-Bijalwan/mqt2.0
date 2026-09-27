/**
 * Reviewable provenance for district-mosaic imagery.
 *
 * A district may only consume its own entry. Generated illustrations are
 * deliberately labelled as illustrations so captions never imply a real,
 * photographed landmark. This is the source of truth for the rollout audit.
 */
export type DistrictTile = {
  district: string;
  image: string;
  caption: string;
  source: "photograph" | "illustrated";
  reviewed: boolean;
};

export const stateTileManifest: Record<string, DistrictTile[]> = {
  "uttar-pradesh": [
    {
      district: "AZAMGARH",
      image: "/images/state-tiles/uttar-pradesh/azamgarh-illustrated-v1.png",
      caption: "Illustrated riverbank scene, Azamgarh.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BAHRAICH",
      image: "/images/state-tiles/uttar-pradesh/bahraich-illustrated-v1.png",
      caption: "Illustrated Terai wetland scene, Bahraich.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BANDA",
      image: "/images/state-tiles/uttar-pradesh/banda-illustrated-v1.png",
      caption: "Illustrated Bundelkhand river and granite scene, Banda.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BIJNOR",
      image: "/images/state-tiles/uttar-pradesh/bijnor-illustrated-v1.png",
      caption: "Illustrated sugarcane and canal scene, Bijnor.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "SONBHADRA",
      image: "/images/state-tiles/uttar-pradesh/sonbhadra-illustrated-v1.png",
      caption: "Illustrated Vindhyan forest and gorge scene, Sonbhadra.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "CHANDAULI",
      image: "/images/state-tiles/uttar-pradesh/chandauli-illustrated-v2.png",
      caption: "Illustrated Kaimur foothill and stream scene, Chandauli.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "CHITRAKOOT",
      image: "/images/state-tiles/uttar-pradesh/chitrakoot-illustrated-v2.png",
      caption: "Illustrated Mandakini riverside scene, Chitrakoot.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "FARRUKHABAD",
      image: "/images/state-tiles/uttar-pradesh/farrukhabad-illustrated-v2.png",
      caption: "Illustrated block-printing and riverbank scene, Farrukhabad.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "LALITPUR",
      image: "/images/state-tiles/uttar-pradesh/lalitpur-illustrated-v2.png",
      caption: "Illustrated Bundelkhand temple and granite scene, Lalitpur.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BALRAMPUR",
      image: "/images/state-tiles/uttar-pradesh/balrampur-illustrated-v1.png",
      caption: "Illustrated Terai forest and paddy scene, Balrampur.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BARABANKI",
      image: "/images/state-tiles/uttar-pradesh/barabanki-illustrated-v1.png",
      caption: "Illustrated Awadhi orchard and paddy scene, Barabanki.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "DEORIA",
      image: "/images/state-tiles/uttar-pradesh/deoria-illustrated-v1.png",
      caption: "Illustrated eastern Gangetic plain scene, Deoria.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "ETAH",
      image: "/images/state-tiles/uttar-pradesh/etah-illustrated-v1.png",
      caption: "Illustrated mustard field and canal scene, Etah.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BAGHPAT",
      image: "/images/state-tiles/uttar-pradesh/baghpat-illustrated-v1.png",
      caption: "Illustrated Yamuna-side farming scene, Baghpat.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BALLIA",
      image: "/images/state-tiles/uttar-pradesh/ballia-illustrated-v1.png",
      caption: "Illustrated Ganga floodplain scene, Ballia.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "FATEHPUR",
      image: "/images/state-tiles/uttar-pradesh/fatehpur-illustrated-v1.png",
      caption: "Illustrated Doab farmland and water structure scene, Fatehpur.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BADAUN",
      image: "/images/state-tiles/uttar-pradesh/badaun-illustrated-v1.png",
      caption: "Illustrated western UP water pavilion and farmland scene, Badaun.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BASTI",
      image: "/images/state-tiles/uttar-pradesh/basti-illustrated-v1.png",
      caption: "Illustrated eastern UP river and paddy scene, Basti.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BHADOHI",
      image: "/images/state-tiles/uttar-pradesh/bhadohi-illustrated-v1.png",
      caption: "Illustrated weaving workshop scene, Bhadohi.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BULANDSHAHR",
      image: "/images/state-tiles/uttar-pradesh/bulandshahr-illustrated-v1.png",
      caption: "Illustrated village well and wheat-field scene, Bulandshahr.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "FIROZABAD",
      image: "/images/state-tiles/uttar-pradesh/firozabad-illustrated-v1.png",
      caption: "Illustrated glass-craft workshop scene, Firozabad.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "GHAZIPUR",
      image: "/images/state-tiles/uttar-pradesh/ghazipur-illustrated-v1.png",
      caption: "Illustrated Ganga-side farm and village scene, Ghazipur.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "HAMIRPUR",
      image: "/images/state-tiles/uttar-pradesh/hamirpur-illustrated-v1.png",
      caption: "Illustrated Bundelkhand river and granite scene, Hamirpur.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "HARDOI",
      image: "/images/state-tiles/uttar-pradesh/hardoi-illustrated-v1.png",
      caption: "Illustrated Awadhi lotus-pond and paddy scene, Hardoi.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "JALAUN",
      image: "/images/state-tiles/uttar-pradesh/jalaun-illustrated-v1.png",
      caption: "Illustrated Bundelkhand canal and granite scene, Jalaun.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "BAREILLY",
      image: "/images/state-tiles/uttar-pradesh/bareilly-illustrated-v1.png",
      caption: "Illustrated Rohilkhand orchard and sugarcane scene, Bareilly.",
      source: "illustrated",
      reviewed: true,
    },
    {
      district: "GONDA",
      image: "/images/state-tiles/uttar-pradesh/gonda-illustrated-v1.png",
      caption: "Illustrated Terai wetland and paddy scene, Gonda.",
      source: "illustrated",
      reviewed: true,
    },
  ],
};
