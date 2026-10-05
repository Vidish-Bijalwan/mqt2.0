import { getPublicPackages } from "@/utils/packageCatalog";
import { experiences, type Experience } from "@/data/experiencesData";

/* ═══════════════════════════════════════════════════════════════════════
   experienceCounts.ts — SERVER-ONLY.
   Computes the real number of packages that match each experience category
   by keyword-matching package title/category/description. Imported only by
   server components so the huge allPackages file never reaches the client.
   ═══════════════════════════════════════════════════════════════════════ */

export interface ExperienceWithCount extends Experience {
  packageCount: number;
}

/**
 * Shared matcher — the SINGLE source of truth for which packages belong to
 * an experience. Used by BOTH the count helper and the category page listing
 * so the number shown on a card always equals the packages listed on its page.
 *
 * Matching rules:
 * - Full keyword phrases (e.g. "national park", "road trip") match as phrases
 *   (substring, case-insensitive). Splitting phrases into words is deliberately
 *   avoided — that would over-match and break reconciliation.
 * - Single-word keywords match on WORD BOUNDARIES (\bkw\b), not substrings,
 *   so "fort" no longer matches "comfort" and "hospital" no longer matches
 *   "hospitality"-style neighbours.
 * - Tiered matching: when the experience defines strongKeywords/weakKeywords,
 *   a package matches if >= 1 STRONG keyword matches OR >= 2 distinct WEAK
 *   keywords match. Bare generic words (e.g. "adventure" alone) can no longer
 *   pull in dozens of unrelated packages.
 * - Experiences without tiers behave as before: any keyword (word-boundary)
 *   match qualifies.
 */
export function matchPackages<T extends { title: string; category: string; description: string }>(
  packages: T[],
  exp: Pick<Experience, "keywords" | "strongKeywords" | "weakKeywords" | "strongTitleOnly">,
): T[] {
  const strongTerms = (exp.strongKeywords ?? exp.keywords).map((k) => k.toLowerCase()).filter(Boolean);
  const weakTerms = (exp.weakKeywords ?? []).map((k) => k.toLowerCase()).filter(Boolean);

  // Compile each term once per call: phrases -> substring; single words -> \b regex.
  const compile = (term: string): ((haystack: string) => boolean) => {
    if (term.includes(" ")) {
      return (haystack) => haystack.includes(term);
    }
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    return (haystack) => re.test(haystack);
  };
  const strongMatchers = strongTerms.map(compile);
  const weakMatchers = weakTerms.map(compile);

  return packages.filter((pkg) => {
    const titleCat = `${pkg.title} ${pkg.category}`.toLowerCase();
    const haystack = `${titleCat} ${pkg.description}`.toLowerCase();
    // strongTitleOnly: broad strong terms (e.g. "history") are contamination
    // when they appear only in a generic itinerary description.
    const strongHay = exp.strongTitleOnly ? titleCat : haystack;
    if (strongMatchers.some((m) => m(strongHay))) return true;
    if (weakMatchers.length > 0) {
      let weakHits = 0;
      for (const m of weakMatchers) {
        if (m(haystack) && ++weakHits >= 2) return true;
      }
    }
    return false;
  });
}

export function experiencesWithCounts(): ExperienceWithCount[] {
  // Zero-match experiences are thin empty category pages — hide them from
  // every listing surface (experiences index, homepage explorer, related
  // lists). The category URLs still resolve directly.
  return experiences
    .map((exp) => ({
      ...exp,
      packageCount: matchPackages(getPublicPackages(), exp).length,
    }))
    .filter((exp) => exp.packageCount > 0);
}
