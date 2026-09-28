/**
 * Group Trip Room — deterministic package matching.
 *
 * Scores REAL packages from the site catalog (getPublicPackages, which
 * excludes archived and non-package slugs) against the group's consensus
 * winners. Never invents slugs or prices — everything shown links to a real
 * /packages/[slug] page. Tie-breaks sort by slug so results are stable.
 */

import { type Package } from "@/data/allPackages";
import { getPublicPackages } from "@/utils/packageCatalog";
import type { PollCategory } from "./types";

export interface PackageMatch {
  pkg: Package;
  score: number;
  /** Short human-readable reasons, e.g. "Covers Kashmir". */
  reasons: string[];
}

const norm = (s: string) => s.toLowerCase();

/** [minDays, maxDays] per duration option. */
const DURATION_RANGES: Record<string, [number, number]> = {
  "3–4 days": [3, 4],
  "5–7 days": [5, 7],
  "8–10 days": [8, 10],
  "10+ days": [11, 90],
};

/** [minPrice, maxPrice] per budget option (Flexible => always a soft match). */
const BUDGET_BANDS: Record<string, [number, number] | null> = {
  "Under ₹25,000": [0, 24999],
  "₹25,000 – ₹40,000": [25000, 40000],
  "₹40,000 – ₹60,000": [40000, 60000],
  "₹60,000+": [60001, Number.MAX_SAFE_INTEGER],
  Flexible: null,
};

const ACTIVITY_KEYWORDS: Record<string, string[]> = {
  Adventure: ["adventure", "trek", "rafting", "paragliding", "ski", "camping", "biking"],
  Sightseeing: ["sightseeing", "sight seeing", "day tour", "city tour", "excursion"],
  Beaches: ["beach", "island", "coast", "seaside"],
  "Spiritual / pilgrimage": [
    "spiritual",
    "pilgrimage",
    "temple",
    "yatra",
    "darshan",
    "jyotirlinga",
    "chardham",
    "mosque",
    "church",
    "monastery",
  ],
  Wildlife: ["wildlife", "safari", "tiger", "national park", "bird"],
  "Food & culture": ["culture", "cultural", "heritage", "food", "cuisine", "festival"],
  "Snow & mountains": ["snow", "skiing", "himalaya", "himalayan", "mountain", "auli", "gulmarg"],
};

function parseDays(duration: string): number | null {
  const m = duration.match(/(\d+)\s*days?/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

function parsePrice(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function scoreDestination(pkg: Package, destination: string): { score: number; reason: string | null } {
  const d = norm(destination);
  const title = norm(pkg.title);
  const slug = norm(pkg.slug);
  const category = norm(pkg.category);
  const route = norm(pkg.route);
  if (title.includes(d)) return { score: 50, reason: `Covers ${destination}` };
  if (slug.includes(d.replace(/\s+/g, "-"))) return { score: 40, reason: `Covers ${destination}` };
  if (category.includes(d)) return { score: 30, reason: pkg.category };
  if (route.includes(d)) return { score: 20, reason: `Route via ${destination}` };
  return { score: 0, reason: null };
}

function scoreDuration(pkg: Package, duration: string): { score: number; reason: string | null } {
  const range = DURATION_RANGES[duration];
  const days = parseDays(pkg.duration);
  if (!range || days === null) return { score: 0, reason: null };
  const [lo, hi] = range;
  if (days >= lo && days <= hi) return { score: 30, reason: `${days}-day itinerary` };
  if (Math.abs(days - lo) <= 2 || Math.abs(days - hi) <= 2) return { score: 10, reason: null };
  return { score: 0, reason: null };
}

function scoreBudget(pkg: Package, budget: string): { score: number; reason: string | null } {
  const band = BUDGET_BANDS[budget];
  const price = parsePrice(pkg.dealPrice);
  if (band === null) return { score: 5, reason: null }; // "Flexible" is a soft match
  if (!band || price === null) return { score: 0, reason: null };
  return price >= band[0] && price <= band[1]
    ? { score: 20, reason: "Fits the group budget" }
    : { score: 0, reason: null };
}

function scoreActivities(pkg: Package, activities: string): { score: number; reason: string | null } {
  const keywords = ACTIVITY_KEYWORDS[activities];
  if (!keywords) return { score: 0, reason: null };
  const hay = norm(`${pkg.title} ${pkg.description} ${pkg.category}`);
  return keywords.some((k) => hay.includes(k)) ? { score: 15, reason: activities } : { score: 0, reason: null };
}

let catalogCache: Package[] | null = null;
function getCatalog(): Package[] {
  if (!catalogCache) catalogCache = getPublicPackages();
  return catalogCache;
}

/**
 * Deterministically score the real package catalog against the group's
 * consensus winners. Returns the top `limit` matches with score > 0.
 * Hotel level has no catalog signal, so it intentionally doesn't score.
 */
export function matchPackages(
  winners: Partial<Record<PollCategory, string>>,
  limit = 3,
): PackageMatch[] {
  const scored: PackageMatch[] = [];
  for (const pkg of getCatalog()) {
    let score = 0;
    const reasons: string[] = [];

    if (winners.destination) {
      const r = scoreDestination(pkg, winners.destination);
      score += r.score;
      if (r.reason) reasons.push(r.reason);
    }
    if (winners.duration) {
      const r = scoreDuration(pkg, winners.duration);
      score += r.score;
      if (r.reason) reasons.push(r.reason);
    }
    if (winners.budget) {
      const r = scoreBudget(pkg, winners.budget);
      score += r.score;
      if (r.reason) reasons.push(r.reason);
    }
    if (winners.activities) {
      const r = scoreActivities(pkg, winners.activities);
      score += r.score;
      if (r.reason) reasons.push(r.reason);
    }

    if (score > 0) scored.push({ pkg, score, reasons: reasons.slice(0, 3) });
  }
  scored.sort((a, b) => b.score - a.score || a.pkg.slug.localeCompare(b.pkg.slug));
  return scored.slice(0, Math.max(1, limit));
}

/** Test seam: clear the cached catalog. */
export function __clearMatcherCache(): void {
  catalogCache = null;
}
