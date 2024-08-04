// sort-imports-ignore

import type { Metadata } from 'next';

import '@junhobaik/ui/css';
import '@/styles/globals.css';

import { variables } from '@/configs';
import { headers } from 'next/headers';
import ArchiveHeader from './components/ArchiveHeader';
import ArchiveFooter from './components/ArchiveFooter';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname.startsWith('/archive/en') ? 'en' : 'ko';

  const title = {
    en: variables.ARCHIVE_TITLE_EN,
    ko: variables.ARCHIVE_TITLE,
  };

  const description = {
    en: variables.ARCHIVE_DESCRIPTION_EN,
    ko: variables.ARCHIVE_DESCRIPTION,
  };

  const url = {
    en: variables.ARCHIVE_URL_EN,
    ko: variables.ARCHIVE_URL,
  };

  return {
    title: title[lang],
    description: description[lang],
    openGraph: {
      title: title[lang],
      description: description[lang],
      url: url[lang],
      siteName: variables.SITE_TITLE,
      locale: lang === 'en' ? 'en_US' : 'ko_KR',
      type: 'website',
    },
    alternates: {
      canonical: url[lang],
      languages: {
        'en-US': url.en,
        'ko-KR': url.ko,
      },
    },
  };
}
const ArchiveLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname.startsWith('/archive/en') ? 'en' : 'ko';

  return (
    <>
      <ArchiveHeader lang={lang} />
      <main className="w-[92%] xl:max-w-[1280px] min-h-[calc(100vh-134px)] mx-auto">{children}</main>
      <ArchiveFooter />
    </>
  );
};

ArchiveLayout.generateMetadata = generateMetadata;

export default ArchiveLayout;
