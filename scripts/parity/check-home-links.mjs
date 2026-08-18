// Check every package card link the homepage renders, against the dev server.
// Uses fetch with long timeouts (dev server is slow on OneDrive).
import fs from 'fs';
import path from 'path';

const src = fs.readFileSync('src/data/allPackages.ts', 'utf8');

const entries = [];
const re = /\{\s*"slug":\s*"([^"]+)"[\s\S]*?"image":\s*"([^"]*)"[\s\S]*?"category":\s*"([^"]*)"/g;
let m;
while ((m = re.exec(src))) entries.push({ slug: m[1], image: m[2], category: m[3] });

const valid = entries.filter((p) => {
  if (!p.image || p.image.trim() === '') return false;
  const filename = path.basename(p.image);
  const diskPath = path.join(process.cwd(), 'public', 'images', 'packages', filename);
  try { return fs.existsSync(diskPath); } catch { return false; }
});
console.log('parsed:', entries.length, 'valid:', valid.length);

const trending = valid.slice(0, 30).map(p => p.slug);
const cats = ['Pilgrimage', 'North India', 'South India', 'International', 'West India', 'Helicopter'];
const byCat = {};
for (const c of cats) byCat[c] = valid.filter(p => p.category === c).slice(0, 10).map(p => p.slug);
const curated = ['bali-sightseeing-tour', 'dubai-honeymoon-tour', '7-days-nepal-tour-packages', 'sri-lanka-group-tour-packages'];

const all = [...new Set([...trending, ...cats.flatMap(c => byCat[c]), ...curated])];
console.log('unique homepage package slugs:', all.length);

const base = process.argv[2] || 'http://localhost:53143';
let bad = 0;
for (const slug of all) {
  let code = 'ERR';
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 30000);
    const res = await fetch(`${base}/packages/${slug}`, { signal: ctrl.signal, redirect: 'manual' });
    clearTimeout(t);
    code = String(res.status);
  } catch { code = 'ERR'; }
  if (code !== '200') { bad++; console.log(`  BAD ${code}  /packages/${slug}`); }
  else process.stdout.write('.');
}
console.log('');
console.log(bad === 0 ? `ALL ${all.length} homepage package links OK` : `${bad}/${all.length} homepage package links BROKEN`);
