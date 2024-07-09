'use server';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';

const fetchArticles = async (session: Session) => {
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

const ArchivePage = async (props: { session: Session }) => {
  const { session } = props;

  const articles = await fetchArticles(session);

  console.log('articles', articles);

  return <div></div>;
};

export default ArchivePage;
