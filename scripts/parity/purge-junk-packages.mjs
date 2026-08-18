// Purge the junk content-less packages (scrape artifacts like
// travel-guide__page__N and pilgrimage-tour-package__page__N) that:
//   - have no page on the reference site (probed 404),
//   - render an empty state at /packages/<slug> today,
//   - and pollute the catalog, sitemap and listing counts.
//
// What this script does:
//   1. Removes them from allPackages.ts (sitemap + listing counts + the
//      /packages/[slug] route follow automatically).
//   2. Adds 308 redirects in redirects.json so the old URLs (both /slug and
//      /slug.html) resolve to the real tour listing instead of 404ing. Slugs
//      with a REAL parent package (e.g. pilgrimage-tour-package__page__1 ->
//      pilgrimage-tour-package) redirect to that package; the rest go to
//      /packages.
//   3. Drops their (empty) entries from packageDetailsV3.json / V2.
//
// Run: node scripts/parity/purge-junk-packages.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ALL_FILE = path.join(ROOT, "src/data/allPackages.ts");
const REDIR_FILE = path.join(ROOT, "src/data/redirects.json");
const V3_FILE = path.join(ROOT, "src/data/packageDetailsV3.json");
const V2_FILE = path.join(ROOT, "src/data/packageDetailsV2.json");

const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/parity/contentless-baseline.json"), "utf8"));
const junk = new Set(baseline.slugs);
console.log(`junk slugs to purge: ${junk.size}`);

// ---- allPackages.ts ----
const src = fs.readFileSync(ALL_FILE, "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);
const before = all.length;
const kept = all.filter((p) => !junk.has(p.slug));
const removed = before - kept.length;
if (removed !== junk.size) {
  console.error(`⚠️ expected to remove ${junk.size} but only ${removed} were in the catalog`);
}
const allBody = JSON.stringify(kept, null, 2).replace(/\n/g, "\r\n");
fs.writeFileSync(ALL_FILE, src.replace(m[1], allBody), "utf8");

// ---- redirects.json ----
// The junk slugs already have redirects from the original scrape, but they
// point at /packages?filter=<junk-slug> which now matches nothing. Rewrite
// every junk-slug redirect (and its .html twin) to the real destination.
const realSlugs = new Set(kept.map((p) => p.slug));
const redirects = JSON.parse(fs.readFileSync(REDIR_FILE, "utf8"));
const bySource = new Map(redirects.map((r, i) => [r.source.toLowerCase(), i]));
const updated = [];
for (const slug of [...junk].sort()) {
  const base = slug.split("__")[0];
  const target = realSlugs.has(base) ? `/packages/${base}` : "/packages";
  for (const form of [`/${slug}`, `/${slug}.html`]) {
    const idx = bySource.get(form.toLowerCase());
    if (idx !== undefined) {
      if (redirects[idx].destination !== target) {
        redirects[idx].destination = target;
        updated.push(`${form} -> ${target} (updated)`);
      }
    } else {
      redirects.push({ source: form, destination: target, permanent: true });
      updated.push(`${form} -> ${target} (added)`);
    }
  }
}
fs.writeFileSync(REDIR_FILE, JSON.stringify(redirects, null, 2), "utf8");

// ---- drop junk entries from the details JSONs ----
for (const FILE of [V3_FILE, V2_FILE]) {
  const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
  let dropped = 0;
  for (const slug of junk) {
    if (data[slug]) {
      delete data[slug];
      dropped++;
    }
  }
  if (dropped) fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`${path.basename(FILE)}: dropped ${dropped} junk entries`);
}

console.log(`\n── purge result ──`);
console.log(`catalog: ${before} -> ${kept.length}`);
console.log(`redirects updated/added: ${updated.length}`);
for (const a of updated.slice(0, 6)) console.log(`  ${a}`);
