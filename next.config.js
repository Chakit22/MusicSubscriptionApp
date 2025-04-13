/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
