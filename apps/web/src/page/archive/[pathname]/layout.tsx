import React from 'react';

import { headers } from 'next/headers';

import { Article } from '@baik/types';
import type { Metadata } from 'next';

import api from '@/api';
import { auth } from '@/auth';
import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

type Props = {
  params: { pathname: string };
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const session = await auth();
  const headersList = headers();
  const headerPathname = headersList.get('x-pathname') || '';

  const lang = headerPathname.startsWith('/archive/en/') ? 'en' : 'ko';

  let res, item: Article | undefined;

  if (session) {
    res = await api.server.archive.getArticleByPathname({ pathname: params.pathname });
    item = res.data?.item;
  } else {
    res = await api.server.archive.getPublishedArticleByPathname({ pathname: params.pathname });
    item = res.data?.item;
  }

  const title = {
    default: lang === 'en' ? item?.intl?.en?.title : item?.title,
    en: item?.intl?.en?.title,
    ko: item?.title,
  };
  const description = {
    default: lang === 'en' ? item?.intl?.en?.description : item?.description,
    en: item?.intl?.en?.description,
    ko: item?.description,
  };
  const content = {
    default: markdownToPlainText((lang === 'en' ? item?.intl?.en?.content : item?.content) ?? ''),
    en: markdownToPlainText(item?.intl?.en?.content ?? ''),
    ko: markdownToPlainText(item?.content ?? ''),
  };

  const alternateUrls = {
    en: `${variables.SITE_URL}/archive/en/${params.pathname}`,
    ko: `${variables.SITE_URL}/archive/${params.pathname}`,
  };

  return {
    metadataBase: new URL(alternateUrls[lang]),
    title: title.default ? `${title.default}${variables.SITE_TITLE_SUFFIX}` : variables.SITE_TITLE,
    description: description.default || content.default.slice(0, 140) || '',
    alternates: {
      canonical: alternateUrls[lang],
      languages: {
        'en-US': alternateUrls.en,
        'ko-KR': alternateUrls.ko,
      },
    },
    openGraph: {
      title: {
        default: title.default ?? variables.SITE_TITLE,
        template: `%s${variables.SITE_TITLE_SUFFIX}`,
        absolute: title.default ? `${title.default}${variables.SITE_TITLE_SUFFIX}` : variables.SITE_TITLE,
      },
      description: description.default || content.default.slice(0, 140) || '',
      url: alternateUrls[lang],
      siteName: variables.SITE_TITLE,
      images: item?.thumbnail_img_url ? [{ url: item.thumbnail_img_url }] : [],
      locale: lang === 'en' ? 'en_US' : 'ko_KR',
      type: 'article',
    },
  };
};

const ArticleLayout = async ({ children }: { children: React.ReactNode; params: { pathname: string } }) => {
  return children;
};

ArticleLayout.generateMetadata = generateMetadata;

export default ArticleLayout;
