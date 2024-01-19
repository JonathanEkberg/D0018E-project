/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 8,
  },
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        // Set so the user browser tells us their preferred color scheme.
        headers: [
          {
            key: "Accept-CH",
            value: "Sec-CH-Prefers-Color-Scheme",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
