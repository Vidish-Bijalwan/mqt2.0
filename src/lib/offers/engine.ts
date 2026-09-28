/**
 * MQT offer engine — the single place where commercial logic lives.
 *
 * Pure functions (no JSX, no Next.js). Safe to run server-side / at build
 * time. It NEVER returns operator-confidential cost fields; the
 * PricingEvaluation it produces is customer-safe.
 *
 * Flow per the spec:
 *  1. Load package commercial config (+ centralized defaults)
 *  2. Load costs
 *  3. Determine eligible offers (per-type rules)
 *  4. Apply valid incentives / value bonuses
 *  5. Calculate expected contribution + contribution %
 *  6. Reject any offer that breaches the configured margin floor
 *  7. Return customer-facing pricing information
 */

import { commercialDefaults } from "@/data/commercial/defaults";
import { getPackageCommercial } from "@/data/commercial/packages";
import type {
  EvaluatedOffer,
  Offer,
  PackageCommercial,
  PricingEvaluation,
} from "@/types/commercial";

function isFuture(iso?: string, now: Date = new Date()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t > now.getTime();
}

/**
 * Per-type eligibility. An offer that fails its type's requirements is
 * ineligible and never rendered — the UI does not second-guess this.
 */
export function evaluateOffer(
  offer: Offer,
  now: Date = new Date(),
): EvaluatedOffer {
  if (!offer.active) {
    return { offer, eligible: false, displayValue: null, ineligibilityReason: "inactive" };
  }

  switch (offer.type) {
    case "EARLY_BIRD": {
      // Only real, dated, inventory-backed early-bird offers may be shown.
      if (!offer.expiresAt || !isFuture(offer.expiresAt, now)) {
        return { offer, eligible: false, displayValue: null, ineligibilityReason: "no valid expiry" };
      }
      if (!offer.inventorySource) {
        return { offer, eligible: false, displayValue: null, ineligibilityReason: "no inventory source" };
      }
      return { offer, eligible: true, displayValue: offer.offerAmount ?? null };
    }
    case "VALUE_BONUS": {
      // The bonus is always real; the VALUE figure needs a comparison basis.
      const displayValue =
        offer.comparisonBasis && offer.bonusValue != null ? offer.bonusValue : null;
      return { offer, eligible: true, displayValue };
    }
    case "GROUP_UNLOCK": {
      // Renders the unlock RULE (e.g. "Groups of 6+ unlock ₹750/person").
      // Live "N more travellers" counters are not shown — no live feed.
      return { offer, eligible: true, displayValue: offer.offerAmount ?? null };
    }
    case "UPGRADE":
    case "WALLET_CREDIT":
    case "REFERRAL":
      return { offer, eligible: true, displayValue: offer.offerAmount ?? offer.referralReward ?? null };
    default:
      return { offer, eligible: false, displayValue: null, ineligibilityReason: "unknown type" };
  }
}

/**
 * Bundle advantage = sum(component values) − public price.
 * Returns null unless EVERY component has a real value and the result is
 * positive. Never fabricated, never negative-shown.
 */
export function computeBundleAdvantage(
  config: PackageCommercial,
  publicPrice: number,
): number | null {
  const values = config.componentValues;
  if (!values || values.length === 0) return null;
  if (values.some((c) => c.value == null || c.value <= 0)) return null;
  const total = values.reduce((sum, c) => sum + (c.value as number), 0);
  const advantage = total - publicPrice;
  return advantage > 0 ? Math.round(advantage) : null;
}

function resolvePct(pkg: number | undefined, fallback: number): number {
  return typeof pkg === "number" && Number.isFinite(pkg) ? pkg : fallback;
}

/**
 * Full pricing evaluation for a package at a given public price.
 * Returns null when the package has no commercial config.
 */
export function evaluatePricing(
  slug: string,
  publicPrice: number,
  now: Date = new Date(),
): PricingEvaluation | null {
  const config = getPackageCommercial(slug);
  if (!config) return null;

  const d = commercialDefaults;
  const minimumMarginPct = resolvePct(config.minimumMarginPct, d.minimumMarginPct);

  const evaluatedOffers = config.offers.map((o) => evaluateOffer(o, now));

  // Bonus value shown to customers: only bonuses with a comparison basis.
  const bonusesValue = evaluatedOffers
    .filter((e) => e.eligible && e.offer.type === "VALUE_BONUS")
    .reduce((sum, e) => {
      const items = e.offer.bonusItems ?? [];
      const itemsTotal = items.reduce((s, b) => s + (b.value ?? 0), 0);
      const bonusTotal = e.offer.bonusValue ?? itemsTotal;
      return e.offer.comparisonBasis ? sum + bonusTotal : sum;
    }, 0);

  const bundleAdvantage = computeBundleAdvantage(config, publicPrice);

  // ── Contribution math (operator-confidential inputs, safe outputs) ──
  const supplierCost = config.supplierCost ?? null;
  let expectedContribution: number | null = null;
  let contributionPct: number | null = null;
  const floorViolations: { offerId: string; reason: string }[] = [];

  if (supplierCost != null && publicPrice > 0) {
    const paymentCost = publicPrice * (resolvePct(config.paymentCostPct, d.paymentCostPct) / 100);
    const supportReserve = config.supportReserve ?? d.supportReserveFlat;
    const riskReserve = config.riskReserve ?? d.riskReserveFlat;
    const baseContribution = publicPrice - supplierCost - paymentCost - supportReserve - riskReserve;

    // Check each monetary offer against the floor before it may be shown.
    for (const e of evaluatedOffers) {
      if (!e.eligible) continue;
      const cost = (e.offer.offerAmount ?? 0) + (e.offer.bonusCost ?? 0);
      if (cost <= 0) continue;
      const after = baseContribution - cost;
      const afterPct = (after / publicPrice) * 100;
      if (afterPct < minimumMarginPct) {
        e.eligible = false;
        e.ineligibilityReason = "breaches margin floor";
        floorViolations.push({
          offerId: e.offer.id,
          reason: `Would drop contribution to ${afterPct.toFixed(1)}% (floor ${minimumMarginPct}%)`,
        });
      }
    }

    expectedContribution = Math.round(baseContribution);
    contributionPct = Math.round((baseContribution / publicPrice) * 1000) / 10;
  }

  return {
    slug,
    publicPrice,
    eligibleOffers: evaluatedOffers,
    bonusesValue: Math.round(bonusesValue),
    bundleAdvantage,
    expectedContribution,
    contributionPct,
    floorViolations,
    evaluatedAt: now.toISOString(),
  };
}

/** Convenience: evaluate using the package's public deal price. */
export function evaluatePackagePricing(
  slug: string,
  publicPrice: number,
  now?: Date,
): PricingEvaluation | null {
  return evaluatePricing(slug, publicPrice, now ?? new Date());
}
