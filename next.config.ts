import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.lumacdn.com'], // Add the external domain
  },
};

export default nextConfig;
