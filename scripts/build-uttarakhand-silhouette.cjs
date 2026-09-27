/*
 * Produces a web mask from the official Survey of India Uttarakhand map.
 * The source raster is retained unchanged in tmp/; this script only extracts
 * the state envelope from its published outer boundary for the web visual.
 */
const sharp = require("sharp");

const source = "tmp/uttarakhand-soi-2026-1.png";
const output = "public/images/maps/uttarakhand-silhouette-mask.png";

async function build() {
  const image = sharp(source).extract({ left: 650, top: 210, width: 3270, height: 3600 }).resize({ width: 1400 });
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const boundary = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    // Published state outline is warm orange. The strict threshold avoids
    // treating district and road lines as an administrative outer boundary.
    boundary[y * width + x] = r > 125 && g > 45 && g < 190 && b < 125 && r > g * 1.22 && r > b * 1.75 ? 1 : 0;
  }
  const sealed = new Uint8Array(boundary);
  for (let pass = 0; pass < 3; pass += 1) {
    const copy = new Uint8Array(sealed);
    for (let y = 2; y < height - 2; y += 1) for (let x = 2; x < width - 2; x += 1) {
      const p = y * width + x;
      if (sealed[p]) continue;
      for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) if (sealed[(y + dy) * width + x + dx]) copy[p] = 1;
    }
    sealed.set(copy);
  }
  const outside = new Uint8Array(width * height);
  const queue = [];
  const push = (x, y) => { const p = y * width + x; if (!outside[p] && !sealed[p]) { outside[p] = 1; queue.push(p); } };
  for (let x = 0; x < width; x += 1) { push(x, 0); push(x, height - 1); }
  for (let y = 0; y < height; y += 1) { push(0, y); push(width - 1, y); }
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const p = queue[cursor], x = p % width, y = Math.floor(p / width);
    if (x) push(x - 1, y); if (x + 1 < width) push(x + 1, y); if (y) push(x, y - 1); if (y + 1 < height) push(x, y + 1);
  }
  // Keep only the component containing the published state interior. This
  // discards isolated map insets and orange road symbols outside Uttarakhand.
  const interior = new Uint8Array(width * height);
  const interiorQueue = [];
  const seedX = 690, seedY = 760;
  const seed = seedY * width + seedX;
  if (!sealed[seed]) { interior[seed] = 1; interiorQueue.push(seed); }
  for (let cursor = 0; cursor < interiorQueue.length; cursor += 1) {
    const p = interiorQueue[cursor], x = p % width, y = Math.floor(p / width);
    const add = (next) => { if (!interior[next] && !sealed[next] && !outside[next]) { interior[next] = 1; interiorQueue.push(next); } };
    if (x) add(p - 1); if (x + 1 < width) add(p + 1); if (y) add(p - width); if (y + 1 < height) add(p + width);
  }
  const mask = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p += 1) {
    const inside = interior[p] || sealed[p] && !outside[p] ? 255 : 0;
    mask[p * 4] = 255; mask[p * 4 + 1] = 255; mask[p * 4 + 2] = 255; mask[p * 4 + 3] = inside;
  }
  await sharp(mask, { raw: { width, height, channels: 4 } }).png().toFile(output);
  console.log(`${output}: ${width}×${height}`);
}

build().catch((error) => { console.error(error); process.exit(1); });
