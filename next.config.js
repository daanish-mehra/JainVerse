/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jainworld.com', 'localhost'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

