// sort-imports-ignore
import type { Metadata, Viewport } from 'next';

import { auth } from '@/auth';

import Sidebar from '../../components/Sidebar';
import ArchiveFooter from './components/ArchiveFooter';
import ArchiveHeader from './components/ArchiveHeader';
import { Providers } from './components/providers';
import { Registries } from './components/registries';

import '@junhobaik/ui/css';
import '@/styles/globals.css';
import { variables } from '@/configs';

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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session)
    return (
      <html lang="kr" className="light min-h-full h-full">
        <body className="min-h-full h-full">
          <Providers>
            <Registries>
              <ArchiveHeader />
              <main className="w-[1200px] mx-auto">{children}</main>
              <ArchiveFooter />
            </Registries>
          </Providers>
        </body>
      </html>
    );

  return (
    <html lang="kr" className="light min-h-full h-full">
      <body className="min-h-full h-full">
        <Providers>
          <Registries>
            <main className="fixed top-0 left-0 flex flex-1 h-screen w-screen overflow-hidden">
              <Sidebar session={session} />
              <div className="flex-1 bg-[#F7F9FC] overflow-y-auto">{children}</div>
            </main>
          </Registries>
        </Providers>
      </body>
    </html>
  );
};

RootLayout.metadata = metadata;
RootLayout.viewport = viewport;

export default RootLayout;
