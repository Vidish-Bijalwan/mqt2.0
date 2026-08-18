// Compare two PNGs region by region, printing a cell grid with color deltas.
// Usage: node scripts/parity/diff.mjs <pngA> <pngB> <x> <y> <w> <h> [cols=18] [rows=auto]
import sharp from 'sharp';

const [a, b, x, y, w, h, cols = '18', rows = '0'] = process.argv.slice(2);
const X = Number(x), Y = Number(y), W = Number(w), H = Number(h);
const C = parseInt(cols, 10);
const R = parseInt(rows, 10) || Math.max(1, Math.round((H / W) * C * 0.5));

const { data: da, info: ia } = await sharp(a).extract({ left: X, top: Y, width: W, height: H }).resize(C, R, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
const { data: db, info: ib } = await sharp(b).extract({ left: X, top: Y, width: W, height: H }).resize(C, R, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
const ch = ia.channels;

let totalDelta = 0;
let maxDelta = 0;
for (let r = 0; r < R; r++) {
  let line = '';
  for (let c = 0; c < C; c++) {
    const i = (r * C + c) * ch;
    const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
    totalDelta += d;
    maxDelta = Math.max(maxDelta, d);
    line += d === 0 ? '.' : d < 12 ? '+' : d < 40 ? 'o' : d < 90 ? 'O' : '#';
  }
  console.log(line);
}
const cells = C * R;
console.log(`avg delta=${(totalDelta / cells).toFixed(1)} max=${maxDelta} per-channel (0-255)`);
