// Parity capture tool: screenshot + computed-style dump for a URL.
// Usage: node scripts/parity/capture.mjs <url> <outPrefix> [viewportW] [viewportH] [scrollY]
//   - Screenshots viewport-sized PNG at scrollY (after fonts/images settle)
//   - Writes <outPrefix>.styles.json with computed styles of key selectors
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const [url, outPrefix, vw = '1440', vh = '900', scrollY = '0', selFile] = process.argv.slice(2);
const viewport = { width: parseInt(vw, 10), height: parseInt(vh, 10) };

const SELECTORS = selFile
  ? JSON.parse(fs.readFileSync(selFile, 'utf8'))
  : [
  // Header / nav
  'header', '.header', '#header', '.site-header', 'nav', '.navbar', '.main-nav',
  '.top-bar', '.topbar', '#topbar',
  // Hero
  '.hero', '#hero', '.slider', '.banner', '.rev_slider', '#rev_slider_1_1',
  // Section scaffolding
  'main', '.container', '.content-area', '#content',
  // Headings
  'h1', 'h2', 'h3', 'h4',
  // Package cards
  '.package-card', '.tour-card', '.tour-box', '.packages-list', '.tour-list',
  '.product', '.card', '.box-tour', '.tour-item', '.tour-package',
  // Buttons / CTA
  'a.btn', '.btn', 'button', '.view-all', '.read-more',
  // Footer
  'footer', '.footer', '#footer', '.site-footer',
  // Forms
  'form', '.quick-enquiry', '.enquiry-form',
  // Theme tiles
  '.theme-box', '.theme-tile', '.theme-card',
];

const styleProps = [
  'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'line-height',
  'letter-spacing', 'text-align', 'text-transform', 'padding-top', 'padding-right',
  'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom',
  'margin-left', 'gap', 'border-top-width', 'border-right-width', 'border-bottom-width',
  'border-left-width', 'border-top-color', 'border-right-color', 'border-bottom-color',
  'border-left-color', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-left-radius', 'border-bottom-right-radius', 'width', 'height',
  'max-width', 'min-height', 'display', 'position', 'z-index', 'background-image',
  'background', 'box-shadow', 'opacity', 'flex-direction', 'flex-wrap', 'align-items',
  'justify-content', 'object-fit', 'object-position', 'aspect-ratio', 'overflow',
  'text-decoration-line', 'text-decoration-color', 'stroke', 'fill', 'vertical-align',
];

function clean(v) {
  if (v == null) return null;
  const s = String(v);
  if (s === 'none' || s === 'normal' || s === '0px') return s;
  return s;
}

async function run() {
  const candidates =
    process.platform === 'win32'
      ? [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        ]
      : ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const systemChrome = process.env.CHROME_PATH || candidates.find((p) => fs.existsSync(p));
  const browser = await puppeteer.launch({
    headless: 'new',
    ignoreHTTPSErrors: true,
    ...(systemChrome ? { executablePath: systemChrome } : {}),
    args: [
      '--force-device-scale-factor=1',
      '--hide-scrollbars',
      '--disable-lazy-loading',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  // Block chat/cookie third-party noise on the reference site
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    if (/zopim|zendesk|facebook\.net|google-analytics|googletagmanager|hotjar|clarity|doubleclick|cookiebot|onetrust|chatwidget|intercom/i.test(u)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  async function evalRetry(fn, arg, tries = 5) {
    for (let i = 0; i < tries; i++) {
      try {
        return await page.evaluate(fn, arg);
      } catch (e) {
        if (i === tries - 1) throw e;
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 3500)); // let client-side nav / dev overlay settle
  await evalRetry(async () => {
    await document.fonts.ready;
    if ('requestIdleCallback' in window) await new Promise((r) => requestIdleCallback(r));
  });

  // Scroll into position (in steps so lazy images load)
  const target = parseInt(scrollY, 10);
  await evalRetry(async (y) => {
    const step = Math.max(200, Math.floor(y / 8));
    for (let cur = 0; cur < y; cur += step) {
      window.scrollTo(0, Math.min(cur + step, y));
      await new Promise((r) => setTimeout(r, 120));
    }
  }, target);
  await new Promise((r) => setTimeout(r, 1200));

  // Screenshot
  const pngPath = `${outPrefix}.png`;
  await page.screenshot({ path: pngPath });

  // Computed styles
  const styles = await evalRetry(([selList, props]) => {
    const out = {};
    for (const sel of selList) {
      const nodes = document.querySelectorAll(sel);
      if (nodes.length === 0) continue;
      const el = nodes[0];
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      out[sel] = {
        count: nodes.length,
        rect: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
        props: Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])),
      };
    }
    return out;
  }, [SELECTORS, styleProps]);

  fs.writeFileSync(`${outPrefix}.styles.json`, JSON.stringify(styles, null, 1));

  // Page-level info
  const pageInfo = await evalRetry(() => {
    const all = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6,section,div[class*="card"],div[class*="package"],div[class*="tour"],div[class*="dest"],div[class*="theme"]')];
    const blocks = all
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          cls: (el.className && String(el.className).slice(0, 90)) || '',
          y: Math.round(r.top + window.scrollY),
          h: Math.round(r.height),
          w: Math.round(r.width),
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
        };
      })
      .filter((b) => b.w > 0 && b.h > 0);
    return {
      scrollY: window.scrollY,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      blocks,
    };
  });
  fs.writeFileSync(`${outPrefix}.blocks.json`, JSON.stringify(pageInfo, null, 1));

  console.log(`captured ${pngPath} (+styles, blocks) at ${viewport.width}x${viewport.height}, scrollY=${target}`);
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
