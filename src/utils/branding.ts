// Branding hygiene: the package/blog data was scraped from a reference site
// (namasteindiatrip.com). Its brand name and claims ("Ministry Approved",
// "Namaste India Trip") leaked into MQT's SEO titles, descriptions and copy.
// These helpers strip/replace that branding so MQT never presents itself
// under the reference site's name.

export const MQT_BRAND = "My Quick Trippers";

/** Replace the reference brand name with MQT's own in any text. */
export function replaceReferenceBrand(text: string | undefined | null): string {
  return (text || "")
    // Full company name first ("Namaste India Trip" -> "My Quick Trippers",
    // consuming the reference's "Trip" suffix), then bare "Namaste India".
    .replace(/Namaste India Trip\b/gi, MQT_BRAND)
    .replace(/Namaste India(?!n)/gi, MQT_BRAND)
    .replace(/Ministry Approved/gi, "")
    .trim();
}

/**
 * Rebuild a scraped SEO title into a clean MQT title:
 * - swaps "Namaste India Trip" -> "My Quick Trippers"
 * - drops "Ministry Approved" claims
 * - collapses empty | segments ("A |  | B" -> "A | B")
 * - drops MQT-brand segments: the root layout's title template
 *   ("%s | My Quick Trippers") appends the brand once, so pages must not
 *   carry it themselves (avoids "X | My Quick Trippers | My Quick Trippers")
 */
export function cleanScrapedTitle(raw: string | undefined | null): string {
  let t = replaceReferenceBrand(raw);
  t = t
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s !== MQT_BRAND)
    .join(" | ");
  return t;
}
