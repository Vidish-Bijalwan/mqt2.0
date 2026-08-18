import puppeteer from 'puppeteer';
import fs from 'fs';

const [url, scrollY = '0', ...sels] = process.argv.slice(2);
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
await page.evaluate((y) => window.scrollTo(0, y), parseInt(scrollY, 10));
await new Promise((r) => setTimeout(r, 1200));

const out = await page.evaluate((sels) => {
  const res = {};
  for (const sel of sels) {
    const nodes = [...document.querySelectorAll(sel)];
    res[sel] = nodes.map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        y: Math.round(r.top + window.scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        fontWeight: cs.fontWeight,
        overflow: cs.overflow,
        whiteSpace: cs.whiteSpace,
        textOverflow: cs.textOverflow,
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
      };
    });
  }
  return res;
}, sels);
console.log(JSON.stringify(out, null, 1));
await browser.close();
