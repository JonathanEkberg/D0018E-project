/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 8,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
