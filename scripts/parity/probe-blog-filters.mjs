import puppeteer from "puppeteer";
import fs from "fs";

const base = process.argv[2] || "http://localhost:53143";

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

async function check(url, label) {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"], executablePath: systemChrome });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1500));
    const info = await page.evaluate(() => {
      const badges = [...document.querySelectorAll("a span, a p")].map((e) => e.textContent.trim());
      const resultHeader = document.querySelector("p.text-sm")?.textContent || "";
      const gridCards = document.querySelectorAll("main a, section a[href*='/blog/']").length;
      // category badges on grid cards
      const catBadges = [...document.querySelectorAll("span")].filter((s) =>
        /^(Pilgrimage|Adventure|Beaches|Hill Stations|Food & Cuisine|Cultural|Travel Tips|Hotels|Buddhist|Honeymoon|Wildlife|Travel)$/.test(s.textContent.trim())
      ).map((s) => s.textContent.trim());
      const titles = [...document.querySelectorAll("h3")].map((h) => h.textContent.trim()).slice(0, 6);
      return { resultHeader, catBadges: catBadges.slice(0, 8), titles };
    });
    console.log(`\n=== ${label} ===`);
    console.log("result header:", info.resultHeader);
    console.log("card category badges:", JSON.stringify(info.catBadges));
    console.log("first titles:", JSON.stringify(info.titles.slice(0, 4)));
  } finally {
    await browser.close();
  }
}

await check(`${base}/blog?cat=Pilgrimage`, "cat=Pilgrimage");
await check(`${base}/blog?q=kedarnath`, "q=kedarnath");
await check(`${base}/blog`, "no params (All)");
