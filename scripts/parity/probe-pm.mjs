import puppeteer from "puppeteer";
import fs from "fs";

const url = process.argv[2] || "http://localhost:53143/";
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
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 4000));

const info = await page.evaluate(() => {
  const track = document.querySelector(".pm-track");
  if (!track) return { found: false };
  const cs = getComputedStyle(track);
  // capture transform at two moments 1.2s apart
  return new Promise((resolve) => {
    const t0 = cs.transform;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      const cs2 = getComputedStyle(track);
      resolve({
        found: true,
        animationName: cs.animationName,
        duration: cs.animationDuration,
        playState: cs.animationPlayState,
        reducedMotionPref: reduced,
        transform0: t0,
        transform1: cs2.transform,
        cardCount: document.querySelectorAll(".pm-card").length,
        trackWidth: track.getBoundingClientRect().width,
        trackInlineDuration: track.style.animationDuration,
        trackInlinePlayState: track.style.animationPlayState,
      });
    }, 1200);
  });
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
