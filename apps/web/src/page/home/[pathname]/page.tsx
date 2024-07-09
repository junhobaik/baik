'use server';

import React from 'react';

import { notFound } from 'next/navigation';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';

const fetchArticle = async (pathname: string, session: Session | null) => {
  let item: Article | undefined;

  if (session) {
    const res = await api.server.archive.getArticlesByPathname({ pathname });
    item = res.data?.item;
  } else {
    const res = await api.server.archive.getArticlesByPathnamePublic({ pathname });
    item = res.data?.item;
  }

  if (!item) return notFound();
  return item;
};

const ArchiveArticlePage = async ({ params }: { params: { pathname: string } }) => {
  const session = await auth();

  const articles = await fetchArticle(params.pathname, session);

  return <div>{params.pathname}</div>;
};

export default ArchiveArticlePage;
