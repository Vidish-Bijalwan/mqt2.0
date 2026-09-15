// Shared price utilities (D16/D17).
//
// Canonical model (after the rename): `pkg.mrp` is the higher list price
// (crossed out) and `pkg.dealPrice` is the actual price shown to the customer.
// When dealPrice is missing we fall back to mrp; if neither is present the
// package is "Pricing on request".
//
// priceOverrides.json normalizes questionable scraped prices without mutating
// the raw catalogue. International packages use their original verified base
// price with the requested 2.5× multiplier here, the single pricing path used
// by cards, listings, package pages, and their structured data.

import priceOverrides from "@/data/priceOverrides.json";
import { allPackages } from "@/data/allPackages";
import { isInternationalPackage } from "@/utils/packageCatalog";

/** Prices below this amount are handled personally rather than advertised. */
export const MINIMUM_PUBLIC_PRICE = 10_000;

type PriceOverride = {
  mrp: string;
  dealPrice: string;
  originalMrp?: string;
  originalDealPrice?: string;
  estimated?: boolean;
};

const internationalPackageSlugs = new Set(
  allPackages.filter(isInternationalPackage).map((pkg) => pkg.slug),
);

function scaleInternationalPrice(value: number) {
  return Math.round(value * 2.5);
}

export function parseINR(s?: string): number {
  const cleaned = (s || "").replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export interface PriceInfo {
  mrp: number;
  deal: number;
  /** True when we have a real price to show (not the fallback flags). */
  hasPrice: boolean;
  /** Deal price (or mrp fallback) formatted en-IN, empty when no price. */
  display: string;
  /** MRP formatted for the strikethrough, empty when there's no discount. */
  crossed: string;
  /** Savings (mrp - deal) formatted en-IN, empty when there's no discount. */
  save: string;
}

export function getPriceInfo(mrp?: string, dealPrice?: string, slug?: string): PriceInfo {
  const override = slug ? (priceOverrides as Record<string, PriceOverride>)[slug] : undefined;
  const isInternational = Boolean(slug && internationalPackageSlugs.has(slug));

  // Overrides are pre-adjusted for domestic tours. For international tours,
  // start from each entry's original base so the multiplier is exactly 2.5×,
  // never 2.5× on top of a previous 1.5× adjustment.
  const originalMrp = parseINR(override?.originalMrp || mrp);
  const originalDeal = parseINR(override?.originalDealPrice || dealPrice);
  const hasUsableOriginal = originalDeal >= MINIMUM_PUBLIC_PRICE / 2.5 && originalMrp >= originalDeal;
  const estimatedBaseMrp = parseINR(override?.mrp || mrp) / 1.5;
  const estimatedBaseDeal = parseINR(override?.dealPrice || dealPrice) / 1.5;
  const unscaledMrp = isInternational
    ? hasUsableOriginal ? originalMrp : estimatedBaseMrp
    : parseINR(override?.mrp || mrp);
  const unscaledDeal = isInternational
    ? hasUsableOriginal ? originalDeal : estimatedBaseDeal
    : parseINR(override?.dealPrice || dealPrice);
  const mrpValue = isInternational ? scaleInternationalPrice(unscaledMrp) : unscaledMrp;
  const dealValue = isInternational ? scaleInternationalPrice(unscaledDeal) : unscaledDeal;

  // Scraper fallback flags — treat as "no price" so we never show fake deals.
  const isFallback = unscaledDeal === 2 || unscaledMrp === 2 || unscaledDeal === 24750;
  const deal = dealValue > 0 ? dealValue : mrpValue;
  const hasPrice = deal >= MINIMUM_PUBLIC_PRICE && !isFallback;
  const display = hasPrice ? deal.toLocaleString("en-IN") : "";
  const crossed = dealValue > 0 && mrpValue > dealValue ? mrpValue.toLocaleString("en-IN") : "";
  const save = dealValue > 0 && mrpValue > dealValue ? (mrpValue - dealValue).toLocaleString("en-IN") : "";

  return { mrp: mrpValue, deal: dealValue, hasPrice, display, crossed, save };
}
