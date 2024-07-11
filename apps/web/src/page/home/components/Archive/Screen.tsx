'use client';

import React, { useEffect } from 'react';

import Link from 'next/link';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

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
