import { ImageResponse } from 'next/og';

import api from '@/api';
import OpenGraphImage from '@/components/ArticleOpenGraphImage';

const runtime = 'edge';

const alt = "Article - Baik's archive";

const size = {
  width: 1200,
  height: 630,
};

const contentType = 'image/png';

export const ImageKo = async ({ params }: { params: { pathname: string } }) => {
  const article = await api.server.archive.getPublishedArticleByPathname({ pathname: params.pathname });
  const title = article.data?.item?.title ?? '';

  return new ImageResponse(<OpenGraphImage title={title} thumbnail_img_url={article.data?.item.thumbnail_img_url} />, {
    ...size,
  });
};

ImageKo.runtime = runtime;
ImageKo.alt = alt;
ImageKo.contentType = contentType;

export const ImageEn = async ({ params }: { params: { pathname: string } }) => {
  const article = await api.server.archive.getPublishedArticleByPathname({ pathname: params.pathname });
  const title = article.data?.item?.intl?.en?.title ?? '';

  return new ImageResponse(<OpenGraphImage title={title} thumbnail_img_url={article.data?.item.thumbnail_img_url} />, {
    ...size,
  });
};

ImageEn.runtime = runtime;
ImageEn.alt = alt;
ImageEn.contentType = contentType;
