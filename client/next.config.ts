import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
  allowedDevOrigins: [
    "192.168.0.104",
    "192.168.0.104:3000",
    "localhost",
    "localhost:3000",
  ],
};

export default nextConfig;
