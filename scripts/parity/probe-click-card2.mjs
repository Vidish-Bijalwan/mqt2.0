import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.argv[2] || 'http://localhost:53143';
let systemChrome = null;
for (const c of [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]) { if (fs.existsSync(c)) { systemChrome = c; break; } }

const browser = await puppeteer.launch({
  headless: 'new',
  ...(systemChrome ? { executablePath: systemChrome } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,2400'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 2400 });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));
page.on('console', (msg) => { if (msg.type() === 'error') console.log('[console.error]', msg.text().slice(0, 200)); });

console.log('loading homepage...');
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 120000 });
await new Promise(r => setTimeout(r, 4000));

// Where is the first package card, and what's topmost at its center?
const probe = await page.evaluate(() => {
  const card = document.querySelector('.nit-pcard');
  if (!card) return { none: true };
  const r = card.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const el = document.elementFromPoint(cx, cy);
  const elInfo = el ? `${el.tagName}.${(el.className || '').toString().split(' ').slice(0, 3).join('.')}` : '(none)';
  const link = card.querySelector('a[href^="/packages/"]');
  return {
    cardRect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    center: { cx: Math.round(cx), cy: Math.round(cy) },
    topmost: elInfo,
    topmostIsLink: !!(el && el.closest && el.closest('a[href^="/packages/"]')),
    firstHref: link ? link.getAttribute('href') : '(no link)',
    scrollY: window.scrollY,
  };
});
console.log('card probe:', JSON.stringify(probe, null, 1));

if (probe.none) { await browser.close(); process.exit(1); }

// Real mouse click at the card center
const { cx, cy } = probe.center;
console.log(`clicking at (${cx}, ${cy})`);
await page.mouse.click(cx, cy, { button: 'left' });

// Poll URL for up to 120s
let url = '';
for (let i = 0; i < 12; i++) {
  await new Promise(r => setTimeout(r, 5000));
  url = page.url();
  console.log(`t+${(i + 1) * 5}s url=${url}`);
  if (url !== BASE + '/' && url !== BASE + '/#') break;
}
console.log('FINAL url:', url);
const title = await page.evaluate(() => document.title).catch(() => '(n/a)');
console.log('title:', title);
await browser.close();
