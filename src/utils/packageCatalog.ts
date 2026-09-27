import { allPackages, type Package } from "@/data/allPackages";
import { getTourDays } from "@/utils/duration";
export { getTourDays, packageDurationGroup } from "@/utils/duration";

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

/** Legacy imports contain a few Indian tours under the International label. */
export function isInternationalPackage(pkg: Package): boolean {
  if (pkg.category !== "International") return false;
  return !/\badi kailash\b|chennai mahabalipuram/i.test(`${pkg.title} ${pkg.slug}`);
}
