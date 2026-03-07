import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreDuringBuildErrors: true,
  },
  trailingSlash: true,
};

export default nextConfig;
