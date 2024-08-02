// sort-imports-ignore
import type { Metadata } from 'next';

import '@junhobaik/ui/css';
import '@/styles/globals.css';

import { variables } from '@/configs';
import { headers } from 'next/headers';
import ArchiveHeader from './components/ArchiveHeader';
import ArchiveFooter from './components/ArchiveFooter';

export const metadata: Metadata = {
  title: variables.SITE_TITLE,
  description: variables.SITE_DESCRIPTION,
};

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

ArchiveLayout.metadata = metadata;

export default ArchiveLayout;
