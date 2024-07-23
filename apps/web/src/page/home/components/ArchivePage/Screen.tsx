'use client';

import React, { useLayoutEffect, useMemo, useState } from 'react';

import { Article, ArticleStatus, ArticleType } from '@baik/types';
import { useSetAtom } from 'jotai';
import { Session } from 'next-auth';

import { enEnabled } from '@/store';

import ArchiveSidebar from '../ArchiveSidebar';
import ArticleList from '../ArticleList';

interface ArchiveScreenProps {
  session: Session | null;
  articles: Article[];
  lang?: 'en' | 'ko';
}

export interface FilterType {
  type: ArticleType[];
  status: ArticleStatus[];
}

const ArchiveScreen = (props: ArchiveScreenProps) => {
  const { session, articles, lang } = props;
  const setEnEnabled = useSetAtom(enEnabled);

  const [filter, setFilter] = useState<FilterType>({
    type: ['post', 'shorts', 'clip'],
    status: session ? ['published', 'private', 'draft'] : ['published'],
  });

  useLayoutEffect(() => {
    setEnEnabled(true);
  }, []);

  const parsedArticles: Article[] = useMemo(() => {
    const filteredArticles = lang === 'ko' ? articles : articles.filter((article) => !!article.intl?.en);

    return filteredArticles.map((article) => {
      return {
        ...article,
        title: (lang === 'en' ? article.intl?.en?.title : article.title) ?? '',
        content: (lang === 'en' ? article.intl?.en?.content : article.content) ?? '',
      };
    });
  }, [articles, lang]);

  return (
    <div className="flex">
      <ArticleList articles={parsedArticles} session={session} filter={{ value: filter, set: setFilter }} />
      <ArchiveSidebar />
    </div>
  );
};

export default ArchiveScreen;
