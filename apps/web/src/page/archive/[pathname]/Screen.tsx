'use client';

import React, { useEffect } from 'react';

import { Article } from '@baik/types';
import { useAtom } from 'jotai';

import MDContent from '@/components/MDContent';
import { enEnabled } from '@/store';

interface ArticleScreenProps {
  article: Article;
}

const ArticleScreen = (props: ArticleScreenProps) => {
  const { article } = props;
  const [, setHeaderEnEnabled] = useAtom(enEnabled);

  useEffect(() => {
    setHeaderEnEnabled(!!article.intl?.en);
  }, [article]);

  return (
    <div>
      <div className="flex flex-col max-w-[720px] mx-auto py-4">
        <p className="text-3xl">{article.title}</p>
        <MDContent content={article.content} codeBlockType="sandpack" />
      </div>
    </div>
  );
};

export default ArticleScreen;
