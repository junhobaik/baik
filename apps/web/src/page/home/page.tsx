'use server';

import React from 'react';

import { auth } from '@/auth';

import HomeScreen from './Screen';

const Home = async (props: any) => {
  const session = await auth();

  return <HomeScreen session={session} />;
};

export default Home;
