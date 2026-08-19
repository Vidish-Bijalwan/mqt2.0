#!/usr/bin/env node
/**
 * Enrich packages without prices with realistic "Starting from" estimates.
 * Uses duration + category to estimate per-person pricing.
 * 
 * These are NOT real scraped prices — they're educated estimates that
 * make the "Contact for Price" area less barren for the 430 packages
 * where the reference site also has no price.
 * 
 * Strategy: price = nights × dailyRate(category) × 1.2 (margin)
 * 
 * We only enrich packages where:
 *   1. Duration data exists (nights can be extracted)
 *   2. No price override already exists
 *   3. The package has a valid slug (not junk)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

// Read source data
const srcPath = path.join(ROOT, 'src/data/allPackages.ts');
const src = fs.readFileSync(srcPath, 'utf8');

// Read existing overrides
const overridesPath = path.join(ROOT, 'src/data/priceOverrides.json');
const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

// Daily rate by category (₹ per person per day, mid-range)
const CATEGORY_RATES = {
  // Domestic categories
  'India Tours': 4500,
  'Pilgrimage': 5000,
  'Char Dham': 5500,
  'Hill Station': 4500,
  'Kerala': 5000,
  'Rajasthan': 5000,
  'Goa': 4000,
  'Kashmir': 5500,
  'Himachal Pradesh': 4500,
  'Uttarakhand': 4000,
  'Uttar Pradesh': 3500,
  'Madhya Pradesh': 3500,
  'Gujarat': 3500,
  'Andhra Pradesh': 3500,
  'Tamil Nadu': 3500,
  'Karnataka': 3500,
  'Odisha': 3500,
  'West Bengal': 3500,
  'Sikkim': 4500,
  'North East India': 5000,
  'Bihar': 3000,
  'Jharkhand': 3000,
  'Chhattisgarh': 3000,
  'Haryana': 3500,
  'Punjab': 3500,
  'Himachal': 4500,
  'North India': 4000,
  'South India': 4000,
  'West India': 4000,
  'East India': 4000,
  'Central India': 3500,
  
  // International categories
  'International': 8000,
  'Nepal': 7000,
  'Bhutan': 8000,
  'Sri Lanka': 7000,
  'Thailand': 6500,
  'Vietnam': 6500,
  'Malaysia': 7000,
  'Singapore': 8000,
  'Cambodia': 6000,
  'Japan': 12000,
  'China': 8000,
  'Korea': 10000,
  'Dubai': 9000,
  'Europe': 12000,
  'Australia': 14000,
  'New Zealand': 14000,
  'USA': 12000,
  'Canada': 12000,
  'Africa': 10000,
  'Maldives': 15000,
  
  // Special categories
  'Helicopter': 12000,
  'Adventure': 5500,
  'Wildlife': 5500,
  'Luxury': 12000,
  'Honeymoon': 7000,
  'Family': 4500,
  'Group': 4000,
  'Weekend': 3500,
};

// Default rate if category not found
const DEFAULT_RATE = 4500;

function parseDuration(durationStr) {
  if (!durationStr || durationStr === '?') return null;
  
  // "2 Nights / 3 Days" or "11 Days / 10 Nights" or "3 Days / 2 Nights"
  const nightsMatch = durationStr.match(/(\d+)\s*Nights?/i);
  const daysMatch = durationStr.match(/(\d+)\s*Days?/i);
  
  if (nightsMatch) return parseInt(nightsMatch[1]);
  if (daysMatch) return parseInt(daysMatch[1]) - 1; // days - 1 = nights
  return null;
}

function getDailyRate(category) {
  if (!category) return DEFAULT_RATE;
  
  // Direct match
  if (CATEGORY_RATES[category]) return CATEGORY_RATES[category];
  
  // Partial match
  for (const [key, rate] of Object.entries(CATEGORY_RATES)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return rate;
  }
  
  return DEFAULT_RATE;
}

function formatPrice(amount) {
  // Round to nearest 500
  amount = Math.round(amount / 500) * 500;
  // Format with Indian comma notation
  const str = amount.toLocaleString('en-IN');
  return '₹' + str;
}

// Parse all packages from the TypeScript source
const pkgRegex = /"slug":\s*"([^"]+)"[\s\S]*?"duration":\s*"([^"]*)"[\s\S]*?"category":\s*"([^"]*)"/g;
const packages = [];
let match;

while ((match = pkgRegex.exec(src)) !== null) {
  packages.push({
    slug: match[1],
    duration: match[2],
    category: match[3],
  });
}

console.log(`Total packages found: ${packages.length}`);

let enriched = 0;
let skipped = 0;
let noDuration = 0;
const enrichedList = [];

for (const pkg of packages) {
  // Skip if already has override price
  if (overrides[pkg.slug] && overrides[pkg.slug].mrp) {
    skipped++;
    continue;
  }
  
  // Skip if inline price is not placeholder
  const idx = src.indexOf(`"slug": "${pkg.slug}"`);
  const chunk = src.slice(idx, idx + 600);
  const mrpMatch = chunk.match(/"mrp":\s*"([^"]+)"/);
  if (mrpMatch && mrpMatch[1] && !mrpMatch[1].includes('31,125') && mrpMatch[1] !== '?' && mrpMatch[1] !== '') {
    skipped++;
    continue;
  }
  
  const nights = parseDuration(pkg.duration);
  if (!nights || nights <= 0) {
    noDuration++;
    continue;
  }
  
  const dailyRate = getDailyRate(pkg.category);
  const basePrice = nights * dailyRate;
  
  // MRP = base price (rounded up to nearest 1000)
  const mrp = Math.ceil(basePrice / 1000) * 1000;
  // Deal price = 20% discount
  const dealPrice = Math.round(mrp * 0.8 / 500) * 500;
  
  overrides[pkg.slug] = {
    mrp: formatPrice(mrp),
    dealPrice: formatPrice(dealPrice),
  };
  
  enriched++;
  enrichedList.push({
    slug: pkg.slug,
    nights,
    category: pkg.category,
    mrp: formatPrice(mrp),
    dealPrice: formatPrice(dealPrice),
  });
}

// Write updated overrides
fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2));

console.log(`\nResults:`);
console.log(`  Skipped (already has price): ${skipped}`);
console.log(`  Skipped (no duration data): ${noDuration}`);
console.log(`  Enriched with estimated price: ${enriched}`);
console.log(`  Total overrides now: ${Object.keys(overrides).length}`);

// Show sample enrichments
console.log(`\nSample enrichments:`);
enrichedList.slice(0, 15).forEach(e => {
  console.log(`  ${e.slug} | ${e.nights}N | ${e.category} | MRP: ${e.mrp} | Deal: ${e.dealPrice}`);
});

// Summary by category
console.log(`\nEnrichments by category:`);
const byCat = {};
enrichedList.forEach(e => {
  byCat[e.category] = (byCat[e.category] || 0) + 1;
});
Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});
