#!/usr/bin/env node
/**
 * Take screenshots of key pages for the audit report.
 * Requires puppeteer (already in devDependencies).
 */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), '.freebuff', 'screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'http://localhost:53143';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Desktop viewport (1440px wide)
  await page.setViewport({ width: 1440, height: 900 });

  const shots = [
    // D03: FAQ tab on package detail page
    {
      name: 'D03-faq-tab-desktop',
      url: '/packages/12-jyotirlinga-tour-package',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // D07: Breadcrumb on a Pilgrimage package
    {
      name: 'D07-breadcrumb-desktop',
      url: '/packages/amarnath-yatra',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // D05: Pricing wording on package card
    {
      name: 'D05-pricing-wording-desktop',
      url: '/packages/agra-tour-packages',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // D11: Day accordion on itinerary page
    {
      name: 'D11-accordion-desktop',
      url: '/packages/3-days-delhi-agra-mathura-vrindavan-tour',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // Pricing: Card with real price (12 Jyotirlinga - ₹1,42,500)
    {
      name: 'price-jyotirlinga-card-desktop',
      url: '/packages?category=Pilgrimage',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // Pricing: Detail page with real price (12 Jyotirlinga - ₹1,42,500)
    {
      name: 'price-jyotirlinga-detail-desktop',
      url: '/packages/12-jyotirlinga-tour-package',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // Pricing: Card with no price (Ahmedabad Dwarka)
    {
      name: 'price-noprice-card-desktop',
      url: '/packages/ahmedabad-dwarka-weekend-tour',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
    // Homepage trending section
    {
      name: 'homepage-trending-desktop',
      url: '/',
      wait: 3000,
      fullPage: false,
      clip: null,
    },
  ];

  for (const shot of shots) {
    console.log(`Capturing ${shot.name}...`);
    try {
      await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, shot.wait || 2000));

      const outPath = path.join(OUT_DIR, `${shot.name}.png`);
      if (shot.fullPage) {
        await page.screenshot({ path: outPath, fullPage: true });
      } else {
        await page.screenshot({ path: outPath });
      }
      console.log(`  ✅ ${outPath}`);
    } catch (e) {
      console.error(`  ❌ ${shot.name}: ${e.message}`);
    }
  }

  // Mobile viewport (390px wide — iPhone 14)
  await page.setViewport({ width: 390, height: 844 });

  const mobileShots = [
    // Mobile: Package detail with FAQ
    {
      name: 'D03-faq-tab-mobile',
      url: '/packages/12-jyotirlinga-tour-package',
      wait: 3000,
    },
    // Mobile: Package card pricing
    {
      name: 'price-card-mobile',
      url: '/packages?category=Pilgrimage',
      wait: 3000,
    },
    // Mobile: Breadcrumb
    {
      name: 'D07-breadcrumb-mobile',
      url: '/packages/amarnath-yatra',
      wait: 3000,
    },
    // Mobile: Itinerary accordion
    {
      name: 'D11-accordion-mobile',
      url: '/packages/3-days-delhi-agra-mathura-vrindavan-tour',
      wait: 3000,
    },
  ];

  for (const shot of mobileShots) {
    console.log(`Capturing mobile ${shot.name}...`);
    try {
      await page.goto(`${BASE}${shot.url}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, shot.wait || 2000));
      const outPath = path.join(OUT_DIR, `${shot.name}.png`);
      await page.screenshot({ path: outPath });
      console.log(`  ✅ ${outPath}`);
    } catch (e) {
      console.error(`  ❌ ${shot.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('\nDone! Screenshots in', OUT_DIR);
}

main().catch(console.error);
