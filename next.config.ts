import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },

  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
