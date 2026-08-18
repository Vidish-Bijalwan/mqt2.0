#!/usr/bin/env node
/**
 * Mobile breakpoint audit: capture MQT and reference site at 390px viewport
 * for side-by-side comparison of key page types.
 */
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.join(process.cwd(), '.freebuff', 'mobile-audit');
fs.mkdirSync(OUT_DIR, { recursive: true });

const MQT_BASE = 'http://localhost:53143';
const REF_BASE = 'https://www.namasteindiatrip.com';

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 }); // iPhone 14

  const pages = [
    // Homepage
    { name: 'homepage', mqt: '/', ref: '/' },
    // Package listing
    { name: 'package-listing', mqt: '/packages?category=Pilgrimage', ref: '/pilgrimage-tour-packages' },
    // Package detail
    { name: 'package-detail', mqt: '/packages/12-jyotirlinga-tour-package', ref: '/12-jyotirlinga-tour-package' },
    // Package detail (no price)
    { name: 'package-noprice', mqt: '/packages/ahmedabad-dwarka-weekend-tour', ref: '/ahmedabad-dwarka-weekend-tour' },
  ];

  for (const p of pages) {
    // MQT
    console.log(`Capturing MQT ${p.name}...`);
    try {
      await page.goto(`${MQT_BASE}${p.mqt}`, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(OUT_DIR, `mqt-${p.name}.png`) });
      console.log(`  ✅ mqt-${p.name}.png`);
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
    }

    // Reference
    console.log(`Capturing reference ${p.name}...`);
    try {
      await page.goto(`${REF_BASE}${p.ref}`, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 3000));
      await page.screenshot({ path: path.join(OUT_DIR, `ref-${p.name}.png`) });
      console.log(`  ✅ ref-${p.name}.png`);
    } catch (e) {
      console.error(`  ❌ ${e.message}`);
    }
  }

  // Also capture computed styles for key elements
  console.log('\nMeasuring mobile layout values...');
  
  await page.goto(`${MQT_BASE}/packages/12-jyotirlinga-tour-package`, { 
    waitUntil: 'networkidle2', timeout: 20000 
  });
  await new Promise(r => setTimeout(r, 3000));

  const mqtMetrics = await page.evaluate(() => {
    const metrics = {};
    
    // Card metrics
    const card = document.querySelector('.nit-pcard');
    if (card) {
      const cs = getComputedStyle(card);
      metrics.card = {
        width: cs.width,
        padding: cs.padding,
        border: cs.border,
        borderRadius: cs.borderRadius,
        fontSize: cs.fontSize,
      };
    }
    
    // Title metrics
    const title = document.querySelector('.nit-pcard-title a');
    if (title) {
      const cs = getComputedStyle(title);
      metrics.title = {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        color: cs.color,
      };
    }
    
    // Price metrics
    const price = document.querySelector('.nit-prCn');
    if (price) {
      const cs = getComputedStyle(price);
      metrics.price = {
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        color: cs.color,
      };
    }
    
    // Body metrics
    const body = document.body;
    const bcs = getComputedStyle(body);
    metrics.body = {
      fontSize: bcs.fontSize,
      fontFamily: bcs.fontFamily,
      backgroundColor: bcs.backgroundColor,
    };
    
    // Nav metrics
    const nav = document.querySelector('nav');
    if (nav) {
      const ncs = getComputedStyle(nav);
      metrics.nav = {
        height: ncs.height,
        backgroundColor: ncs.backgroundColor,
      };
    }
    
    // H1 metrics
    const h1 = document.querySelector('h1');
    if (h1) {
      const hcs = getComputedStyle(h1);
      metrics.h1 = {
        fontSize: hcs.fontSize,
        fontWeight: hcs.fontWeight,
        lineHeight: hcs.lineHeight,
      };
    }
    
    return metrics;
  });

  console.log('\nMQT Mobile Metrics:');
  console.log(JSON.stringify(mqtMetrics, null, 2));

  // Save metrics
  fs.writeFileSync(
    path.join(OUT_DIR, 'mqt-mobile-metrics.json'),
    JSON.stringify(mqtMetrics, null, 2)
  );

  await browser.close();
  console.log('\nDone! Screenshots in', OUT_DIR);
}

main().catch(console.error);
