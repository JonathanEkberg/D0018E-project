/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       // Set so the user browser tells us their preferred color scheme.
  //       headers: [
  //         {
  //           key: "Accept-CH",
  //           value: "Sec-CH-Prefers-Color-Scheme",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
