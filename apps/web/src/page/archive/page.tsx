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

  const url = {
    en: variables.ARCHIVE_URL_EN,
    ko: variables.ARCHIVE_URL,
  };

  const title = {
    en: variables.ARCHIVE_TITLE_EN,
    ko: variables.ARCHIVE_TITLE,
  };

  const description = {
    en: variables.ARCHIVE_DESCRIPTION_EN,
    ko: variables.ARCHIVE_DESCRIPTION,
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    url: url[lang],
    name: title[lang],
    description: description[lang],
    author: {
      '@type': 'Person',
      name: variables.MY_NAME,
    },
    publisher: {
      '@type': 'Person',
      name: variables.MY_NAME,
      url: variables.SITE_URL,
      image: {
        '@type': 'ImageObject',
        url: 'https://d25sqaee97ji3k.cloudfront.net/0816bcfe-3f37-4982-90a8-e825ba5663a8.png',
      },
    },
    blogPost: articles
      .map((article) => {
        if (article.type === 'clip') return null;
        if (lang === 'en' && !article.intl?.en) return null;

        const articleTitle = article.intl && lang === 'en' ? article.intl.en?.title : article.title;
        const content = (lang === 'en' ? article.intl?.en?.content : article.content) ?? '';
        const plainContent = markdownToPlainText(content);
        const articleDescription = (lang === 'en' ? article.intl?.en?.description : article.description) ?? '';
        const articleUrl = `${variables.SITE_URL}/archive${lang === 'en' ? '/en' : ''}/${article.pathname}`;

        return {
          '@type': 'BlogPosting',
          url: articleUrl,
          headline: articleTitle,
          datePublished: new Date(article.published_date).toISOString(),
          dateModified: new Date(article.updated_date).toISOString(),
          author: {
            '@type': 'Person',
            name: variables.MY_NAME,
          },
          image: article.thumbnail_img_url ? [article.thumbnail_img_url] : undefined,
          keywords: article.keywords,
          abstract: articleDescription,
          articleBody: plainContent,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ArchiveScreen session={session} articles={articles} lang={lang} />
    </>
  );
};

export default ArchivePage;
