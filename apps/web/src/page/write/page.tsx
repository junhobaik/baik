'use server';

import React from 'react';

import WriteScreen from './Screen';

interface WritePageProps {
  params: {};
  searchParams: { pathname?: string };
}

const WritePage = async (props: WritePageProps) => {
  return <WriteScreen />;
};

export default WritePage;
