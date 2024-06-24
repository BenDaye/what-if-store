/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
const { i18n } = require('./next-i18next.config');

/** @type {import("next").NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ];
  },
  i18n,
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'loremflickr.com',
      },
    ],
  },
};

module.exports = config;
