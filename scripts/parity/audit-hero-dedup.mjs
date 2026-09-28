// Hero dedup audit: finds packages whose RESOLVED hero (getApprovedPackageImage)
// is shared by 2+ packages of the same location/state. Writes a machine-readable
// JSON + markdown report. Run: node --experimental-strip-types scripts/parity/audit-hero-dedup.mts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..", "..");

const mediaMod = await import(path.join(root, "src/data/packageLocationMedia.ts"));
const { getApprovedPackageImage, PACKAGE_MEDIA_PLACEHOLDER } = mediaMod;
const pkgMod = await import(path.join(root, "src/data/allPackages.ts"));
const { allPackages } = pkgMod;

const resolved = allPackages.map((pkg) => {
  const hero = getApprovedPackageImage({ slug: pkg.slug, title: pkg.title, route: pkg.route, category: pkg.category });
  return { slug: pkg.slug, title: pkg.title, category: pkg.category, hero };
});

// group by hero
const groups = new Map();
for (const r of resolved) {
  if (!groups.has(r.hero)) groups.set(r.hero, []);
  groups.get(r.hero).push(r);
}

const placeholderUsers = (groups.get(PACKAGE_MEDIA_PLACEHOLDER) || []).map((r) => r.slug);

const clusters = [];
for (const [hero, pkgs] of groups) {
  if (hero === PACKAGE_MEDIA_PLACEHOLDER) continue;
  if (pkgs.length < 2) continue;
  const fileExists = fs.existsSync(path.join(root, "public", hero.replace(/^\//, "")));
  clusters.push({ hero, count: pkgs.length, fileExists, slugs: pkgs.map((p) => p.slug) });
}
clusters.sort((a, b) => b.count - a.count || a.hero.localeCompare(b.hero));

const out = {
  generatedAt: new Date().toISOString(),
  totalPackages: resolved.length,
  uniqueHeroes: groups.size - (groups.has(PACKAGE_MEDIA_PLACEHOLDER) ? 1 : 0),
  placeholderCount: placeholderUsers.length,
  clusterCount: clusters.length,
  packagesInClusters: clusters.reduce((n, c) => n + c.count, 0),
  clusters,
};

const jsonPath = path.join(root, "docs/qa/hero-dedup-audit.json");
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));

const md = [
  "# Hero Dedup Audit",
  "",
  `- Generated: ${out.generatedAt}`,
  `- Packages checked: ${out.totalPackages}`,
  `- Unique resolved heroes: ${out.uniqueHeroes}`,
  `- Packages with placeholder hero (no media record): ${out.placeholderCount}`,
  `- Duplicate-hero clusters (2+ packages, non-placeholder): ${out.clusterCount}`,
  `- Packages inside clusters: ${out.packagesInClusters}`,
  "",
  "## Clusters",
  "",
  ...clusters.flatMap((c) => [
    `### ${c.count}x \`${c.hero}\` ${c.fileExists ? "" : "**(FILE MISSING)**"}`,
    "",
    ...c.slugs.map((s) => `- \`${s}\``),
    "",
  ]),
];
fs.writeFileSync(path.join(root, "docs/qa/hero-dedup-audit.md"), md.join("\n"));

console.log(JSON.stringify({ ...out, clusters: clusters.map((c) => ({ hero: c.hero, count: c.count, fileExists: c.fileExists, slugs: c.slugs })) }, null, 2));
