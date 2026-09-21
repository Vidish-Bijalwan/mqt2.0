import { Package } from "@/data/allPackages";
import { getApprovedPackageImage } from "@/data/packageLocationMedia";

/**
 * Smart image mapping system to resolve the best possible image for a package.
 */
export function getPackageImage(pkg: Package, destSlug?: string): string {
  // `destSlug` is retained for the legacy function signature. The approved
  // resolver uses the package's own title, route and curated inventory match.
  void destSlug;
  return getApprovedPackageImage(pkg);
}
