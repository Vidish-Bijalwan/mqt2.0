// Coverage + dedupe report across all 1,116 packages.
// Usage: node scripts/parity/coverage-report.mjs
import fs from "fs";

const src = fs.readFileSync("src/data/allPackages.ts", "utf8");
const fields = [];
const re = /\{\s*"slug": "([^"]+)",[\s\S]*?"title": "([^"]+)",[\s\S]*?"category": "([^"]+)",[\s\S]*?"duration": "([^"]*)",[\s\S]*?"route": "([^"]*)",[\s\S]*?"mrp": "([^"]*)",[\s\S]*?"dealPrice": "([^"]*)"/g;
let m;
while ((m = re.exec(src)) !== null) {
  fields.push({ slug: m[1], title: m[2], category: m[3], duration: m[4], route: m[5], mrp: m[6], dealPrice: m[7] });
}

const parseINR = (s) => parseInt((s || "").replace(/[^\d]/g, ""), 10) || 0;
const isFallback = (p) => {
  const d = parseINR(p.dealPrice), r = parseINR(p.mrp);
  return d === 2 || r === 2 || d === 24750;
};
const hasPrice = (p) => (parseINR(p.mrp) > 0 || parseINR(p.dealPrice) > 0) && !isFallback(p);

const emptyDur = fields.filter((p) => !p.duration).length;
const emptyRoute = fields.filter((p) => !p.route).length;
const noPrice = fields.filter((p) => !hasPrice(p)).length;
const fallback = fields.filter((p) => isFallback(p)).length;
const withPrice = fields.filter((p) => hasPrice(p)).length;

const byCat = {};
for (const p of fields) byCat[p.category] = (byCat[p.category] || 0) + 1;
const catEmptyDur = {};
for (const p of fields) if (!p.duration) catEmptyDur[p.category] = (catEmptyDur[p.category] || 0) + 1;

// Dedupe candidates: same price+oldPrice (same deal) in the same category,
// with similar titles (first 4 words).
const dupGroups = {};
for (const p of fields) {
  if (!hasPrice(p)) continue;
  const key = `${p.category}|${p.dealPrice}|${p.mrp}`;
  const shortTitle = p.title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/).slice(0, 4).join(" ");
  (dupGroups[key] = dupGroups[key] || []).push({ slug: p.slug, shortTitle, title: p.title, dealPrice: p.dealPrice, mrp: p.mrp });
}
const dupGroupsWithMulti = Object.values(dupGroups)
  .filter((g) => g.length > 1)
  .map((g) => ({ key: g[0].dealPrice + " / " + g[0].mrp, cat: g[0].slug, count: g.length, items: g }));

console.log("=== COVERAGE (1,116 packages) ===");
console.log(`Total: ${fields.length}`);
console.log(`Empty duration: ${emptyDur} (${(emptyDur / fields.length * 100).toFixed(1)}%)`);
console.log(`Empty route:    ${emptyRoute} (${(emptyRoute / fields.length * 100).toFixed(1)}%)`);
console.log(`With price:     ${withPrice} (${(withPrice / fields.length * 100).toFixed(1)}%)`);
console.log(`No price / On Request: ${noPrice} (incl. ${fallback} fallback-price flags)`);
console.log("\nEmpty duration by category:");
for (const [c, n] of Object.entries(catEmptyDur).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${c.padEnd(20)} ${n} / ${byCat[c]}`);
}

console.log("\n=== DEDUPE CANDIDATES (same deal price, same category) ===");
const seriousDupes = dupGroupsWithMulti.filter((g) => {
  const titles = g.items.map((i) => i.shortTitle);
  return new Set(titles).size < titles.length;
});
console.log(`Groups with >1 package at same price: ${dupGroupsWithMulti.length}`);
console.log(`Groups with similar titles (likely true dupes): ${seriousDupes.length}`);
const examples = seriousDupes.slice(0, 5);
for (const g of examples) {
  console.log(`  ${g.key} (${g.items[0].title.slice(0, 30)}): ${g.items.map((i) => i.slug).join(", ")}`);
}

fs.writeFileSync(".freebuff/parity/coverage-report.txt", [
  `Total packages: ${fields.length}`,
  `Empty duration: ${emptyDur} (${(emptyDur / fields.length * 100).toFixed(1)}%)`,
  `Empty route: ${emptyRoute} (${(emptyRoute / fields.length * 100).toFixed(1)}%)`,
  `With price: ${withPrice} (${(withPrice / fields.length * 100).toFixed(1)}%)`,
  `No price: ${noPrice} (incl ${fallback} fallback flags)`,
  `Dedupe groups (>1 pkg same price): ${dupGroupsWithMulti.length}`,
  `Dedupe groups with similar titles: ${seriousDupes.length}`,
].join("\n"));
console.log("\nWrote .freebuff/parity/coverage-report.txt");
