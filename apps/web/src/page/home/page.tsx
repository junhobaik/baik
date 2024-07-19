'use server';

import React from 'react';

import { auth } from '@/auth';

import ArchivePage from './components/ArchivePage';

const Home = async () => {
  const session = await auth();

  return <ArchivePage session={session} />;
};

export default Home;
