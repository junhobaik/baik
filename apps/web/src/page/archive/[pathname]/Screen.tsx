'use client';

import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { Article } from '@baik/types';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';

import MDContent from '@/components/MDContent';
import TypeChip from '@/components/TypeChip';
import { enEnabled } from '@/store';

const DynamicComments = dynamic(() => import('./components/Comments'), { ssr: false });

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
      <div className="flex flex-col max-w-[720px] mx-auto pt-4 pb-24">
        {article.type === 'shorts' ? (
          <div className={'bg-purple-50 flex items-center px-2 rounded-lg mb-4 h-8'}>
            <TypeChip type="shorts" className="m-0" />
            <p className="text-sm ml-1 text-purple-500">
              <span className="inline sm:hidden">Simple and lightly written post.</span>
              <span className="hidden sm:inline">This content is simple and lightly written post.</span>
            </p>
          </div>
        ) : (
          <div className="min-h-12" />
        )}

        {!!article.thumbnail_img_url ? (
          <img
            src={article.thumbnail_img_url}
            alt=""
            className="w-full aspect-[1.91/1] object-cover rounded-2xl mb-6"
          />
        ) : null}

        <h1 className="text-3xl font-semibold text-gray-800 mb-8">{article.title}</h1>

        <div className="flex items-center justify-between mb-20">
          <p className="text-gray-600 py-1 px-2 bg-gray-100 rounded-lg">
            {dayjs(article.updated_date).format('YYYY.MM.DD')}
          </p>
        </div>

        <MDContent content={article.content} codeBlockType="sandpack" />

        <div className="comments-container mt-24 min-h-[296px]">
          <DynamicComments />
        </div>
      </div>
    </div>
  );
};

export default ArticleScreen;
