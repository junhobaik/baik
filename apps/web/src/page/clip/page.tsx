'use server';

import React from 'react';

import { Session } from 'next-auth';

import ClipScreen from './Screen';

const ClipPage = async (props: { session: Session }) => {
  const { session } = props;

  return <ClipScreen session={session} />;
};

export default ClipPage;
