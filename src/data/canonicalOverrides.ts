/* ═══════════════════════════════════════════════════════════════════════
   canonicalOverrides.ts — per-package canonical URL overrides.
   Reversible: no 301s. Used by generateMetadata in
   src/app/packages/[slug]/page.tsx via alternates.canonical.
   ═══════════════════════════════════════════════════════════════════════ */

import { siteConfig } from "@/data/siteConfig";

/** Maps a duplicate package slug to the slug its canonical should point at. */
export const PACKAGE_CANONICAL_OVERRIDES: Record<string, string> = {
  "shimla-tour": "shimla-tour-packages",
  // NOTE (2026-10-05): the "2-days-ayodhya-tour-package" override was
  // REMOVED — it pointed at "ayodhya-tour-packages", which 404s. The page
  // now self-canonicals. Never add an override whose target is not live.
  "3-days-nepal-tour-package": "nepal-tour-packages",
};

export function canonicalUrlForPackage(slug: string): string {
  const target = PACKAGE_CANONICAL_OVERRIDES[slug] ?? slug;
  return `${siteConfig.domain}/packages/${target}`;
}
