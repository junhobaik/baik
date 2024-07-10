'use server';

import React from 'react';

import { notFound } from 'next/navigation';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';

import ArticleScreen from './Screen';

const fetchArticle = async (pathname: string, session: Session | null) => {
  let item: Article | undefined;

  if (session) {
    const res = await api.server.archive.getArticleByPathname({ pathname });
    item = res.data?.item;
  } else {
    const res = await api.server.archive.getArticleByPathnamePublic({ pathname });
    item = res.data?.item;
  }

  if (!item) return notFound();
  return item;
};

const ArchiveArticlePage = async ({ params }: { params: { pathname: string } }) => {
  const session = await auth();

  const article = await fetchArticle(params.pathname, session);

  return <ArticleScreen session={session} article={article} />;
};

export default ArchiveArticlePage;
