import os from "node:os";
import type { NextConfig } from "next";

// This project lives inside an OneDrive-synced folder. Two machine-local
// workarounds keep the heavy trees out of the sync layer (OneDrive locks and
// partial-syncs files, which caused 20-30s dev compiles and corrupted
// packages like sharp):
//   - `.next`        is a Windows junction -> AppData\Local\mqt-next-cache
//   - `node_modules` is a Windows junction -> AppData\Local\mqt-node-modules-next16
// Turbopack's module resolver refuses symlinks/junctions that point outside
// its root, so on OneDrive machines widen the root to the home directory —
// the common ancestor of the project and both junction targets. CI and
// non-OneDrive machines keep the default project-root behavior.
const isOneDrive = process.cwd().toLowerCase().includes("onedrive");

const nextConfig: NextConfig = {
  // Keep the local preview visually identical to production for design reviews.
  devIndicators: false,
  // Redirects moved to src/proxy.ts to bypass Vercel's 1,024 limit
  images: {
    // Serve the owned images from /public directly. This avoids Vercel's
    // on-demand image transformation allowance and prevents a quota error
    // from turning otherwise valid blog and package images into broken media.
    unoptimized: true,
    // Use modern image formats for better performance
    formats: ["image/avif", "image/webp"],
    qualities: [55, 60, 65, 68, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // HTTP headers for caching & security
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/logo/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Security headers on all pages
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { 
            key: "Content-Security-Policy", 
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://translate.google.com; frame-src https://translate.google.com;" 
          },
        ],
      },
    ];
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
