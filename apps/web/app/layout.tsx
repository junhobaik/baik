import { Metadata, Viewport } from 'next';

import { HomeLayout } from '@/page';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'baik',
  description: '',
};

export default HomeLayout;
