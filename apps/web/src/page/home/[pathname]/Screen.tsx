'use client';

import React, { useEffect } from 'react';

import { Article } from '@baik/types';
import { useAtom } from 'jotai';
import { Session } from 'next-auth';

import MDContent from '@/components/MDContent';
import { enEnabled } from '@/store';

import ArchiveHeader from '../components/ArchiveHeader';

interface ArticleScreenProps {
  session: Session | null;
  article: Article;
  lang?: 'en' | 'ko';
}

const ArticleScreen = (props: ArticleScreenProps) => {
  const { session, article, lang = 'ko' } = props;
  const [headerEnEnabled, setHeaderEnEnabled] = useAtom(enEnabled);

  useEffect(() => {
    setHeaderEnEnabled(!!article.intl?.en);
  }, [article]);

  return (
    <div>
      {session ? <ArchiveHeader lang={lang} /> : null}
      <div className="flex flex-col max-w-[720px] mx-auto py-4">
        <p className="text-3xl">{article.title}</p>
        <MDContent content={article.content} codeBlockType="sandpack" />
      </div>
    </div>
  );
};

export default ArticleScreen;
