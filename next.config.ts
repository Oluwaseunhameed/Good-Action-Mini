/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  // additional config as needed
};

module.exports = nextConfig;
