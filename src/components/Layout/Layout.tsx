import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';
import TopBar from 'components/TopBar/TopBar';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

type Props = PropsWithChildren<{
  showCTABar: boolean;
  year: number;
  config: any;
}>;

const Layout: FunctionComponent<Props> = ({
  showCTABar,
  children,
  year,
  config,
}: Props) => {
  const t = useTranslations('All');

  return (
    <>
      <noscript>
        <div className="noscript">{t('javascript')}</div>
      </noscript>

      <TopBar />

      <Header showCTABar={showCTABar} year={year} />

      <div className="max-w-screen-lg mx-auto font-sans px-2">{children}</div>

      <Footer config={config} />
    </>
  );
};

export default Layout;
