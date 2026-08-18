// Wraps `next dev` and pre-warms the routes users click first, so the first
// click after startup (or after a rebuild) doesn't pay the cold-compile cost.
// Usage: `npm run dev` or `npm run dev -- -p 53143`
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import "./health-check.mjs"; // exits with repair instructions if the junction setup has drifted
import "./ensure-build-link.mjs";
import { ogRepairHint } from "./health-check.mjs";

const args = process.argv.slice(2);

function detectPort() {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-p" || args[i] === "--port") {
      const v = parseInt(args[i + 1], 10);
      if (!Number.isNaN(v)) return v;
    }
  }
  return 3000;
}

const port = detectPort();
const nextBin = "node_modules/next/dist/bin/next";

// Turbopack evaluates postcss.config.mjs as an external chunk inside the build
// dir. On this machine `.next` is a junction pointing outside the project (to
// keep the build tree out of OneDrive), so Node's normal upward resolution
// can't reach the project's node_modules — NODE_PATH covers that fallback.
const env = {
  ...process.env,
  NODE_PATH: path.join(process.cwd(), "node_modules"),
};

const child = spawn(process.execPath, [nextBin, "dev", ...args], {
  stdio: ["inherit", "pipe", "pipe"],
  env,
  shell: false,
});

let warmed = false;
let outBuf = "";

function pump(stream) {
  stream.on("data", (chunk) => {
    const text = chunk.toString();
    outBuf += text;
    process.stdout.write(text);
    if (!warmed && /(Ready|Local:)/i.test(outBuf)) {
      warmed = true;
      warmRoutes(port).catch((err) =>
        console.error("prewarm error:", err.message),
      );
    }
  });
}
pump(child.stdout);
pump(child.stderr);

child.on("exit", (code) => process.exit(code ?? 1));

async function warmRoutes(p) {
  const base = `http://localhost:${p}`;
  const routes = [
    "/",
    "/packages",
    "/blog",
    "/destinations/india-tours",
    "/packages/3-days-nepal-tour-package",
    "/blog/adi-kailash-yatra",
    "/api/og/10-days-assam-meghalaya-arunachal-pradesh-tour-packages",
  ];
  await sleep(500); // let the HTTP server accept connections
  for (const r of routes) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const t0 = Date.now();
        const res = await fetch(base + r, {
          signal: AbortSignal.timeout(120000),
        });
        console.log(`prewarm ${res.status} ${Date.now() - t0}ms ${r}`);
        if (r.startsWith("/api/og") && res.status !== 200) {
          console.error("\n❌ " + ogRepairHint() + "\n");
        }
        break;
      } catch (e) {
        if (attempt === 3) {
          console.log(`prewarm failed ${r}: ${e.message}`);
          if (r.startsWith("/api/og")) {
            console.error("\n❌ " + ogRepairHint() + "\n");
          }
        } else {
          console.log(`prewarm retry ${r} (${attempt}): ${e.message}`);
          await sleep(1500);
        }
      }
    }
  }
  console.log("prewarm done — first clicks should be fast");
}
