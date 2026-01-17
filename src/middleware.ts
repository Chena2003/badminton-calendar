import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: [
    "zh",
    "zh-HK",
    "en"
  ],

  // Used when no locale matches
  defaultLocale: 'zh',
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|robots.txt|workbox-\\w+\\.js|sw.js|.*\\..*).*)']
};