/**
 * Package Voice Guide — MyQuickTrippers (mqt2.0)
 *
 * This file is a WRITER'S GUIDE, not a template engine. It exists so that
 * future rewrites (human or agent) keep package copy varied, honest and
 * human — instead of drifting back into Mad-Libs sameness.
 *
 * There are intentionally NO string-interpolation factories here. Every
 * package rewrite is hand-written. This guide tells the writer what music
 * to play, not which notes.
 *
 * ---------------------------------------------------------------------------
 * 1. COMMERCIAL HONESTY (non-negotiable)
 * ---------------------------------------------------------------------------
 * - Rewrite the VOICE, never the facts. If the catalog says "4 nights
 *   hotels", the rewrite says it more excitingly — it does NOT add "5-star",
 *   "free upgrade", "all-inclusive", or any inclusion/price/availability
 *   the data doesn't state.
 * - Day plans must follow the catalog route and duration. Don't invent
 *   stops, don't extend or shorten the trip.
 * - Seasonal claims (Tulip Festival, skiing, "best time") must stay
 *   conditional — "in season", "in winter" — never promised year-round.
 * - Where the render pipeline falls back matters: heroSummary (hero) and
 *   overview/highlights/itinerary (packageExperienceOverrides) take
 *   precedence over scraped blocks. Prefer adding an editorial override to
 *   rewriting scraped data; never delete scraped fields to make an
 *   override "win".
 *
 * ---------------------------------------------------------------------------
 * 2. PER-DESTINATION VOICE NOTES (pilot set)
 * ---------------------------------------------------------------------------
 * Each destination gets ONE voice. Hold it across heroSummary, overview,
 * highlights and itinerary for that package.
 *
 * - badrinath-kedarnath-yatra-from-haridwar — PILGRIM-REVERENT. Quiet,
 *   devotional register; slow sentences; intimate second person ("your part
 *   is simply to walk in"). No exclamation marks, no sales energy. The
 *   mountains are sacred, not scenic backdrops.
 * - kashmir-tour-packages — LYRICAL-SENSORY. Romantic but grounded in
 *   specifics: shikara woodwork, kahwa from a samovar, chinar gold.
 *   Avoid the word "paradise" unless you've earned it with a concrete image.
 * - goa-tour-packages — SUN-SOAKED PLAYFUL. Brisk, witty, short sentences.
 *   Susegad with a pulse. North = buzz, South = hush; the forest interior
 *   is the surprise third act.
 * - best-of-kerala-tour — LANGUID-LUSH. Long, slow sentences; the copy
 *   itself should feel unhurried. Green-on-green imagery, water as a
 *   recurring motif. Never rush the reader.
 * - discover-majestic-rajasthan — REGAL STORYTELLER. Courtly, cinematic;
 *   cities as chapters in an epic. Colour words do heavy lifting (amber,
 *   indigo, pink). History with affection, not a textbook.
 * - enchanting-himachal — FIRESIDE IDYLL. Warm, cosy, pine-scented.
 *   Sensory and domestic: woodsmoke, ridge walks, café lanes. The
 *   mountains as a home you visit, not a conquest.
 * - ladakh-tour-packages — STARK-ELEMENTAL. Terse. Short declarative
 *   bursts; rock/sky/water/light as the only adjectives that matter.
 *   Altitude is treated with respect, never bravado.
 * - dubai-tour-packages — GLOSSY METROPOLIS. Confident, sleek, assured.
 *   Superlatives allowed only when literally true (tallest, largest).
 *   Old Dubai is the contrast that makes the new Dubai interesting.
 * - bali-tour-packages — ISLAND-DREAMY. Soft and unhurried; frangipani,
 *   incense, gamelan. Spiritual-lite, never preachy. The island slows
 *   you down — let the sentences do the same.
 * - golden-triangle-tour-packages — CURATOR'S TOUR. Crisp, knowledgeable
 *   guide voice; history with a wink ("side one of the greatest-hits
 *   album"). Assumes an intelligent first-timer.
 *
 * ---------------------------------------------------------------------------
 * 3. STRUCTURAL PATTERNS (vary them — never use the same one twice in a row)
 * ---------------------------------------------------------------------------
 * - Overview openers: rotate between (a) a scene-setting image, (b) a quiet
 *   thesis statement, (c) a direct address to the reader, (d) a small
 *   paradox ("the city that treats 'impossible' as a rough draft").
 *   Never open two packages with "X is a land of...".
 * - Itinerary day titles: vary the format per package — "Day One — ...",
 *   "Day 1 · ...", "Day 1: ..." — and vary whether titles are poetic
 *   ("the blue hour, all day") or plain ("Jaipur — ramparts and farewell").
 * - Itinerary rhythm: alternate long travel days with slow days ON THE PAGE
 *   too — a one-sentence day description after a dense one is a feature.
 * - Highlights bullets: mix noun-led ("Amber Fort, City Palace...") and
 *   verb-led ("Walk a spice plantation...") lists across packages; keep
 *   every package to 6–8 bullets, each under ~20 words.
 * - heroSummary: one or two sentences, the whole trip in a breath. No
 *   prices, no CTAs, no exclamation marks.
 *
 * ---------------------------------------------------------------------------
 * 4. BANNED CLICHÉS (do not use; find the concrete image instead)
 * ---------------------------------------------------------------------------
 * - "nestled", "boasts of", "feast of senses", "treat all year round"
 * - "immerse yourself", "hidden gem", "off the beaten path"
 * - "vibrant tapestry", "rich tapestry", "mesmerizing", "enchanting" as
 *   filler (it's fine inside a proper noun like a package title)
 * - "paradise on earth", "heaven on earth", "God's own country" (unless
 *   quoting Kerala's actual tagline, sparingly)
 * - "breathtaking" — budget: max once per package, zero is better
 * - "absolutely wonderful", "amazing", "incredible" as sentence fillers
 * - "Book now and experience...", "So don't wait...", "What are you
 *   waiting for" — hard-sell CTAs
 * - "Welcome to..." openers; "See More"/"Places You'll See" residue
 * - More than one exclamation mark per package. Ideally zero.
 * - "land of X" constructions ("land of kings" is grandfathered for
 *   Rajasthan only — it earned it)
 *
 * ---------------------------------------------------------------------------
 * 5. LENGTH & MECHANICS
 * ---------------------------------------------------------------------------
 * - description (allPackages): 1–2 sentences, ~140–220 chars. Used in hero
 *   fallback and meta description — front-load the concrete nouns.
 * - heroSummary: 1–2 sentences, no prices, no CTA.
 * - overview: ~120–180 words. Facts first, music second.
 * - itinerary day: 2–4 sentences each; include distances/times ONLY where
 *   the catalog states them (e.g. "210 km / 8–9 hrs").
 * - Plain text only: no markdown (**bold** is stripped by the renderer),
 *   no "See More", typographic quotes fine.
 * - Keep the "Day N" numbering matching the catalog duration exactly.
 */
export const PACKAGE_VOICE_GUIDE_VERSION = "2026-09-28-pilot";

export const BANNED_CLICHES: string[] = [
  "nestled",
  "boasts of",
  "feast of senses",
  "treat all year round",
  "immerse yourself",
  "hidden gem",
  "off the beaten path",
  "vibrant tapestry",
  "rich tapestry",
  "paradise on earth",
  "heaven on earth",
  "absolutely wonderful",
  "book now and experience",
  "so don't wait",
  "what are you waiting for",
  "welcome to",
];

export const PILOT_VOICES: Record<string, string> = {
  "badrinath-kedarnath-yatra-from-haridwar": "pilgrim-reverent",
  "kashmir-tour-packages": "lyrical-sensory",
  "goa-tour-packages": "sun-soaked playful",
  "best-of-kerala-tour": "languid-lush",
  "discover-majestic-rajasthan": "regal storyteller",
  "enchanting-himachal": "fireside idyll",
  "ladakh-tour-packages": "stark-elemental",
  "dubai-tour-packages": "glossy metropolis",
  "bali-tour-packages": "island-dreamy",
  "golden-triangle-tour-packages": "curator's tour",
};
