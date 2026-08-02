import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirects moved to src/middleware.ts to bypass Vercel's 1,024 limit
  images: {
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
