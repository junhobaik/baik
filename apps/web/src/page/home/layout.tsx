// sort-imports-ignore
import type { Metadata, Viewport } from 'next';

import { auth } from '@/auth';

import { headers } from 'next/headers';
import localFont from 'next/font/local';

import Sidebar from '../../components/Sidebar';
import { Providers } from './components/providers';
import { Registries } from './components/registries';

import { variables } from '@/configs';

import { Toaster } from 'react-hot-toast';
import { GoogleTagManager } from '@next/third-parties/google';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import '@junhobaik/ui/css';
import '@/styles/globals.css';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname === '/en' ? 'en' : 'ko';

  const title = {
    en: variables.SITE_TITLE,
    ko: variables.SITE_TITLE_EN,
  };

  const description = {
    en: variables.SITE_DESCRIPTION_EN,
    ko: variables.SITE_DESCRIPTION,
  };

  return {
    metadataBase: new URL(variables.SITE_URL),
    title: title[lang],
    description: description[lang],
    alternates: {
      canonical: `${variables.SITE_URL}${lang === 'en' ? '/en' : ''}`,
      languages: {
        'en-US': `${variables.SITE_URL}/en`,
        'ko-KR': `${variables.SITE_URL}`,
      },
    },
    openGraph: {
      title: title[lang],
      description: description[lang],
      url: `${variables.SITE_URL}${lang === 'en' ? '/en' : ''}`,
      siteName: title[lang],
      locale: lang === 'en' ? 'en_US' : 'ko_KR',
      type: 'website',
    },
  };
}

const fontPretendard = localFont({
  src: '../../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname === '/en' ? 'en' : 'ko';

  if (!session)
    return (
      <html lang={lang} className="light">
        {process.env.NODE_ENV !== 'development' && <GoogleTagManager gtmId="GTM-5XQJ5M9D" />}
        <body className={fontPretendard.className}>
          <Providers>
            <Registries>{children}</Registries>
          </Providers>
        </body>
      </html>
    );

  return (
    <html lang={lang} className="light min-h-full h-full">
      <body className="min-h-full h-full">
        <Providers>
          <Registries>
            <main className="fixed top-0 left-0 flex flex-1 h-screen w-screen overflow-hidden">
              <Sidebar session={session} />
              <div className="flex-1 overflow-y-auto">{children}</div>
            </main>

            <Toaster position="bottom-center" />
          </Registries>
        </Providers>
      </body>
    </html>
  );
};

RootLayout.generateMetadata = generateMetadata;
RootLayout.viewport = viewport;

export default RootLayout;
