#!/usr/bin/env node
/**
 * Probability simulation for "Spin the Himalayas".
 *
 * 1. Parses the REAL operator config (src/data/commercial/games.ts) — the
 *    same file the UI reads — and asserts its integrity (6 tiers,
 *    probabilities sum to 100, budget checksum).
 * 2. Imports the REAL draw function (src/lib/games/gameEngine.ts) and
 *    simulates 100k seeded draws, asserting the empirical distribution
 *    matches the disclosed odds.
 * 3. Validates voucher code format and the WALLET_CREDIT offer wiring.
 * 4. Validates the "fully claimed" redistribution behavior.
 *
 * Usage: node scripts/simulate-game-odds.mjs   (exit 1 on any failure)
 */
import { readFileSync } from "node:fs";
import { getRandomValues } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  buildWalletCreditOffer,
  drawTierIndex,
  effectiveProbabilities,
  generateVoucherCode,
} from "../src/lib/games/gameEngine.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;

function check(name, ok, detail = "") {
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
}

/* ── 1. Parse the real config file ─────────────────────────────── */
const src = readFileSync(join(ROOT, "src/data/commercial/games.ts"), "utf8");
const prizeRe =
  /\{\s*id:\s*"([^"]+)"[\s\S]*?value:\s*(\d+)[\s\S]*?probability:\s*([\d.]+)[\s\S]*?maxWinners:\s*([0-9A-Za-z_.]+)[\s\S]*?minSpend:\s*(\d+)[\s\S]*?claimedExhausted:\s*(true|false)/g;

const prizes = [];
for (const m of src.matchAll(prizeRe)) {
  const [, id, value, probability, maxWinnersRaw, minSpend, claimedExhausted] = m;
  const maxWinners =
    maxWinnersRaw === "Number.MAX_SAFE_INTEGER"
      ? Number.MAX_SAFE_INTEGER
      : Number(maxWinnersRaw);
  prizes.push({
    id,
    label: id,
    value: Number(value),
    probability: Number(probability),
    maxWinners,
    minSpend: Number(minSpend),
    claimedExhausted: claimedExhausted === "true",
    segmentLabel: id,
    color: "#000",
    textColor: "#fff",
  });
}

check("parsed 6 prize tiers from games.ts", prizes.length === 6, `found ${prizes.length}`);
const probSum = prizes.reduce((s, p) => s + p.probability, 0);
check("probabilities sum to exactly 100", probSum === 100, `sum = ${probSum}`);
const budget = prizes
  .filter((p) => p.value > 0)
  .reduce((s, p) => s + p.value * p.maxWinners, 0);
check("monthly budget Σ(value × maxWinners) = ₹2,50,000", budget === 250000,
  `₹${budget.toLocaleString("en-IN")}`);

/* ── 2. Simulate draws with the REAL engine function ───────────── */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const N = 100_000;
const counts = Object.fromEntries(prizes.map((p) => [p.id, 0]));
const rng = mulberry32(20260928);
for (let i = 0; i < N; i++) {
  const idx = drawTierIndex(prizes, rng);
  counts[prizes[idx].id] += 1;
}

console.log("\nEmpirical distribution over 100,000 seeded draws:");
console.log("tier".padEnd(20) + "disclosed".padEnd(12) + "empirical".padEnd(12) + "Δpp");
let distOk = true;
for (const p of prizes) {
  const empirical = (counts[p.id] / N) * 100;
  const delta = Math.abs(empirical - p.probability);
  const ok = delta <= 0.4;
  if (!ok) distOk = false;
  console.log(
    p.id.padEnd(20) +
      `${p.probability}%`.padEnd(12) +
      `${empirical.toFixed(3)}%`.padEnd(12) +
      delta.toFixed(3),
  );
}
check("empirical distribution matches disclosed odds (±0.4pp)", distOk);

/* ── 3. Voucher code format ────────────────────────────────────── */
const codeRe = /^MQT-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/;
let codesOk = true;
for (let i = 0; i < 200; i++) {
  const code = generateVoucherCode((n) => getRandomValues(new Uint8Array(n)));
  if (!codeRe.test(code)) { codesOk = false; break; }
}
const uniq = new Set(
  Array.from({ length: 200 }, () => generateVoucherCode((n) => getRandomValues(new Uint8Array(n)))),
);
check("voucher codes match MQT-XXXX-XXXX (200 samples)", codesOk);
check("voucher codes are unique across 200 samples", uniq.size === 200, `${uniq.size}/200 unique`);

/* ── 4. WALLET_CREDIT offer wiring ─────────────────────────────── */
const sample = prizes.find((p) => p.id === "valley-of-flowers");
const offer = buildWalletCreditOffer(
  "spin-the-himalayas",
  sample,
  "2026-09-28T00:00:00.000Z",
  180,
  "Redeem via WhatsApp/enquiry; applied manually at booking.",
);
check("offer type is WALLET_CREDIT", offer.type === "WALLET_CREDIT");
check("offerAmount equals tier value", offer.offerAmount === 500, `₹${offer.offerAmount}`);
check("walletMinimumSpend equals tier minSpend", offer.walletMinimumSpend === 12000);
check("walletExpiry ≈ 180 days after issue",
  offer.walletExpiry.startsWith("2027-03-27"), offer.walletExpiry);
check("walletRedemptionRules present", typeof offer.walletRedemptionRules === "string" && offer.walletRedemptionRules.length > 20);
check("offer is active", offer.active === true);

/* ── 5. Fully-claimed redistribution ───────────────────────────── */
const exhausted = prizes.map((p) =>
  p.id === "everest-base" ? { ...p, claimedExhausted: true } : p,
);
const eff = effectiveProbabilities(exhausted);
const everest = eff.find((e) => e.id === "everest-base");
check("exhausted tier gets 0% effective odds", everest.percent === 0);
const effSum = eff.reduce((s, e) => s + e.percent, 0);
check("effective odds still sum to 100", Math.abs(effSum - 100) < 1e-9, effSum.toFixed(4));

const counts2 = Object.fromEntries(exhausted.map((p) => [p.id, 0]));
const rng2 = mulberry32(777);
for (let i = 0; i < 20_000; i++) {
  const idx = drawTierIndex(exhausted, rng2);
  counts2[exhausted[idx].id] += 1;
}
check("exhausted tier never drawn (20k draws)", counts2["everest-base"] === 0);
// Jackpot: nominal 1% → effective 1/90 ≈ 1.111%
const jackpotEmp = (counts2["himalayan-jackpot"] / 20_000) * 100;
check("redistributed odds respected (jackpot ≈1.11%)",
  Math.abs(jackpotEmp - 100 / 90) <= 0.3, `${jackpotEmp.toFixed(3)}%`);

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
