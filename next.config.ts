import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com", protocol: "https" }
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
