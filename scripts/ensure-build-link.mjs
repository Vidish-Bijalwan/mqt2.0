// On this machine `.next` is a junction pointing outside the project (out of
// OneDrive). Turbopack's runtime chunks live inside that build dir and treat
// `next/*` (e.g. next/og) as externals that Node must resolve at runtime —
// but Node's ESM resolver walks up from the chunk location and never reaches
// the project's node_modules. A `node_modules\next` junction inside the build
// dir fixes that. Turbopack wipes `.next/node_modules` during `next build`,
// so this helper is invoked before every next command (dev/build/start).
//
// On machines where `.next` is a normal in-project directory this is a no-op.
import fs from "node:fs";
import path from "node:path";

try {
  const projectRoot = process.cwd();
  const nextDir = path.join(projectRoot, ".next");
  const realBuildDir = fs.realpathSync(nextDir);
  if (path.resolve(nextDir) === realBuildDir) {
    // .next is a plain directory inside the project — nothing to do.
    process.exit(0);
  }

  const nmDir = path.join(realBuildDir, "node_modules");
  fs.mkdirSync(nmDir, { recursive: true });

  const linkPath = path.join(nmDir, "next");
  if (!fs.existsSync(linkPath)) {
    const target = path.join(
      fs.realpathSync(path.join(projectRoot, "node_modules")),
      "next",
    );
    fs.symlinkSync(target, linkPath, "junction");
    console.log(`[ensure-build-link] linked ${linkPath} -> ${target}`);
  }
} catch (e) {
  console.warn(`[ensure-build-link] skipped: ${e.message}`);
}
