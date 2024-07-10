'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';

import { Article } from '@baik/types';
import { Button } from '@nextui-org/react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';

interface ArchiveScreenProps {
  session: Session | null;
  articles: Article[];
}

const ArchiveScreen = (props: ArchiveScreenProps) => {
  const { session, articles } = props;

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <div>
      {!session ? (
        <Button className="mr-1" onClick={() => signIn()}>
          Sign In
        </Button>
      ) : (
        <Button className="mr-1" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}

      <ul>
        {articles.map((article) => (
          <Link href={`/${article.pathname}`} key={article.id}>
            <li key={article.id}>{article.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default ArchiveScreen;
