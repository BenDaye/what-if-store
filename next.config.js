/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
const { i18n } = require('./next-i18next.config');

/** @type {import("next").NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
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
