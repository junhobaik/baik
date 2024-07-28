'use server';

import React from 'react';

import { headers } from 'next/headers';

import { auth } from '@/auth';

// import ArchivePage from './components/ArchivePage';

const Home = async (props: any) => {
  const session = await auth();
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname === '/en' ? 'en' : 'ko';

  return <div>home</div>;
};

export default Home;
