/**
 * Pure game logic for the MQT voucher games ("Spin the Himalayas" pilot).
 *
 * Deliberately zero-dependency: no imports, no DOM, no randomness source of
 * its own. The caller injects an `rng` function. That keeps the draw
 * testable (seeded simulation in scripts/simulate-game-odds.mjs) and makes
 * the honesty guarantee structural: the ENGINE picks the prize from the
 * configured probabilities — the UI never decides jackpots, it only
 * animates whatever the engine returned.
 */

export interface PrizeTier {
  /** Stable id, e.g. "kedarnath-trail". */
  id: string;
  /** Display label, e.g. "₹500 travel voucher". */
  label: string;
  /** Rupee value of the voucher. 0 = no-prize tier. */
  value: number;
  /**
   * Weight in percent (e.g. 20 = 20 of every 100 spins on average).
   * The configured probabilities across all tiers MUST sum to 100.
   */
  probability: number;
  /** Monthly budget cap: at most this many vouchers of this tier per month. */
  maxWinners: number;
  /** Minimum qualifying booking value (₹) to redeem this voucher. */
  minSpend: number;
  /**
   * Operator-toggled. When the tier's monthly budget is fully claimed, the
   * operator sets this to true in the config: the segment renders as
   * "Fully claimed" and is EXCLUDED from the draw (odds redistribute across
   * the remaining tiers — displayed honestly on screen).
   */
  claimedExhausted: boolean;
  /** Short label drawn on the wheel segment. */
  segmentLabel: string;
  /** Wheel segment fill color (hex). */
  color: string;
  /** Wheel segment label color (hex). */
  textColor: string;
}

/** A drawn prize with the voucher code attached (code only for value > 0). */
export interface DrawnPrize {
  tier: PrizeTier;
  /** Voucher code, MQT-XXXX-XXXX. Null for the no-prize tier. */
  code: string | null;
  issuedAtIso: string;
  expiresAtIso: string;
}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L

/**
 * Weighted draw over ACTIVE tiers (claimedExhausted tiers are excluded and
 * their probability redistributes proportionally — the honest behavior).
 * Returns the index into the ORIGINAL prizes array.
 */
export function drawTierIndex(
  prizes: PrizeTier[],
  rng: () => number,
): number {
  const active = prizes
    .map((tier, index) => ({ tier, index }))
    .filter(({ tier }) => !tier.claimedExhausted);

  const total = active.reduce((sum, { tier }) => sum + tier.probability, 0);
  if (active.length === 0 || total <= 0) {
    throw new Error("gameEngine.drawTierIndex: no active prize tiers");
  }

  let roll = rng() * total;
  for (const { tier, index } of active) {
    roll -= tier.probability;
    if (roll < 0) return index;
  }
  // Floating-point guard: return the last active tier instead of failing.
  return active[active.length - 1].index;
}

/**
 * Effective probability of each tier among the ACTIVE set, in percent.
 * Identical to configured probabilities when nothing is exhausted.
 */
export function effectiveProbabilities(
  prizes: PrizeTier[],
): { id: string; percent: number }[] {
  const active = prizes.filter((t) => !t.claimedExhausted);
  const total = active.reduce((sum, t) => sum + t.probability, 0);
  return prizes.map((t) => ({
    id: t.id,
    percent:
      t.claimedExhausted || total <= 0
        ? 0
        : (t.probability / total) * 100,
  }));
}

/**
 * Generate a voucher code in MQT-XXXX-XXXX format.
 * randomBytes must return `n` cryptographically-strong random bytes
 * (pass crypto.getRandomValues in the browser).
 */
export function generateVoucherCode(
  randomBytes: (n: number) => Uint8Array,
): string {
  const bytes = randomBytes(8);
  let body = "";
  for (let i = 0; i < 8; i++) {
    body += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return `MQT-${body.slice(0, 4)}-${body.slice(4)}`;
}

/** ISO date of `days` after `issuedAtIso` (voucher expiry). */
export function expiryIso(issuedAtIso: string, days: number): string {
  const d = new Date(issuedAtIso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** "₹1,000" style formatting (en-IN). */
export function formatRupees(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

/**
 * Build the WALLET_CREDIT offer payload for a won voucher, shaped so the
 * commercial offer engine (src/lib/offers/engine.ts) recognizes it:
 * type WALLET_CREDIT + offerAmount + walletExpiry + walletMinimumSpend +
 * walletRedemptionRules. The returned object is intentionally a plain
 * record — the typed wrapper lives in src/data/commercial/games.ts.
 */
export function buildWalletCreditOffer(
  gameId: string,
  tier: PrizeTier,
  issuedAtIso: string,
  expiryDays: number,
  redemptionRules: string,
): {
  id: string;
  type: "WALLET_CREDIT";
  packageId: string;
  headline: string;
  detail: string;
  offerAmount: number;
  eligibility: string;
  walletExpiry: string;
  walletMinimumSpend: number;
  walletRedemptionRules: string;
  active: boolean;
} {
  const expiresAtIso = expiryIso(issuedAtIso, expiryDays);
  return {
    id: `${gameId}-${tier.id}`,
    type: "WALLET_CREDIT",
    // Not tied to one package: the voucher applies to any qualifying booking.
    packageId: "voucher-games",
    headline: `${formatRupees(tier.value)} travel voucher — won on ${gameId}`,
    detail:
      `A real ${formatRupees(tier.value)} discount won by spinning the wheel. ` +
      `Applied manually by our team to a qualifying booking before you pay. ` +
      `Minimum booking value ${formatRupees(tier.minSpend)}. One voucher per booking. ` +
      `Valid until ${new Date(expiresAtIso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.`,
    offerAmount: tier.value,
    eligibility: `Minimum booking value ${formatRupees(tier.minSpend)}. One voucher per booking.`,
    walletExpiry: expiresAtIso,
    walletMinimumSpend: tier.minSpend,
    walletRedemptionRules: redemptionRules,
    active: true,
  };
}

/* ── Daily spin limit (per device, disclosed honestly on screen) ── */

export const SPIN_STORAGE_KEY = "mqt-spin-himalayas:v1";

interface SpinStore {
  /** Unique spin dates (YYYY-MM-DD), newest last. Cap 90. */
  dates?: string[];
  /** Last spin, informational only. */
  last?: { date: string; result: string };
}

/** Parse the stored spin record (never throws). */
function readStore(storage: {
  getItem(key: string): string | null;
}): SpinStore {
  try {
    const raw = storage.getItem(SPIN_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SpinStore;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

/** All dates this device has spun on (unique, ascending). */
export function spinDates(storage: {
  getItem(key: string): string | null;
}): string[] {
  const dates = readStore(storage).dates;
  return Array.isArray(dates) ? dates.filter((d) => typeof d === "string") : [];
}

/** True when the device has already used today's spin. */
export function hasSpunToday(
  storage: { getItem(key: string): string | null },
  today: string,
): boolean {
  return spinDates(storage).includes(today);
}

/**
 * Consecutive-day streak ending today (or yesterday, if today isn't spun
 * yet). Pure honesty: it counts days the device actually spun.
 */
export function streakDays(dates: string[], today: string): number {
  const set = new Set(dates);
  let cursor = set.has(today) ? today : shiftDate(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }
  return streak;
}

function shiftDate(isoDate: string, deltaDays: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

/** Record today's spin. Storage failure (private mode) is non-fatal. */
export function recordSpin(
  storage: {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
  },
  today: string,
  resultLabel: string,
): void {
  try {
    const dates = spinDates(storage);
    if (!dates.includes(today)) dates.push(today);
    const trimmed = dates.slice(-90);
    const store: SpinStore = { dates: trimmed, last: { date: today, result: resultLabel } };
    storage.setItem(SPIN_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage unavailable — the spin still counts for this session via
    // component state; we just can't persist it.
  }
}
