// Runs the Next CLI (build/start) with NODE_PATH set, so chunks evaluated from
// the out-of-project build dir (see next.config note / dev-prewarm.mjs) can
// still resolve the project's node_modules. Also runs the junction health
// check, which fails loudly with repair instructions on drift.
// Usage: `npm run build` / `npm run start -- -p 53144`
import { spawn } from "node:child_process";
import path from "node:path";

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

const env = {
  ...process.env,
  NODE_PATH: path.join(process.cwd(), "node_modules"),
};

const child = spawn(
  process.execPath,
  ["--max-old-space-size=4096", "node_modules/next/dist/bin/next", ...args],
  { stdio: "inherit", env, shell: false },
);
child.on("exit", (code) => process.exit(code ?? 1));
