import type { PackageCommercial } from "@/types/commercial";

/**
 * Per-package commercial configurations. OPERATOR GUIDE:
 *
 * 1. `includes` — plain-language inclusions. Source them from the package's
 *    published itinerary/copy. Never invent an inclusion.
 * 2. `componentValues` — real rupee values of the bundle components, used to
 *    compute the "bundle advantage". Leave as null (or any value null) until
 *    you have REAL numbers — the UI hides the savings row automatically.
 *    Every value SHOULD carry a `basis` note (where the figure comes from).
 * 3. `tiers[].verified` — set true only when differences + price match real,
 *    bookable inventory. Unverified tiers render differences with a
 *    "Price on enquiry" CTA instead of a price.
 * 4. `tiers[].badge` — neutral labels only ("Popular configuration") unless
 *    real booking data backs a popularity claim (then badgeVerified: true).
 * 5. `offers` — offers are config, not copy. EARLY_BIRD needs a real
 *    expiresAt + inventorySource; VALUE_BONUS needs comparisonBasis before
 *    any "Value ₹X" is shown; GROUP_UNLOCK shows the unlock RULE (never a
 *    live "N more travellers" counter — we have no live booking feed).
 * 6. Cost fields (supplierCost, reserves, margins) are operator-confidential.
 *    They are used server-side by the engine for floor checks and are never
 *    rendered.
 */

const badrinathKedarnathCommercial: PackageCommercial = {
  slug: "badrinath-kedarnath-yatra-from-haridwar",
  displayName: "Badrinath–Kedarnath Essentials",
  // occupancyNote omitted — twin-sharing not confirmed in package copy.
  taxNote: "All applicable taxes are included in your final confirmed quote.",
  includes: [
    { label: "4 nights in checked, clean hotels", detail: "Handpicked stays on the Haridwar – Guptkashi – Kedarnath – Badrinath route" },
    { label: "Private car with mountain-experienced drivers", detail: "Drivers with years of experience on Himalayan roads" },
    { label: "Fresh, tasty meals on the route", detail: "As per the published meal plan" },
    { label: "Completely guided yatra", detail: "From Haridwar departure to return" },
    { label: "Darshan assistance with quick entry passes" },
    { label: "Senior-friendly pacing with planned rest stops", detail: "Extra buffer hours built in for weather delays" },
  ],
  // No verified component costs yet → savings row hidden automatically.
  // OPERATOR: fill real values (e.g. contracted hotel + transport rates) to
  // unlock the "Bundle advantage" row, e.g.
  //   { label: "4 nights hotels (twin sharing)", value: 14000, basis: "Contracted hotel rates, Sep 2026" },
  componentValues: null,
  bundleBasis: undefined,
  tiers: [
    {
      id: "essential",
      name: "Essential",
      tagline: "The complete Do Dham yatra, as described",
      // Matches priceOverrides.json dealPrice for this slug (₹34,500).
      priceFrom: 34500,
      differences: [
        { label: "Private car with mountain-experienced driver", included: true },
        { label: "Clean, checked hotels — 4 nights", included: true },
        { label: "Guided darshan with quick entry passes", included: true },
        { label: "Flexible, senior-friendly pacing", included: true },
      ],
      tierParam: "essential",
      verified: true,
    },
    {
      id: "comfort",
      name: "Comfort",
      tagline: "Roomier stays and a more relaxed pace",
      priceFrom: null, // OPERATOR: set a real starting price to show it.
      badge: "Comfort upgrade",
      differences: [
        { label: "Everything in Essential", included: true },
        { label: "Deluxe room upgrade", included: true, note: "Where available" },
        { label: "Dedicated trip host on call", included: true },
        { label: "Meals upgraded to breakfast + dinner", included: true, note: "Where available" },
      ],
      tierParam: "comfort",
      verified: false,
    },
    {
      id: "premium",
      name: "Premium",
      tagline: "The most effortless way to do Do Dham",
      priceFrom: null, // OPERATOR: set a real starting price to show it.
      differences: [
        { label: "Everything in Comfort", included: true },
        { label: "Best available hotels on the route", included: true, note: "Subject to confirmation" },
        { label: "VIP darshan assistance", included: true, note: "Where available" },
        { label: "Priority support line during the yatra", included: true },
      ],
      tierParam: "premium",
      verified: false,
    },
  ],
  // No live offers on the pilot yet. Add offers here following the Offer
  // type — e.g. a GROUP_UNLOCK rule or an EARLY_BIRD with a real expiresAt
  // and inventorySource. The engine validates every offer before display.
  offers: [],
  // OPERATOR: fill real costs to enable margin floor checks.
  supplierCost: null,
};

export const packageCommercialConfigs: Record<string, PackageCommercial> = {
  [badrinathKedarnathCommercial.slug]: badrinathKedarnathCommercial,
};

export function getPackageCommercial(slug: string): PackageCommercial | null {
  return packageCommercialConfigs[slug] ?? null;
}
