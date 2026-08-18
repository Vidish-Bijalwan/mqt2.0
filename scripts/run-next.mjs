// Runs the Next CLI (build/start) with NODE_PATH set, so chunks evaluated from
// the out-of-project build dir (see next.config note / dev-prewarm.mjs) can
// still resolve the project's node_modules. Also runs the junction health
// check (fails loudly with repair instructions on drift) and, for `next
// start`, probes the OG route once the server is up.
// Usage: `npm run build` / `npm run start -- -p 53144`
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import path from "node:path";
import fs from "node:fs";

const args = process.argv.slice(2); // e.g. ["build"] or ["start","-p","53144"]

// Only run OneDrive health checks on OneDrive machines (skip on Vercel/CI)
const isOneDrive = process.cwd().toLowerCase().includes("onedrive");
if (isOneDrive) {
  try {
    await import("./health-check.mjs");
    await import("./ensure-build-link.mjs");
  } catch (e) {
    console.warn(`[run-next] health check skipped: ${e.message}`);
  }
}

// Dynamically import ogRepairHint only when on OneDrive
let ogRepairHint = () => "Check .next junction setup.";
if (isOneDrive) {
  try {
    const mod = await import("./health-check.mjs");
    ogRepairHint = mod.ogRepairHint;
  } catch {}
}

const env = {
  ...process.env,
  NODE_PATH: path.join(process.cwd(), "node_modules"),
};

const child = spawn(
  process.execPath,
  ["--max-old-space-size=4096", "node_modules/next/dist/bin/next.js", ...args],
  { stdio: "inherit", env, shell: false },
);
child.on("exit", (code) => process.exit(code ?? 1));

// After `next start` is up, verify the OG route (the most likely thing to
// break when the junction setup drifts).
if (args[0] === "start") {
  probeOg(detectPort(args)).catch(() => {});
}

function detectPort(a) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "-p" || a[i] === "--port") {
      const v = parseInt(a[i + 1], 10);
      if (!Number.isNaN(v)) return v;
    }
  }
  return 3000;
}

async function probeOg(port) {
  const base = `http://localhost:${port}`;
  const slug = "10-days-assam-meghalaya-arunachal-pradesh-tour-packages";
  // Wait for the server to accept connections (max ~30s).
  let up = false;
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(base + "/", { signal: AbortSignal.timeout(3000) });
      if (r.ok) {
        up = true;
        break;
      }
    } catch {
      /* not up yet */
    }
    await sleep(1000);
  }
  if (!up) return; // server never came up — its own output is the diagnosis
  try {
    const r = await fetch(`${base}/api/og/${slug}`, {
      signal: AbortSignal.timeout(60000),
    });
    if (r.ok) {
      console.log(`✅ OG route OK (${r.status}, ${r.headers.get("content-type")})`);
    } else {
      console.error(`\n❌ OG route responded ${r.status} after startup.\n${ogRepairHint()}\n`);
    }
  } catch (e) {
    console.error(`\n❌ OG route check failed: ${e.message}\n${ogRepairHint()}\n`);
  }
}
