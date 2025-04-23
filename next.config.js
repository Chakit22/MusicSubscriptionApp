/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "upload.wikimedia.org",
      "raw.githubusercontent.com",
      "music-images-2025.s3.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
