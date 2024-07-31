'use client';

import React, { useLayoutEffect, useMemo, useState } from 'react';

import { Article, ArticleStatus, ArticleType } from '@baik/types';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { type Session } from 'next-auth';

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
  const { session, articles, lang = 'ko' } = props;
  const setEnEnabled = useSetAtom(enEnabled);

  const [filter, setFilter] = useState<FilterType>({
    type: ['post', 'shorts', 'clip'],
    status: session ? ['published', 'private', 'draft'] : ['published'],
  });

  useLayoutEffect(() => {
    setEnEnabled(true);
  }, []);

  const parsedArticles = useMemo(() => {
    const enFiltered = lang === 'ko' ? articles : articles.filter((article) => !!article.intl?.en);
    const parsedOrdered = enFiltered.map((article) => ({
      ...article,
      title: (lang === 'en' ? article.intl?.en?.title : article.title) ?? '',
      content: (lang === 'en' ? article.intl?.en?.content : article.content) ?? '',
    }));

    const filtered = parsedOrdered.filter((article) => {
      if (!filter.type.includes(article.type)) return false;
      if (!filter.status.includes(article.status)) return false;
      return true;
    });

    return {
      ordered: parsedOrdered,
      filtered: filtered,
    };
  }, [articles, lang, filter]);

  return (
    <div className={clsx(['flex', session ? 'w-[92%] max-w-[1280px] mx-auto' : ''])}>
      <ArticleList articles={parsedArticles.filtered} session={session} filter={{ value: filter, set: setFilter }} />
      <ArchiveSidebar articles={parsedArticles.ordered} />
    </div>
  );
};

export default ArchiveScreen;
