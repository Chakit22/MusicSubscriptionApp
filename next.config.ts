import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "raw.githubusercontent.com",
      "music-images-2025.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
