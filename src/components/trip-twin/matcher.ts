/** Deterministic package matching: scores REAL packages from allPackages.ts
 * against a traveler personality. Never invents slugs, destinations or prices. */

import { allPackages, type Package } from "@/data/allPackages";
import type { Personality, PersonalityId } from "./personalities";
import type { Answers } from "./questions";

export interface ScoredPackage {
  pkg: Package;
  /** Total score (includes the price-display nudge). */
  score: number;
  /** Score from relevance signals only — 0 means "nothing sensible". */
  signal: number;
}

/** Parse "11 Days / 10 Nights" → 11. Returns null when unparseable. */
export function parseTripDays(duration: string): number | null {
  const m = duration.match(/(\d+)\s*days?/i);
  return m ? parseInt(m[1], 10) : null;
}

function durationBandFor(answer: string | undefined): [number, number] | null {
  switch (answer) {
    case "weekend": return [2, 4];
    case "week": return [5, 8];
    case "long": return [9, 14];
    case "epic": return [15, Number.POSITIVE_INFINITY];
    default: return null;
  }
}

const CATEGORY_POINTS = 5;
const DURATION_POINTS = 4;
const KEYWORD_POINTS = 2;
const MAX_KEYWORD_BONUS = 10;
const PRICE_POINTS = 2; // small nudge so results more often show a real price

/** Fallback categories when nothing scores — still real packages. */
const FALLBACK_CATEGORIES = ["Pilgrimage", "Adventure", "Wildlife"];

export function scorePackages(
  personality: Personality,
  answers: Answers,
): ScoredPackage[] {
  const band = durationBandFor(answers["duration"]);
  const scored: ScoredPackage[] = allPackages.map((pkg) => {
    let signal = 0;

    // 1) Category match (exact, from the real catalog taxonomy).
    if (personality.categories.includes(pkg.category)) {
      signal += CATEGORY_POINTS;
    }

    // 2) Terrain / theme keywords across title, route, highlights, description.
    const haystack = [pkg.title, pkg.route, pkg.description, ...(pkg.highlights ?? [])]
      .join(" ")
      .toLowerCase();
    let keywordHits = 0;
    for (const kw of personality.keywords) {
      if (haystack.includes(kw.toLowerCase())) keywordHits += 1;
    }
    signal += Math.min(keywordHits * KEYWORD_POINTS, MAX_KEYWORD_BONUS);

    // 3) Duration fit — only count trips inside the user's chosen window.
    const days = parseTripDays(pkg.duration);
    if (band && days !== null && days >= band[0] && days <= band[1]) {
      signal += DURATION_POINTS;
    }

    // 4) Small nudge for packages that actually list a price — results
    //    that show a real price are more useful. Never invents one.
    //    Not part of `signal`: it must not mask "nothing sensible".
    let score = signal;
    if (pkg.dealPrice && pkg.dealPrice.trim()) {
      score += PRICE_POINTS;
    }

    return { pkg, score, signal };
  });

  // Deterministic ordering: score desc, then slug asc (stable, no randomness).
  scored.sort((a, b) => b.score - a.score || a.pkg.slug.localeCompare(b.pkg.slug));
  return scored;
}

export function topMatches(
  personality: Personality,
  answers: Answers,
  count = 3,
): ScoredPackage[] {
  const scored = scorePackages(personality, answers);
  const top = scored.filter((s) => s.signal > 0).slice(0, count);
  if (top.length > 0) return top;

  // Fallback: top-rated pilgrimage / adventure / wildlife packages by category.
  // Still 100% real catalog data; sorted by slug for determinism.
  return allPackages
    .filter((p) => FALLBACK_CATEGORIES.includes(p.category))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .slice(0, count)
    .map((pkg) => ({ pkg, score: 0, signal: 0 }));
}

/** The price to display, or null when the catalog lists none. Never invented. */
export function displayPrice(pkg: Package): string | null {
  const p = (pkg.dealPrice ?? "").trim();
  return p ? p : null;
}

/** Convenience: top 3 real packages for a personality + answers. */
export function matchPackagesFor(
  personality: Personality,
  answers: Answers,
): Package[] {
  return topMatches(personality, answers).map((s) => s.pkg);
}

export function personalityIdOf(p: Personality): PersonalityId {
  return p.id;
}
