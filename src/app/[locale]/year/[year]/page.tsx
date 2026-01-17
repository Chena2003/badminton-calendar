import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import Layout from 'components/Layout/Layout';
import Card from 'components/Card/Card';
import OptionsBar from 'components/OptionsBar/OptionsBar';
import Races from 'components/Races/Races';
import path from 'path';
import fs from 'fs';

export interface Props {
  params: { year: string; locale: string };
}

export async function generateMetadata({
  params,
}: Omit<Props, 'children'>): Promise<Metadata> {
  const year = (await params).year;

  const t = await getTranslations('All');

  return {
    title: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.title`, { year: year }),
    description: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.description`, {
      year: year,
    }),
    keywords: t(`${process.env.NEXT_PUBLIC_SITE_KEY}.seo.keywords`, {
      year: year,
    }),
  };
}

export async function generateStaticParams(): Promise<{ year: string; locale: string }[]> {
  // We are not statically generating specific year pages at build time for now.
  // They will be generated on demand.
  return [];
}

export default async function Year({ params }: Props) {
  const { locale, year } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('All');

  const configPath = path.join(process.cwd(), `_db/${process.env.NEXT_PUBLIC_SITE_KEY}/config.json`);
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  let availableYears = config.availableYears;
  if (!availableYears.includes(parseInt(year))) {
    notFound();
  }

  const dataPath = path.join(process.cwd(), `_db/${process.env.NEXT_PUBLIC_SITE_KEY}/${year}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  if (data.races) {
    return (
      <Layout year={parseInt(year)} config={config} showCTABar={true}>
        <OptionsBar pickerShowing={false} />
        <Races year={parseInt(year)} races={data.races} config={config} />
      </Layout>
    );
  } else {
    return (
      <Layout year={parseInt(year)} config={config} showCTABar={false}>
        <h3 className="text-xl mb-4">
          Oops, unfortunately we dont go back that far yet.
        </h3>
        <Card>
          <p>
            Want to add more historical dates to F1 Calendar? Contribute
            previous seasons via our{' '}
            <a href="https://github.com/sportstimes/f1">GitHub repository</a>.
          </p>
        </Card>
      </Layout>
    );
  }
}
