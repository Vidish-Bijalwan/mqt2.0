// Safe reinstall for the OneDrive machine setup.
//
// `npm ci` / `npm prune` run from the project REPLACE the node_modules junction
// with a real directory inside OneDrive, silently reintroducing the corruption
// this setup exists to avoid. Instead, this script reinstalls exactly as the
// initial setup did:
//   1. copies the current manifests into the junction target (AppData),
//   2. runs `npm ci --prefix <target>` — entirely outside OneDrive,
//   3. restores the project's `node_modules` junction if it has drifted,
//   4. repairs the `.next` junction if it is missing or a real directory,
//   5. re-verifies with the health check, then
//   6. rebuilds `.next` when the build output is missing or stale (deps
//      changed since the last build) — so one command repairs the full setup.
//
// Usage: `npm run reinstall` or `npm run reinstall -- --force` (always rebuild)
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

const projectRoot = process.cwd();
const isOneDrive = projectRoot.toLowerCase().includes("onedrive");
const TARGET = path.join(os.homedir(), "AppData", "Local", "mqt-node-modules");
const NM_TARGET = path.join(TARGET, "node_modules");
const NM_PATH = path.join(projectRoot, "node_modules");
const NEXT_TARGET = path.join(os.homedir(), "AppData", "Local", "mqt-next-cache");
const NEXT_PATH = path.join(projectRoot, ".next");
const forceBuild = process.argv.includes("--force");

function run(cmd, args, env) {
  const res = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: env ? { ...process.env, ...env } : process.env,
  });
  if (res.status !== 0) {
    console.error(`✗ command failed (${cmd} ${args.join(" ")}), exiting`);
    process.exit(res.status ?? 1);
  }
  return res;
}

function portInUse(port) {
  // A raw TCP connect is the right signal: any listener counts, regardless of
  // how slowly it answers HTTP (the dev homepage takes >1s to respond, which
  // would defeat an HTTP-based check with a short timeout).
  return new Promise((resolve) => {
    const sock = net.connect({ host: "127.0.0.1", port, timeout: 1000 });
    sock.once("connect", () => {
      sock.destroy();
      resolve(true);
    });
    sock.once("error", () => resolve(false));
    sock.once("timeout", () => {
      sock.destroy();
      resolve(false);
    });
  });
}

async function refuseIfServerRunning() {
  // npm ci deletes the target tree first; native modules (.node binaries) stay
  // memory-mapped by a running server, so the unlink fails mid-way and leaves
  // the target half-deleted (this bit us once). Refuse to run instead.
  for (const port of [3000, 53143, 53144]) {
    if (await portInUse(port)) {
      console.error(
        `✗ A server is listening on port ${port} (probably npm run dev/start).\n` +
          `  Stop it first, then re-run: npm run reinstall`,
      );
      process.exit(1);
    }
  }
}

function repairNextJunction() {
  // .next is pure build output: if the junction is missing or drifted, remove
  // whatever is there and re-link to the out-of-OneDrive target, then let the
  // build step repopulate it. Servers are refused earlier, so nothing depends
  // on a live tree.
  let isLink = false;
  try {
    isLink = fs.lstatSync(NEXT_PATH).isSymbolicLink();
  } catch {
    /* missing */
  }
  if (isLink) {
    const real = fs.realpathSync(NEXT_PATH);
    if (real.toLowerCase().includes("mqt-next-cache")) {
      console.log(`  .next junction OK -> ${real}`);
      return;
    }
    console.warn(`  .next junction points to an unexpected target (${real}) — re-linking`);
    fs.rmSync(NEXT_PATH, { force: true }); // removes the link itself
  } else if (fs.existsSync(NEXT_PATH)) {
    console.warn("  .next is a real directory (drift) — removing build output and re-linking");
    fs.rmSync(NEXT_PATH, { recursive: true, force: true });
  }
  fs.mkdirSync(NEXT_TARGET, { recursive: true });
  fs.symlinkSync(NEXT_TARGET, NEXT_PATH, "junction");
  console.log(`  linked .next -> ${NEXT_TARGET}`);
}

function buildIsStale() {
  const buildId = path.join(NEXT_PATH, "BUILD_ID");
  if (!fs.existsSync(buildId)) return "no .next/BUILD_ID — never built or build wiped";
  if (!fs.existsSync(path.join(NEXT_PATH, "server", "app", "index.html"))) {
    return ".next/server/app/index.html missing — incomplete production build";
  }
  const buildTime = fs.statSync(buildId).mtimeMs;
  for (const f of ["package.json", "package-lock.json"]) {
    const p = path.join(projectRoot, f);
    if (fs.existsSync(p) && fs.statSync(p).mtimeMs > buildTime) {
      return `${f} is newer than the last build — dependencies may have changed`;
    }
  }
  return null;
}

async function main() {
  console.log("── reinstall: MQT dependencies ──");

  if (!isOneDrive) {
    console.log("Not an OneDrive machine — running plain `npm ci` in the project.");
    run("npm", ["ci", "--no-audit", "--no-fund"]);
    console.log("✅ reinstall complete");
    return;
  }

  await refuseIfServerRunning();

  // 1. Fresh manifests into the target so the install matches the project.
  fs.mkdirSync(TARGET, { recursive: true });
  for (const f of ["package.json", "package-lock.json"]) {
    const src = path.join(projectRoot, f);
    if (!fs.existsSync(src)) {
      if (f === "package-lock.json") {
        console.warn("⚠  package-lock.json missing — falling back to `npm install`.");
      } else {
        console.error(`✗ ${f} not found in the project root`);
        process.exit(1);
      }
    } else {
      fs.copyFileSync(src, path.join(TARGET, f));
      console.log(`  copied ${f} -> ${TARGET}`);
    }
  }

  // 2. Fresh install entirely outside OneDrive.
  console.log("  running npm ci in the junction target (outside OneDrive)...");
  const lockMissing = !fs.existsSync(path.join(projectRoot, "package-lock.json"));
  run(
    "npm",
    lockMissing
      ? ["install", "--prefix", TARGET, "--no-audit", "--no-fund"]
      : ["ci", "--prefix", TARGET, "--no-audit", "--no-fund"],
    { PUPPETEER_SKIP_DOWNLOAD: "true" },
  );

  // 3. Verify the fresh tree is usable.
  for (const pkg of ["next/package.json", "sharp/package.json", "react/package.json"]) {
    if (!fs.existsSync(path.join(NM_TARGET, pkg))) {
      console.error(`✗ fresh install is missing ${pkg} — something went wrong`);
      process.exit(1);
    }
  }
  console.log("  fresh tree verified (next, sharp, react)");

  // 4. Restore/verify the project junction (only if it isn't already right).
  let isLink = false;
  try {
    isLink = fs.lstatSync(NM_PATH).isSymbolicLink();
  } catch {
    /* missing */
  }
  if (isLink) {
    const real = fs.realpathSync(NM_PATH);
    console.log(`  node_modules junction OK -> ${real}`);
  } else {
    if (fs.existsSync(NM_PATH)) {
      // Real directory (drift) or dangling link — fs.rmSync removes a link
      // without following it, and recursively deletes a real directory.
      fs.rmSync(NM_PATH, { recursive: true, force: true });
      console.log("  removed drifted node_modules entry");
    }
    fs.symlinkSync(NM_TARGET, NM_PATH, "junction");
    console.log(`  linked node_modules -> ${NM_TARGET}`);
  }

  // 5. Repair the .next junction (missing/drifted) so the build step can run.
  repairNextJunction();

  // 6. Re-verify the whole setup.
  const hc = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", "health-check.mjs")],
    { stdio: "inherit" },
  );
  if (hc.status !== 0) {
    console.error("✗ health check failed after reinstall — see above");
    process.exit(hc.status ?? 1);
  }
  spawnSync(process.execPath, [path.join(projectRoot, "scripts", "ensure-build-link.mjs")], {
    stdio: "inherit",
  });

  // 7. Rebuild .next when the build output is missing or stale.
  const staleReason = forceBuild ? "--force requested" : buildIsStale();
  if (staleReason) {
    console.log(`\n── rebuild .next ──\n  reason: ${staleReason}`);
    run("npm", ["run", "build"]);
    // next build wipes the build-dir `next` link — re-create it so `start` works.
    spawnSync(process.execPath, [path.join(projectRoot, "scripts", "ensure-build-link.mjs")], {
      stdio: "inherit",
    });
    const buildId = path.join(NEXT_PATH, "BUILD_ID");
    if (
      !fs.existsSync(buildId) ||
      !fs.existsSync(path.join(NEXT_PATH, "server", "app", "index.html"))
    ) {
      console.error("✗ build finished but the output is incomplete (missing BUILD_ID/index.html)");
      process.exit(1);
    }
    console.log(`✅ build verified (BUILD_ID ${fs.readFileSync(buildId, "utf8").trim()})`);
  } else {
    console.log("  .next build output is fresh — skipping rebuild (use --force to force)");
  }

  console.log("✅ reinstall complete — `npm run dev` to confirm");
}

main().catch((e) => {
  console.error("✗ reinstall failed:", e.message);
  process.exit(1);
});
