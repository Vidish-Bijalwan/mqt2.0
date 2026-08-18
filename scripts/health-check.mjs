// Startup health check for the OneDrive machine setup.
//
// This project lives inside an OneDrive-synced folder, so `.next` and
// `node_modules` are Windows junctions pointing outside the sync layer
// (AppData\Local). Tools that replace the link with a real directory —
// `npm prune`, `npm ci`, `rm -rf node_modules`, fresh checkouts — silently
// reintroduce OneDrive corruption and confusing errors. This check runs
// before every `next` command (via dev-prewarm.mjs / run-next.mjs) and on
// direct invocation (`node scripts/health-check.mjs`), and fails loudly with
// exact repair commands when the setup has drifted.
//
// On non-OneDrive machines (CI, Vercel, other devs) this is a silent no-op.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectRoot = process.cwd();
const isOneDrive = projectRoot.toLowerCase().includes("onedrive");

const NM_TARGET_DIR = "mqt-node-modules";
const NEXT_TARGET_DIR = "mqt-next-cache";
const NM_TARGET = path.join(
  os.homedir(),
  "AppData",
  "Local",
  NM_TARGET_DIR,
  "node_modules",
);
const NEXT_TARGET = path.join(os.homedir(), "AppData", "Local", NEXT_TARGET_DIR);

const OG_SLUG = "10-days-assam-meghalaya-arunachal-pradesh-tour-packages";

function isJunction(p) {
  try {
    return fs.lstatSync(p).isSymbolicLink();
  } catch {
    return false;
  }
}

function realTarget(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
  }
}

export function repairInstructions() {
  return `Repair (run in the project root, Git Bash):

1) Recreate the node_modules junction (removes the LINK only, never the target):
   cmd //c rmdir node_modules
   cmd //c mklink //J node_modules "${NM_TARGET}"

   If the target folder is missing/corrupt, reinstall fresh outside OneDrive:
   mkdir -p "${path.join(os.homedir(), "AppData", "Local", NM_TARGET_DIR)}"
   cp package.json package-lock.json "${path.join(os.homedir(), "AppData", "Local", NM_TARGET_DIR)}/"
   npm ci --prefix "${path.join(os.homedir(), "AppData", "Local", NM_TARGET_DIR)}"
   cmd //c rmdir node_modules
   cmd //c mklink //J node_modules "${NM_TARGET}"

2) Recreate the .next junction (if .next is a real dir: rm -rf .next first — it's build output):
   cmd //c rmdir .next
   cmd //c mklink //J .next "${NEXT_TARGET}"

NEVER run 'npm prune', 'npm ci', or 'rm -rf node_modules' from the project —
they replace the junction with a real directory.`;
}

export function ogRepairHint() {
  return `The OG image route (/api/og/*) is failing. Most likely 'next build' wiped the
build-dir 'next' link that lets Node resolve next/og from the out-of-project
build dir. Fix: node scripts/ensure-build-link.mjs
(the dev/start wrappers run it automatically on the next start).`;
}

export function runHealthCheck() {
  if (!isOneDrive) {
    console.log("✅ health check: not an OneDrive machine — nothing to verify");
    return true;
  }

  const problems = [];

  // --- node_modules junction ---
  const nmPath = path.join(projectRoot, "node_modules");
  if (!isJunction(nmPath)) {
    problems.push(
      "❌ node_modules is NOT a junction (it's a real directory inside OneDrive).",
    );
  } else {
    const nmReal = realTarget(nmPath);
    if (!nmReal) {
      problems.push("❌ node_modules junction points to a missing target.");
    } else if (!nmReal.toLowerCase().includes(NM_TARGET_DIR)) {
      problems.push(
        `❌ node_modules junction points to an unexpected target: ${nmReal}\n   (expected ...${NM_TARGET_DIR})`,
      );
    } else {
      for (const pkg of ["next/package.json", "sharp/package.json", "react/package.json"]) {
        if (!fs.existsSync(path.join(nmPath, pkg))) {
          problems.push(`❌ node_modules target is missing ${pkg} — install is incomplete/corrupt.`);
          break;
        }
      }
    }
  }

  // --- .next junction ---
  const nextPath = path.join(projectRoot, ".next");
  if (!fs.existsSync(nextPath)) {
    problems.push("❌ .next does not exist — the junction is missing.");
  } else if (!isJunction(nextPath)) {
    problems.push("❌ .next is a real directory inside OneDrive, not a junction.");
  } else {
    const nextReal = realTarget(nextPath);
    if (!nextReal) {
      problems.push("❌ .next junction points to a missing target.");
    } else if (!nextReal.toLowerCase().includes(NEXT_TARGET_DIR)) {
      problems.push(
        `❌ .next junction points to an unexpected target: ${nextReal}\n   (expected ...${NEXT_TARGET_DIR})`,
      );
    }
  }

  if (problems.length > 0) {
    console.error("\n================================================================");
    console.error("❌ MQT health check FAILED — the junction setup has drifted.\n");
    console.error(problems.join("\n\n"));
    console.error("\n" + repairInstructions());
    console.error("================================================================\n");
    return false;
  }

  console.log("✅ health check passed (node_modules + .next junctions OK)");
  return true;
}

// Run on import (before every next command via the wrappers) AND on direct
// invocation (`node scripts/health-check.mjs`). On drift, print the repair
// instructions and exit non-zero so the wrapper never starts a broken setup.
const healthOk = runHealthCheck();
if (!healthOk) process.exit(1);
if (process.argv[1] && process.argv[1].endsWith("health-check.mjs")) {
  process.exit(0);
}
