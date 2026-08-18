// Pixel sampling from a PNG.
// Usage:
//   node scripts/parity/sample.mjs <png> grid <x> <y> <w> <h> [cols=16] [rows=auto]
//     prints a coarse grid of hex colors
//   node scripts/parity/sample.mjs <png> point <x> <y>
//     prints the exact pixel color (and a 3x3 neighborhood)
import sharp from 'sharp';

const [png, mode, ...rest] = process.argv.slice(2);
const img = sharp(png);
const meta = await img.metadata();
const { width, height } = meta;

if (mode === 'point') {
  const [x, y] = rest.map(Number);
  const { data: buf, info } = await sharp(png).extract({ left: Math.max(0, x - 1), top: Math.max(0, y - 1), width: 3, height: 3 }).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let r = 0; r < 3; r++) {
    let line = '';
    for (let c = 0; c < 3; c++) {
      const i = (r * 3 + c) * ch;
      const hex = [buf[i], buf[i + 1], buf[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
      line += (r === 1 && c === 1 ? `[#${hex}]` : ` #${hex} `);
    }
    console.log(line);
  }
} else if (mode === 'grid') {
  const [x, y, w, h, cols = '16', rows = '0'] = rest;
  const X = Number(x), Y = Number(y), W = Number(w), H = Number(h);
  const C = parseInt(cols, 10);
  const R = parseInt(rows, 10) || Math.max(1, Math.round((H / W) * C * 0.5));
  const { data: buf, info } = await sharp(png)
    .extract({ left: X, top: Y, width: W, height: H })
    .resize(C, R, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let r = 0; r < R; r++) {
    let line = '';
    for (let c = 0; c < C; c++) {
      const i = (r * C + c) * ch;
      const hex = [buf[i], buf[i + 1], buf[i + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
      line += hex + ' ';
    }
    console.log(line);
  }
}
