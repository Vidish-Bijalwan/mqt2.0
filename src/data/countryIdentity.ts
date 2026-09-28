import type { StateIdentity, StateMotifKey, StateSignature } from "./stateArtwork";

/**
 * Identity treatment for international destinations, mirroring the
 * per-state system: accent + ink (AA on accent), a motif key and a
 * signature module. Consumed by /destinations/[slug] when no explorer
 * profile exists (e.g. /destinations/dubai, /destinations/bali).
 */
export interface CountryIdentity {
  slug: string;
  name: string;
  identity: StateIdentity;
  motif: StateMotifKey;
  eyebrow: string;
  tagline: string;
  description: string;
  bestTime: string;
  signature: StateSignature;
}

const dubaiSignature: StateSignature = {
  layout: "route",
  eyebrow: "The emirates arc",
  title: "Skyline, souks and dune evenings",
  description:
    "Dubai rewards travellers who mix the superlatives with the old city — cross the creek by abra, climb the dunes at golden hour, and end the day high above the Marina.",
  stops: [
    { name: "Dubai", note: "Old souks, the Creek and Burj Khalifa sunsets.", href: "/destinations/dubai?destination=dubai" },
    { name: "Abu Dhabi", note: "Sheikh Zayed Grand Mosque and Saadiyat's shoreline.", href: "/destinations/dubai?destination=abu%20dhabi" },
    { name: "Desert safari", note: "Dune evenings, Tanoura and dinner under the stars.", href: "/destinations/dubai?destination=desert" },
  ],
};

const baliSignature: StateSignature = {
  layout: "grid",
  eyebrow: "The island circuit",
  title: "Temples, terraces and the Bukit cliffs",
  description:
    "Bali is three islands in one mood — spiritual Ubud, surfy Canggu and the dramatic limestone south. This circuit strings them together without the backtracking.",
  stops: [
    { name: "Uluwatu", note: "Cliff temples and the kecak fire dance at sunset.", image: "/images/packages/hi-bali-combo-tour.webp", href: "/destinations/bali?destination=uluwatu" },
    { name: "Ubud", note: "Rice terraces, craft villages and jungle spas.", href: "/destinations/bali?destination=ubud" },
    { name: "Nusa Penida", note: "Kelingking's cliff spine and manta-point snorkelling.", href: "/destinations/bali?destination=nusa%20penida" },
  ],
};

const thailandSignature: StateSignature = {
  layout: "grid",
  eyebrow: "Gulf & andaman",
  title: "Temples, night markets and two seas",
  description:
    "Thailand pairs Bangkok's beautiful chaos with island time on two different coasts — pick a side, or do both the way most first-timers should.",
  stops: [
    { name: "Bangkok", note: "Grand Palace mornings, Chao Phraya by night.", href: "/destinations/thailand?destination=bangkok" },
    { name: "Phuket", note: "Andaman blues and Big Buddha viewpoints.", href: "/destinations/thailand?destination=phuket" },
    { name: "Krabi", note: "Karst cliffs, Railay's coves and island hops.", href: "/destinations/thailand?destination=krabi" },
  ],
};

const sriLankaSignature: StateSignature = {
  layout: "route",
  eyebrow: "The pearl trail",
  title: "Ancient cities, hill tea and the south coast",
  description:
    "Sri Lanka compresses an entire continent of variety into one teardrop — climb Sigiriya at dawn, ride the hill-country railway, and finish on southern beaches.",
  stops: [
    { name: "Sigiriya", note: "The lion rock fortress at first light.", href: "/destinations/sri-lanka?destination=sigiriya" },
    { name: "Kandy", note: "Temple of the Tooth and the lake circuit.", href: "/destinations/sri-lanka?destination=kandy" },
    { name: "Ella", note: "Nine-arch bridge and tea-country hikes.", href: "/destinations/sri-lanka?destination=ella" },
  ],
};

const nepalSignature: StateSignature = {
  layout: "route",
  eyebrow: "Himalayan gateway",
  title: "Durbar squares, lakeside calm and jungle plains",
  description:
    "Nepal is the gentlest entry into the high Himalaya — medieval city squares, Pokhara's mirror lakes and rhino country in the Terai, all in one compact circuit.",
  stops: [
    { name: "Kathmandu", note: "Durbar squares and Boudhanath's kora.", href: "/destinations/nepal?destination=kathmandu" },
    { name: "Pokhara", note: "Phewa Lake and Annapurna sunrise points.", href: "/destinations/nepal?destination=pokhara" },
    { name: "Chitwan", note: "One-horned rhinos in the tall grass.", href: "/destinations/nepal?destination=chitwan" },
  ],
};

const bhutanSignature: StateSignature = {
  layout: "route",
  eyebrow: "The thunder dragon",
  title: "Dzongs, high valleys and the Tiger's Nest",
  description:
    "Bhutan measures itself in happiness, and it shows — fortresses that double as monasteries, valleys that feel untouched, and the most famous cliffside hike in the Himalaya.",
  stops: [
    { name: "Paro", note: "Tiger's Nest clinging to the cliff.", href: "/destinations/bhutan?destination=paro" },
    { name: "Thimphu", note: "The capital of calm and craft.", href: "/destinations/bhutan?destination=thimphu" },
    { name: "Punakha", note: "The great dzong where two rivers meet.", href: "/destinations/bhutan?destination=punakha" },
  ],
};

const vietnamSignature: StateSignature = {
  layout: "route",
  eyebrow: "From delta to bay",
  title: "Lantern towns, limestone bays and street-food cities",
  description:
    "Vietnam runs north to south like a highlight reel — Hanoi's old quarter, lantern-lit Hoi An and a thousand limestone islands rising out of Ha Long Bay.",
  stops: [
    { name: "Hanoi", note: "Old-quarter chaos and egg coffee.", href: "/destinations/vietnam?destination=hanoi" },
    { name: "Hoi An", note: "Lantern-lit lanes and tailor shops.", href: "/destinations/vietnam?destination=hoi%20an" },
    { name: "Ha Long Bay", note: "Overnight among the karst isles.", href: "/destinations/vietnam?destination=ha%20long" },
  ],
};

export const countryIdentities: Record<string, CountryIdentity> = {
  dubai: {
    slug: "dubai",
    name: "Dubai",
    identity: { accent: "#d9a441", ink: "#0a2f2a" },
    motif: "dunes",
    eyebrow: "Emirates",
    tagline: "Skyline icons, old souks and desert nights.",
    description: "Pair Dubai's superlatives with the old city's creek-side soul and a desert evening — the Emirates work best as a mix.",
    bestTime: "Nov–Mar",
    signature: dubaiSignature,
  },
  bali: {
    slug: "bali",
    name: "Bali",
    identity: { accent: "#e0764a", ink: "#0a2f2a" },
    motif: "fronds",
    eyebrow: "Indonesia",
    tagline: "Temple cliffs, rice terraces and island time.",
    description: "Bali blends spirituality, surf and jungle luxury into one easy island rhythm — temples at dawn, beaches by afternoon.",
    bestTime: "Apr–Oct",
    signature: baliSignature,
  },
  thailand: {
    slug: "thailand",
    name: "Thailand",
    identity: { accent: "#3fa7c4", ink: "#062a32" },
    motif: "coast-arcs",
    eyebrow: "Southeast Asia",
    tagline: "Temple cities and two seas of islands.",
    description: "Bangkok's beautiful chaos plus island time on the Gulf or the Andaman — Thailand is the region's easiest first trip.",
    bestTime: "Nov–Feb",
    signature: thailandSignature,
  },
  "sri-lanka": {
    slug: "sri-lanka",
    name: "Sri Lanka",
    identity: { accent: "#7bc043", ink: "#0a2f2a" },
    motif: "tea-leaves",
    eyebrow: "The pearl of the Indian Ocean",
    tagline: "Ancient cities, hill tea and leopard country.",
    description: "A teardrop of ancient capitals, misty tea hills and southern beaches — Sri Lanka packs a continent into one island.",
    bestTime: "Dec–Apr",
    signature: sriLankaSignature,
  },
  nepal: {
    slug: "nepal",
    name: "Nepal",
    identity: { accent: "#ad4638", ink: "#ffffff" },
    motif: "peaks",
    eyebrow: "Himalaya",
    tagline: "Durbar squares and the roof of the world.",
    description: "The gentlest doorway into the high Himalaya — medieval cities, lakeside Pokhara and jungle plains in one trip.",
    bestTime: "Oct–Nov · Mar–Apr",
    signature: nepalSignature,
  },
  bhutan: {
    slug: "bhutan",
    name: "Bhutan",
    identity: { accent: "#b98a3e", ink: "#0a2f2a" },
    motif: "pennants",
    eyebrow: "The last Shangri-La",
    tagline: "Dzongs, high valleys and Gross National Happiness.",
    description: "A Himalayan kingdom of fortress-monasteries and pristine valleys, measured in happiness rather than hurry.",
    bestTime: "Mar–May · Oct–Nov",
    signature: bhutanSignature,
  },
  vietnam: {
    slug: "vietnam",
    name: "Vietnam",
    identity: { accent: "#e3b23c", ink: "#0a2f2a" },
    motif: "lanterns",
    eyebrow: "Southeast Asia",
    tagline: "Lantern towns and limestone bays.",
    description: "From Hanoi's old quarter to lantern-lit Hoi An and the karst isles of Ha Long Bay — Vietnam runs like a highlight reel.",
    bestTime: "Oct–Apr",
    signature: vietnamSignature,
  },
};
