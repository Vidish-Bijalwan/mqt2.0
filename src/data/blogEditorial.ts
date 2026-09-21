import type { ContentBlock } from "@/types/content";

export type BlogCategory =
  | "Destination Guides"
  | "Food & Cuisine"
  | "Culture & Heritage"
  | "Mountains & Adventure"
  | "Pilgrimage"
  | "Travel Planning"
  | "Wildlife"
  | "Beaches & Backwaters";

export interface EditorialBlogSeed {
  slug: string;
  title: string;
}

const ARCHIVE_PATTERN = /\barchives?\b|^travel-theme__/i;
const OFF_BRAND_PATTERN = /(?:carnival\s+valor|repositioning\s+cruise|liveaboard|travel\s+alarm\s+clock|private\s+jet\s+myth|new\s+york\s+city|pink\s+lakes?\s+(?:from|in)\s+the\s+world|best\s+exercises?\s+for\s+(?:a\s+)?long\s+road)/i;

const CATEGORY_RULES: Array<{ category: BlogCategory; pattern: RegExp; tags: string[] }> = [
  { category: "Food & Cuisine", pattern: /\b(?:foods?|cuisine|restaurants?|cafes?|coffee|tea|street\s+foods?|dish(?:es)?|culinary|eat(?:ing)?)\b/i, tags: ["food", "cuisine", "restaurants", "local food", "travel dining"] },
  { category: "Pilgrimage", pattern: /yatra|temple|dham|jyotirlinga|spiritual|shrine|pilgrim|monastery|buddh(?:ist|ism)|church|mosque|gurdwara|kailash|darshan/i, tags: ["pilgrimage", "temples", "spiritual travel", "faith journeys"] },
  { category: "Wildlife", pattern: /wildlife|tiger|bird(?:ing)?|safari|national\s+park|sanctuary|corbett|animal/i, tags: ["wildlife", "safari", "national parks", "nature"] },
  { category: "Mountains & Adventure", pattern: /trek|adventure|rafting|camping|bungee|ski|snow|glacier|mountain|hill\s+station|valley|waterfall|hiking|climb|paragliding/i, tags: ["adventure", "mountains", "treks", "outdoors"] },
  { category: "Beaches & Backwaters", pattern: /beach|coast|coastal|island|backwater|sea\b|shore|goa|andaman|lakshadweep/i, tags: ["beaches", "backwaters", "coastal travel", "islands"] },
  { category: "Culture & Heritage", pattern: /heritage|history|museum|palace|fort|festival|culture|craft|art\b|dance|architecture|monument/i, tags: ["heritage", "culture", "history", "local experiences"] },
  { category: "Travel Planning", pattern: /how\s+to|tips?|plan|budget|pack(?:ing)?|solo|hotel|resort|stay|visa|travel(?:ling)?\s+alone|honeymoon/i, tags: ["travel planning", "trip tips", "stays", "itinerary advice"] },
];

const CATEGORY_DEFAULTS: Record<BlogCategory, { focus: string; planning: string[]; moments: string[] }> = {
  "Food & Cuisine": {
    focus: "local flavours and the places that make them memorable",
    planning: ["Keep one meal free each day for a local recommendation instead of booking every table in advance.", "Tell your travel consultant about dietary preferences before stays and meal stops are confirmed.", "Balance famous dishes with neighbourhood markets and family-run places for a fuller sense of the destination."],
    moments: ["A food-led walk can turn a transfer day into one of the most memorable parts of a holiday.", "Seasonal ingredients, regional breakfasts and an unhurried dinner often reveal more than a rushed sightseeing stop."],
  },
  "Pilgrimage": {
    focus: "a respectful, well-paced faith journey",
    planning: ["Check seasonal access, registration requirements and temple timings before fixing travel dates.", "Build in buffer time for weather, queues and the slower pace that many sacred places deserve.", "Choose stays and transfers that reduce fatigue, particularly for senior travellers and families."],
    moments: ["The best pilgrimage plans leave room for prayer, reflection and local customs—not only photo stops.", "A considered route makes the journey feel calmer from the first transfer to the final darshan."],
  },
  "Wildlife": {
    focus: "responsible encounters with landscapes and wildlife",
    planning: ["Match safari windows and park permits to the season rather than assuming every month offers the same sightings.", "Choose naturalist-led experiences and keep a little flexibility for weather and park regulations.", "Pack neutral layers, binoculars and patience; wildlife travel is about the habitat as much as a checklist."],
    moments: ["A quiet morning in the forest can be just as valuable as a single headline sighting.", "Responsible travel protects the habitats that make these journeys possible."],
  },
  "Mountains & Adventure": {
    focus: "mountain time, fresh air and a journey paced for the terrain",
    planning: ["Keep transfer days realistic: mountain roads, weather and viewpoints all take longer than a map suggests.", "Choose activities that suit the group’s fitness and allow a rest window before demanding days.", "Carry layers, comfortable footwear and a flexible mindset for changing weather."],
    moments: ["A well-paced mountain itinerary leaves room for viewpoints, chai stops and the unexpected.", "The most rewarding adventures feel considered—not crammed."],
  },
  "Beaches & Backwaters": {
    focus: "unhurried coastlines, water journeys and time to slow down",
    planning: ["Plan around the right weather window and leave space for a sunset or a slow morning by the water.", "Pair busy beach towns with a quieter stay for balance.", "Confirm water activities locally, as sea conditions and timings can change."],
    moments: ["The best coastal days usually need less scheduling and more room to linger.", "A thoughtful stay location can make the difference between a busy visit and a restorative break."],
  },
  "Culture & Heritage": {
    focus: "stories, architecture and everyday culture beyond the obvious highlights",
    planning: ["Check opening days, local observances and realistic visiting windows before locking the route.", "Combine marquee landmarks with a market, neighbourhood walk or craft encounter.", "Use a guide where context changes the experience, especially at layered historic sites."],
    moments: ["Culture is often found in the pauses between landmarks: a conversation, a craft, a local meal.", "A slower route gives each place a chance to feel like more than a pin on a map."],
  },
  "Travel Planning": {
    focus: "the practical choices that make travel feel easy",
    planning: ["Start with dates, traveller needs and a comfortable daily pace before comparing hotels or transport.", "Keep a small buffer in both time and budget for real-world changes.", "Ask for clear inclusions so the itinerary is easy to compare and easy to enjoy."],
    moments: ["Good planning should create more freedom on the road, not a tighter checklist.", "The right itinerary feels personal because it starts with how you want to travel."],
  },
  "Destination Guides": {
    focus: "a destination worth seeing with more context and less rush",
    planning: ["Choose a travel window that suits the experience you want, not simply the first available dates.", "Group nearby sights together and keep room for local recommendations.", "Discuss transfer pace, hotel style and interests before turning a wish list into a route."],
    moments: ["A great destination is remembered for its rhythm as much as its headline sights.", "The strongest travel days leave room for discovery between the planned moments."],
  },
};

function hash(value: string) {
  return [...value].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7);
}

export function isPublishedBlog(seed: EditorialBlogSeed) {
  return !ARCHIVE_PATTERN.test(`${seed.slug} ${seed.title}`) && !OFF_BRAND_PATTERN.test(`${seed.slug} ${seed.title}`);
}

export function getBlogCategory(seed: EditorialBlogSeed): BlogCategory {
  const source = `${seed.title} ${seed.slug.replace(/[-_]/g, " ")}`;
  return CATEGORY_RULES.find((rule) => rule.pattern.test(source))?.category ?? "Destination Guides";
}

export function getBlogTags(seed: EditorialBlogSeed) {
  const category = getBlogCategory(seed);
  const locationTerms = seed.title
    .replace(/\b(?:best|top|most|famous|complete|guide|travel|places?|visit|things?|to|in|the|and|for|with|from|of|a|an)\b/gi, " ")
    .split(/[^a-zA-Z]+/)
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 3)
    .slice(0, 5);
  return [...new Set([...CATEGORY_RULES.find((rule) => rule.category === category)?.tags ?? [], ...locationTerms])];
}

export function getEditorialSnippet(seed: EditorialBlogSeed) {
  const category = getBlogCategory(seed);
  return `Plan ${seed.title.toLowerCase()} with practical ${CATEGORY_DEFAULTS[category].focus}, curated by the My Quick Trippers travel team.`;
}

export function getEditorialBlocks(seed: EditorialBlogSeed): ContentBlock[] {
  const category = getBlogCategory(seed);
  const detail = CATEGORY_DEFAULTS[category];
  const version = hash(seed.slug);
  const opening = [
    `${seed.title} is more rewarding when the journey is shaped around the right season, a comfortable pace and the people you are travelling with. This My Quick Trippers guide focuses on ${detail.focus}.`,
    `There is more to ${seed.title} than a quick list of stops. With a little thought around timing, stays and travel flow, it can become a trip that feels considered from the first day.`,
    `At My Quick Trippers, we believe ${seed.title} deserves an itinerary built around the experience—not a copied checklist. Start with what you want to feel, then build the route around it.`,
  ][version % 3];

  return [
    { type: "p", text: opening },
    { type: "h2", text: "Plan the experience around your pace" },
    { type: "p", text: `Every traveller sees this journey differently. Families may value relaxed transfers and reliable stays; friends may want fuller days; couples may prefer more unhurried time. A tailored My Quick Trippers itinerary brings those choices together before you book.` },
    { type: "ul", items: detail.planning },
    { type: "h2", text: "What makes the journey memorable" },
    { type: "p", text: detail.moments[version % detail.moments.length] },
    { type: "h2", text: "Turn the idea into a My Quick Trippers journey" },
    { type: "p", text: `Tell us your travel dates, group size and priorities. Our team can help turn ${seed.title.toLowerCase()} into a practical route with the right stays, transfers and experiences for your trip.` },
  ];
}
