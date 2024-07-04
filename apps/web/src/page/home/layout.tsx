import type { Metadata } from 'next';

import '@/styles/globals.css';

import { Providers } from './providers';

import '@junhobaik/ui/css';

export const metadata: Metadata = {
  title: 'my-archive',
  description: 'my-archive',
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  return (
    <html lang="kr" className="light">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
