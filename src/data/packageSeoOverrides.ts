/* ═══════════════════════════════════════════════════════════════════════
   packageSeoOverrides.ts — per-package <title> / meta description overrides.
   Used ONLY by generateMetadata in src/app/packages/[slug]/page.tsx.
   Does NOT change H1s, on-page copy, or the V1 noindex gate — reversible.
   ═══════════════════════════════════════════════════════════════════════ */

export interface PackageSeoOverride {
  /** Replaces the <title> (before the " | My Quick Trippers" suffix). */
  title?: string;
  /** Replaces the meta description (and OG/Twitter descriptions). */
  description?: string;
}

export const PACKAGE_SEO_OVERRIDES: Record<string, PackageSeoOverride> = {
  // GSC striking distance: pos 8.5, 53 impr, 0 clicks. Stays noindexed
  // (not in packageDetails.json V1 — copy is scraped V2/V3).
  "bhutan-tour-packages": {
    title: "Bhutan Tour Packages: Thimphu, Paro & Punakha Itineraries from India",
    description:
      "Plan a Bhutan trip from India: hike to Tiger's Nest monastery, explore Thimphu and Paro, cross Dochula Pass. See routes, best season and what's included in the package.",
  },
  // GSC striking distance: pos 11.4, 52 impr, 0 clicks. Stays noindexed (not in V1).
  "jama-masjid-agra": {
    title: "Jama Masjid, Agra: History, Architecture & Visitor Guide",
    description:
      "Jama Masjid in Agra — the 17th-century mosque built by Jahanara Begum, daughter of Shah Jahan. Its history, architecture highlights and how to include it in your Agra trip.",
  },
};
