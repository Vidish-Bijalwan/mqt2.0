/** Trip Twin traveler personalities — 6 deterministic archetypes. */

export type PersonalityId =
  | "himalayan-nomad"
  | "heritage-wanderer"
  | "beach-drifter"
  | "jungle-seeker"
  | "pilgrim-soul"
  | "adrenaline-chaser";

export interface Personality {
  id: PersonalityId;
  name: string;
  hook: string;
  description: string;
  /** Package categories (from allPackages.ts) that suit this personality. */
  categories: string[];
  /** Keywords matched against package title / route / highlights / description. */
  keywords: string[];
  /** Accent color used on the result card (canvas + UI). */
  accent: string;
}

/** Tie-break order for equal scores — deterministic, never random. */
export const PERSONALITY_ORDER: PersonalityId[] = [
  "himalayan-nomad",
  "heritage-wanderer",
  "beach-drifter",
  "jungle-seeker",
  "pilgrim-soul",
  "adrenaline-chaser",
];

export const PERSONALITIES: Record<PersonalityId, Personality> = {
  "himalayan-nomad": {
    id: "himalayan-nomad",
    name: "Himalayan Nomad",
    hook: "You'd rather wake up above the clouds than beside a hotel pool.",
    description:
      "Thin air, high passes and long winding roads — that's your happy place. You travel to feel small in the best possible way.",
    categories: ["North India", "North East India", "Adventure"],
    keywords: [
      "ladakh", "leh", "kashmir", "himachal", "spiti", "uttarakhand",
      "trek", "mountain", "himalaya", "valley", "snow", "manali",
      "shimla", "sikkim", "arunachal", "meghalaya", "nubra", "pangong",
      "darjeeling", "gangtok", "kedarnath",
    ],
    accent: "#7DD3FC",
  },
  "heritage-wanderer": {
    id: "heritage-wanderer",
    name: "Heritage Wanderer",
    hook: "You don't visit places — you time-travel through them.",
    description:
      "Forts, palaces and thousand-year-old streets pull you in. Every monument is a chapter, and you're reading the whole book.",
    categories: ["North India", "East India", "West India", "Uttar Pradesh", "South India"],
    keywords: [
      "heritage", "fort", "palace", "taj", "agra", "jaipur", "rajasthan",
      "udaipur", "jodhpur", "jaisalmer", "khajuraho", "delhi", "mughal",
      "monument", "haveli", "ajanta", "ellora", "hampi", "mysore",
      "hyderabad", "lucknow", "varanasi",
    ],
    accent: "#F2B544",
  },
  "beach-drifter": {
    id: "beach-drifter",
    name: "Beach Drifter",
    hook: "Your perfect plan is no plan, somewhere the waves outnumber the worries.",
    description:
      "Salt in the air, sand in your shoes, and a hammock with your name on it. You measure a trip in sunsets, not sightseeing lists.",
    categories: ["West India", "South India", "International"],
    keywords: [
      "beach", "goa", "andaman", "maldives", "bali", "island", "sea",
      "coast", "lakshadweep", "phuket", "thailand", "kovalam", "pondicherry",
      "gokarna", "varkala",
    ],
    accent: "#2DD4BF",
  },
  "jungle-seeker": {
    id: "jungle-seeker",
    name: "Jungle Seeker",
    hook: "While others chase sunsets, you chase pugmarks.",
    description:
      "Dense forests, dawn safaris and the electric silence before a tiger appears. The wild is where you feel most alive.",
    categories: ["Wildlife", "North East India", "South India", "North India"],
    keywords: [
      "safari", "tiger", "wildlife", "jungle", "national park", "ranthambore",
      "corbett", "kaziranga", "gir", "forest", "reserve", "sanctuary",
      "sundarban", "periyar", "bandhavgarh", "kanha", "rhino", "elephant",
    ],
    accent: "#86EFAC",
  },
  "pilgrim-soul": {
    id: "pilgrim-soul",
    name: "Pilgrim Soul",
    hook: "You pack light but carry centuries of faith.",
    description:
      "Sacred rivers, ancient temples and mountain shrines — your journeys are measured in blessings, not miles.",
    categories: ["Pilgrimage", "Uttar Pradesh", "North India"],
    keywords: [
      "pilgrimage", "temple", "yatra", "chardham", "kedarnath", "badrinath",
      "vaishno", "ayodhya", "jyotirlinga", "rameshwaram", "tirupati",
      "amarnath", "mathura", "vrindavan", "dham", "ganga", "puri",
      "dwarka", "somnath", "kashi",
    ],
    accent: "#FDA4AF",
  },
  "adrenaline-chaser": {
    id: "adrenaline-chaser",
    name: "Adrenaline Chaser",
    hook: "If it doesn't raise your heartbeat, it's not on the itinerary.",
    description:
      "Rafting rapids, paragliding ridges and roads that make others nervous. Comfort zones are just places you drive through fast.",
    categories: ["Adventure", "Helicopter", "North India", "North East India"],
    keywords: [
      "adventure", "rafting", "paragliding", "bungee", "trek", "bike",
      "biking", "motorbike", "helicopter", "ski", "camping", "expedition",
      "zipline", "kayak", "climb", "parasailing", "scuba", "snorkel",
      "atv", "dune",
    ],
    accent: "#FB923C",
  },
};

export function getPersonality(id: PersonalityId): Personality {
  return PERSONALITIES[id];
}
