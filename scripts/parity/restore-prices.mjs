#!/usr/bin/env node
/**
 * Restore lost prices from reference site verification data.
 * Reads .freebuff/full-price-verification.json and updates allPackages.ts
 * with real prices for packages that had prices on the reference site.
 */
import fs from 'fs';
import path from 'path';

const VERIFICATION_FILE = path.join(process.cwd(), '.freebuff', 'full-price-verification.json');
const PACKAGES_FILE = path.join(process.cwd(), 'src', 'data', 'allPackages.ts');
const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'priceOverrides.json');

// Parse price string to number
function parsePrice(priceStr) {
  if (!priceStr) return null;
  
  // Remove currency symbols and whitespace
  let cleaned = priceStr
    .replace(/[₹$]/g, '')
    .replace(/INR/gi, '')
    .replace(/Rs\.?/gi, '')
    .replace(/\s/g, '')
    .trim();
  
  // Remove commas
  cleaned = cleaned.replace(/,/g, '');
  
  // Parse to number
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

// Format price as Indian Rupees
function formatPrice(num) {
  if (!num) return '';
  return '₹' + num.toLocaleString('en-IN');
}

// Calculate 1.5x multiplier with rounding
function applyMultiplier(price) {
  return Math.round(price * 1.5);
}

async function main() {
  console.log('📦 Restoring lost prices from reference site...\n');
  
  // Read verification data
  if (!fs.existsSync(VERIFICATION_FILE)) {
    console.error('❌ Verification file not found:', VERIFICATION_FILE);
    process.exit(1);
  }
  
  const verificationData = JSON.parse(fs.readFileSync(VERIFICATION_FILE, 'utf8'));
  const foundPackages = verificationData.found || [];
  console.log(`Found ${foundPackages.length} packages with prices on reference site\n`);
  
  // Read current packages
  const packagesContent = fs.readFileSync(PACKAGES_FILE, 'utf8');
  
  // Read existing overrides
  let overrides = {};
  if (fs.existsSync(OVERRIDES_FILE)) {
    overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8'));
  }
  
  let restored = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const pkg of foundPackages) {
    const { slug, price } = pkg;
    
    // Parse the reference price
    const originalPrice = parsePrice(price);
    if (!originalPrice) {
      console.log(`  ⚠️  Could not parse price for ${slug}: "${price}"`);
      errors++;
      continue;
    }
    
    // Apply 1.5x multiplier
    const dealPrice = applyMultiplier(originalPrice);
    const mrp = applyMultiplier(Math.round(originalPrice * 1.25)); // MRP is ~25% higher than deal
    
    // Check if package exists in allPackages.ts
    const slugPattern = new RegExp(`"slug":\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'i');
    if (!slugPattern.test(packagesContent)) {
      console.log(`  ⚠️  Package not found in allPackages.ts: ${slug}`);
      skipped++;
      continue;
    }
    
    // Check if already has a real price (not placeholder)
    const pkgSection = packagesContent.substring(
      packagesContent.indexOf(`"slug": "${slug}"`) - 100,
      packagesContent.indexOf(`"slug": "${slug}"`) + 500
    );
    
    const currentMrpMatch = pkgSection.match(/"mrp":\s*"([^"]*)"/);
    const currentMrp = currentMrpMatch ? currentMrpMatch[1] : '';
    
    // Skip if already has a real price (not placeholder)
    if (currentMrp && currentMrp !== '₹31,125' && currentMrp !== '' && currentMrp !== '₹0') {
      // Already has a price, but let's check if our override is better
      if (overrides[slug]) {
        // Already has override, skip
        skipped++;
        continue;
      }
    }
    
    // Add to overrides
    overrides[slug] = {
      mrp: formatPrice(mrp),
      dealPrice: formatPrice(dealPrice),
      originalPrice: price,
      originalMrp: formatPrice(Math.round(originalPrice * 1.25)),
      restored: true
    };
    
    restored++;
  }
  
  // Write updated overrides
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2));
  
  console.log('\n📊 Summary:');
  console.log(`  ✅ Restored: ${restored} packages`);
  console.log(`  ⏭️  Skipped: ${skipped} packages (already have prices)`);
  console.log(`  ❌ Errors: ${errors} packages (could not parse price)`);
  console.log(`  📁 Total overrides: ${Object.keys(overrides).length}`);
  
  // Count restored prices
  const restoredCount = Object.values(overrides).filter(o => o.restored).length;
  console.log(`\n💰 Price coverage improvement:`);
  console.log(`  Before: 246 packages with real prices (34.7%)`);
  console.log(`  After: ${246 + restored} packages with real prices (${((246 + restored) / 709 * 100).toFixed(1)}%)`);
}

main().catch(console.error);
