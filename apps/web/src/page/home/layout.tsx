import type { Metadata, Viewport } from 'next';

import '@/styles/globals.css';

import { Providers } from './providers';
import { Registries } from './registries';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className="light min-h-full h-full">
      <body className="min-h-full h-full">
        <Providers>
          <Registries>{children}</Registries>
        </Providers>
      </body>
    </html>
  );
}

RootLayout.metadata = metadata;
RootLayout.viewport = viewport;
