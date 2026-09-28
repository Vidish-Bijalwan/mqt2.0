import type { CommercialDefaults } from "@/types/commercial";

/**
 * Centralized commercial guardrails for the MQT offer engine.
 *
 * THE rule: no business-wide margin or cost assumption may be hardcoded in
 * components. Everything reads from here (or per-package overrides in
 * src/data/commercial/packages.ts). The engine in src/lib/offers/engine.ts
 * is the only consumer.
 *
 * These are starting defaults — replace with real finance numbers.
 */
export const commercialDefaults: CommercialDefaults = {
  /** Healthy target contribution per booking, % of public price. */
  targetMarginPct: 18,
  /**
   * Hard floor: any offer that would push contribution below this is
   * rejected by the engine and never shown to the customer.
   */
  minimumMarginPct: 10,
  /** Payment processing cost, % of public price. */
  paymentCostPct: 2,
  /** Per-booking customer-support reserve (rupees). */
  supportReserveFlat: 400,
  /** Per-booking risk reserve — cancellations, contingencies (rupees). */
  riskReserveFlat: 600,
  /** GROUP_UNLOCK default when an offer has no explicit threshold. */
  groupUnlockDefaultThreshold: 6,
  /** WALLET_CREDIT default validity. */
  walletDefaultExpiryDays: 180,
  currency: "INR",
};

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
