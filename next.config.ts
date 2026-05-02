import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  basePath: "/Daily_News",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
