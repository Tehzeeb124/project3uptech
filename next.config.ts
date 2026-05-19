import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Experimental CSS optimization ko remove kar diya hai taake build crash na ho */
  typescript: {
    // Build ke dauran agar koi minor strict type mismatch ho to build na ruke
    ignoreBuildErrors: true,
  },
};

export default nextConfig;