'use client';

import React from 'react';

import { Button } from '@nextui-org/react';
import { getSession, signIn, signOut } from 'next-auth/react';

const AuthTest = () => {
  const handleSignIn = () => {
    signIn();
  };

  return (
    <div className="p-4">
      <p className="ml-2 text-lg text-bold">Auth Test</p>
      <Button
        className="m-2"
        onClick={() => {
          handleSignIn();
        }}
      >
        SignIn
      </Button>

      <Button
        className="m-2"
        onClick={() => {
          signOut();
        }}
      >
        SignOut
      </Button>

      <Button
        className="m-2"
        onClick={async () => {
          const session = await getSession();
          console.log(session);
        }}
      >
        getSession
      </Button>
    </div>
  );
};

export default AuthTest;
