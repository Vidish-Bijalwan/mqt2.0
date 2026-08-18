// Content guard: fails the build when the set of content-less packages grows
// beyond the committed baseline (scripts/parity/contentless-baseline.json).
//
//  - NEW content-less packages => exit 1 (a regression: previously-fine data
//    lost its content, or new scraped packages arrived empty).
//  - Baseline packages that gained content => reported (exit 0): the fix is
//    to re-run contentless-report.mjs to shrink the baseline.
//
// Regenerate the baseline with: node scripts/parity/contentless-report.mjs
//
// Run: node scripts/parity/check-content.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const src = fs.readFileSync(path.join(root, "src/data/allPackages.ts"), "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);

const v3 = readJson("src/data/packageDetailsV3.json");
const v2 = readJson("src/data/packageDetailsV2.json");
const v1 = readJson("src/data/packageDetails.json");

// Exact mirror of the page's hasRealContent (keep in sync with
// src/app/packages/[slug]/page.tsx).
function hasRealContent(arr) {
  return (
    Array.isArray(arr) &&
    arr.some((b) => {
      if (b.type === "table") return (b.rows || []).length > 0;
      if (b.type === "image") return true;
      if (b.type === "paragraph") {
        const t = (b.text || "").trim();
        return t.length > 60 && !/^(coming soon|under construction)/i.test(t);
      }
      if (b.type === "heading") {
        const t = (b.text || "").trim();
        return t.length > 3 && !/live chat|whatsapp|quick enquiry|email us|coming soon/i.test(t);
      }
      if (b.type === "list") {
        const items = (b.items || []).filter(Boolean);
        return items.length > 0 && !items.every((i) => /live chat|whatsapp|enquiry|email|phone|^\+\d/i.test(i));
      }
      return false;
    })
  );
}

const current = new Set();
for (const p of all) {
  const blocks = hasRealContent(v3[p.slug]?.blocks)
    ? v3[p.slug].blocks
    : hasRealContent(v2[p.slug]?.blocks)
      ? v2[p.slug].blocks
      : null;
  const v1e = v1[p.slug];
  const hasV1 =
    v1e &&
    ((v1e.overview || "").trim().length > 30 ||
      (v1e.itinerary || []).length > 0 ||
      (v1e.highlights || []).length > 0 ||
      (v1e.faqs || []).length > 0);
  const desc = (p.description || "").trim();
  if (!blocks && !hasV1 && desc.length < 30) current.add(p.slug);
}

let baseline;
try {
  baseline = readJson("scripts/parity/contentless-baseline.json");
} catch {
  console.error("❌ no baseline found — run `node scripts/parity/contentless-report.mjs` first");
  process.exit(1);
}
const known = new Set(baseline.slugs || []);

const regressed = [...current].filter((s) => !known.has(s)).sort();
const recovered = [...known].filter((s) => !current.has(s)).sort();

console.log(`content-less packages: ${current.size} (baseline: ${known.size})`);
if (regressed.length) {
  console.error(`\n❌ CONTENT GUARD FAILED — ${regressed.length} package(s) are newly content-less:`);
  for (const s of regressed) console.error(`   ${s}`);
  console.error(`\nFix the scrape/data or, if intentional, re-run:`);
  console.error(`   node scripts/parity/contentless-report.mjs`);
  process.exit(1);
}
if (recovered.length) {
  console.log(`✅ ${recovered.length} previously content-less package(s) now have content:`);
  for (const s of recovered) console.log(`   ${s}`);
  console.log(`   → re-run node scripts/parity/contentless-report.mjs to shrink the baseline`);
} else {
  console.log("✅ no new content-less packages");
}
