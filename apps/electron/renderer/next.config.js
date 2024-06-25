/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

/** @type {import("next").NextConfig} */
const config = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  webpack: (config) => {
    return config;
  },
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'loremflickr.com',
      },
    ],
  },
  transpilePackages: [
    '@what-if-store/config',
    '@what-if-store/constants',
    '@what-if-store/electron',
    '@what-if-store/prisma',
    '@what-if-store/bridge',
    '@what-if-store/server',
    '@what-if-store/tsconfig',
    '@what-if-store/types',
    '@what-if-store/utils',
  ],
};

module.exports = config;
