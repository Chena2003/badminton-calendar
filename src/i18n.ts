import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';
import { notFound } from 'next/navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  const locales = [
    'zh',
    'zh-HK',
    'en',
  ];

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    locale,
    onError(error) {
      //console.error(error);
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + ' is not yet translated';
      } else {
        return 'Dear developer, please fix this message: ' + path;
      }
    },
    messages: (await import(`../locales/${locale}/localization.json`)).default,
  };
});
