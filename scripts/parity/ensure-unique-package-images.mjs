// Give published packages distinct, location-relevant primary images when the
// local image library contains a strong, unused match. Ambiguous records are
// reported instead of being silently assigned another generic image.
import fs from "node:fs";
import path from "node:path";

const PACKAGE_FILE = path.join(process.cwd(), "src/data/allPackages.ts");
const IMAGE_DIR = path.join(process.cwd(), "public/images/packages");
const REPORT_FILE = path.join(process.cwd(), "docs/qa/package-image-uniqueness.md");

const source = fs.readFileSync(PACKAGE_FILE, "utf8");
const match = source.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) throw new Error("Could not locate allPackages array");
const packages = JSON.parse(match[1]);

const utilitySlugs = new Set([
  "book-now.php", "customer-center", "customer-satisfaction", "pay-online.php",
  "payment-guide", "payment-options", "payment-security", "privacy-policy", "testimonial",
]);

function tourDays(pkg) {
  const value = `${pkg.duration || ""} ${pkg.title || ""}`;
  const found = value.match(/(\d+)\s*days?/i);
  return found ? Number(found[1]) : null;
}

function isPublished(pkg) {
  const days = tourDays(pkg);
  return !utilitySlugs.has(pkg.slug) && !(days !== null && days < 3);
}

function score(slug, filename) {
  const stripSuffix = (value) => value
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/^hi-/, "")
    .replace(/-(tour|tours|package|packages|holiday|holidays|trip|trips)$/i, "");
  const slugStem = stripSuffix(slug).toLowerCase();
  const filenameStem = stripSuffix(filename).toLowerCase();
  if (filenameStem === slugStem) return 1;
  return 0;
}

function fileQuality(filename) {
  const fullPath = path.join(IMAGE_DIR, filename);
  const stat = fs.statSync(fullPath);
  const generic = /(^|[-_])(india|international|north|south|east|west|tour|package|packages|holiday|holidays)([-_.]|$)/i.test(filename);
  return { bytes: stat.size, generic };
}

const imageFiles = fs.readdirSync(IMAGE_DIR)
  .filter((filename) => /\.(jpg|jpeg|png|webp)$/i.test(filename))
  .filter((filename) => !/^[0-9a-f]{8,}\./i.test(filename))
  .map((filename) => ({ filename, ...fileQuality(filename) }))
  .filter((file) => file.bytes >= 12000)
  .sort((a, b) => b.bytes - a.bytes);

const published = packages.filter(isPublished);
const usage = new Map();
for (const pkg of published) usage.set(pkg.image, (usage.get(pkg.image) || 0) + 1);

const duplicatePackages = published.filter((pkg) => (usage.get(pkg.image) || 0) > 1);
const duplicateUrls = new Set(duplicatePackages.map((pkg) => pkg.image));
const duplicateSourceFiles = new Set([...duplicateUrls].map((image) => path.basename(image)));
const assigned = new Set(published.filter((pkg) => !duplicateUrls.has(pkg.image)).map((pkg) => path.basename(pkg.image)));
const changes = [];
const unresolved = [];

const candidatesFor = (pkg) => {
  return imageFiles
    .filter((file) => !assigned.has(file.filename) && !duplicateSourceFiles.has(file.filename))
    .map((file) => ({ file, confidence: score(pkg.slug, file.filename) }))
    .filter((candidate) => candidate.confidence >= 0.5)
    .sort((a, b) => b.confidence - a.confidence || b.file.bytes - a.file.bytes);
};

// Resolve scarcer duplicate groups first so a strong location asset is not
// consumed by a broad category record before the exact package can use it.
const groups = [...duplicateUrls]
  .map((image) => duplicatePackages.filter((pkg) => pkg.image === image))
  .sort((a, b) => candidatesFor(a[0]).length - candidatesFor(b[0]).length);

for (const group of groups) {
  const ordered = [...group].sort((a, b) => candidatesFor(b)[0]?.confidence - candidatesFor(a)[0]?.confidence);
  for (const pkg of ordered) {
    const candidate = candidatesFor(pkg)[0];
    if (!candidate) {
      unresolved.push({ slug: pkg.slug, current: pkg.image, reason: "No unused local image with a strong location match" });
      continue;
    }
    const next = `/images/packages/${candidate.file.filename}`;
    changes.push({ slug: pkg.slug, old: pkg.image, next, confidence: candidate.confidence.toFixed(2) });
    pkg.image = next;
    assigned.add(candidate.file.filename);
  }
}

const body = JSON.stringify(packages, null, 2).replace(/\n/g, "\r\n");
fs.writeFileSync(PACKAGE_FILE, source.replace(match[1], body), "utf8");

fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
const report = [
  "# Package Image Uniqueness",
  "",
  `- Published packages checked: **${published.length}**`,
  `- Duplicate-primary packages before pass: **${duplicatePackages.length}**`,
  `- Strong local replacements applied: **${changes.length}**`,
  `- Packages still needing an owned/verified source image: **${unresolved.length}**`,
  "",
  "## Replacements",
  "",
  "| Package | Previous image | Assigned image | Match |",
  "|---|---|---|---:|",
  ...changes.map((item) => `| \`${item.slug}\` | \`${path.basename(item.old)}\` | \`${path.basename(item.next)}\` | ${item.confidence} |`),
  "",
  "## Unresolved",
  "",
  "| Package | Current image | Reason |",
  "|---|---|---|",
  ...unresolved.map((item) => `| \`${item.slug}\` | \`${path.basename(item.current)}\` | ${item.reason} |`),
  "",
  "The unresolved list requires original, licensed destination photography or a verified source URL. This pass deliberately does not invent location identity from a generic stock image.",
  "",
].join("\n");
fs.writeFileSync(REPORT_FILE, report, "utf8");

console.log(JSON.stringify({ checked: published.length, beforeDuplicates: duplicatePackages.length, replacements: changes.length, unresolved: unresolved.length, report: REPORT_FILE }, null, 2));
