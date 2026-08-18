// Render a PNG as luminance ASCII art + distinct-color hex palette.
// Usage: node scripts/parity/ascii.mjs <png> [cols=160] [yStart=0] [yEnd=full] [bandCount=4]
import sharp from 'sharp';

const [png, cols = '160', yStart = '0', yEnd = '', bands = '4'] = process.argv.slice(2);
const COLS = parseInt(cols, 10);
const BANDS = parseInt(bands, 10);

const img = sharp(png);
const meta = await img.metadata();
const { width, height } = meta;

let y0 = parseInt(yStart, 10);
let y1 = yEnd ? parseInt(yEnd, 10) : height;
y0 = Math.max(0, Math.min(y0, height));
y1 = Math.max(y0, Math.min(y1, height));
const cropH = y1 - y0;
const ROWS = Math.max(1, Math.round((cropH / width) * COLS * 0.5));
const small = await sharp(png)
  .extract({ left: 0, top: y0, width, height: cropH })
  .resize(COLS, ROWS, { fit: 'fill' })
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = small;
const RAMP = ' .:-=+*#%@';
const N = info.channels;
const px = (r, c) => r * COLS + c;
const lum = (i) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

console.log(`# ${png} ${width}x${height} — y ${y0}..${y1} at ${COLS}x${ROWS}\n`);
for (let row = 0; row < ROWS; row++) {
  let line = '';
  for (let col = 0; col < COLS; col++) {
    const v = lum(px(row, col) * N);
    const idx = Math.min(9, Math.floor((v / 255) * 10));
    line += RAMP[idx];
  }
  console.log(line);
}

// Color palette per vertical band
console.log('');
const rowsPerBand = Math.max(1, Math.floor(ROWS / BANDS));
for (let b = 0; b < BANDS; b++) {
  const bStart = b * rowsPerBand;
  const bEnd = b === BANDS - 1 ? ROWS : bStart + rowsPerBand;
  const counts = new Map();
  for (let row = bStart; row < bEnd; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = px(row, col) * N;
      const key = `${data[i].toString(16).padStart(2, '0')}${data[i + 1].toString(16).padStart(2, '0')}${data[i + 2].toString(16).padStart(2, '0')}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const sorted = [...counts.entries()].sort((a, b2) => b2[1] - a[1]).slice(0, 12);
  const scaleY = cropH / ROWS;
  const rowY0 = y0 + Math.round(bStart * scaleY);
  const rowY1 = y0 + Math.round(bEnd * scaleY);
  console.log(`y ${rowY0}..${rowY1}: ` + sorted.map(([c, n]) => `#${c}(${n})`).join(' '));
}
