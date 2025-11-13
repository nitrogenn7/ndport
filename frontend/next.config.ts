import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configuration for remote image sources
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**"
      },
      {
        protocol: "http",
        hostname: "ndport.vercel.app/",
        pathname: "/uploads/**"
      },
      {
        protocol: 'https',
        hostname: 'ndport.vercel.app/',
      }
    ],
  },

};

export default nextConfig;
