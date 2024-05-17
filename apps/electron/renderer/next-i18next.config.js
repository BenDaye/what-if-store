/** @type {import('next-i18next').UserConfig} */
const config = {
  // debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN'],
  },
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  nonExplicitSupportedLngs: true,
  ns: ['common', 'router', 'errorMessage'],
  preload: ['en-US', 'zh-CN'],
  defaultNS: 'common',
  react: {
    // https://locize.com/blog/next-i18next/
    // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
    bindI18n: 'languageChanged loaded',
    useSuspense: false,
  },
  localePath:
    typeof window === 'undefined'
      ? // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('path').resolve('./renderer/public/locales')
      : '/locales',
};

module.exports = config;
