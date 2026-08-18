// Shared price utilities (D16/D17).
//
// Canonical model (after the rename): `pkg.mrp` is the higher list price
// (crossed out) and `pkg.dealPrice` is the actual price shown to the customer.
// When dealPrice is missing we fall back to mrp; if neither is present the
// package is "Pricing on request".
//
// Part B: priceOverrides.json contains 1.5x adjusted prices for packages
// that had real scraped prices. The override is applied here so the original
// allPackages.ts data stays untouched.

import priceOverrides from "@/data/priceOverrides.json";

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
  // Check for 1.5x adjusted prices first (Part B override)
  const override = slug ? (priceOverrides as Record<string, { mrp: string; dealPrice: string }>)[slug] : undefined;
  const effectiveMrp = override?.mrp || mrp;
  const effectiveDeal = override?.dealPrice || dealPrice;

  const mrpValue = parseINR(effectiveMrp);
  const dealValue = parseINR(effectiveDeal);

  // Scraper fallback flags — treat as "no price" so we never show fake deals.
  const isFallback = dealValue === 2 || mrpValue === 2 || dealValue === 24750;
  const hasPrice = (mrpValue > 0 || dealValue > 0) && !isFallback;

  const deal = dealValue > 0 ? dealValue : mrpValue;
  const display = hasPrice ? deal.toLocaleString("en-IN") : "";
  const crossed = dealValue > 0 && mrpValue > dealValue ? mrpValue.toLocaleString("en-IN") : "";
  const save = dealValue > 0 && mrpValue > dealValue ? (mrpValue - dealValue).toLocaleString("en-IN") : "";

  return { mrp: mrpValue, deal: dealValue, hasPrice, display, crossed, save };
}
