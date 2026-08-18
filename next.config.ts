import os from "node:os";
import type { NextConfig } from "next";

// This project lives inside an OneDrive-synced folder. Two machine-local
// workarounds keep the heavy trees out of the sync layer (OneDrive locks and
// partial-syncs files, which caused 20-30s dev compiles and corrupted
// packages like sharp):
//   - `.next`        is a Windows junction -> AppData\Local\mqt-next-cache
//   - `node_modules` is a Windows junction -> AppData\Local\mqt-node-modules
// Turbopack's module resolver refuses symlinks/junctions that point outside
// its root, so on OneDrive machines widen the root to the home directory —
// the common ancestor of the project and both junction targets. CI and
// non-OneDrive machines keep the default project-root behavior.
const isOneDrive = process.cwd().toLowerCase().includes("onedrive");

const nextConfig: NextConfig = {
  // Redirects moved to src/proxy.ts to bypass Vercel's 1,024 limit
  images: {
    // On Vercel, always use optimized images (default behavior)
    // Locally in dev, skip optimization for faster iteration
    unoptimized: process.env.NODE_ENV === "development",
  },
  // On Vercel/CI, skip turbopack root override (no junctions needed)
  // Locally on OneDrive, widen root to home dir so turbopack can resolve
  // modules from the .next junction target outside the project.
  ...(isOneDrive
    ? {
        turbopack: {
          root: os.homedir(),
        },
      }
    : {}),
};

export default nextConfig;
