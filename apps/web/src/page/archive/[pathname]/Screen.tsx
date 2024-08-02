'use client';

import React, { useEffect } from 'react';

import { Article } from '@baik/types';
import dayjs from 'dayjs';
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
      <div className="flex flex-col max-w-[720px] mx-auto py-4 pb-24">
        {!!article.thumbnail_img_url && (
          <img
            src={article.thumbnail_img_url}
            alt=""
            className="w-full aspect-[1.91/1] object-cover rounded-2xl mb-6"
          />
        )}
        <p className="text-3xl font-semibold text-gray-800 mb-4">{article.title}</p>
        <p className="mb-12 text-gray-500">{dayjs(article.updated_date).format('YYYY.MM.DD')}</p>

        <MDContent content={article.content} codeBlockType="sandpack" />
      </div>
    </div>
  );
};

export default ArticleScreen;
