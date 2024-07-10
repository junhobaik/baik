'use client';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import MDContent from '@/components/MDContent';

interface ArticleScreenProps {
  session: Session | null;
  article: Article;
}

const ArticleScreen = (props: ArticleScreenProps) => {
  const { session, article } = props;

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
