import type { Metadata, Viewport } from 'next';

import { auth } from '@/auth';
import '@/styles/globals.css';

import Sidebar from '../../components/Sidebar';
import { Providers } from './components/providers';
import { Registries } from './components/registries';

import '@junhobaik/ui/css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'my-archive',
  description: 'my-archive',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  if (!session)
    return (
      <html lang="kr" className="light">
        <body>
          <Providers>
            <Registries>{children}</Registries>
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
              <Sidebar />
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
