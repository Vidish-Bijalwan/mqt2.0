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
  const logs = [];
  page.on("console", (m) => logs.push(m.text().slice(0, 200)));
  page.on("requestfailed", (r) => logs.push("REQFAIL " + r.url().slice(0, 120)));

  await page.goto("https://www.myquicktrippers.com/", { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  // Close any modal / cookie banner
  const closeButtons = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button, [role=button], a")]
      .filter((b) => /close|×|x|decline|essential/i.test((b.textContent || "") + (b.getAttribute("aria-label") || "") + (b.className || "")) && b.offsetParent !== null)
      .map((b, i) => ({ i, text: (b.textContent || "").trim().slice(0, 30), cls: (b.className || "").toString().slice(0, 60) }));
    return btns.slice(0, 8);
  });
  console.log("close candidates:", JSON.stringify(closeButtons));
  for (const c of closeButtons) {
    try { await page.evaluate((i) => { document.querySelectorAll("button, [role=button], a")[i]?.click(); }, c.i); } catch {}
  }
  await new Promise((r) => setTimeout(r, 1200));

  // Extract package links visible on the page
  const links = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll("a[href*='/packages/']")];
    const visible = anchors.filter((a) => a.offsetParent !== null);
    return [...new Set(visible.map((a) => a.getAttribute("href")))].slice(0, 12);
  });
  console.log("visible package links:", JSON.stringify(links, null, 1));

  if (links.length > 0) {
    const href = links[0];
    console.log("clicking:", href);
    try {
      await page.click(`a[href="${href}"]`, { timeout: 8000 });
      await new Promise((r) => setTimeout(r, 6000));
      console.log("after click URL:", page.url());
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400).replace(/\n+/g, " | "));
      console.log("page text head:", bodyText);
    } catch (e) {
      console.log("click failed:", e.message.slice(0, 200));
      // fallback: navigate directly
      await page.goto("https://www.myquicktrippers.com" + href, { waitUntil: "networkidle0", timeout: 45000 });
      console.log("direct nav URL:", page.url());
      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 400).replace(/\n+/g, " | "));
      console.log("page text head:", bodyText);
    }
  }

  const errLogs = logs.filter((l) => /error|404|failed|Cannot/i.test(l));
  console.log("\nconsole errors:", errLogs.slice(0, 6));
} finally {
  await browser.close();
}
