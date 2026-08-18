// Generate per-package Open Graph images: package photo + title overlay.
// Uses sharp to composite text onto the package image at 1200x630 (OG standard).
//
// Run: node scripts/parity/generate-og-images.mjs [--slug=<slug>] [--force]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OG_DIR = path.join(ROOT, "public/images/og");
const ALL_PATH = path.join(ROOT, "src/data/allPackages.ts");
const PUB_IMG = path.join(ROOT, "public/images/packages");

// Ensure OG directory exists
if (!fs.existsSync(OG_DIR)) fs.mkdirSync(OG_DIR, { recursive: true });

// Read allPackages
const allSrc = fs.readFileSync(ALL_PATH, "utf8");
const allM = allSrc.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
const allPkgs = JSON.parse(allM[1]);

// Simple SVG text overlay — no external font needed
function titleOverlay(title, subtitle) {
  // Wrap title at ~30 chars
  const words = title.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).length > 30 && line) {
      lines.push(line);
      line = w;
    } else {
      line = line ? line + " " + w : w;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 42;
  const titleY = 630 - 40 - lines.length * lineHeight - (subtitle ? 30 : 0);

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="40%" stop-color="rgba(0,0,0,0.1)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.85)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#overlay)"/>
  <text x="40" y="${titleY}" font-family="Arial,sans-serif" font-size="38" font-weight="bold" fill="white">
    ${lines.map((l, i) => `<tspan x="40" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(l)}</tspan>`).join("")}
  </text>
  ${subtitle ? `<text x="40" y="${630 - 30}" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.85)">My Quick Trippers · ${escapeXml(subtitle)}</text>` : `<text x="40" y="${630 - 30}" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.85)">My Quick Trippers · myquicktrippers.com</text>`}
  <rect x="40" y="${titleY - 15}" width="60" height="4" rx="2" fill="#FF6B35"/>
</svg>`;
  return Buffer.from(svg);
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

async function main() {
  const force = process.argv.includes("--force");
  const onlySlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = onlySlug ? [onlySlug] : allPkgs.map((p) => p.slug);

  let generated = 0;
  let skipped = 0;

  for (const slug of slugs) {
    const pkg = allPkgs.find((p) => p.slug === slug);
    if (!pkg) continue;

    const ogPath = path.join(OG_DIR, `${slug}.webp`);
    if (!force && fs.existsSync(ogPath)) {
      skipped++;
      continue;
    }

    // Find the source image
    const imgName = path.basename(pkg.image);
    const srcPath = path.join(PUB_IMG, imgName);
    if (!fs.existsSync(srcPath)) {
      console.log(`⚠️  ${slug}: source image missing (${imgName})`);
      continue;
    }

    try {
      // Resize source to 1200x630 cover
      const bg = await sharp(srcPath)
        .resize(1200, 630, { fit: "cover", position: "center" })
        .toBuffer();

      // Create overlay
      const overlaySvg = titleOverlay(pkg.title, pkg.category || "");
      const overlayBuf = await sharp(Buffer.from(overlaySvg))
        .resize(1200, 630)
        .toBuffer();

      // Composite
      const result = await sharp(bg)
        .composite([{ input: overlayBuf, top: 0, left: 0 }])
        .webp({ quality: 85 })
        .toBuffer();

      fs.writeFileSync(ogPath, result);
      generated++;
      if (generated % 50 === 0) console.log(`  ... ${generated} generated`);
    } catch (e) {
      console.log(`⚠️  ${slug}: ${e.message}`);
    }
  }

  console.log(`\n── OG image result ──`);
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (exists): ${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
