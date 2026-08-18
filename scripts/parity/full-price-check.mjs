#!/usr/bin/env node
/**
 * Full check: how many of the 942 "no price" packages actually have
 * prices on namasteindiatrip.com? Run in batches to avoid timeouts.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const src = fs.readFileSync(path.join(ROOT, 'src/data/allPackages.ts'), 'utf8');

const slugPattern = /"slug":\s*"([^"]+)"/g;
const mrpPattern = /"mrp":\s*"([^"]*)"/g;
const dealPattern = /"dealPrice":\s*"([^"]*)"/g;

const slugs = [], mrps = [], deals = [];
let m;
while ((m = slugPattern.exec(src)) !== null) slugs.push(m[1]);
while ((m = mrpPattern.exec(src)) !== null) mrps.push(m[1]);
while ((m = dealPattern.exec(src)) !== null) deals.push(m[1]);

const packages = slugs.map((s, i) => ({
  slug: s,
  mrp: mrps[i] || '',
  dealPrice: deals[i] || '',
}));

const noPrice = packages.filter(p => !p.mrp && !p.dealPrice);
console.log(`Checking ${noPrice.length} no-price packages...`);

// Process in batches of 5
const BATCH_SIZE = 5;
const DELAY = 800; // ms between batches
const results = { found: [], notFound: [], four04: [], errors: [] };

for (let i = 0; i < noPrice.length; i += BATCH_SIZE) {
  const batch = noPrice.slice(i, i + BATCH_SIZE);
  const promises = batch.map(async (pkg) => {
    const refUrl = `https://www.namasteindiatrip.com/${pkg.slug}`;
    try {
      const resp = await fetch(refUrl, { 
        method: 'HEAD', 
        redirect: 'follow',
        signal: AbortSignal.timeout(8000) 
      });
      
      if (resp.status === 404) {
        results.four04.push(pkg.slug);
        return;
      }
      
      if (resp.status !== 200) return;
      
      // Fetch body and check for prices
      const bodyResp = await fetch(refUrl, { signal: AbortSignal.timeout(12000) });
      const html = await bodyResp.text();
      
      const pricePatterns = [
        /₹\s*[\d,]+/g,
        /INR\s*[\d,]+/g,
        /Rs\.?\s*[\d,]+/g,
      ];
      
      for (const pat of pricePatterns) {
        const matches = html.match(pat);
        if (matches) {
          const realPrices = matches.filter(m => {
            const num = m.replace(/[^\d]/g, '');
            return num.length >= 4 && num.length <= 8 && 
                   !m.includes('9181') && !m.includes('2024') &&
                   !m.includes('9711') && !m.includes('8171');
          });
          if (realPrices.length > 0) {
            results.found.push({ slug: pkg.slug, price: realPrices[0] });
            return;
          }
        }
      }
      
      results.notFound.push(pkg.slug);
    } catch (e) {
      results.errors.push({ slug: pkg.slug, error: e.message });
    }
  });
  
  await Promise.all(promises);
  
  if ((i / BATCH_SIZE) % 20 === 0) {
    process.stdout.write(`  ${i}/${noPrice.length} checked... (found: ${results.found.length}, 404: ${results.four04.length})\r`);
  }
  
  await new Promise(r => setTimeout(r, DELAY));
}

console.log(`\n\n--- FULL RESULTS ---`);
console.log(`Total checked: ${noPrice.length}`);
console.log(`❌ 404 on reference (junk): ${results.four04.length}`);
console.log(`✅ 200, no price found (confirmed gap): ${results.notFound.length}`);
console.log(`💰 200, HAS price (DATA LOSS): ${results.found.length}`);
console.log(`⚠️ Errors: ${results.errors.length}`);

if (results.found.length > 0) {
  console.log(`\nDATA LOSS BUG — packages with prices on reference missing from MQT:`);
  for (const r of results.found) {
    console.log(`  ${r.slug}: ${r.price}`);
  }
}

if (results.four04.length > 0) {
  console.log(`\n404 JUNK (should be purged): ${results.four04.length}`);
}

// Save results
const outPath = path.join(ROOT, '.freebuff', 'full-price-verification.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nResults saved to ${outPath}`);
