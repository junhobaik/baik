'use client';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

interface ArticleScreenProps {
  session: Session | null;
  article: Article;
}

const ArticleScreen = (props: ArticleScreenProps) => {
  const { session, article } = props;
  console.log('ArticleScreen', props);

  return (
    <div>
      <p>{article.title}</p>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleScreen;
