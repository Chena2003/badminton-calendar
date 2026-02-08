import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: [
    "en",
    "zh",
    "zh-HK"
  ],

  // Used when no locale matches
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  // Get browser language from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');

  // If user hasn't explicitly chosen a locale and we have browser language info
  if (acceptLanguage && !request.cookies.get('NEXT_LOCALE')) {
    const browserLang = acceptLanguage.split(',')[0].toLowerCase();

    // Map browser language to supported locales
    let detectedLocale = 'en'; // default fallback

    if (browserLang.startsWith('zh-hk') || browserLang.startsWith('zh-tw')) {
      detectedLocale = 'zh-HK';
    } else if (browserLang.startsWith('zh')) {
      detectedLocale = 'zh';
    } else if (browserLang.startsWith('en')) {
      detectedLocale = 'en';
    }

    // Create a new request with the detected locale
    const url = request.nextUrl.clone();
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = `/${detectedLocale}`;
      return Response.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|robots.txt|workbox-\\w+\\.js|sw.js|.*\\..*).*)']
};