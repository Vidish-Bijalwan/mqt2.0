#!/usr/bin/env node
/**
 * Fix the 210-package price data loss bug.
 * For each package that has a price on namasteindiatrip.com but not in MQT,
 * fetch the reference page, extract the price, and write it to allPackages.ts.
 *
 * The reference site shows prices as:
 *   "Starting from ₹X,XXX" (deal price)
 *   "₹X,XXX" with strikethrough (MRP)
 *
 * We also apply the 1.5x multiplier after restoring the original price.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ALL_FILE = path.join(ROOT, 'src/data/allPackages.ts');
const VERIFY_FILE = path.join(ROOT, '.freebuff/full-price-verification.json');

const verifyData = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf8'));
const lostPrices = verifyData.found; // [{slug, price}]
console.log(`Restoring prices for ${lostPrices.length} packages...`);

function parsePrice(s) {
  // Extract numeric value from price string like "₹14500", "₹ 1,500", "INR 5000"
  const cleaned = s.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

function formatINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}

async function fetchPrice(slug) {
  const refUrl = `https://www.namasteindiatrip.com/${slug}`;
  try {
    const resp = await fetch(refUrl, { 
      signal: AbortSignal.timeout(15000),
      redirect: 'follow'
    });
    if (resp.status !== 200) return null;
    
    const html = await resp.text();
    
    // Extract prices from the page
    // Pattern 1: "Starting from ₹X,XXX" or "Starting Price ₹X,XXX"
    // Pattern 2: Strikethrough MRP: "₹X,XXX" with line-through class
    // Pattern 3: Deal price in green/bold
    
    const prices = [];
    
    // Find all ₹ amounts
    const rupeePattern = /₹\s*([\d,]+)/g;
    let m;
    while ((m = rupeePattern.exec(html)) !== null) {
      const val = parseInt(m[1].replace(/,/g, ''), 10);
      if (val >= 500 && val <= 500000) { // Reasonable tour price range
        prices.push(val);
      }
    }
    
    // Also check INR pattern
    const inrPattern = /INR\s*([\d,]+)/g;
    while ((m = inrPattern.exec(html)) !== null) {
      const val = parseInt(m[1].replace(/,/g, ''), 10);
      if (val >= 500 && val <= 500000) {
        prices.push(val);
      }
    }
    
    if (prices.length === 0) return null;
    
    // Dedupe and sort
    const unique = [...new Set(prices)].sort((a, b) => a - b);
    
    // The lowest price is likely the deal price, highest is MRP
    const dealPrice = unique[0];
    const mrp = unique.length > 1 ? unique[unique.length - 1] : Math.round(dealPrice * 1.25);
    
    return { dealPrice, mrp };
  } catch (e) {
    return null;
  }
}

// Process in batches
const BATCH_SIZE = 5;
const results = { restored: [], failed: [], alreadyHasPrice: [] };

// Read current allPackages.ts
const allSrc = fs.readFileSync(ALL_FILE, 'utf8');
const allMatch = allSrc.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!allMatch) throw new Error('Could not locate allPackages array');
const allPackages = JSON.parse(allMatch[1]);

// Build lookup by slug
const pkgMap = new Map(allPackages.map(p => [p.slug, p]));

for (let i = 0; i < lostPrices.length; i += BATCH_SIZE) {
  const batch = lostPrices.slice(i, i + BATCH_SIZE);
  
  const promises = batch.map(async (item) => {
    const pkg = pkgMap.get(item.slug);
    if (!pkg) {
      results.failed.push({ slug: item.slug, reason: 'not in allPackages' });
      return;
    }
    
    // Skip if already has price
    if (pkg.mrp && pkg.dealPrice) {
      results.alreadyHasPrice.push(item.slug);
      return;
    }
    
    const prices = await fetchPrice(item.slug);
    if (!prices) {
      results.failed.push({ slug: item.slug, reason: 'could not extract price' });
      return;
    }
    
    // Apply 1.5x multiplier
    const mrp15x = Math.round(prices.mrp * 1.5);
    const deal15x = Math.round(prices.dealPrice * 1.5);
    
    // Update the package
    pkg.mrp = formatINR(mrp15x);
    pkg.dealPrice = formatINR(deal15x);
    
    results.restored.push({
      slug: item.slug,
      originalMrp: formatINR(prices.mrp),
      originalDeal: formatINR(prices.dealPrice),
      mrp15x: pkg.mrp,
      deal15x: pkg.dealPrice,
    });
  });
  
  await Promise.all(promises);
  
  if ((i / BATCH_SIZE) % 10 === 0) {
    process.stdout.write(`  ${i}/${lostPrices.length} processed... (restored: ${results.restored.length})\r`);
  }
  
  // Throttle
  await new Promise(r => setTimeout(r, 800));
}

console.log(`\n\n--- Results ---`);
console.log(`Restored: ${results.restored.length}`);
console.log(`Failed: ${results.failed.length}`);
console.log(`Already had price: ${results.alreadyHasPrice.length}`);

if (results.restored.length > 0) {
  console.log(`\nSample restored prices:`);
  results.restored.slice(0, 5).forEach(r => {
    console.log(`  ${r.slug}: ${r.originalDeal} → ${r.deal15x} (deal), ${r.originalMrp} → ${r.mrp15x} (mrp)`);
  });
}

// Write updated allPackages.ts
const updatedBody = JSON.stringify(allPackages, null, 2).replace(/\n/g, '\r\n');
const updatedSrc = allSrc.replace(allMatch[1], updatedBody);
fs.writeFileSync(ALL_FILE, updatedSrc, 'utf8');
console.log(`\nUpdated ${ALL_FILE}`);

// Also update priceOverrides.json for the newly priced packages
const overridesPath = path.join(ROOT, 'src/data/priceOverrides.json');
const overrides = fs.existsSync(overridesPath) 
  ? JSON.parse(fs.readFileSync(overridesPath, 'utf8'))
  : {};

for (const r of results.restored) {
  overrides[r.slug] = {
    mrp: r.mrp15x,
    dealPrice: r.deal15x,
    originalMrp: r.originalMrp,
    originalDealPrice: r.originalDeal,
  };
}

fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2));
console.log(`Updated ${overridesPath} (${Object.keys(overrides).length} entries)`);

// Save detailed results
fs.writeFileSync(
  path.join(ROOT, '.freebuff', 'price-restoration-results.json'),
  JSON.stringify(results, null, 2)
);
console.log(`Results saved to .freebuff/price-restoration-results.json`);
