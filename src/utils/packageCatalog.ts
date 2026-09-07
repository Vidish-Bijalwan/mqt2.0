import { allPackages, type Package } from "@/data/allPackages";

/** Packages shorter than a three-day journey are retained in source data but not published. */
export const MINIMUM_PUBLISHED_TOUR_DAYS = 3;

/** Scraped utility pages that are not travel products and must not enter the package catalog. */
export const NON_PACKAGE_SLUGS = new Set([
  "book-now.php",
  "customer-center",
  "customer-satisfaction",
  "pay-online.php",
  "payment-guide",
  "payment-options",
  "payment-security",
  "privacy-policy",
  "testimonial",
]);

export function getTourDays(duration: string | undefined, title?: string): number | null {
  const match = `${duration || ""} ${title || ""}`.match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : null;
}

export function isArchivedPackage(pkg: Pick<Package, "slug" | "duration" | "title">): boolean {
  if (NON_PACKAGE_SLUGS.has(pkg.slug)) return true;
  const days = getTourDays(pkg.duration, pkg.title);
  return days !== null && days < MINIMUM_PUBLISHED_TOUR_DAYS;
}

export function isPublicPackage(pkg: Package): boolean {
  return !isArchivedPackage(pkg);
}

export function getPublicPackages(): Package[] {
  return allPackages.filter(isPublicPackage);
}

export function packageDurationGroup(pkg: Pick<Package, "duration" | "title">): "3-5" | "6-9" | "10+" | "custom" {
  const days = getTourDays(pkg.duration, pkg.title);
  if (days === null) return "custom";
  if (days <= 5) return "3-5";
  if (days <= 9) return "6-9";
  return "10+";
}
