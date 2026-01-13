import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Layout from 'components/Layout/Layout';
import OptionsBar from 'components/OptionsBar/OptionsBar';
import Races from 'components/Races/Races';
import i18nConfig from '../../i18nConfig.js';

export async function generateStaticParams(): Promise<{ locale: string }[]> {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const currentYear = Number(process.env.NEXT_PUBLIC_CURRENT_YEAR);
  const year = require(
    `/_db/${process.env.NEXT_PUBLIC_SITE_KEY}/${currentYear}.json`,
  );
  const config = require(
    `/_db/${process.env.NEXT_PUBLIC_SITE_KEY}/config.json`,
  );

  const currentTime = new Date();

  return (
    <>
      <Layout showCTABar={true} year={currentYear} config={config}>
        <OptionsBar />
        <Races year={currentYear} races={year.races} config={config} />
      </Layout>
    </>
  );
}

export const revalidate = 3600;
