// Content-less package report + baseline for the build guard.
//
// A package is "content-less" when the package page has NOTHING real to
// render: the V3/V2 blocks contain no meaningful block (mirrors
// hasRealContent in src/app/packages/[slug]/page.tsx exactly), the legacy
// V1 entry is empty, and the structured description is under 30 chars. Such
// packages show the honest empty state ("Detailed tour information is shared
// on request" + CTAs) — fine UX-wise, but a re-scrape target.
//
// Run: node scripts/parity/contentless-report.mjs
// Writes: scripts/parity/contentless-baseline.json (the current set)
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

// Exact mirror of the page's hasRealContent (keep in sync).
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

const contentless = [];
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
  if (!blocks && !hasV1 && desc.length < 30) contentless.push(p.slug);
}

contentless.sort();
const baseline = {
  generatedAt: new Date().toISOString(),
  count: contentless.length,
  slugs: contentless,
};
fs.writeFileSync(
  path.join(root, "scripts/parity/contentless-baseline.json"),
  JSON.stringify(baseline, null, 2) + "\n",
  "utf8"
);

const byCategory = {};
const inter = /algeria|benin|brazil|cape-verde|ethiopia|fiji|french-polynesia|gambia|gauteng|ghana|kenya|kwazulu|libya|mpumalanga|northern-cape|papua-new-guinea|rwanda|senegal|tanzania|tunisia|western-cape|holidays-in/;
for (const s of contentless) {
  const key = inter.test(s) ? "international" : "india";
  byCategory[key] = (byCategory[key] || 0) + 1;
}
console.log(`── content-less report ──`);
console.log(`total: ${contentless.length}  (india: ${byCategory.india || 0}, international: ${byCategory.international || 0})`);
console.log(`baseline written to scripts/parity/contentless-baseline.json`);
console.log(`\n${contentless.join("\n")}`);
