import puppeteer from "puppeteer";
import fs from "fs";

const url = process.argv[2];
const vw = parseInt(process.argv[3] || "1440", 10);

const candidates =
  process.platform === "win32"
    ? [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      ]
    : ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"];

const browser = await puppeteer.launch({
  headless: "new",
  executablePath: candidates.find((c) => fs.existsSync(c)),
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});
const page = await browser.newPage();
await page.setViewport({ width: vw, height: 900 });
const errors = [];
const failedRequests = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => {
  const t = m.text();
  if (m.type() === "error") errors.push("[console] " + t.slice(0, 300));
});
page.on("requestfailed", (request) => {
  const reason = request.failure()?.errorText || "FAILED";
  const url = request.url();
  // Next cancels speculative RSC prefetches when a link leaves the viewport.
  if (reason === "net::ERR_ABORTED" && url.includes("_rsc=")) return;
  failedRequests.push(`${reason} ${url}`);
});
page.on("response", (response) => {
  if (response.status() >= 400) {
    failedRequests.push(`${response.status()} ${response.url()}`);
  }
});
try {
  await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
} catch (e) {
  console.log("goto err:", e.message.slice(0, 120));
}
await new Promise((r) => setTimeout(r, 3000));
const info = await page.evaluate(() => {
  return {
    title: document.title,
    bodyText: (document.body.innerText || "").slice(0, 400).replace(/\n+/g, " | "),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    imgCount: document.images.length,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src)
      .slice(0, 10),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    overlayText: (document.body.innerText.match(/Runtime [A-Za-z]+|Unexpected end of JSON input|Call Stack/g) || []).slice(0, 6),
  };
});
info.errors = errors;
info.failedRequests = [...new Set(failedRequests)].slice(0, 10);
console.log(JSON.stringify(info, null, 1));
await browser.close();
