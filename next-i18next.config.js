/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en_US',
    locales: ['en_US', 'zh_CN'],
  },
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  nonExplicitSupportedLngs: true,
  ns: [
    'common',
    'router',
    'errorMessage',
    'meta',
    'auth',
    'user',
    'provider',
    'application',
  ],
  preload: ['en_US', 'zh_CN'],
  defaultNS: 'common',
  react: {
    // https://locize.com/blog/next-i18next/
    // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
    bindI18n: 'languageChanged loaded',
    useSuspense: false,
  },
};
