import puppeteer from 'puppeteer';
import fs from 'fs';

const [url, sel] = process.argv.slice(2);
const candidates =
  process.platform === 'win32'
    ? ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe']
    : ['/usr/bin/google-chrome', '/usr/bin/chromium'];
const executablePath = process.env.CHROME_PATH || candidates.find((p) => fs.existsSync(p));

const browser = await puppeteer.launch({
  headless: 'new', ignoreHTTPSErrors: true, executablePath,
  args: ['--force-device-scale-factor=1', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(async () => { await document.fonts.ready; });

// Scroll the target into view, then hover
const result = await page.evaluate(async (sel) => {
  const el = document.querySelector(sel);
  if (!el) return { error: 'not found' };
  el.scrollIntoView({ block: 'center' });
  await new Promise((r) => setTimeout(r, 500));
  const r = el.getBoundingClientRect();
  // move mouse to center via CDP-less approach: dispatch hover
  return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
}, sel);
if (result.error) { console.log(JSON.stringify(result)); await browser.close(); process.exit(0); }

await page.mouse.move(result.x, result.y);
await new Promise((r) => setTimeout(r, 600));
const styles = await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    bg: cs.backgroundColor,
    color: cs.color,
    borderColor: cs.borderColor,
    opacity: cs.opacity,
    transform: cs.transform,
    filter: cs.filter,
    bgImage: cs.backgroundImage.slice(0, 80),
  };
}, sel);
console.log(JSON.stringify({ sel, hovered: styles }, null, 1));
await browser.close();
