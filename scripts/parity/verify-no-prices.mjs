#!/usr/bin/env node
/**
 * Point #3: Verify that 942 "no price" packages genuinely lack pricing
 * on namasteindiatrip.com. Sample 20 packages across different categories.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const src = fs.readFileSync(path.join(ROOT, 'src/data/allPackages.ts'), 'utf8');

// Parse all packages
const slugPattern = /"slug":\s*"([^"]+)"/g;
const mrpPattern = /"mrp":\s*"([^"]*)"/g;
const dealPattern = /"dealPrice":\s*"([^"]*)"/g;

const slugs = [], mrps = [], deals = [], categories = [];
let m;
while ((m = slugPattern.exec(src)) !== null) slugs.push(m[1]);
while ((m = mrpPattern.exec(src)) !== null) mrps.push(m[1]);
while ((m = dealPattern.exec(src)) !== null) deals.push(m[1]);

// Get categories
const catPattern = /"category":\s*"([^"]+)"/g;
while ((m = catPattern.exec(src)) !== null) categories.push(m[1]);

// Build package list
const packages = slugs.map((s, i) => ({
  slug: s,
  mrp: mrps[i] || '',
  dealPrice: deals[i] || '',
  category: categories[i] || '',
}));

// Filter to no-price packages
const noPrice = packages.filter(p => !p.mrp && !p.dealPrice);
console.log(`Total no-price packages: ${noPrice.length}`);

// Sample 20 evenly across the list
const step = Math.floor(noPrice.length / 20);
const sample = [];
for (let i = 0; i < 20 && i * step < noPrice.length; i++) {
  sample.push(noPrice[i * step]);
}

console.log(`\nSampling ${sample.length} packages against reference site:\n`);

// For each sample, check if the reference site has a price
const results = [];
for (const pkg of sample) {
  const refUrl = `https://www.namasteindiatrip.com/${pkg.slug}`;
  try {
    const resp = await fetch(refUrl, { 
      method: 'HEAD', 
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) 
    });
    const status = resp.status;
    
    // If 200, fetch body and check for price patterns
    let hasPrice = false;
    let priceText = '';
    if (status === 200) {
      const bodyResp = await fetch(refUrl, { 
        signal: AbortSignal.timeout(15000) 
      });
      const html = await bodyResp.text();
      
      // Check for common Indian price patterns
      const pricePatterns = [
        /₹\s*[\d,]+/g,
        /INR\s*[\d,]+/g,
        /Rs\.?\s*[\d,]+/g,
        /Starting\s+(?:from|at|price)[:\s]*₹?[\d,]+/gi,
        /(?:price|cost|fare)[:\s]*₹?[\d,]+/gi,
      ];
      
      for (const pat of pricePatterns) {
        const matches = html.match(pat);
        if (matches && matches.length > 0) {
          // Filter out phone numbers and year references
          const realPrices = matches.filter(m => {
            const num = m.replace(/[^\d]/g, '');
            return num.length >= 4 && num.length <= 8 && !m.includes('9181') && !m.includes('2024');
          });
          if (realPrices.length > 0) {
            hasPrice = true;
            priceText = realPrices[0];
            break;
          }
        }
      }
    }
    
    results.push({
      slug: pkg.slug,
      category: pkg.category,
      refStatus: status,
      hasPrice,
      priceText,
    });
    
    const icon = status === 404 ? '❌404' : hasPrice ? '💰HAS' : '✅NONE';
    console.log(`  ${icon} ${pkg.slug} (${pkg.category}) — ref:${status} ${hasPrice ? 'price:' + priceText : 'no price found'}`);
    
    // Throttle requests
    await new Promise(r => setTimeout(r, 500));
  } catch (e) {
    results.push({
      slug: pkg.slug,
      category: pkg.category,
      refStatus: 'error',
      hasPrice: false,
      priceText: '',
      error: e.message,
    });
    console.log(`  ⚠️ERROR ${pkg.slug} — ${e.message}`);
  }
}

// Summary
const found404 = results.filter(r => r.refStatus === 404);
const foundPrice = results.filter(r => r.hasPrice);
const foundNoPrice = results.filter(r => r.refStatus === 200 && !r.hasPrice);
const errors = results.filter(r => r.refStatus === 'error');

console.log(`\n--- Summary ---`);
console.log(`404 on reference: ${found404.length} (junk — should be purged)`);
console.log(`200 but no price: ${foundNoPrice.length} (confirmed no-price)`);
console.log(`200 WITH price: ${foundPrice.length} (DATA LOSS BUG)`);
console.log(`Errors: ${errors.length}`);

if (foundPrice.length > 0) {
  console.log(`\n⚠️ DATA LOSS BUG: ${foundPrice.length} packages have prices on reference that are missing from MQT:`);
  for (const r of foundPrice) {
    console.log(`  ${r.slug}: ${r.priceText}`);
  }
}

// Write results
fs.writeFileSync(
  path.join(ROOT, '.freebuff', 'no-price-verification.json'),
  JSON.stringify(results, null, 2)
);
console.log(`\nResults written to .freebuff/no-price-verification.json`);
