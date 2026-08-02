import { allPackages } from "@/data/allPackages";
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
 * Full keyword phrases (e.g. "national park", "road trip") match as phrases;
 * single-word keywords match as substrings. Splitting phrases into words is
 * deliberately avoided — that would over-match and break reconciliation.
 */
export function matchPackages<T extends { title: string; category: string; description: string }>(
  packages: T[],
  exp: Pick<Experience, "keywords">,
): T[] {
  const terms = exp.keywords.map((k) => k.toLowerCase()).filter(Boolean);
  return packages.filter((pkg) => {
    const haystack = `${pkg.title} ${pkg.category} ${pkg.description}`.toLowerCase();
    return terms.some((t) => haystack.includes(t));
  });
}

export function experiencesWithCounts(): ExperienceWithCount[] {
  return experiences.map((exp) => ({
    ...exp,
    packageCount: matchPackages(allPackages, exp).length,
  }));
}
