#!/usr/bin/env node
/**
 * Part B: Apply 1.5x price multiplier to all customer-facing prices.
 *
 * Writes src/data/priceOverrides.json (slug → { mrp, dealPrice }) without
 * modifying the original allPackages.ts data. The getPriceInfo() utility
 * checks this file first.
 *
 * Rules:
 * - Multiply mrp and dealPrice by 1.5x
 * - Round to nearest whole rupee
 * - Skip packages with no real price (empty mrp/dealPrice)
 * - Skip the scraper fallback flag values (mrp=₹31,125 is placeholder)
 * - Preserve ₹ prefix and en-IN comma formatting
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = fs.readFileSync(path.join(ROOT, 'src/data/allPackages.ts'), 'utf8');

// Parse all packages from the TypeScript source
const packages = [];
const slugPattern = /"slug":\s*"([^"]+)"/g;
const mrpPattern = /"mrp":\s*"([^"]*)"/g;
const dealPattern = /"dealPrice":\s*"([^"]*)"/g;

const slugs = [], mrps = [], deals = [];
let m;
while ((m = slugPattern.exec(SRC)) !== null) slugs.push(m[1]);
while ((m = mrpPattern.exec(SRC)) !== null) mrps.push(m[1]);
while ((m = dealPattern.exec(SRC)) !== null) deals.push(m[1]);

for (let i = 0; i < slugs.length; i++) {
  packages.push({
    slug: slugs[i],
    mrp: mrps[i] || '',
    dealPrice: deals[i] || '',
  });
}

console.log(`Parsed ${packages.length} packages`);

function parseINR(s) {
  const cleaned = (s || '').replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

// Scraper fallback values — these are NOT real prices
const FALLBACK_MRPS = new Set(['₹31,125']);
const FALLBACK_DEALS = new Set(['₹24,900']);

const overrides = {};
let multiplied = 0;
let skipped = 0;
let skippedReasons = { noPrice: 0, fallback: 0 };

for (const pkg of packages) {
  const mrpVal = parseINR(pkg.mrp);
  const dealVal = parseINR(pkg.dealPrice);

  // Skip packages with no real price
  if (mrpVal === 0 && dealVal === 0) {
    skipped++;
    skippedReasons.noPrice++;
    continue;
  }

  // Skip placeholder/fallback prices
  if (FALLBACK_MRPS.has(pkg.mrp) || FALLBACK_DEALS.has(pkg.dealPrice)) {
    skipped++;
    skippedReasons.fallback++;
    continue;
  }

  // Apply 1.5x multiplier, round to nearest whole rupee
  const newMrp = Math.round(mrpVal * 1.5);
  const newDeal = dealVal > 0 ? Math.round(dealVal * 1.5) : Math.round(mrpVal * 1.5);

  overrides[pkg.slug] = {
    mrp: formatINR(newMrp),
    dealPrice: formatINR(newDeal),
    originalMrp: pkg.mrp,
    originalDealPrice: pkg.dealPrice,
  };
  multiplied++;
}

// Write the overrides file
const outPath = path.join(ROOT, 'src/data/priceOverrides.json');
fs.writeFileSync(outPath, JSON.stringify(overrides, null, 2));

console.log(`\nResults:`);
console.log(`  Multiplied: ${multiplied} packages`);
console.log(`  Skipped: ${skipped} packages`);
console.log(`    - No price: ${skippedReasons.noPrice}`);
console.log(`    - Fallback/placeholder: ${skippedReasons.fallback}`);
console.log(`\nOutput: ${outPath}`);

// Print sample
const sampleSlugs = Object.keys(overrides).slice(0, 5);
console.log('\nSample changes:');
for (const s of sampleSlugs) {
  const o = overrides[s];
  console.log(`  ${s}: ${o.originalMrp} → ${o.mrp} (mrp), ${o.originalDealPrice} → ${o.dealPrice} (deal)`);
}
