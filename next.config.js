/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  generateEtags: true,
  images: { unoptimized: true },
}

module.exports = nextConfig
