// Load the LOCAL homepage in a real browser, find the package cards,
// click one, and report whether the package page actually opens.
import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.argv[2] || 'http://localhost:53143';
let systemChrome = null;
for (const c of [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
]) {
  if (fs.existsSync(c)) { systemChrome = c; break; }
}
console.log('chrome:', systemChrome);

const browser = await puppeteer.launch({
  headless: 'new',
  ...(systemChrome ? { executablePath: systemChrome } : {}),
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,2400'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 2400 });
page.on('console', (msg) => { if (msg.type() === 'error') console.log('[console.error]', msg.text().slice(0, 200)); });
page.on('pageerror', (e) => console.log('[pageerror]', String(e).slice(0, 300)));

console.log('loading homepage...');
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 120000 });
await new Promise(r => setTimeout(r, 3000));

// Collect package card links (nit-pcard hrefs)
const links = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('.nit-pcard a[href^="/packages/"]').forEach(a => {
    out.push({ href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 60) });
  });
  return out;
});
console.log('package card links on homepage:', links.length);
const uniq = [];
const seen = new Set();
for (const l of links) if (!seen.has(l.href)) { seen.add(l.href); uniq.push(l); }
console.log('unique:', uniq.length);
for (const l of uniq.slice(0, 12)) console.log('  ', l.href, '|', l.text);

if (uniq.length === 0) {
  console.log('NO PACKAGE LINKS FOUND — dumping sections:');
  const titles = await page.evaluate(() => [...document.querySelectorAll('h2, h3')].map(h => h.textContent.trim()).slice(0, 30));
  console.log(titles);
  await browser.close();
  process.exit(1);
}

// Click the FIRST card's image link
const first = uniq[0];
console.log('clicking:', first.href);
try {
  await page.click(`a[href="${first.href}"]`, { timeout: 15000 });
} catch (e) {
  console.log('click failed:', String(e).slice(0, 200));
}
console.log('waiting for navigation...');
await new Promise(r => setTimeout(r, 25000));
console.log('final URL:', page.url());
const title = await page.evaluate(() => document.title);
console.log('page title:', title);
const h1 = await page.evaluate(() => document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : '(no h1)');
console.log('h1:', h1);

// Check for an error boundary / 404 text
const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 400) : '(no body)');
console.log('body head:', bodyText.replace(/\n+/g, ' | ').slice(0, 300));

await browser.close();
