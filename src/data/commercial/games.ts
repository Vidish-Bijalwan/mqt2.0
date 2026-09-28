import type { Offer } from "@/types/commercial";
import {
  buildWalletCreditOffer,
  type PrizeTier,
} from "@/lib/games/gameEngine";
import { commercialDefaults } from "@/data/commercial/defaults";

/**
 * VOUCHER GAMES — operator configuration.
 *
 * OPERATOR GUIDE (read before editing):
 *
 * 1. `prizes[].probability` — the REAL odds of each tier, in percent. They
 *    MUST sum to exactly 100. These same numbers are printed on the game
 *    screen ("Odds" column) — the page cannot show different odds from here.
 * 2. `maxWinners` — monthly budget cap per tier. The total monthly prize
 *    budget is sum(value × maxWinners) across tiers. When a tier's winners
 *    reach this cap, set `claimedExhausted: true`: the segment is shown
 *    honestly as "Fully claimed" and its probability redistributes across
 *    the remaining tiers (the on-screen odds recalculate automatically).
 *    Set it back to false when the next month's budget opens.
 * 3. `value` / `minSpend` — REAL discounts, funded from the configured
 *    margin budget. Every won voucher is a genuine discount applied to a
 *    real booking; never configure a tier you cannot honor.
 * 4. Vouchers are redeemed MANUALLY by the team at booking time (there is
 *    no automatic wallet). `redemptionSteps` below must keep saying so.
 * 5. `spinsPerDay` is enforced per device via localStorage and disclosed
 *    on screen. Do not imply it is enforced server-side.
 *
 * HONESTY RULES (same as the offer engine — non-negotiable):
 * - No fake wins, no rigged outcomes, no fake scarcity, no fake timers.
 * - Every spin resolves per the configured probabilities via the pure
 *   engine in src/lib/games/gameEngine.ts; the UI only animates the result.
 */

/** Monthly prize budget cap = Σ(value × maxWinners). Keep in sync by hand. */
export const MONTHLY_PRIZE_BUDGET = 250_000; // ₹2,50,000

const prizes: PrizeTier[] = [
  {
    id: "himalayan-jackpot",
    label: "₹5,000 travel voucher",
    value: 5000,
    probability: 1,
    maxWinners: 2,
    minSpend: 50000,
    claimedExhausted: false,
    segmentLabel: "₹5K",
    color: "#F29D38",
    textColor: "#0B1F33",
  },
  {
    id: "k2-summit",
    label: "₹2,500 travel voucher",
    value: 2500,
    probability: 3,
    maxWinners: 10,
    minSpend: 35000,
    claimedExhausted: false,
    segmentLabel: "₹2.5K",
    color: "#0B1F33",
    textColor: "#FFFFFF",
  },
  {
    id: "everest-base",
    label: "₹1,000 travel voucher",
    value: 1000,
    probability: 10,
    maxWinners: 40,
    minSpend: 20000,
    claimedExhausted: false,
    segmentLabel: "₹1K",
    color: "#127C82",
    textColor: "#FFFFFF",
  },
  {
    id: "valley-of-flowers",
    label: "₹500 travel voucher",
    value: 500,
    probability: 20,
    maxWinners: 150,
    minSpend: 12000,
    claimedExhausted: false,
    segmentLabel: "₹500",
    color: "#0C5B60",
    textColor: "#FFFFFF",
  },
  {
    id: "kedarnath-trail",
    label: "₹250 travel voucher",
    value: 250,
    probability: 26,
    maxWinners: 400,
    minSpend: 8000,
    claimedExhausted: false,
    segmentLabel: "₹250",
    color: "#9FD8DC",
    textColor: "#0B1F33",
  },
  {
    id: "no-prize",
    label: "No voucher this time",
    value: 0,
    probability: 40,
    maxWinners: Number.MAX_SAFE_INTEGER,
    minSpend: 0,
    claimedExhausted: false,
    segmentLabel: "Try again",
    color: "#DEE7E4",
    textColor: "#5B6B76",
  },
];

/** Probability checksum — fail loudly at import time if the odds are broken. */
const probabilitySum = prizes.reduce((s, p) => s + p.probability, 0);
if (probabilitySum !== 100) {
  throw new Error(
    `voucher game misconfigured: probabilities sum to ${probabilitySum}, must be 100`,
  );
}

const budgetCheck = prizes
  .filter((p) => p.value > 0)
  .reduce((s, p) => s + p.value * p.maxWinners, 0);
if (budgetCheck !== MONTHLY_PRIZE_BUDGET) {
  throw new Error(
    `voucher game misconfigured: prize budget Σ(value × maxWinners) = ₹${budgetCheck.toLocaleString("en-IN")}, ` +
      `but MONTHLY_PRIZE_BUDGET = ₹${MONTHLY_PRIZE_BUDGET.toLocaleString("en-IN")}. Keep them in sync.`,
  );
}

export interface VoucherGameConfig {
  id: string;
  name: string;
  tagline: string;
  /** Honestly enforced per device via localStorage; disclosed on screen. */
  spinsPerDay: number;
  prizes: PrizeTier[];
  monthlyPrizeBudget: number;
  /** Voucher validity, in days — reads the commercial default. */
  expiryDays: number;
  terms: string[];
  redemptionSteps: string[];
  /** One-line honesty statement shown under the wheel. */
  fairnessNote: string;
}

export const spinTheHimalayas: VoucherGameConfig = {
  id: "spin-the-himalayas",
  name: "Spin the Himalayas",
  tagline:
    "One spin a day. Real vouchers, real odds — every spin is decided by the probabilities below.",
  spinsPerDay: 1,
  prizes,
  monthlyPrizeBudget: MONTHLY_PRIZE_BUDGET,
  expiryDays: commercialDefaults.walletDefaultExpiryDays,
  terms: [
    "1 free spin per day, per device. No sign-up, no purchase needed.",
    "Vouchers are valid for 180 days from the day you win them.",
    "Each voucher needs a minimum booking value (shown with each prize) and applies to any MyQuickTrippers package booking.",
    "One voucher per booking. Vouchers can't be combined with each other.",
    "Every spin follows the published odds — the wheel animation never changes the outcome.",
    "When a prize tier's monthly budget is fully claimed, we mark it “Fully claimed” and its odds are shared across the remaining tiers.",
    "Vouchers have no cash value and can't be transferred or sold.",
  ],
  redemptionSteps: [
    "Copy your voucher code (it appears right after your winning spin).",
    "Share the code with us when you enquire or chat on WhatsApp about a booking.",
    "Our team verifies the code and applies the discount to your final quote before you pay. There is no automatic wallet — it's applied manually by a real person.",
  ],
  fairnessNote:
    "Every spin is resolved by the configured probabilities before the wheel starts moving. Nothing on this page can change the result.",
};

const WALLET_REDEMPTION_RULES =
  "Share this code on WhatsApp or in your booking enquiry. Our team verifies it and applies the discount to your final quote before payment. " +
  "Valid for 180 days from issue. Minimum booking value and one-voucher-per-booking limits apply as printed on your voucher. " +
  "There is no automatic wallet balance — the discount is applied manually at booking.";

/**
 * Wire a won voucher into the commercial offer engine: builds the
 * WALLET_CREDIT `Offer` the engine recognizes (type + offerAmount +
 * walletExpiry + walletMinimumSpend + walletRedemptionRules). The engine's
 * evaluateOffer() accepts it like any other offer.
 */
export function voucherGameWalletOffer(
  tier: PrizeTier,
  issuedAtIso: string,
): Offer {
  if (tier.value <= 0) {
    throw new Error("voucherGameWalletOffer: no-prize tiers produce no offer");
  }
  const payload = buildWalletCreditOffer(
    spinTheHimalayas.id,
    tier,
    issuedAtIso,
    spinTheHimalayas.expiryDays,
    WALLET_REDEMPTION_RULES,
  );
  return payload as Offer;
}
