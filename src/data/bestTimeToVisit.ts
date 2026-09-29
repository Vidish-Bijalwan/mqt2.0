/**
 * Best-time-to-visit data for MQT's top Indian destinations.
 *
 * Editorial policy (do not loosen without review):
 * - Only broad, well-established seasonal facts. No invented precision:
 *   no temperature decimals, no fabricated festivals or events.
 * - Keep reasons qualitative and plain-language: weather, crowds, cost.
 * - If unsure about a destination, leave it OUT of this file.
 */

export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export interface DestinationSeason {
  /** URL-safe key, used for anchors (e.g. #destination-rajasthan). */
  slug: string;
  /** Display name shown on the page. */
  name: string;
  /** State / region label. */
  region: string;
  /** One-line summary of the verdict. */
  tagline: string;
  /** Months (1-12) considered the best time to visit. */
  bestMonths: number[];
  /** Human-readable best window, e.g. "Oct – Mar". */
  bestWindow: string;
  /** Why these months — weather, crowds, cost. Plain language. */
  bestReason: string;
  /** Months (1-12) best avoided or approached with caution. */
  avoidMonths: number[];
  /** Why these months are tricky, plain language. */
  avoidReason: string;
  /** What the weather is honestly like across the year (qualitative). */
  weather: string;
  /** Crowd / season-demand notes. */
  crowds: string;
  /** Cost / pricing-season notes. */
  cost: string;
}

const m = (arr: number[]) => arr;

export const DESTINATIONS: DestinationSeason[] = [
  {
    slug: "rajasthan",
    name: "Rajasthan",
    region: "Jaipur · Udaipur · Jodhpur · Jaisalmer",
    tagline: "Palaces, forts and desert towns are at their best in the cool winter months.",
    bestMonths: m([10, 11, 12, 1, 2, 3]),
    bestWindow: "Oct – Mar",
    bestReason:
      "Days are pleasantly warm and evenings cool, so sightseeing on foot — forts, palaces, old-city bazaars — is comfortable. This is also when desert towns are most enjoyable.",
    avoidMonths: m([5, 6]),
    avoidReason:
      "Peak summer heat makes daytime sightseeing genuinely difficult; many travellers restrict outings to early mornings and late evenings.",
    weather:
      "A desert climate: very hot summers, a short monsoon, and mild, dry winters with cool nights.",
    crowds:
      "December and January are the busiest months — book stays early. Shoulder months (Oct, Nov, Feb, Mar) are a sweet spot with good weather and thinner crowds.",
    cost:
      "Heritage hotels and desert camps charge their highest rates in Dec–Jan. You'll find better value in Oct–Nov and Feb–Mar.",
  },
  {
    slug: "kerala",
    name: "Kerala",
    region: "Kochi · Munnar · Alleppey · Kovalam",
    tagline: "Backwaters and hill stations shine from post-monsoon through winter.",
    bestMonths: m([9, 10, 11, 12, 1, 2, 3]),
    bestWindow: "Sep – Mar",
    bestReason:
      "The monsoon leaves everything green, the backwaters are full, and the weather is warm but comfortable. Houseboat cruises and hill-station drives are at their most pleasant.",
    avoidMonths: m([6, 7]),
    avoidReason:
      "Peak southwest-monsoon months bring very heavy rain that can disrupt backwater cruises and beach plans.",
    weather:
      "Tropical and humid year-round. Heavy monsoon rain Jun–Aug, pleasant warmth Sep–Mar, hot and humid Apr–May.",
    crowds:
      "Dec–Jan is peak season for houseboats and beach resorts. Sep–Nov sees fewer visitors with nearly as good weather.",
    cost:
      "Houseboats and resorts are priced highest in Dec–Jan. Sep–Oct and Feb–Mar usually offer better rates.",
  },
  {
    slug: "himachal-pradesh",
    name: "Himachal Pradesh",
    region: "Shimla · Manali · Dharamshala · Dalhousie",
    tagline: "Two sweet spots: summer escape season and crisp, clear autumn.",
    bestMonths: m([4, 5, 6, 9, 10, 11]),
    bestWindow: "Apr – Jun & Sep – Nov",
    bestReason:
      "Apr–Jun brings cool mountain air when the plains are scorching; Sep–Nov brings clear blue skies and the best mountain views of the year.",
    avoidMonths: m([7, 8]),
    avoidReason:
      "Monsoon months bring heavy rain and a real risk of landslides and road blocks on hill routes.",
    weather:
      "Pleasant summers in the hills, heavy monsoon rain Jul–Aug, cold winters with snowfall at higher altitudes from Dec–Feb.",
    crowds:
      "May–Jun is peak family-holiday season — expect crowds and traffic on the main routes. Sep–Nov is calmer and clearer.",
    cost:
      "Hotels peak in May–Jun and around Christmas–New Year. Autumn (Sep–Nov) generally offers better value.",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    region: "Srinagar · Gulmarg · Pahalgam · Sonmarg",
    tagline: "Spring blossoms to autumn gold — most of the year except deep winter.",
    bestMonths: m([3, 4, 5, 6, 7, 8, 9, 10]),
    bestWindow: "Mar – Oct",
    bestReason:
      "Spring brings blossoms, summer is cool and green, and autumn paints the valley gold. Houseboats, meadows and lakes are all accessible and enjoyable.",
    avoidMonths: m([12, 1, 2]),
    avoidReason:
      "Deep winter brings intense cold and heavy snow; many high routes close and sightseeing is limited (Gulmarg excepted, for snow).",
    weather:
      "Four distinct seasons: blossoming spring, cool summer, golden autumn, and a snowy winter.",
    crowds:
      "Summer (May–Aug) is the busiest. Spring and autumn are quieter with arguably the prettiest scenery.",
    cost:
      "Houseboats and hotels peak in summer. Spring and autumn bookings are easier on the pocket.",
  },
  {
    slug: "goa",
    name: "Goa",
    region: "North Goa · South Goa",
    tagline: "Classic beach season: dry, sunny winter months.",
    bestMonths: m([11, 12, 1, 2]),
    bestWindow: "Nov – Feb",
    bestReason:
      "Dry, sunny days and cool evenings — ideal beach weather. Shacks are open, the sea is calm, and the festive season adds to the atmosphere.",
    avoidMonths: m([6, 7, 8, 9]),
    avoidReason:
      "Monsoon months bring heavy rain, rough seas and red-flagged beaches; most shacks shut down.",
    weather:
      "Tropical coastal: hot and humid Mar–May, heavy monsoon Jun–Sep, dry and pleasant Nov–Feb.",
    crowds:
      "Christmas–New Year is the absolute peak — crowded and expensive. Early Nov and Feb are calmer with the same good weather.",
    cost:
      "Prices spike sharply around Christmas and New Year. The weeks before and after are far better value.",
  },
  {
    slug: "uttarakhand",
    name: "Uttarakhand",
    region: "Nainital · Mussoorie · Rishikesh · Jim Corbett",
    tagline: "Hill-station weather in summer, clear Himalayan views in autumn.",
    bestMonths: m([3, 4, 5, 6, 9, 10, 11]),
    bestWindow: "Mar – Jun & Sep – Nov",
    bestReason:
      "Spring and early summer are perfect for lakes, treks and river towns; autumn brings washed-clean skies and the sharpest views of the snow peaks.",
    avoidMonths: m([7, 8]),
    avoidReason:
      "Monsoon rain makes hill roads risky and can disrupt treks, rafting and wildlife safaris.",
    weather:
      "Cool hill summers, heavy monsoon Jul–Aug, crisp clear autumns, and cold winters with snow at altitude.",
    crowds:
      "May–Jun is peak holiday season in Nainital and Mussoorie. Sep–Nov is quieter with better visibility.",
    cost:
      "Summer-holiday rates are highest in May–Jun. Autumn is generally cheaper and calmer.",
  },
  {
    slug: "agra",
    name: "Agra",
    region: "Uttar Pradesh",
    tagline: "The Taj Mahal rewards early mornings in the cool season.",
    bestMonths: m([10, 11, 12, 1, 2, 3]),
    bestWindow: "Oct – Mar",
    bestReason:
      "Cool, dry weather makes sunrise visits and long walks around the monuments comfortable. Winter mornings can be misty but atmospheric.",
    avoidMonths: m([5, 6]),
    avoidReason:
      "Extreme summer heat makes midday sightseeing exhausting; the marble forecourts radiate heat.",
    weather:
      "North-Indian plains climate: scorching summers, monsoon Jul–Sep, cool dry winters with occasional fog.",
    crowds:
      "Nov–Feb is the busiest, especially weekends and holidays. Weekday mornings are the calmest time at the Taj.",
    cost:
      "Agra is a day-trip city for many, so hotel prices stay moderate; peak winter weekends cost more.",
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    region: "Uttar Pradesh",
    tagline: "Ghats, boats and evening aarti are best in the cool, dry months.",
    bestMonths: m([10, 11, 12, 1, 2, 3]),
    bestWindow: "Oct – Mar",
    bestReason:
      "Comfortable temperatures for dawn boat rides and evening walks along the ghats. The river is at a good level for boating.",
    avoidMonths: m([5, 6]),
    avoidReason:
      "Fierce summer heat makes daytime exploring very tiring; the monsoon (Jul–Sep) swells the river and can flood the lower ghats.",
    weather:
      "Hot summers, monsoon Jul–Sep, and cool, dry winters with foggy mornings in Dec–Jan.",
    crowds:
      "Winter is peak pilgrimage and tourist season. Early mornings on the river are peaceful even in peak months.",
    cost:
      "Riverside hotels charge more in the winter peak; shoulder months offer better deals.",
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    region: "Leh · Nubra Valley · Pangong Lake",
    tagline: "A short, precious summer window when the high passes open.",
    bestMonths: m([5, 6, 7, 8, 9]),
    bestWindow: "May – Sep",
    bestReason:
      "The mountain passes open and roads to Nubra and Pangong become accessible. Days are sunny and pleasant at altitude; the landscape is stark and spectacular.",
    avoidMonths: m([11, 12, 1, 2, 3]),
    avoidReason:
      "Harsh winter: extreme cold, heavy snow, and closed passes cut off most of the region. Only for the very prepared.",
    weather:
      "High-altitude desert: intense sun and big day-night temperature swings in summer; bitterly cold, snowbound winters.",
    crowds:
      "Jun–Aug is peak season on the Leh–Manali and Leh–Srinagar routes. May and September are quieter with open roads.",
    cost:
      "Flights and stays peak Jun–Aug. Shoulder months (May, Sep) are cheaper and less crowded.",
  },
  {
    slug: "darjeeling",
    name: "Darjeeling",
    region: "West Bengal",
    tagline: "Tea gardens and Kanchenjunga views in spring and autumn.",
    bestMonths: m([3, 4, 5, 10, 11]),
    bestWindow: "Mar – May & Oct – Nov",
    bestReason:
      "Clear skies give the best chance of seeing Kanchenjunga at sunrise; tea gardens are lush and the toy train runs in good weather.",
    avoidMonths: m([7, 8]),
    avoidReason:
      "Monsoon brings persistent cloud, heavy rain and frequent landslides on the hill roads.",
    weather:
      "Cool year-round. Misty monsoon Jul–Sep, crisp clear autumns, cold winters with occasional frost.",
    crowds:
      "Spring and autumn are both popular but never overwhelming. Winter is quiet and very cold.",
    cost:
      "Heritage hotels price highest in the spring and autumn windows; winter is the budget season.",
  },
  {
    slug: "andaman-nicobar",
    name: "Andaman & Nicobar",
    region: "Port Blair · Havelock · Neil Island",
    tagline: "Calm seas and clear water for diving from late autumn to spring.",
    bestMonths: m([11, 12, 1, 2, 3, 4]),
    bestWindow: "Nov – Apr",
    bestReason:
      "Calm seas, good visibility for snorkelling and diving, and reliable ferry schedules between islands.",
    avoidMonths: m([6, 7, 8, 9]),
    avoidReason:
      "Monsoon brings rough seas, cancelled ferries and murky water — most water activities shut down.",
    weather:
      "Tropical island climate: warm and humid year-round, with monsoon rain roughly May–Sep.",
    crowds:
      "Dec–Jan is peak season for the islands. Nov and Feb–Apr are calmer with equally good sea conditions.",
    cost:
      "Island resorts peak in Dec–Jan. Ferries and stays are easier to book and cheaper in the shoulder months.",
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand",
    tagline: "Rafting, yoga and Ganga aarti outside the monsoon months.",
    bestMonths: m([2, 3, 4, 5, 9, 10, 11]),
    bestWindow: "Feb – May & Sep – Nov",
    bestReason:
      "Pleasant weather for rafting, treks and riverside cafés. The Ganga is at good levels and the ghats are lively.",
    avoidMonths: m([7, 8]),
    avoidReason:
      "Monsoon swells the river dangerously — rafting is suspended and riverside paths can flood.",
    weather:
      "Foothill climate: warm summers, heavy monsoon Jul–Aug, pleasant autumns, cool winters.",
    crowds:
      "Weekends and the yoga season (Feb–Apr) draw crowds. Weekdays are relaxed even in good months.",
    cost:
      "Rafting camps and riverside stays are moderately priced year-round; monsoon is cheapest but activities are off.",
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    region: "Punjab",
    tagline: "The Golden Temple gleams in the cool Punjabi winter.",
    bestMonths: m([10, 11, 12, 1, 2, 3]),
    bestWindow: "Oct – Mar",
    bestReason:
      "Cool, dry weather suits long walks around the temple complex, the old city food trail and the Wagah border ceremony.",
    avoidMonths: m([5, 6]),
    avoidReason:
      "Peak summer heat in the Punjab plains makes daytime sightseeing draining.",
    weather:
      "Plains climate: very hot summers, monsoon Jul–Sep, cool winters with foggy mornings.",
    crowds:
      "Weekends and winter holidays are busy at the Golden Temple. Early mornings are serene year-round.",
    cost:
      "Generally affordable; winter weekends and holidays push hotel prices up.",
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    tagline: "The city is most enjoyable in its dry, breezy winter.",
    bestMonths: m([11, 12, 1, 2]),
    bestWindow: "Nov – Feb",
    bestReason:
      "Dry days, sea breezes and comfortable evenings — perfect for the Gateway, Marine Drive and Elephanta day trips.",
    avoidMonths: m([6, 7, 8, 9]),
    avoidReason:
      "One of India's heaviest monsoons: relentless rain, waterlogged streets and disrupted local trains.",
    weather:
      "Hot and humid most of the year, with an intense monsoon Jun–Sep and a mild, dry winter.",
    crowds:
      "Winter is peak season. The monsoon months are the quietest (and cheapest) if you don't mind the rain.",
    cost:
      "Hotels are priciest Nov–Feb. Monsoon brings the year's best hotel deals.",
  },
  {
    slug: "hampi",
    name: "Hampi",
    region: "Karnataka",
    tagline: "Boulder-strewn ruins are best explored in the cool dry season.",
    bestMonths: m([10, 11, 12, 1, 2]),
    bestWindow: "Oct – Feb",
    bestReason:
      "Mild days make it possible to walk or cycle between temples for hours — impossible in the Deccan summer heat.",
    avoidMonths: m([4, 5]),
    avoidReason:
      "Scorching summer heat on exposed rock terrain; shade is scarce among the ruins.",
    weather:
      "Deccan plateau climate: hot dry summers, monsoon Jun–Sep, mild dry winters.",
    crowds:
      "A backpacker favourite — busy Dec–Jan but never overwhelming. Oct–Nov and Feb are ideal balances.",
    cost:
      "Budget-friendly year-round; guesthouses fill up fastest in Dec–Jan.",
  },
];

/** Destinations (slugs) that are good in a given month (1-12), in data order. */
export function destinationsForMonth(month: number): DestinationSeason[] {
  return DESTINATIONS.filter((d) => d.bestMonths.includes(month));
}

/** All destinations sorted alphabetically by name. */
export const DESTINATIONS_AZ: DestinationSeason[] = [...DESTINATIONS].sort((a, b) =>
  a.name.localeCompare(b.name),
);
