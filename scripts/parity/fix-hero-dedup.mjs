// Hero dedup fix — PLAN mode.
// Assigns every package in a duplicate-hero cluster a UNIQUE hero:
//   1. keep the shared hero for the first package in the cluster
//   2. real unused sibling photo from the record's location folder(s)
//   3. distinct crop of a real location photo (different file, different framing)
// Writes docs/qa/hero-dedup-plan.json consumed by the crop step + APPLY mode.
// Run: node --experimental-strip-types scripts/parity/fix-hero-dedup.mts plan
import fs from "node:fs";
import path from "node:path";

const root = "/home/hatch/workspace/batch3-herodup";
const mode = process.argv[2] || "plan";

const mediaMod = await import(path.join(root, "src/data/packageLocationMedia.ts"));
const { getApprovedPackageImage, packageLocationMedia, PACKAGE_MEDIA_PLACEHOLDER } = mediaMod;
const pkgMod = await import(path.join(root, "src/data/allPackages.ts"));
const { allPackages } = pkgMod;

const heroOf = (pkg) =>
  getApprovedPackageImage({ slug: pkg.slug, title: pkg.title, route: pkg.route, category: pkg.category });

// Primaries that resolve through PREFERRED_HERO_IMAGES must never be assigned
// as a new primary (they would remap to the preferred target).
const PREFERRED_KEYS = new Set([
  "/images/location-library/manali-himachal-pradesh-india/manali-himachal-pradesh-india-01-lg.webp",
]);

const groups = new Map();
for (const pkg of allPackages) {
  const h = heroOf(pkg);
  if (h === PACKAGE_MEDIA_PLACEHOLDER) continue;
  if (!groups.has(h)) groups.set(h, []);
  groups.get(h).push(pkg.slug);
}
const clusters = [...groups.entries()]
  .filter(([, v]) => v.length > 1)
  .sort((a, b) => a[0].localeCompare(b[0]));

const usedHeroes = new Set(groups.keys());

// caption lookup: src -> caption (first seen)
const captionOf = new Map();
for (const rec of Object.values(packageLocationMedia)) {
  for (const g of rec.gallery) if (!captionOf.has(g.src)) captionOf.set(g.src, g.caption);
}

const libRoot = path.join(root, "public/images/location-library");
const folderOf = (url) => (url.match(/^\/images\/location-library\/([^/]+)\//) || [])[1];
const fileOf = (url) => url.split("/").pop();

function foldersOfRecord(rec) {
  const primaryFolder = folderOf(rec.primary);
  const others = new Set();
  for (const g of rec.gallery) {
    const f = folderOf(g.src);
    if (f && f !== primaryFolder) others.add(f);
  }
  return [primaryFolder, ...[...others].sort()].filter(Boolean);
}

function filesIn(folder) {
  return fs
    .readdirSync(path.join(libRoot, folder))
    .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f) && !/-mobile\./i.test(f))
    .sort()
    .map((f) => `/images/location-library/${folder}/${f}`);
}

// All rects sit at y>=180 so the library's top-right corner watermark zone
// (y ~8-132) is NEVER partially cut: a crop either excludes the corner or,
// for sources without a watermark, is simply a bottom-band framing.
const RECT_1600x900 = [
  [160, 180], // center-bottom
  [320, 180], // right-bottom
  [0, 180], // left-bottom
];
const CROP_W = 1280, CROP_H = 720, MIN_W = 1200, MIN_H = 675;

const cropUsedBySource = new Map(); // sourceUrl -> count of crops taken

function planCrop(sourceUrl) {
  // dims via file read would need an image lib; sizes were verified 1600x900
  // for the library in the analysis step — re-check per file with a tiny
  // webp/jpg header parse.
  const dims = imageDims(path.join(root, "public", sourceUrl.replace(/^\//, "")));
  if (!dims) return null;
  const [sw, sh] = dims;
  const sx = sw / 1600, sy = sh / 900;
  const used = cropUsedBySource.get(sourceUrl) || 0;
  const idx = used % RECT_1600x900.length;
  const [rx, ry] = RECT_1600x900[idx];
  const x = Math.round(rx * sx), y = Math.round(ry * sy);
  const w = Math.round(CROP_W * sx), h = Math.round(CROP_H * sy);
  if (x + w > sw || y + h > sh || w < MIN_W || h < MIN_H) return null;
  return { x, y, w, h, n: used + 1 };
}

function imageDims(p) {
  try {
    const b = fs.readFileSync(p);
    if (b.length < 24) return null;
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
      return [b.readUInt32BE(16), b.readUInt32BE(20)];
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 1) {
        if (b[i] !== 0xff) { i++; continue; }
        const m2 = b[i + 1];
        if ((m2 >= 0xc0 && m2 <= 0xc3) || (m2 >= 0xc5 && m2 <= 0xc7) || (m2 >= 0xc9 && m2 <= 0xcb) || (m2 >= 0xcd && m2 <= 0xcf))
          return [b.readUInt16BE(i + 5), b.readUInt16BE(i + 7)];
        i += 2 + b.readUInt16BE(i + 2);
      }
      return null;
    }
    if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const c = b.toString("ascii", 12, 16);
      if (c === "VP8X") return [b.readUIntLE(24, 3), b.readUIntLE(27, 3)];
      if (c === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
      if (c === "VP8L") {
        const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
        return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
      }
    }
    return null;
  } catch { return null; }
}

function placeNameFor(folder) {
  // derive a display place from an existing caption in that folder
  for (const [src, cap] of captionOf) {
    if (folderOf(src) === folder) return cap.split(" — ")[0] || folder;
  }
  return folder.replace(/-india$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function cropFileName(sourceUrl, n) {
  const folder = folderOf(sourceUrl);
  const file = fileOf(sourceUrl);
  const ext = path.extname(file);
  const stem = file.slice(0, -ext.length).replace(/-lg$/, "");
  return { folder, file: `${stem}-crop${n}-lg${ext}` };
}

if (mode === "plan") {
  const plan = [];
  const stats = { real: 0, crop: 0, aiNeeded: 0 };
  for (const [hero, slugs] of clusters) {
    for (const slug of slugs.slice(1)) {
      const rec = packageLocationMedia[slug];
      const folders = foldersOfRecord(rec);
      let assigned = null;
      // 1) real unused sibling
      outer: for (const folder of folders) {
        for (const url of filesIn(folder)) {
          if (!usedHeroes.has(url) && !PREFERRED_KEYS.has(url)) {
            assigned = { kind: "real", newHero: url, source: url, rect: null };
            break outer;
          }
        }
      }
      // 2) distinct crop of a real location photo
      if (!assigned) {
        const sources = folders.flatMap(filesIn);
        // round-robin: least-cropped source first
        sources.sort((a, b) => (cropUsedBySource.get(a) || 0) - (cropUsedBySource.get(b) || 0));
        for (const srcUrl of sources) {
          if ((cropUsedBySource.get(srcUrl) || 0) >= RECT_1600x900.length) continue;
          const rect = planCrop(srcUrl);
          if (!rect) continue;
          const { folder, file } = cropFileName(srcUrl, rect.n);
          const newHero = `/images/location-library/${folder}/${file}`;
          if (usedHeroes.has(newHero)) continue;
          cropUsedBySource.set(srcUrl, rect.n);
          const caption = captionOf.get(srcUrl) || `${placeNameFor(folder)} — travel photograph`;
          assigned = { kind: "crop", newHero, source: srcUrl, rect, caption };
          break;
        }
      }
      if (!assigned) {
        stats.aiNeeded++;
        plan.push({ slug, oldHero: hero, newHero: null, kind: "ai-needed", source: null, rect: null, caption: null });
        continue;
      }
      stats[assigned.kind]++;
      usedHeroes.add(assigned.newHero);
      const caption = assigned.kind === "real"
        ? captionOf.get(assigned.newHero) || `${placeNameFor(folderOf(assigned.newHero))} — travel photograph`
        : assigned.caption;
      plan.push({ slug, oldHero: hero, newHero: assigned.newHero, kind: assigned.kind, source: assigned.source, rect: assigned.rect, caption });
    }
  }
  const planPath = path.join(root, "docs/qa/hero-dedup-plan.json");
  fs.mkdirSync(path.dirname(planPath), { recursive: true });
  fs.writeFileSync(planPath, JSON.stringify({ generatedAt: new Date().toISOString(), stats, plan }, null, 2));
  console.log(JSON.stringify({ clusters: clusters.length, planned: plan.length, stats }, null, 2));
  const ai = plan.filter((p) => p.kind === "ai-needed");
  if (ai.length) console.log("AI-NEEDED slugs:", ai.map((p) => p.slug).join(", "));
}

if (mode === "apply") {
  const planPath = path.join(root, "docs/qa/hero-dedup-plan.json");
  const { plan } = JSON.parse(fs.readFileSync(planPath, "utf8"));
  const missing = plan.filter((p) => p.newHero && !fs.existsSync(path.join(root, "public", p.newHero.replace(/^\//, ""))));
  if (missing.length) {
    console.error("MISSING FILES:", missing.map((p) => p.newHero).join("\n"));
    process.exit(1);
  }
  const aiNeeded = plan.filter((p) => !p.newHero);
  if (aiNeeded.length) {
    console.error("AI-NEEDED entries have no hero; refusing to apply:", aiNeeded.map((p) => p.slug).join(", "));
    process.exit(1);
  }

  const file = path.join(root, "src/data/packageLocationMedia.ts");
  const src = fs.readFileSync(file, "utf8");
  const startMark = "export const packageLocationMedia: Record<string, PackageLocationMedia> = ";
  const si = src.indexOf(startMark) + startMark.length;
  const ei = src.indexOf("\n};\n\n/**\n * A deliberately neutral", si);
  if (si < startMark.length || ei < 0) throw new Error("could not locate object literal bounds");
  const literal = src.slice(si, ei + 2);
  const obj = JSON.parse(literal);
  const before = JSON.stringify(obj, null, 2);
  if (before !== literal) throw new Error("literal is not stable under re-serialization; aborting");

  let touched = 0;
  for (const p of plan) {
    const rec = obj[p.slug];
    if (!rec) throw new Error(`record missing for ${p.slug}`);
    if (rec.primary === p.newHero) continue; // idempotent
    rec.primary = p.newHero;
    rec.gallery = [{ src: p.newHero, caption: p.caption }, ...rec.gallery.filter((g) => g.src !== p.newHero)];
    touched++;
  }
  const reser = JSON.stringify(obj, null, 2);
  fs.writeFileSync(file, src.slice(0, si) + reser + src.slice(ei + 2), "utf8");
  console.log(JSON.stringify({ applied: plan.length, touched }, null, 2));
}
