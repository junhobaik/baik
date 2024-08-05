'use server';

import React from 'react';

import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Article } from '@baik/types';
import { type Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';
import { markdownToPlainText } from '@/utils';

import ArticleScreen from './components/Screen';

const ArchiveArticlePage = async ({ params }: { params: { pathname: string } }) => {
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname.startsWith('/archive/en/') ? 'en' : 'ko';

  const session = await auth();

  const fetchArticle = async (pathname: string, session: Session | null) => {
    let item: Article | undefined;

    if (session) {
      const res = await api.server.archive.getArticleByPathname({ pathname });
      item = res.data?.item;
    } else {
      const res = await api.server.archive.getArticleByPathnamePublic({ pathname });
      item = res.data?.item;
    }

    if (!item) return notFound();
    if (lang === 'en' && !item.intl?.en) return notFound();

    return item;
  };

  const article = await fetchArticle(params.pathname, session);
  const title = (lang === 'en' ? article.intl?.en?.title : article.title) ?? '';
  const content = (lang === 'en' ? article.intl?.en?.content : article.content) ?? '';
  const plainContent = markdownToPlainText(content);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    articleBody: plainContent,
    datePublished: new Date(article.published_date).toISOString(),
    dateModified: new Date(article.updated_date).toISOString(),
    author: {
      '@type': 'Person',
      name: 'Junho Baik',
    },
    keywords: article.keywords || [],
    image: article.thumbnail_img_url || '',
  };

  const parsedArticle = {
    ...article,
    title,
    content,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ArticleScreen article={parsedArticle} />
    </>
  );
};

export default ArchiveArticlePage;
