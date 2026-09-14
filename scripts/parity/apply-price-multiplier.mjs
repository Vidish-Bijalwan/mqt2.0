#!/usr/bin/env node
/**
 * Part B: Apply 1.5x price multiplier to all customer-facing prices.
 *
 * Writes src/data/priceOverrides.json (slug → { mrp, dealPrice }) without
 * modifying the original allPackages.ts data. The getPriceInfo() utility
 * checks this file first.
 *
 * Rules:
 * - Multiply every genuine source price by 1.5x
 * - Give packages with missing/scraper-placeholder prices a conservative
 *   duration-and-category baseline, then apply the same 1.5x multiplier
 * - Round prices to the nearest ₹500 so the catalogue remains readable
 * - Preserve the source values for auditing
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = fs.readFileSync(path.join(ROOT, 'src/data/allPackages.ts'), 'utf8');

// The exported array is JSON-compatible. Parsing it as one unit avoids fields
// becoming misaligned when future packages add optional properties.
const exportMarker = 'export const allPackages: Package[] =';
const exportStart = SRC.indexOf(exportMarker);
if (exportStart < 0) throw new Error('Could not find the allPackages export');
const arrayStart = SRC.indexOf('[', exportStart + exportMarker.length);
const arraySource = SRC.slice(arrayStart, SRC.lastIndexOf(']') + 1);
const packages = JSON.parse(arraySource);

console.log(`Parsed ${packages.length} packages`);

function parseINR(s) {
  const cleaned = (s || '').replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

function roundTo500(n) {
  return Math.round(n / 500) * 500;
}

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

const FALLBACK_PAIRS = new Set(['31125:24900', '2:2', '0:24750']);
const CATEGORY_DAILY_RATES = {
  International: 12500,
  Helicopter: 15000,
  Luxury: 13500,
  Adventure: 7000,
  Pilgrimage: 5500,
  'North East India': 7500,
  'South India': 6500,
  'North India': 6500,
  'West India': 6500,
  'East India': 6250,
  'Central India': 6250,
  'India Tours': 6250,
};

function getTourDays(duration) {
  const days = String(duration || '').match(/(\d+)\s*days?/i);
  if (days) return Math.max(1, Number(days[1]));
  const nights = String(duration || '').match(/(\d+)\s*nights?/i);
  if (nights) return Math.max(1, Number(nights[1]) + 1);
  return 4;
}

function deriveBaseline(pkg) {
  const days = getTourDays(pkg.duration);
  const dailyRate = CATEGORY_DAILY_RATES[pkg.category] || 6250;
  const deal = roundTo500(Math.max(10000, days * dailyRate));
  return { deal, mrp: roundTo500(deal * 1.25) };
}

const overrides = {};
let multiplied = 0;
let estimated = 0;

for (const pkg of packages) {
  const mrpVal = parseINR(pkg.mrp);
  const dealVal = parseINR(pkg.dealPrice);

  const isPlaceholder = FALLBACK_PAIRS.has(`${mrpVal}:${dealVal}`);
  const advertisedPrice = dealVal || mrpVal;
  const discountRatio = mrpVal > 0 && dealVal > 0 ? mrpVal / dealVal : 1;
  const hasPlausibleRelationship = dealVal === 0 || mrpVal === 0 || (mrpVal >= dealVal && discountRatio <= 3);
  const hasRealPrice = !isPlaceholder && advertisedPrice >= 5000 && hasPlausibleRelationship;
  const baseline = hasRealPrice ? null : deriveBaseline(pkg);
  const sourceDeal = baseline?.deal || dealVal || mrpVal;
  const sourceMrp = baseline?.mrp || mrpVal || sourceDeal;
  const newDeal = Math.max(10000, roundTo500(sourceDeal * 1.5));
  const newMrp = Math.max(newDeal, roundTo500(sourceMrp * 1.5));

  overrides[pkg.slug] = {
    mrp: formatINR(newMrp),
    dealPrice: formatINR(newDeal),
    originalMrp: pkg.mrp,
    originalDealPrice: pkg.dealPrice,
    estimated: !hasRealPrice,
  };
  multiplied++;
  if (!hasRealPrice) estimated++;
}

// Write the overrides file
const outPath = path.join(ROOT, 'src/data/priceOverrides.json');
fs.writeFileSync(outPath, JSON.stringify(overrides, null, 2));

console.log(`\nResults:`);
console.log(`  Multiplied: ${multiplied} packages`);
console.log(`  Derived from duration/category baseline: ${estimated} packages`);
console.log(`  Packages without a published price: ${packages.length - multiplied}`);
console.log(`\nOutput: ${outPath}`);

// Print sample
const sampleSlugs = Object.keys(overrides).slice(0, 5);
console.log('\nSample changes:');
for (const s of sampleSlugs) {
  const o = overrides[s];
  console.log(`  ${s}: ${o.originalMrp} → ${o.mrp} (mrp), ${o.originalDealPrice} → ${o.dealPrice} (deal)`);
}
