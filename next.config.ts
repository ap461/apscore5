import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    // Allow next/image to serve from the Prismic CDN and your own domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apscore5.cdn.prismic.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "apscore5.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
