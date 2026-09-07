import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const source = fs.readFileSync(path.join(root, "src/data/allPackages.ts"), "utf8");
const packageMatch = source.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!packageMatch) throw new Error("Could not locate the allPackages array");

const packages = JSON.parse(packageMatch[1]);
const v1 = readJson("src/data/packageDetails.json");
const v2 = readJson("src/data/packageDetailsV2.json");
const v3 = readJson("src/data/packageDetailsV3.json");

const NON_PACKAGE_SLUGS = new Set([
  "book-now.php",
  "customer-center",
  "customer-satisfaction",
  "pay-online.php",
  "payment-guide",
  "payment-options",
  "payment-security",
  "privacy-policy",
  "testimonial",
]);

const STOP_WORDS = new Set([
  "tour", "tours", "package", "packages", "trip", "travel", "yatra", "holiday", "holidays",
  "from", "with", "for", "and", "the", "india", "indian", "days", "day", "nights", "night",
  "best", "special", "complete", "explore", "guide", "guides", "sightseeing", "honeymoon",
  "helicopter", "group", "family", "customized", "customised", "private", "luxury", "budget",
]);

const PLACE_WORDS = new Set([
  "agra", "ahmedabad", "ajmer", "amarnath", "andaman", "arunachal", "assam", "auli", "ayodhya",
  "badrinath", "bali", "bangalore", "bhopal", "bhutan", "chardham", "chennai", "coorg", "darjeeling",
  "delhi", "dubai", "dwarka", "europe", "gangotri", "gangtok", "goa", "gujarat", "guwahati",
  "haridwar", "himachal", "hyderabad", "indore", "jaipur", "jaisalmer", "japan", "jodhpur",
  "kashmir", "kathmandu", "kedarnath", "kerala", "khajuraho", "kolkata", "ladakh", "lucknow",
  "maharashtra", "malaysia", "maldives", "manali", "mathura", "mauritius", "meghalaya", "mumbai",
  "munnar", "mysore", "nepal", "odisha", "omkareshwar", "ooty", "pahalgam", "pattaya", "phuket",
  "puri", "pushkar", "rajasthan", "rameshwaram", "rishikesh", "shimla", "shillong", "sikkim",
  "singapore", "somnath", "srinagar", "tawang", "thailand", "tirupati", "udaipur", "ujjain",
  "uttarakhand", "varanasi", "vietnam", "vrindavan", "wayanad",
]);

const REGION_MEMBERS = {
  gujarat: new Set(["ahmedabad", "dwarka", "somnath", "surat"]),
  rajasthan: new Set(["ajmer", "jaipur", "jaisalmer", "jodhpur", "pushkar", "udaipur"]),
  uttarakhand: new Set(["auli", "badrinath", "dehradun", "gangotri", "haridwar", "kedarnath", "rishikesh"]),
  himachal: new Set(["manali", "shimla"]),
  kerala: new Set(["munnar", "wayanad"]),
};

const GENERIC_IMAGES = /(^|\/)(india-tour-packages?|north-india-tour-packages|south-india-tour|east-india-tour-packages|west-india-tour-package|northeast-india|international-tours|pilgrimage-tours|helicopter-packages|honeymoon|wildlife|adventure|uttar-pradesh)\.(jpg|jpeg|png|webp)$/i;
const SCRAPE_LEAK = /live chat|quick enquiry|write a review|pay online|my booking|related tour packages|top trending tour packages|view all images|best price|coupon code|response time|response rate|discuss on whatsapp|no hidden charges|people are considering|price guarantee/i;

function tokens(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function placeTokens(value) {
  return new Set(tokens(value).filter((token) => PLACE_WORDS.has(token)));
}

function expectedDays(pkg) {
  const match = `${pkg.duration || ""} ${pkg.title || ""}`.match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : null;
}

function blockText(block) {
  return String(block?.text || block?.content || "").trim();
}

function hasRealContent(blocks) {
  return Array.isArray(blocks) && blocks.some((block) => {
    if (block.type === "table") return (block.rows || []).length > 0;
    if (block.type === "image") return true;
    if (block.type === "paragraph") return blockText(block).length > 60;
    if (block.type === "heading") return blockText(block).length > 3 && !SCRAPE_LEAK.test(blockText(block));
    if (block.type === "list") return (block.items || []).some((item) => typeof item === "string" && item.trim());
    return false;
  });
}

function selectedBlocks(slug) {
  if (hasRealContent(v3[slug]?.blocks)) return { source: "v3", blocks: v3[slug].blocks };
  if (hasRealContent(v2[slug]?.blocks)) return { source: "v2", blocks: v2[slug].blocks };
  return { source: "none", blocks: [] };
}

function itineraryFromBlocks(sourceName, blocks) {
  if (!Array.isArray(blocks)) return { source: sourceName, days: [], rawText: "" };
  const wrapper = blocks.findIndex((block) => block.type === "heading" && /(day-?by-?day itinerary|day-?wise itinerary|tour itinerary)/i.test(blockText(block)));
  const firstDay = blocks.findIndex((block) => block.type === "heading" && /^day\s*[-:]?\s*\d/i.test(blockText(block)));
  const start = firstDay >= 0 ? firstDay : wrapper >= 0 ? wrapper + 1 : -1;
  if (start < 0) return { source: sourceName, days: [], rawText: "" };
  const end = blocks.findIndex((block, index) => index > start && block.type === "heading" && /(frequently asked|faqs?|related tour|inclusions?|exclusions?|highlights?)/i.test(blockText(block)));
  const rawItineraryBlocks = blocks.slice(start, end > start ? end : blocks.length);
  let skipAuxiliary = false;
  const itineraryBlocks = rawItineraryBlocks.filter((block) => {
    const text = block.type === "list"
      ? (block.items || []).filter((item) => typeof item === "string").join(" ")
      : `${blockText(block)} ${block.alt || ""}`;
    const isDayHeading = block.type === "heading" && /^day\s*[-:]?\s*\d/i.test(blockText(block));
    if (isDayHeading) {
      skipAuxiliary = false;
      return true;
    }
    if (block.type === "heading" && /places you[’']ll see/i.test(blockText(block))) {
      skipAuxiliary = true;
      return false;
    }
    if (SCRAPE_LEAK.test(text)) {
      skipAuxiliary = true;
      return false;
    }
    return !skipAuxiliary && block.type !== "image";
  });
  const days = [];
  let current = null;
  for (const block of itineraryBlocks) {
    const text = blockText(block);
    const dayMatch = block.type === "heading" ? text.match(/^day\s*[-:]?\s*(\d+)/i) : null;
    if (dayMatch) {
      current = { number: Number(dayMatch[1]), title: text, body: "" };
      days.push(current);
    } else if (current && (block.type === "paragraph" || block.type === "list")) {
      const extra = block.type === "list"
        ? (block.items || []).filter((item) => typeof item === "string").join(" ")
        : text;
      current.body += ` ${extra}`;
    }
  }
  return { source: sourceName, days, rawText: itineraryBlocks.map(blockText).join(" ") };
}

function itineraryFor(pkg) {
  const legacyDays = Array.isArray(v1[pkg.slug]?.itinerary)
    ? v1[pkg.slug].itinerary.filter((day) => String(day.description || "").trim().length >= 20)
    : [];
  if (legacyDays.length) {
    return {
      source: "v1",
      days: legacyDays.map((day, index) => ({
        number: index + 1,
        title: String(day.title || ""),
        body: String(day.description || ""),
      })),
      rawText: legacyDays.map((day) => `${day.title || ""} ${day.description || ""}`).join(" "),
    };
  }

  const newest = itineraryFromBlocks("v3", v3[pkg.slug]?.blocks);
  if (newest.days.length) return newest;
  return itineraryFromBlocks("v2", v2[pkg.slug]?.blocks);
}

function imageDimensions(buffer) {
  if (buffer.length < 24) return [0, 0];
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length - 9) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
        return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)];
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    const kind = buffer.toString("ascii", 12, 16);
    if (kind === "VP8X") return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
    if (kind === "VP8 ") return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
    if (kind === "VP8L") {
      const bits = buffer[21] | (buffer[22] << 8) | (buffer[23] << 16) | (buffer[24] << 24);
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
    }
  }
  return [0, 0];
}

function localImagePath(url) {
  if (!url) return null;
  let publicUrl = String(url);
  if (/^https?:\/\//i.test(publicUrl)) {
    try {
      const filename = decodeURIComponent(new URL(publicUrl).pathname.split("/").pop() || "");
      publicUrl = filename ? `/images/packages/${filename}` : "";
    } catch {
      return null;
    }
  }
  if (!publicUrl.startsWith("/images/")) return null;
  const absolute = path.resolve(root, "public", publicUrl.replace(/^\/+/, ""));
  return absolute.startsWith(path.resolve(root, "public")) ? { publicUrl, absolute } : null;
}

function inspectImage(url, pkg, usageCount) {
  const resolved = localImagePath(url);
  if (!resolved || !fs.existsSync(resolved.absolute)) return { url, status: "missing", issues: ["missing-file"] };
  const buffer = fs.readFileSync(resolved.absolute);
  const [width, height] = imageDimensions(buffer);
  const issues = [];
  if (buffer.length < 8_000) issues.push("tiny-file");
  if (!width || !height) issues.push("unknown-dimensions");
  if (width && width < 600) issues.push("low-resolution");
  if (width && height && (height / width > 2.5 || width / height > 3.5)) issues.push("extreme-aspect-ratio");
  if (GENERIC_IMAGES.test(resolved.publicUrl)) issues.push("generic-fallback");
  if (usageCount >= 8) issues.push("overused-image");

  const stem = path.basename(resolved.publicUrl).replace(/\.(jpe?g|png|webp|avif)$/i, "");
  const stemTokens = tokens(stem);
  const subjectTokens = new Set(tokens(`${pkg.slug} ${pkg.title} ${pkg.route} ${pkg.category}`));
  const filenameIsHash = /^[0-9a-f]{8,}$/i.test(stem);
  const packagePlaces = placeTokens(`${pkg.slug} ${pkg.title} ${pkg.route}`);
  const imagePlaces = placeTokens(stem);
  const sharedPlaces = [...packagePlaces].filter((place) => imagePlaces.has(place));
  const regionCompatible = [...imagePlaces].some((place) =>
    [...(REGION_MEMBERS[place] || [])].some((member) => packagePlaces.has(member)),
  ) || [...packagePlaces].some((place) =>
    [...(REGION_MEMBERS[place] || [])].some((member) => imagePlaces.has(member)),
  );
  const conflictingPlaces = imagePlaces.size > 0 && packagePlaces.size > 0 && sharedPlaces.length === 0 && !regionCompatible;
  const sharedSubject = stemTokens.some((token) => subjectTokens.has(token));
  if (conflictingPlaces) issues.push("destination-mismatch");
  else if (!filenameIsHash && !sharedSubject && !GENERIC_IMAGES.test(resolved.publicUrl)) issues.push("weak-semantic-match");
  if (filenameIsHash) issues.push("semantic-review-needed");

  return { url: resolved.publicUrl, status: issues.length ? "review" : "ok", bytes: buffer.length, width, height, issues };
}

const publicPackages = packages.filter((pkg) => {
  const days = expectedDays(pkg);
  return !NON_PACKAGE_SLUGS.has(pkg.slug) && (days === null || days >= 3);
});
const archivedShortPackages = packages.filter((pkg) => {
  const days = expectedDays(pkg);
  return days !== null && days < 3;
}).length;
const imageUsage = new Map();
for (const pkg of publicPackages) {
  for (const url of [pkg.image, pkg.image2].filter(Boolean)) imageUsage.set(url, (imageUsage.get(url) || 0) + 1);
}

const records = publicPackages.map((pkg) => {
  const expected = expectedDays(pkg);
  const itinerary = itineraryFor(pkg);
  const numbers = itinerary.days.map((day) => day.number);
  const expectedSequence = numbers.map((_, index) => index + 1);
  const sequenceMismatch = numbers.length > 0 && numbers.some((number, index) => number !== expectedSequence[index]);
  const emptyDays = itinerary.days.filter((day) => day.body.trim().length < 45).map((day) => day.number);
  const itineraryIssues = [];
  if (!itinerary.days.length) itineraryIssues.push("missing-itinerary");
  if (!itinerary.days.length && itinerary.rawText.trim().length >= 120) itineraryIssues.push("unstructured-itinerary-copy");
  if (expected && itinerary.days.length && expected !== itinerary.days.length) itineraryIssues.push("day-count-mismatch");
  if (sequenceMismatch) itineraryIssues.push("day-sequence-mismatch");
  if (emptyDays.length) itineraryIssues.push("empty-or-thin-days");
  if (SCRAPE_LEAK.test(itinerary.rawText)) itineraryIssues.push("scraped-content-leak");

  const packagePlaces = placeTokens(`${pkg.slug} ${pkg.title} ${pkg.route}`);
  const itineraryPlaces = placeTokens(itinerary.rawText);
  const sharedPlaces = [...packagePlaces].filter((place) => itineraryPlaces.has(place));
  const foreignPlaces = [...itineraryPlaces].filter((place) => !packagePlaces.has(place));
  const routeRegionCompatible = [...packagePlaces].some((place) =>
    [...(REGION_MEMBERS[place] || [])].some((member) => itineraryPlaces.has(member)),
  );
  if (itinerary.days.length && packagePlaces.size && itineraryPlaces.size >= 2 && !sharedPlaces.length && !routeRegionCompatible && foreignPlaces.length >= 2) {
    itineraryIssues.push("possible-destination-mismatch");
  }

  const primaryImage = inspectImage(pkg.image, pkg, imageUsage.get(pkg.image) || 0);
  const secondaryImage = pkg.image2 ? inspectImage(pkg.image2, pkg, imageUsage.get(pkg.image2) || 0) : null;
  const blockImages = selectedBlocks(pkg.slug).blocks.filter((block) => block.type === "image" && block.url);
  const unusableBlockImages = blockImages.filter((block) => inspectImage(block.url, pkg, 0).status === "missing").length;

  return {
    slug: pkg.slug,
    title: pkg.title,
    category: pkg.category,
    duration: pkg.duration,
    expectedDays: expected,
    primaryImage,
    secondaryImage,
    sourceBlockCount: blockImages.length,
    unusableSourceImages: unusableBlockImages,
    itinerary: {
      source: itinerary.source,
      dayCount: itinerary.days.length,
      emptyDays,
      issues: itineraryIssues,
    },
  };
});

const withImageIssue = records.filter((record) => record.primaryImage.issues.length || record.secondaryImage?.issues.length);
const missingImages = records.filter((record) => record.primaryImage.issues.includes("missing-file"));
const lowResolution = records.filter((record) => record.primaryImage.issues.includes("low-resolution"));
const destinationMismatch = records.filter((record) => record.primaryImage.issues.includes("destination-mismatch"));
const missingItinerary = records.filter((record) => record.itinerary.issues.includes("missing-itinerary"));
const unstructuredItinerary = records.filter((record) => record.itinerary.issues.includes("unstructured-itinerary-copy"));
const dayMismatch = records.filter((record) => record.itinerary.issues.includes("day-count-mismatch"));
const itineraryMismatch = records.filter((record) => record.itinerary.issues.includes("possible-destination-mismatch"));
const leakage = records.filter((record) => record.itinerary.issues.includes("scraped-content-leak"));

const summary = {
  generatedAt: new Date().toISOString(),
  catalogPackages: packages.length,
  publicPackages: publicPackages.length,
  archivedShortPackages,
  excludedNonPackageRecords: NON_PACKAGE_SLUGS.size,
  primaryImagesPresent: records.length - missingImages.length,
  primaryImagesMissing: missingImages.length,
  primaryImagesLowResolution: lowResolution.length,
  primaryImageDestinationMismatch: destinationMismatch.length,
  imageRecordsNeedingReview: withImageIssue.length,
  itinerariesPresent: records.length - missingItinerary.length,
  itinerariesMissing: missingItinerary.length,
  itineraryNarrativesWithoutDayStructure: unstructuredItinerary.length,
  itineraryDayCountMismatch: dayMismatch.length,
  itineraryPossibleDestinationMismatch: itineraryMismatch.length,
  itineraryScrapeLeaks: leakage.length,
};

const outputDir = path.join(root, "docs", "qa");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "package-integrity-audit.json"), JSON.stringify({ summary, records }, null, 2));

const table = (items, detail) => items.length
  ? items.slice(0, 50).map((item) => `| \`${item.slug}\` | ${detail(item).replace(/\|/g, "\\|")} |`).join("\n")
  : "| None | No issues found |";

const markdown = `# Package Content Integrity Audit

Generated: ${summary.generatedAt}

## Scope

- Catalog records: **${summary.catalogPackages}**
- Public packages audited: **${summary.publicPackages}**
- One- and two-day packages archived: **${summary.archivedShortPackages}**
- Non-package utility records excluded: **${summary.excludedNonPackageRecords}**

## Image Results

- Primary files present: **${summary.primaryImagesPresent}/${summary.publicPackages}**
- Missing primary files: **${summary.primaryImagesMissing}**
- Primary images below 600px width: **${summary.primaryImagesLowResolution}**
- High-confidence filename destination conflicts: **${summary.primaryImageDestinationMismatch}**
- Records needing visual/semantic review: **${summary.imageRecordsNeedingReview}**

## Itinerary Results


- Structured itineraries present: **${summary.itinerariesPresent}/${summary.publicPackages}**
- Missing structured itineraries: **${summary.itinerariesMissing}**
- Narrative itinerary copy without numbered days: **${summary.itineraryNarrativesWithoutDayStructure}**
- Duration/day-count mismatches: **${summary.itineraryDayCountMismatch}**
- Possible itinerary destination mismatches: **${summary.itineraryPossibleDestinationMismatch}**
- Scraped navigation/contact leakage: **${summary.itineraryScrapeLeaks}**

## Missing Itineraries

| Package | Finding |
|---|---|
${table(missingItinerary, (item) => `${item.duration || "Duration unavailable"}; detail source: ${item.itinerary.source}`)}

## Day-count Mismatches

| Package | Finding |
|---|---|
${table(dayMismatch, (item) => `Duration implies ${item.expectedDays} days; itinerary contains ${item.itinerary.dayCount}`)}

## Primary Image Destination Conflicts

| Package | Finding |
|---|---|
${table(destinationMismatch, (item) => `${item.primaryImage.url}; ${item.primaryImage.width}x${item.primaryImage.height}`)}

## Low-resolution Primary Images

| Package | Finding |
|---|---|
${table(lowResolution, (item) => `${item.primaryImage.url}; ${item.primaryImage.width}x${item.primaryImage.height}`)}

## Interpretation

File presence, dimensions, itinerary structure, day sequencing, and known scrape leakage are objective checks. Destination correctness is conservative: only explicit conflicting place names are marked as mismatches. Hash-named and generic images remain in the JSON report as manual-review candidates rather than being declared correct.
`;

fs.writeFileSync(path.join(root, "docs", "package-content-audit.md"), markdown);
console.log(JSON.stringify(summary, null, 2));
console.log("Wrote docs/package-content-audit.md and docs/qa/package-integrity-audit.json");
