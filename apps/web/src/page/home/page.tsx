'use server';

import React from 'react';

import Link from 'next/link';

import { Button } from '@nextui-org/react';

import { auth } from '@/auth';

const Home = async (props: any) => {
  const session = await auth();

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Link href="/archive">
        <Button size="lg" color="primary">
          Go to Archive(Blog)
        </Button>
      </Link>
    </div>
  );
};

export default Home;
