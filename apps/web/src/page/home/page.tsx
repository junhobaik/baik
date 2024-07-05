'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@nextui-org/react';
import { getSession, signIn, signOut } from 'next-auth/react';

const Home = () => {
  const router = useRouter();
  const [signed, setSigned] = useState<null | boolean>(null);

  const fetchSigned = async () => {
    const session = await getSession();
    setSigned(!!session);
  };

  useEffect(() => {
    fetchSigned();
  }, []);

  return (
    <main className="w-full h-screen flex flex-col justify-center items-center">
      <div className="p-4">
        {signed === false ? (
          <Button
            color="secondary"
            onClick={() => {
              signIn();
            }}
          >
            Sign In
          </Button>
        ) : null}

        {signed === true ? (
          <Button
            color="danger"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </Button>
        ) : null}

        {signed === null ? <Button color="warning" isLoading></Button> : null}
      </div>

      <Button
        color="primary"
        onClick={() => {
          router.push('/admin');
        }}
      >
        /admin
      </Button>

      <div className="p-1"></div>

      <Button
        color="primary"
        onClick={() => {
          router.push('/test');
        }}
      >
        /test
      </Button>
    </main>
  );
};

export default Home;
