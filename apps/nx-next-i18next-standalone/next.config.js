// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const { i18n } = require('./next-i18next.config');
const { join } = require('path');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  experimental: {
    outputStandalone: true,
    outputFileTracingRoot: join(__dirname, '../../'),
  },
  i18n,
};

module.exports = withNx(nextConfig);
