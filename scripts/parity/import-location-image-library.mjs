// Imports the supplied, attributable location images only when a package title
// or stated route contains that exact destination. This intentionally avoids
// broad theme/category matching, which is how unrelated package imagery crept
// into the catalogue previously.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packageFile = path.join(root, "src", "data", "allPackages.ts");
const inventoryFile = path.join(root, "new_images", "locations_inventory.csv");
const creditsFile = path.join(root, "new_images", "credits.csv");
const sourceRoot = path.join(root, "new_images", "images");
const publicRoot = path.join(root, "public", "images", "location-library");
const outputFile = path.join(root, "src", "data", "packageLocationMedia.ts");
const reportFile = path.join(root, "docs", "qa", "location-image-import-report.json");

function parseCsv(input) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === '"') {
      if (quoted && input[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && input[index + 1] === "\n") index += 1;
      row.push(value);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }
  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  const [headers, ...body] = rows;
  return body.map((fields) => Object.fromEntries(headers.map((header, i) => [header, fields[i] || ""])));
}

function normalise(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(the|tour|package|packages|holiday|holidays|trip|india)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const aliases = new Map([
  ["rameshwaram", ["rameswaram"]],
  ["rameswaram", ["rameshwaram"]],
  ["prayagraj", ["allahabad"]],
  ["allahabad", ["prayagraj"]],
  ["puducherry", ["pondicherry"]],
  ["pondicherry", ["puducherry"]],
  ["bengaluru", ["bangalore"]],
  ["bangalore", ["bengaluru"]],
  ["lepakshi", ["lepakshi temple"]],
]);

function phrasesFor(name) {
  const exact = normalise(name);
  const values = new Set([exact]);
  for (const [source, replacements] of aliases) {
    if (!exact.includes(source)) continue;
    for (const replacement of replacements) values.add(exact.replace(source, replacement));
  }
  return [...values].filter((phrase) => phrase.length >= 3);
}

function containsPhrase(text, phrase) {
  return ` ${text} `.includes(` ${phrase} `);
}

const packageSource = fs.readFileSync(packageFile, "utf8");
const packageMatch = packageSource.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!packageMatch) throw new Error("Could not locate allPackages array");
const packages = JSON.parse(packageMatch[1]);
const inventory = parseCsv(fs.readFileSync(inventoryFile, "utf8"));
const credits = parseCsv(fs.readFileSync(creditsFile, "utf8"));
const creditsBySlug = new Map();
for (const item of credits) {
  const items = creditsBySlug.get(item.slug) || [];
  items.push(item);
  creditsBySlug.set(item.slug, items);
}

const transitHubs = new Set(["delhi", "mumbai", "chennai", "bengaluru", "bangalore", "kolkata", "hyderabad"]);
const locations = inventory
  .filter((item) => item.slug && item.name && fs.existsSync(path.join(sourceRoot, item.slug)))
  .map((item) => ({ ...item, phrases: phrasesFor(item.name) }));

const packageMedia = {};
const report = [];
const copiedFiles = new Set();

for (const pkg of packages) {
  const title = normalise(pkg.title);
  const route = normalise(pkg.route);
  const slug = normalise(pkg.slug);
  const candidates = locations.map((location) => {
    const titleMatch = location.phrases.some((phrase) => containsPhrase(title, phrase));
    const routeMatch = location.phrases.some((phrase) => containsPhrase(route, phrase));
    const slugMatch = location.phrases.some((phrase) => containsPhrase(slug, phrase));
    const primaryPhrase = location.phrases[0] || "";
    const genericHub = transitHubs.has(primaryPhrase);
    const geoTokens = normalise(location.geo_hint).split(" ").filter((token) => token.length >= 4);
    const geoScore = geoTokens.filter((token) => containsPhrase(`${title} ${route} ${slug}`, token)).length * 16;
    const score = (titleMatch ? 120 : 0) + (routeMatch ? 80 : 0) + (slugMatch ? 45 : 0) + geoScore + Math.min(primaryPhrase.length, 30) - (genericHub ? 70 : 0);
    return { location, titleMatch, routeMatch, slugMatch, score, genericHub };
  })
    .filter((candidate) => candidate.titleMatch || candidate.routeMatch || candidate.slugMatch)
    .filter((candidate) => candidate.score >= 55)
    .sort((a, b) => b.score - a.score || b.location.name.length - a.location.name.length);

  const preferredCandidates = candidates.some((candidate) => !candidate.genericHub)
    ? candidates.filter((candidate) => !candidate.genericHub)
    : candidates;
  const selected = [];
  const selectedNames = new Set();
  for (const candidate of preferredCandidates) {
    const locationName = normalise(candidate.location.name);
    if (selected.some((current) => current.location.slug === candidate.location.slug) || selectedNames.has(locationName)) continue;
    // Two exact locations provide eight verified gallery images without mixing
    // in unrelated places on longer multi-stop routes.
    selected.push(candidate);
    selectedNames.add(locationName);
    if (selected.length === 2) break;
  }
  if (!selected.length) continue;

  const gallery = [];
  for (const { location } of selected) {
    const sourceDirectory = path.join(sourceRoot, location.slug);
    const creditRows = creditsBySlug.get(location.slug) || [];
    for (let sequence = 1; sequence <= 4; sequence += 1) {
      const filename = `${location.slug}-${String(sequence).padStart(2, "0")}-lg.webp`;
      const sourceFile = path.join(sourceDirectory, filename);
      if (!fs.existsSync(sourceFile)) continue;
      const outputDirectory = path.join(publicRoot, location.slug);
      const outputFilePath = path.join(outputDirectory, filename);
      fs.mkdirSync(outputDirectory, { recursive: true });
      fs.copyFileSync(sourceFile, outputFilePath);
      copiedFiles.add(outputFilePath);
      const credit = creditRows.find((item) => Number(item.sequence) === sequence);
      const attribution = credit
        ? `${location.name} — ${credit.creator || credit.provider || "source credited"}, ${credit.license || "license recorded"}`
        : `${location.name} — supplied location image`;
      gallery.push({
        src: `/images/location-library/${location.slug}/${filename}`,
        caption: attribution,
      });
    }
  }
  if (gallery.length < 2) continue;
  packageMedia[pkg.slug] = {
    primary: gallery[0].src,
    gallery,
    locations: selected.map(({ location }) => location.name),
  };
  report.push({
    slug: pkg.slug,
    title: pkg.title,
    locations: selected.map(({ location, score }) => ({ name: location.name, score })),
    images: gallery.length,
  });
}

const header = `export interface PackageLocationImage {\n  src: string;\n  caption: string;\n}\n\nexport interface PackageLocationMedia {\n  primary: string;\n  gallery: PackageLocationImage[];\n  locations: string[];\n}\n\n/** Generated from new_images/locations_inventory.csv. Only exact title or route matches are included. */\nexport const packageLocationMedia: Record<string, PackageLocationMedia> = `;
const moduleSource = `${header}${JSON.stringify(packageMedia, null, 2)};\n`;
fs.writeFileSync(outputFile, moduleSource, "utf8");
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify({ packagesMatched: report.length, imagesCopied: copiedFiles.size, report }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ packagesMatched: report.length, imagesCopied: copiedFiles.size, outputFile, reportFile }, null, 2));
