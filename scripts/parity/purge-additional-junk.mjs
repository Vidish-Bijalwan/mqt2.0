#!/usr/bin/env node
/**
 * Purge the 305 additional junk packages that return 404 on the reference site.
 * These were identified by full-price-check.mjs.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const ALL_FILE = path.join(ROOT, 'src/data/allPackages.ts');
const REDIR_FILE = path.join(ROOT, 'src/data/redirects.json');
const V3_FILE = path.join(ROOT, 'src/data/packageDetailsV3.json');
const VERIFY_FILE = path.join(ROOT, '.freebuff/full-price-verification.json');

const verifyData = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf8'));
const junkSlugs = new Set(verifyData.four04);
console.log(`Junk slugs to purge: ${junkSlugs.size}`);

// ---- allPackages.ts ----
const src = fs.readFileSync(ALL_FILE, 'utf8');
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error('Could not locate allPackages array');
const all = JSON.parse(m[1]);
const before = all.length;
const kept = all.filter(p => !junkSlugs.has(p.slug));
const removed = before - kept.length;
console.log(`allPackages.ts: ${before} → ${kept.length} (removed ${removed})`);

const allBody = JSON.stringify(kept, null, 2).replace(/\n/g, '\r\n');
fs.writeFileSync(ALL_FILE, src.replace(m[1], allBody), 'utf8');

// ---- redirects.json ----
const realSlugs = new Set(kept.map(p => p.slug));
const redirects = JSON.parse(fs.readFileSync(REDIR_FILE, 'utf8'));
const bySource = new Map(redirects.map((r, i) => [r.source.toLowerCase(), i]));
let redirectUpdated = 0;

for (const slug of junkSlugs) {
  const base = slug.split('__')[0];
  const target = realSlugs.has(base) ? `/packages/${base}` : '/packages';
  
  for (const form of [`/${slug}`, `/${slug}.html`]) {
    const idx = bySource.get(form.toLowerCase());
    if (idx !== undefined && redirects[idx].destination !== target) {
      redirects[idx].destination = target;
      redirectUpdated++;
    }
  }
}

fs.writeFileSync(REDIR_FILE, JSON.stringify(redirects, null, 2));
console.log(`redirects.json: ${redirectUpdated} destinations updated`);

// ---- packageDetailsV3.json ----
if (fs.existsSync(V3_FILE)) {
  const v3 = JSON.parse(fs.readFileSync(V3_FILE, 'utf8'));
  let v3removed = 0;
  for (const slug of junkSlugs) {
    if (v3[slug]) {
      delete v3[slug];
      v3removed++;
    }
  }
  fs.writeFileSync(V3_FILE, JSON.stringify(v3, null, 2));
  console.log(`packageDetailsV3.json: removed ${v3removed} entries`);
}

console.log(`\nDone! Catalog: ${kept.length} packages`);
