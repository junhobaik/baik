// sort-imports-ignore
import type { Metadata, Viewport } from 'next';

import { auth } from '@/auth';
import localFont from 'next/font/local';

import Sidebar from '../../components/Sidebar';

import { Providers } from './components/providers';
import { Registries } from './components/registries';
import { Toaster } from 'react-hot-toast';

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

RootLayout.metadata = metadata;
RootLayout.viewport = viewport;

export default RootLayout;
