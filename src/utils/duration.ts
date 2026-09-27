/**
 * Lightweight duration parsing for package durations.
 *
 * Kept free of data imports on purpose: `packageCatalog.ts` imports the full
 * `allPackages` catalogue, so client components must import from here (or
 * receive pre-parsed values) instead — otherwise the whole catalogue gets
 * bundled into the client JavaScript.
 */

/** Extract the number of days from a duration/title string ("6 Nights / 7 Days" → 7). */
export function getTourDays(duration: string | undefined, title?: string): number | null {
  const match = `${duration || ""} ${title || ""}`.match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : null;
}

/** Group a package into the duration buckets used by the listing filters. */
export function packageDurationGroup(pkg: { duration?: string; title?: string }): "3-5" | "6-9" | "10+" | "custom" {
  const days = getTourDays(pkg.duration, pkg.title);
  if (days === null) return "custom";
  if (days <= 5) return "3-5";
  if (days <= 9) return "6-9";
  return "10+";
}
