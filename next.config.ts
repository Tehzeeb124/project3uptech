import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true, // This enables Tailwind v4 extraction engine properly
  },
};

export default nextConfig;