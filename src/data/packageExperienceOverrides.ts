export interface PackageGalleryItem {
  src: string;
  caption: string;
}

export interface PackageItineraryDay {
  title: string;
  description: string;
}

export interface PackageExperienceOverride {
  heroSummary?: string;
  overview?: string;
  route?: string[];
  highlights?: string[];
  gallery?: PackageGalleryItem[];
  itinerary?: PackageItineraryDay[];
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
    itinerary: [
      {
        title: "Arrive in Madurai and meet the temple city",
        description: "Arrive in Madurai, settle in, and begin with the city’s living temple atmosphere. The day is kept flexible around your arrival, with time for a first look at Meenakshi Amman Temple’s sculpted gopurams and, when timings allow, the surrounding market streets. It is an easy opening that lets you absorb the scale and colour of the city before the coastal leg begins.",
      },
      {
        title: "Cross Pamban Bridge to Rameswaram",
        description: "After breakfast, travel east towards Rameswaram, with the sea crossing at Pamban marking the change from mainland Tamil Nadu to island landscapes. In Rameswaram, spend time around Ramanathaswamy Temple and its celebrated corridors, then continue to the waterfront at Agni Theertham. The sequence is planned around temple access and road conditions, leaving the evening unhurried.",
      },
      {
        title: "Dhanushkodi coast and onward departure",
        description: "Begin with the wind-shaped coast and wide horizons near Dhanushkodi, where the road runs towards the meeting of sea and sky. Return through Rameswaram for an unhurried final meal or a time-permitting stop, then begin the onward journey to Madurai or your confirmed departure point. It is a fitting close: temple heritage, island road, and open shoreline in one compact journey.",
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
    itinerary: [
      {
        title: "Arrive in Guwahati and travel to Kaziranga",
        description: "Meet the team in Guwahati and begin the drive into Assam’s river plains towards Kaziranga. The road day is paced with comfort stops, allowing you to arrive, settle in, and prepare for an early wildlife start rather than rushing straight into activities.",
      },
      {
        title: "Kaziranga wildlife and tea-country atmosphere",
        description: "Start early for a guided Kaziranga safari, timed around the park’s operating windows and the best light in the grasslands. The rest of the day stays deliberately spacious: a slower afternoon, local scenery, and time to recharge before the mountain roads ahead.",
      },
      {
        title: "Kaziranga to Bomdila through the foothills",
        description: "Leave the plains after breakfast and climb towards Bomdila, watching the landscape change from broad Assam to the Himalayan foothills. This is a scenic travel stage, so breaks are built in for views, meals, and a comfortable arrival rather than a tightly packed sightseeing list.",
      },
      {
        title: "Sela Pass road to Tawang",
        description: "Continue towards Tawang via the high mountain route around Sela Pass. The day is shaped around road, weather, and access conditions, with time for the mountain landscape and memorial stops where practical before reaching Tawang for a restful evening.",
      },
      {
        title: "Tawang monasteries, stories, and mountain views",
        description: "Spend a full day in and around Tawang, with its monastery heritage, local Monpa culture, and high-altitude views. The pace remains flexible enough for temple timings and quiet moments—this is the day to stay with the place rather than simply pass through it.",
      },
      {
        title: "Bum La and high-lake excursion, conditions permitting",
        description: "Take the high-road excursion towards Bum La, PT Tso, and the lakes around Tawang where permits, weather, and road access allow. If conditions call for a revised plan, the day stays within the Tawang area with equally meaningful monastery and local-culture time.",
      },
      {
        title: "Tawang to Dirang via the mountain valleys",
        description: "Begin the return through the mountains to Dirang, travelling at a sensible pace through valleys and changing elevations. The focus is on a comfortable road day, with viewing pauses and a relaxed arrival that keeps the long route enjoyable.",
      },
      {
        title: "Fly or drive south towards Meghalaya",
        description: "Transition from Arunachal’s mountain valleys towards Meghalaya, with the exact transport sequence confirmed against your dates and connections. It is a purposeful transfer day, balanced with rest so the next chapter begins with energy rather than fatigue.",
      },
      {
        title: "Cherrapunji waterfalls and cloud-forest landscapes",
        description: "Explore Cherrapunji’s misty plateau, waterfall country, and forested viewpoints at a pace that responds to the weather. The day leaves room for short walks and scenic pauses rather than locking you into an inflexible checklist.",
      },
      {
        title: "Mawlynnong, Dawki, and the Umngot River",
        description: "Travel through Meghalaya’s village and river landscapes towards Mawlynnong and Dawki. Where local conditions allow, spend time around the clear waters of the Umngot River, then return via the Khasi Hills with the evening set aside for a calm final night.",
      },
      {
        title: "Shillong to Guwahati departure",
        description: "After breakfast, leave Shillong for Guwahati and your confirmed onward connection. The transfer is planned with practical buffer time, bringing the journey to a smooth close after eleven days of wildlife, high mountains, monasteries, and cloud-forest roads.",
      },
    ],
  },
};
