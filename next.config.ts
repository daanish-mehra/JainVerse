import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jainworld.com', 'localhost'],
  },
};

export default nextConfig;
