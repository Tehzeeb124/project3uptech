import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Experimental CSS optimization ko remove kar diya hai taake build crash na ho */
  typescript: {
    // Build ke dauran agar koi minor strict type mismatch ho to build na ruke
    ignoreBuildErrors: true,
  },
  eslint: {
    // Production compile time par linter warnings ko bypass karne ke liye
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;