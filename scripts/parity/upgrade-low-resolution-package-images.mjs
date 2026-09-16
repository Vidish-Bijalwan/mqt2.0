// Replace a low-resolution package primary only when the repository already
// contains an exact, high-resolution `hi-<package-slug>` asset. This is
// deliberately stricter than a token or category match: it improves clarity
// without inventing a location identity for a package.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const packageFile = path.join(process.cwd(), "src", "data", "allPackages.ts");
const imageRoot = path.join(process.cwd(), "public");
const reportFile = path.join(process.cwd(), "docs", "qa", "exact-hi-image-upgrades.json");
const source = fs.readFileSync(packageFile, "utf8");
const match = source.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) throw new Error("Could not locate allPackages array");

const packages = JSON.parse(match[1]);

async function widthFor(publicPath) {
  if (!publicPath?.startsWith("/")) return 0;
  try {
    const metadata = await sharp(path.join(imageRoot, publicPath)).metadata();
    return metadata.width || 0;
  } catch {
    return 0;
  }
}

const changes = [];
for (const pkg of packages) {
  const currentWidth = await widthFor(pkg.image);
  if (currentWidth >= 600 || currentWidth === 0) continue;

  const candidates = ["webp", "jpg", "jpeg", "png"].map((extension) =>
    `/images/packages/hi-${pkg.slug}.${extension}`,
  );
  for (const candidate of candidates) {
    const candidateWidth = await widthFor(candidate);
    if (candidateWidth < 600) continue;
    changes.push({ slug: pkg.slug, oldImage: pkg.image, oldWidth: currentWidth, image: candidate, width: candidateWidth });
    pkg.image = candidate;
    break;
  }
}

if (changes.length > 0) {
  const nextBody = JSON.stringify(packages, null, 2).replace(/\n/g, "\r\n");
  fs.writeFileSync(packageFile, source.replace(match[1], nextBody), "utf8");
}

fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify({ changed: changes.length, changes }, null, 2)}\n`);
console.log(JSON.stringify({ changed: changes.length, report: reportFile }, null, 2));
