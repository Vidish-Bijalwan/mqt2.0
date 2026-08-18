import puppeteer from 'puppeteer';
import fs from 'fs';

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
await page.goto('https://www.namasteindiatrip.com/', { waitUntil: 'domcontentloaded', timeout: 90000 });
await new Promise((r) => setTimeout(r, 3000));
await page.evaluate(async () => { await document.fonts.ready; });

const info = await page.evaluate(() => {
  const footer = document.querySelector('footer');
  const fr = footer.getBoundingClientRect();
  const kids = [...footer.children].map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      cls: (el.className || '').toString().slice(0, 60),
      y: Math.round(r.top + scrollY - fr.top),
      h: Math.round(r.height),
      bg: cs.backgroundColor,
      bgImage: cs.backgroundImage.slice(0, 100),
    };
  });
  return {
    footerY: Math.round(fr.top + scrollY),
    footerH: Math.round(fr.height),
    children: kids.slice(0, 14),
  };
});

// scroll to footer and screenshot
await page.evaluate((y) => window.scrollTo(0, y), info.footerY - 100);
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: '.freebuff/parity/ref-footer-live.png' });

console.log(JSON.stringify(info, null, 1));
await browser.close();
