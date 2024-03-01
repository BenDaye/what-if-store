/** @type {import('next-i18next').UserConfig} */
module.exports = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
  },
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  nonExplicitSupportedLngs: true,
  ns: ['common', 'errorMessage', 'meta', 'auth'],
  preload: ['en', 'zh'],
  defaultNS: 'common',
  react: {
    // https://locize.com/blog/next-i18next/
    // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
    bindI18n: 'languageChanged loaded',
    useSuspense: false,
  },
};
