// Re-scrape pass for the content-less packages that DO have a page on the
// reference site (the probe classified them as "listing": a real page exists,
// but it is a category page with no day-by-day itinerary — the honest ceiling
// of what re-scraping can yield).
//
// For each such package this script:
//   1. Fetches the reference page and extracts its real <meta description>.
//   2. Sets pkg.description (shown as the Tour Overview intro — the page
//      renders description-only packages without the empty state).
//   3. Adds V3 blocks: a "Tour Overview" heading + the description paragraph,
//      so the package gets the same structure as real packages.
//
// It does NOT invent itineraries, inclusions, or routes — if the reference has
// none, the package keeps the honest "shared on request" treatment for those
// sections. Packages whose reference page is a 404 (scrape artifacts like
// travel-guide__page__N) are left untouched and reported.
//
// Run: node scripts/parity/rescrape-contentless.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ALL_FILE = path.join(ROOT, "src/data/allPackages.ts");
const V3_FILE = path.join(ROOT, "src/data/packageDetailsV3.json");

const src = fs.readFileSync(ALL_FILE, "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);

const probe = JSON.parse(fs.readFileSync(path.join(ROOT, ".freebuff/probe-results.json"), "utf8"));
const listingSlugs = Object.entries(probe)
  .filter(([, v]) => v.kind === "listing")
  .map(([s]) => s);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchMeta(slug) {
  const url = `https://www.namasteindiatrip.com/${slug}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (res.status !== 200) return null;
  const html = await res.text();
  const meta = (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1];
  return meta ? meta.replace(/&amp;/g, "&").trim() : null;
}

const v3 = JSON.parse(fs.readFileSync(V3_FILE, "utf8"));
let updated = 0;
let skipped = 0;

for (const slug of listingSlugs) {
  const pkg = all.find((p) => p.slug === slug);
  if (!pkg) continue;
  if ((pkg.description || "").length >= 30) {
    skipped++; // already has a real description
    continue;
  }
  const desc = await fetchMeta(slug);
  if (!desc || desc.length < 30) {
    console.log(`⚠️  ${slug}: no usable meta description`);
    continue;
  }
  pkg.description = desc;
  if (!v3[slug]) v3[slug] = { seo: {}, blocks: [] };
  const blocks = v3[slug].blocks || [];
  // replace any stub blocks with the real overview structure
  v3[slug].blocks = [
    { type: "heading", level: 2, text: "Tour Overview" },
    { type: "paragraph", text: desc },
  ];
  updated++;
  console.log(`✅ ${slug}: "${desc.slice(0, 60)}…"`);
  await sleep(800);
}

// ---- write back ----
const allBody = JSON.stringify(all, null, 2).replace(/\n/g, "\r\n");
fs.writeFileSync(ALL_FILE, src.replace(m[1], allBody), "utf8");
fs.writeFileSync(V3_FILE, JSON.stringify(v3, null, 2) + "\n", "utf8");

console.log(`\n── re-scrape result ──`);
console.log(`updated: ${updated}  (already-had-description: ${skipped})`);
const still404 = Object.entries(probe).filter(([, v]) => v.kind === "404").length;
console.log(`untouched 404s (junk slugs, no page anywhere): ${still404}`);
