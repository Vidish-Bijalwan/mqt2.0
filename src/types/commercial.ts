/**
 * Commercial / offer-engine types for MyQuickTrippers.
 *
 * Design principles (non-negotiable):
 * - No fake MRPs, fake previous prices, fabricated scarcity, fake timers,
 *   random prices, fake booking counts, or fake reviews. Ever.
 * - Any "savings" or "value" figure shown to a customer MUST be computed
 *   from real component values stored in data, with a valid comparison
 *   basis. When the data is absent, the UI hides the figure gracefully.
 * - Cost-side fields (supplierCost, reserves) are operator-confidential and
 *   must never be rendered client-side in a customer-facing way. The engine
 *   runs server-side (or at build time) and only returns display-safe fields.
 */

export type OfferType =
  | "EARLY_BIRD"
  | "GROUP_UNLOCK"
  | "VALUE_BONUS"
  | "UPGRADE"
  | "WALLET_CREDIT"
  | "REFERRAL";

/** One line of the "what's inside the price" breakdown. */
export interface ComponentValue {
  /** e.g. "4 nights hotels (twin sharing)" */
  label: string;
  /** Real rupee value, or null when unknown. Null hides the savings row. */
  value: number | null;
  /** Where the figure comes from, e.g. "our contracted hotel rates, Sep 2026". */
  basis?: string;
}

/** A single included / not-included line inside a tier. */
export interface TierDifference {
  label: string;
  included: boolean;
  /** Honest qualifier, e.g. "Subject to confirmation". */
  note?: string;
}

export interface TierDefinition {
  id: string;
  name: string;
  tagline: string;
  /**
   * Starting price in rupees, or null when the tier is quote-only.
   * null renders "Price on enquiry" — never invent a price.
   */
  priceFrom: number | null;
  /**
   * Badge text. Use neutral labels ("Popular configuration", "Comfort
   * upgrade") unless real booking data backs a popularity claim, in which
   * case set badgeVerified: true and cite the basis in the config comment.
   */
  badge?: string;
  badgeVerified?: boolean;
  differences: TierDifference[];
  /** Tier identifier forwarded into the enquiry flow. */
  tierParam: string;
  /** Operator confirmation that differences + price match real inventory. */
  verified: boolean;
}

export interface BonusItem {
  label: string;
  /** Real rupee value, or null when unknown (value hidden then). */
  value: number | null;
}

export interface Offer {
  id: string;
  type: OfferType;
  packageId: string;
  departureId?: string;
  headline: string;
  detail: string;
  /** Per-person rupee benefit, when the offer type has one. */
  offerAmount?: number;
  eligibility?: string;
  /** VALUE_BONUS items. */
  bonusItems?: BonusItem[];
  bonusCost?: number | null;
  bonusValue?: number | null;
  /**
   * REQUIRED before any "Value ₹X" figure may be shown, e.g. "Priced from
   * our published airport-transfer rate card".
   */
  comparisonBasis?: string;
  /** EARLY_BIRD: real booking deadline (ISO). Offer is ineligible past it. */
  expiresAt?: string;
  /** EARLY_BIRD: where the inventory comes from. Required for eligibility. */
  inventorySource?: string;
  /** GROUP_UNLOCK: travellers needed to unlock the benefit. */
  threshold?: number;
  /** WALLET_CREDIT rules. */
  walletExpiry?: string;
  walletMinimumSpend?: number;
  walletRedemptionRules?: string;
  /** REFERRAL rules. */
  referralReward?: number;
  referralConditions?: string;
  /** UPGRADE qualifier, e.g. "Subject to confirmation". */
  upgradeNote?: string;
  active: boolean;
}

/**
 * Everything the commercial UI needs for one package. Lives in
 * src/data/commercial/packages.ts (operator-editable).
 */
export interface PackageCommercial {
  slug: string;
  /** e.g. "BADRINATH–KEDARNATH ESSENTIALS" */
  displayName: string;
  /** e.g. "Twin sharing". Omit when not confirmed. */
  occupancyNote?: string;
  /** Always shown, e.g. "All applicable taxes included in the final quote." */
  taxNote: string;
  includes: { label: string; detail?: string }[];
  /**
   * Component values used to compute the bundle advantage. null (or any
   * null value) hides the savings row — the engine never fabricates it.
   */
  componentValues: ComponentValue[] | null;
  bundleBasis?: string;
  tiers: TierDefinition[];
  offers: Offer[];

  /* ── Operator-confidential cost model (never rendered) ── */
  supplierCost?: number | null;
  paymentCostPct?: number;
  supportReserve?: number;
  riskReserve?: number;
  targetMarginPct?: number;
  minimumMarginPct?: number;
}

/** Centralized commercial guardrails. One place — never hardcoded in components. */
export interface CommercialDefaults {
  targetMarginPct: number;
  minimumMarginPct: number;
  /** Payment gateway / processing cost as % of public price. */
  paymentCostPct: number;
  /** Flat per-booking support reserve (rupees). */
  supportReserveFlat: number;
  /** Flat per-booking risk reserve (rupees). */
  riskReserveFlat: number;
  groupUnlockDefaultThreshold: number;
  walletDefaultExpiryDays: number;
  currency: "INR";
}

/** Customer-safe result of the offer engine. */
export interface EvaluatedOffer {
  offer: Offer;
  eligible: boolean;
  /** Present only when the offer type + data allow a value figure. */
  displayValue: number | null;
  ineligibilityReason?: string;
}

export interface PricingEvaluation {
  slug: string;
  publicPrice: number;
  eligibleOffers: EvaluatedOffer[];
  /** Sum of bonus values with a valid comparison basis. */
  bonusesValue: number;
  /** Bundle advantage = sum(componentValues) − publicPrice, or null. */
  bundleAdvantage: number | null;
  expectedContribution: number | null;
  contributionPct: number | null;
  /** Offers rejected because they would breach the margin floor. */
  floorViolations: { offerId: string; reason: string }[];
  evaluatedAt: string;
}
