'use server';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';

import Archive from './components/Archive';

const Home = async () => {
  const session = await auth();

  return <Archive session={session} />;
};

export default Home;
