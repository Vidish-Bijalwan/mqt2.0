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
  const walk = (el, depth, acc) => {
    if (acc.length > 60) return;
    for (const child of el.children) {
      const r = child.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(child);
      const text = (child.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 45);
      const style = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none'
        ? `${cs.backgroundColor}${cs.backgroundImage !== 'none' ? ' IMG' : ''}`
        : '';
      acc.push({
        d: depth,
        tag: child.tagName,
        cls: (child.className || '').toString().slice(0, 45),
        y: Math.round(r.top - fr.top),
        h: Math.round(r.height),
        w: Math.round(r.width),
        bg: style,
        color: cs.color,
        fontSize: cs.fontSize,
        text,
      });
      walk(child, depth + 1, acc);
    }
  };
  const acc = [];
  walk(footer, 0, acc);
  return acc;
});
for (const it of info) {
  console.log(`${'  '.repeat(it.d)}${it.tag}.${it.cls} y=${it.y} h=${it.h} w=${it.w} bg=[${it.bg}] c=${it.color} fs=${it.fontSize} "${it.text}"`);
}
await browser.close();
