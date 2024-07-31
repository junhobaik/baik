'use server';

import React from 'react';

import { headers } from 'next/headers';

import { Article } from '@baik/types';
import { type Session } from 'next-auth';

import api from '@/api';
import { auth } from '@/auth';
import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

import ArchiveScreen from './components/ArchiveScreen';

const fetchArticles = async (session: Session | null) => {
  let articles: Article[];

  if (session) {
    const res = await api.server.archive.getAllArticles({ orderBy: 'updated_date' });
    articles = res.data?.items ?? [];
  } else {
    const res = await api.server.archive.getAllArticlesPublic({ orderBy: 'updated_date' });
    articles = res.data?.items ?? [];
  }

  return articles;
};

const ArchivePage = async () => {
  const session = await auth();
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';
  const lang = headerPathname === '/archive/en' ? 'en' : 'ko';

  const articles = await fetchArticles(session);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: variables.SITE_URL,
    name: variables.SITE_TITLE,
    description: variables.SITE_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: variables.MY_NAME,
    },
    publisher: {
      '@type': 'Person',
      name: variables.MY_NAME,
      // TODO: about, my-page 구현 후 수정
      url: variables.SITE_URL,
      // TODO: 프로필 이미지 기능 추가 후 추가
      // image: {
      //   '@type': 'ImageObject',
      //   url: 'https://.../profile-image.jpg',
      // },
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((article, index) => {
        const content = (lang === 'en' ? article.intl?.en?.content : article.content) ?? '';
        const plainContent = markdownToPlainText(content);

        return {
          '@type': 'BlogPosting',
          position: index + 1,
          url: article.type === 'clip' ? article.url : `https://yourblog.com/${article.pathname}`,
          headline: article.intl && lang === 'en' ? article.intl.en?.title : article.title,
          datePublished: new Date(article.published_date).toISOString(),
          dateModified: new Date(article.updated_date).toISOString(),
          author: {
            '@type': 'Person',
            name: variables.MY_NAME,
          },
          image: article.thumbnail_img_url ?? '',
          keywords: article.keywords,
          articleBody: plainContent,
        };
      }),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ArchiveScreen session={session} articles={articles} lang={lang} />
    </>
  );
};

export default ArchivePage;
