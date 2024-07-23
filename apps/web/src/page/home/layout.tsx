// sort-imports-ignore
import type { Metadata, Viewport } from 'next';

import { auth } from '@/auth';
import localFont from 'next/font/local';

import Sidebar from '../../components/Sidebar';
import ArchiveFooter from './components/ArchiveFooter';
import ArchiveHeader from './components/ArchiveHeader';
import { Providers } from './components/providers';
import { Registries } from './components/registries';

import '@junhobaik/ui/css';
import '@/styles/globals.css';

import { variables } from '@/configs';
import { headers } from 'next/headers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: variables.SITE_TITLE,
  description: variables.SITE_DESCRIPTION,
};

const fontPretendard = localFont({
  src: '../../../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  variable: '--font-pretendard',
});

const nonArchivePaths = ['/admin', '/write'];

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname === '/en' ? 'en' : 'ko';

  const isArchive = !headerPathname.startsWith('/admin') && !headerPathname.startsWith('/write');

  if (!session)
    return (
      <html lang={lang} className="light">
        <body className={fontPretendard.className}>
          <Providers>
            <Registries>
              <ArchiveHeader lang={lang} />
              <main className="w-[92%] xl:max-w-[1280px] min-h-screen mx-auto">{children}</main>
              <ArchiveFooter />
            </Registries>
          </Providers>
        </body>
      </html>
    );

  return (
    <html lang={lang} className="light min-h-full h-full">
      <body className="min-h-full h-full">
        <Providers>
          <Registries>
            {isArchive ? (
              <div className="flex">
                <Sidebar session={session} />
                <div className='flex-grow h-screen overflow-scroll'>
                  <ArchiveHeader lang={lang} />
                  <main className="w-[92%] xl:max-w-[1280px] min-h-screen mx-auto">{children}</main>
                  <ArchiveFooter />
                </div>
              </div>
            ) : (
              <main className="fixed top-0 left-0 flex flex-1 h-screen w-screen overflow-hidden">
                <Sidebar session={session} />
                <div className="flex-1 bg-[#F7F9FC] overflow-y-auto">{children}</div>
              </main>
            )}
          </Registries>
        </Providers>
      </body>
    </html>
  );
};

RootLayout.metadata = metadata;
RootLayout.viewport = viewport;

export default RootLayout;
