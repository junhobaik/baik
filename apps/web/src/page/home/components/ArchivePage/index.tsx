'use server';

import React from 'react';

import { Article } from '@baik/types';
import { Session } from 'next-auth';

import api from '@/api';
import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

import ArchiveHeader from '../ArchiveHeader';
import ArchiveScreen from './Screen';

interface ArchiveProps {
  session: Session | null;
  lang: 'en' | 'ko';
}

const fetchArticles = async (session: Session | null) => {
  let articles: Article[];

  if (session) {
    const res = await api.server.archive.getAllArticles();
    articles = res.data?.items ?? [];
  } else {
    const res = await api.server.archive.getAllArticlesPublic();
    articles = res.data?.items ?? [];
  }

  return articles;
};

const ArchivePage = async (props: ArchiveProps) => {
  const { session, lang } = props;
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
      {session ? <ArchiveHeader lang={lang} /> : null}
      <ArchiveScreen session={session} articles={articles} lang={lang} />
    </>
  );
};

export default ArchivePage;
