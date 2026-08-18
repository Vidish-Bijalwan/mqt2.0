import puppeteer from "puppeteer";
import fs from "fs";

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

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"], executablePath: systemChrome });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("https://www.myquicktrippers.com/", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  // Dismiss overlays: click any element with close/decline/accept
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("button, [role=button], a")];
    const close = els.find((b) => {
      const t = (b.textContent || "") + " " + (b.className || "");
      return /decline essential|accept all|×|✕|close/i.test(t) && (b.className || "").toString().includes("absolute top-3");
    });
    if (close) close.click();
  });
  await page.evaluate(() => {
    const els = [...document.querySelectorAll("button")];
    const acc = els.find((b) => /accept all/i.test(b.textContent || ""));
    if (acc) acc.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  const dump = await page.evaluate(() => {
    const all = [...document.querySelectorAll("a")];
    const hrefs = all.map((a) => a.getAttribute("href")).filter(Boolean);
    const uniq = [...new Set(hrefs)];
    const pkgLike = uniq.filter((h) => /package|tour|\/packages/i.test(h));
    const viewTour = [...document.querySelectorAll("a,button")]
      .filter((e) => /quick enquiry|view tour|view details|send query|view package/i.test(e.textContent || ""))
      .map((e) => ({ tag: e.tagName, text: (e.textContent || "").trim().slice(0, 30), href: e.getAttribute("href") }));
    return { total: uniq.length, pkgLike: pkgLike.slice(0, 15), viewTour: viewTour.slice(0, 10) };
  });
  console.log("total unique hrefs:", dump.total);
  console.log("package-like hrefs:", JSON.stringify(dump.pkgLike, null, 1));
  console.log("view-tour elements:", JSON.stringify(dump.viewTour, null, 1));

  // Screenshot after dismissing overlays
  await page.screenshot({ path: ".freebuff/parity/live-home-clean.png" });
  console.log("screenshot saved");
} finally {
  await browser.close();
}
