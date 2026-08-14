import type { NextConfig } from "next";
import { legacyLandingPageRedirects } from "./src/lib/legacyLandingPages";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyLandingPageRedirects();
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
