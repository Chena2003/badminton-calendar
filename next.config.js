const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  skipWaiting: true,
  register: true,
  importScripts: ['firebase-messaging-sw.js'],
});
const withNextIntl = require('next-intl/plugin')();

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  // Move _public/:site_key to public
  require('./build/public-assets');

  return withNextIntl(
    withPWA({
      typescript: {
        ignoreBuildErrors: true,
      },
      experimental: {
        allowedDevOrigins: ['192.168.1.219'],
      },
      webpack: (cfg) => {
        cfg.module.rules.push({
          test: /\.md$/,
          loader: 'ignore-loader',
        });
        return cfg;
      },
      redirects: async function redirects() {
        const rules = [];

        rules.push({
          source: '/download/:file*',
          destination: `https://files-${process.env.NEXT_PUBLIC_SITE_KEY}.badminton-calendar.com/:file*`,
          permanent: true,
        });

        return rules;
      },
    }),
  );
};
