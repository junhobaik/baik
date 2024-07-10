import React from 'react';

import type { Metadata } from 'next';

import api from '@/api';
import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

type Props = {
  params: { pathname: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const res = await api.server.archive.getArticleByPathname({ pathname: params.pathname });
  const item = res.data?.item;

  const content = markdownToPlainText(item.content ?? '');

  return {
    title: item?.title ? `${item.title} - Baik` : `Baik's archive`,
    description: content.slice(0, 140) ?? '',
    alternates: {
      canonical: `${variables.SITE_URL}/${item.pathname}`,
    },
    openGraph: {
      images: item?.thumbnail_img_url ?? '',
    },
  };
};

const ArticleLayout = async ({ children, params }: { children: React.ReactNode; params: { pathname: string } }) => {
  return <>{children}</>;
};

ArticleLayout.generateMetadata = generateMetadata;

export default ArticleLayout;
