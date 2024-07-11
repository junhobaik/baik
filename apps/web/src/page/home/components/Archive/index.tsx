'use server';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';

import ArchiveScreen from './Screen';

interface ArchiveProps {
  session: Session | null;
}

const fetchArticles = async (session: Session | null) => {
  let articles: Article[];

  if (session) {
    const res = await api.server.archive.getAllArticles();
    articles = res.data?.items ?? [];
  } else {
    const res = await api.server.archive.getAllArticlesPublic();
    articles = res.data?.items ?? [];
  }

  return articles;
};

const Archive = async (props: ArchiveProps) => {
  const { session } = props;
  const articles = await fetchArticles(session);

  return <ArchiveScreen session={session} articles={articles} />;
};

export default Archive;
