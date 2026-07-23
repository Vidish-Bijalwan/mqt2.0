import type { NextConfig } from "next";
import redirectsData from "./src/data/redirects.json";

const nextConfig: NextConfig = {
  async redirects() {
    return redirectsData.map(r => ({
      source: r.source,
      destination: r.destination,
      permanent: r.permanent
    }));
  }
};

export default nextConfig;
