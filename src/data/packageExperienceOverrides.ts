export interface PackageGalleryItem {
  src: string;
  caption: string;
}

export interface PackageExperienceOverride {
  heroSummary?: string;
  overview?: string;
  route?: string[];
  highlights?: string[];
  gallery?: PackageGalleryItem[];
}

/**
 * Editorial overrides are intentionally small and human-reviewed. The package
 * catalog still supplies the commercial facts; this file only enriches trips
 * whose route and visual story have been verified against the itinerary.
 */
export const packageExperienceOverrides: Record<string, PackageExperienceOverride> = {
  "3-days-madurai-rameshwaram-tour": {
    heroSummary:
      "Begin beneath Madurai's sculpted temple towers, cross the sea to Rameswaram, and follow the island road to Dhanushkodi's windswept shore.",
    overview:
      "This compact three-day journey pairs Madurai's living temple culture with the sacred corridors and sea horizons of Rameswaram. Begin with the colour and craftsmanship of Meenakshi Amman Temple, then travel across Pamban Bridge for Ramanathaswamy Temple, Agni Theertham and the island's coastal landmarks. A visit towards Dhanushkodi adds a dramatic final contrast: open water, salt air and the remains of a town at India's south-eastern edge.",
    route: ["Madurai", "Rameswaram", "Dhanushkodi", "Madurai"],
    highlights: [
      "See the sculpted gopurams and evening atmosphere of Meenakshi Amman Temple",
      "Walk the famously long painted corridors of Ramanathaswamy Temple",
      "Cross the Pamban sea bridge between mainland Tamil Nadu and Rameswaram Island",
      "Experience the ritual waterfront at Agni Theertham",
      "Follow the island road to Dhanushkodi's wide, wind-shaped coastline",
    ],
    gallery: [
      {
        src: "/images/packages/hi-3-days-madurai-rameshwaram-tour.webp",
        caption: "The richly sculpted gopuram of Meenakshi Amman Temple in Madurai",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/thirumalai-nayakkar-palace.jpg",
        caption: "The grand interior arches of Thirumalai Nayakkar Palace — Vinay Mundhada, CC BY-SA 3.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/ramanathaswamy-temple-corridor.jpg",
        caption: "Ramanathaswamy Temple's painted corridor in Rameswaram — Vensatry, CC BY-SA 3.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/pamban-rail-bridge.jpg",
        caption: "The historic Pamban railway bridge crossing the sea — N. Vivekananthamoorthy, CC BY-SA 4.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/dhanushkodi-beach.jpg",
        caption: "The open coastline at Dhanushkodi — Keerthi murugan 005, CC BY 4.0",
      },
      {
        src: "/images/packages/curated/madurai-rameswaram/agni-theertham.jpg",
        caption: "Pilgrims at Agni Theertham on the Rameswaram waterfront — S. P. Krishnamurthy, CC BY-SA 3.0",
      },
    ],
  },
  "10-days-assam-meghalaya-arunachal-pradesh-tour-packages": {
    heroSummary:
      "Track one-horned rhinos through Kaziranga, climb to Tawang's high Himalayan monasteries, then follow Meghalaya's waterfalls and living-root landscapes back to Guwahati.",
    overview:
      "This 11-day North-East expedition moves through three dramatically different worlds. It begins in Assam's river plains and the wild grasslands of Kaziranga, rises through orchid country, Sela Pass and the monastery town of Tawang, then softens into Meghalaya's cloud forests, waterfalls, living-root bridges and the clear waters of Dawki. Long mountain drives are balanced with full sightseeing days and unhurried evenings, giving the journey enough depth to feel discovered rather than rushed.",
    route: [
      "Guwahati",
      "Kaziranga",
      "Bomdila",
      "Tawang",
      "Dirang",
      "Cherrapunji",
      "Mawlynnong",
      "Dawki",
      "Shillong",
      "Guwahati",
    ],
    highlights: [
      "A guided wildlife safari through Kaziranga's one-horned rhino habitat",
      "The high-altitude road to Tawang via Sela Pass and Jaswant Garh",
      "Monasteries, Monpa craft traditions and the evening war memorial show in Tawang",
      "A full-day excursion to Bum La, PT Tso and the cinematic Madhuri Lake",
      "Meghalaya's great waterfall circuit, caves and mist-filled valleys",
      "Living-root landscapes at Mawlynnong and a boat ride on the Umngot River at Dawki",
    ],
    gallery: [
      {
        src: "/images/packages/hi-10-days-assam-meghalaya-arunachal-pradesh-tour-packages.webp",
        caption: "A one-horned rhinoceros in the forest habitat of Kaziranga, Assam",
      },
      {
        src: "/images/packages/interesting-facts-about-kaziranga-national-park.jpg",
        caption: "Kaziranga's one-horned rhinos moving across open grassland",
      },
      {
        src: "/images/packages/hi-arunachal-pradesh-tour-packages.webp",
        caption: "Tawang Monastery set high in the mountains of Arunachal Pradesh",
      },
      {
        src: "/images/packages/tawang-monastery.jpg",
        caption: "A wide mountain view of the Tawang monastery complex",
      },
      {
        src: "/images/packages/hi-meghalaya-tour-packages.webp",
        caption: "Nohkalikai Falls dropping through Meghalaya's forested cliffs",
      },
      {
        src: "/images/packages/hi-assam-tour-packages.webp",
        caption: "Kamakhya Temple, one of Guwahati's most important landmarks",
      },
      {
        src: "/images/packages/hi-shillong-cherrapunji-kamakhya-temple-tour.webp",
        caption: "Shillong spread across the green Khasi Hills",
      },
    ],
  },
};
