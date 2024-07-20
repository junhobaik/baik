'use client';

import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

interface ArchiveScreenProps {
  session: Session | null;
  articles: Article[];
  lang?: 'en' | 'ko';
}

const ArchiveScreen = (props: ArchiveScreenProps) => {
  const { session, articles, lang } = props;

  const parsedArticles = useMemo(() => {
    const filteredArticles = lang === 'ko' ? articles : articles.filter((article) => !!article.intl?.en);

    return filteredArticles.map((article) => {
      return {
        ...article,
        title: lang === 'en' ? article.intl?.en?.title : article.title,
        content: lang === 'en' ? article.intl?.en?.content : article.content,
      };
    });
  }, [articles, lang]);

  const articlesList = parsedArticles.map((article) => {
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
