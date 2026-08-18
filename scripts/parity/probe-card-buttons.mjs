import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.argv[2] || 'http://localhost:53144';
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
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 200)));

console.log('loading homepage...');
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 120000 });
await new Promise(r => setTimeout(r, 3000));

// Find the first card's "Quick enquiry" button; check what's on top of it.
const btn = await page.evaluate(() => {
  const a = document.querySelector('.nit-pcard .nit-prcEnq a:first-child');
  if (!a) return null;
  const r = a.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  return {
    href: a.getAttribute('href'),
    topmost: top ? `${top.tagName}.${(top.className || '').toString().split(' ').slice(0, 2).join('.')}` : '(none)',
    topIsTheButton: top === a,
    cx: Math.round(cx), cy: Math.round(cy),
  };
});
console.log('quick enquiry button:', JSON.stringify(btn));

if (btn && btn.topIsTheButton) {
  await page.mouse.click(btn.cx, btn.cy);
  await new Promise(r => setTimeout(r, 15000));
  console.log('final url:', page.url());
} else {
  console.log('button is NOT topmost — stretched link may swallow it');
}
await browser.close();
