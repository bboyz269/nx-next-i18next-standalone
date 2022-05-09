const { resolve } = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 **/
const i18nConfig = {
  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
  },
  localePath: resolve('./apps/nx-next-i18next-standalone/public/locales'),
};

module.exports = i18nConfig;
