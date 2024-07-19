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

  const articlesList = articles.map((article) => {
    if (article.type === 'clip') {
      <Link href={`/${article.url}`} key={article.id}>
        <li key={`article-${article.id}`}>{article.title}</li>
      </Link>;
    }

    return (
      <Link href={`/${article.pathname}`} key={article.id}>
        <li key={`article-${article.id}`}>{article.title}</li>
      </Link>
    );
  });

  return (
    <div>
      <ul>{articlesList}</ul>
    </div>
  );
};

export default ArchiveScreen;
