import { notFound } from 'next/navigation';
import './globals.css';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import Script from 'next/script';
import { UserContextProvider } from 'components/UserContext';
import { League_Spartan } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import {
  getTranslations,
  getMessages,
  setRequestLocale,
} from 'next-intl/server';
import i18nConfig from '../../i18nConfig.js';

import path from 'path';
import fs from 'fs';

interface Props {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations('All');
  const currentYear = process.env.NEXT_PUBLIC_CURRENT_YEAR;

  const configPath = path.join(process.cwd(), `_db/${process.env.NEXT_PUBLIC_SITE_KEY}/config.json`);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const { locales } = i18nConfig;

  const { locale } = await params;
  const currentLocale = locale || 'en';

  // Helper function to create language alternates
  const createLanguageAlternates = (path: string = '') => {
    const languages: { [key: string]: string } = {};

    locales.forEach((locale: string) => {
      // For the default locale (assuming it's 'en'), don't add the locale prefix
      const localePath = locale === 'en' ? path : `/${locale}${path}`;
      languages[locale] = `https://${config.url}${localePath}`;
    });

    languages['x-default'] = `https://${config.url}`;

    return languages;
  };

  let ogDescription = t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.description`, {
    year: currentYear,
  });

  // Truncate if it exceeds 65 characters
  if (ogDescription.length > 65) {
    ogDescription = `${ogDescription.slice(0, 62)}...`;
  }

  // Generate canonical URL based on current locale
  const canonicalPath = currentLocale === 'en' ? '' : `/${currentLocale}`;
  const canonical = `https://${config.url}${canonicalPath}`;

  return {
    title: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.title`, {
      year: currentYear,
    }),
    description: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.description`, {
      year: currentYear,
    }),
    keywords: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.keywords`, {
      year: currentYear,
    }),
    alternates: {
      canonical,
      languages: createLanguageAlternates(),
    },
    manifest: '/manifest.json',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@badmintoncal',
      images: [`https://${config.url}/share.png`],
    },
    openGraph: {
      title: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.title`, {
        year: currentYear,
      }),
      description: ogDescription,
      url: `https://${config.url}/`,
      siteName: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.title`, {
        year: currentYear,
      }),
      images: [`https://${config.url}/share.png`],
      type: 'website',
    },
    appleWebApp: {
      title: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.title`, {
        year: currentYear,
      }),
      statusBarStyle: 'black-translucent',
      capable: true,
    },
    other: {
      'twitter:site': '@badmintoncal',
    },
  };
}

const leagueSpartan = League_Spartan({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-league-spartan',
});

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale as any)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <PlausibleProvider>
      <UserContextProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <html lang={locale} className={leagueSpartan.className} suppressHydrationWarning>
            <head>
              <PlausibleProvider
                domain={process.env.NEXT_PUBLIC_PLAUSIBLE_KEY}
              />

              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=5"
              />

              <meta name="msapplication-TileColor" content="#000000" />
              <meta name="theme-color" content="#03120f" />
              <meta name="format-detection" content="telephone=no" />
              <meta name="mobile-web-app-capable" content="yes" />

              {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
                <meta
                  name="google-site-verification"
                  content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
                />
              )}
            </head>
            <body>{children}</body>
          </html>
        </NextIntlClientProvider>
      </UserContextProvider>
    </PlausibleProvider>
  );
}
