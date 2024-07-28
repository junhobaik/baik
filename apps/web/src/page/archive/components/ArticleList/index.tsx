import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Article, ArticleType } from '@baik/types';
import { IconBroadcast, IconFilter, IconLock, IconPencil } from '@tabler/icons-react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Session } from 'next-auth';
import styled from 'styled-components';

import TypeChip from '@/components/TypeChip';
import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

import { FilterType } from '../ArchiveScreen';

interface ArticleListProps {
  session: Session | null;
  articles: Article[];
  filter: { value: FilterType; set: Dispatch<SetStateAction<FilterType>> };
}

const ArticleList = (props: ArticleListProps) => {
  const { session, articles, filter } = props;
  const pathname = usePathname();

  const parsedArticles = useMemo(() => {
    const { type, status } = filter.value;

    return articles.filter((article) => {
      if (!type.includes(article.type)) return false;
      if (!status.includes(article.status)) return false;
      return true;
    });
  }, [filter.value, articles]);

  const anchorMouseEnter = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const parent = e.currentTarget.parentNode?.parentNode?.parentNode as HTMLDivElement;
    const target = parent.querySelector('._thumbnail > img') as HTMLElement | null;
    if (target) target.style.transform = 'scale(1.1)';
  };

  const anchorMouseLeave = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const parent = e.currentTarget.parentNode?.parentNode?.parentNode as HTMLDivElement;
    const target = parent.querySelector('._thumbnail > img') as HTMLElement | null;
    if (target) target.style.transform = 'scale(1)';
  };

  const toggleFilterType = (targetType: ArticleType) => {
    filter.set((prev) => {
      let type = [...prev.type];

      if (type.includes(targetType)) {
        type = type.filter((t) => t !== targetType);
      } else {
        type = [...type, targetType];
      }
      return { ...prev, type };
    });
  };

  const renderArticleContent = useCallback(
    (article: Article) => {
      const plainContent = markdownToPlainText(article.content);
      const date = dayjs(article.updated_date).format('YYYY.MM.DD');
      const path =
        article.type === 'clip'
          ? article.url
          : `${pathname}${pathname.endsWith('/') ? '' : '/'}${article.pathname}`;

      const faviconUrl = article.site?.favicon_url;

      return (
        <ArticleItem key={`article-list-item-${article.id}`} $type={article.type} className="py-6">
          <div
            className={clsx([
              'flex justify-between',
              {
                'pl-4 border-l-4': !!session,
                'border-orange-400': !!session && article.status === 'draft',
                'border-transparent': !!session && article.status === 'published',
                'border-red-600': !!session && article.status === 'private',
              },
            ])}
          >
            <div className="py-1 w-full">
              <div className="flex items-center max-h-6">
                {session ? (
                  <>
                    {article.status === 'published' && (
                      <div className="mr-2">
                        <IconBroadcast size={18} className="text-green-600" />
                      </div>
                    )}
                    {article.status === 'private' && (
                      <div className="mr-2">
                        <IconLock size={18} className="text-red-600" />
                      </div>
                    )}
                    {article.status === 'draft' && (
                      <div className="mr-2">
                        <IconPencil size={18} className="text-orange-400" stroke={2} />
                      </div>
                    )}
                  </>
                ) : null}

                <TypeChip type={article.type} />
              </div>

              <div className="mt-2">
                <Link
                  className="_article-link"
                  href={path}
                  target={article.type === 'clip' ? '_blank' : '_self'}
                  onMouseEnter={anchorMouseEnter}
                  onMouseLeave={anchorMouseLeave}
                  rel={article.type === 'clip' ? 'noopener noreferrer' : ''}
                >
                  <p className={clsx(['_title', 'text-xl font-semibold w-full'])}>{article.title}</p>

                  <div className="mt-2">
                    {article.type === 'clip' && article.title !== article.origin_title ? (
                      <p className="text-sm text-gray-500 mb-1">{article.origin_title}</p>
                    ) : null}
                    <p className="line-clamp-1 text-sm text-gray-500 font-light w-full">{plainContent}</p>
                  </div>
                </Link>

                <div className="mt-4 flex text-sm font-light text-gray-600">
                  <p>{date}</p>
                  <span className="mx-1 text-gray-400">|</span>

                  {article.site?.title ? (
                    <Link href={article.site.link} target="_blank" className="flex items-center hover:text-green-800">
                      {!!faviconUrl && <img src={faviconUrl} alt="" className="w-4 h-4 mr-1" />}
                      <p className="font-normal line-clamp-1">{article.site?.title}</p>
                    </Link>
                  ) : (
                    <div className="flex items-center">
                      <p>{variables.MY_NAME}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4">
              {article.thumbnail_img_url ? (
                <div
                  className={clsx([
                    '_thumbnail',
                    'mt-7 overflow-hidden flex justify-center items-center rounded-lg',
                    'min-w-24 w-24 aspect-[4/3]',
                    'sm:min-w-40 sm:w-40 sm:aspect-[1.91/1]',
                  ])}
                >
                  <img
                    src={article.thumbnail_img_url}
                    alt={article.title}
                    className={clsx([
                      'border object-cover',
                      'min-w-24 w-24 aspect-[4/3]',
                      'sm:min-w-40 sm:w-40 sm:aspect-[1.91/1]',
                    ])}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </ArticleItem>
      );
    },
    [pathname],
  );

  return (
    <div className="pt-8 flex-grow">
      <div className="sticky top-16 z-10 border-b h-12 bg-white flex items-center">
        <div className="flex items-center">
          <IconFilter className="text-gray-500 mr-4" size={20} />

          <TypeChip
            type="post"
            className="mr-2 px-3 py-1 opacity-70 hover:opacity-100"
            disabled={!filter.value.type.includes('post')}
            onClick={() => toggleFilterType('post')}
          />
          <TypeChip
            type="shorts"
            className="mr-2 px-3 py-1 opacity-70 hover:opacity-100"
            disabled={!filter.value.type.includes('shorts')}
            onClick={() => toggleFilterType('shorts')}
          />
          <TypeChip
            type="clip"
            className="mr-2 px-3 py-1 opacity-70 hover:opacity-100"
            disabled={!filter.value.type.includes('clip')}
            onClick={() => toggleFilterType('clip')}
          />
        </div>
      </div>
      <div className="sticky top-28 z-10 h-8">
        <div className="bg-white h-2"></div>
        <div className="h-6 bg-gradient-to-b from-white to-transparent"></div>
      </div>
      <ul>{parsedArticles.map(renderArticleContent)}</ul>
    </div>
  );
};

const ArticleItem = styled.li<{ $type: ArticleType }>`
  ._thumbnail > img {
    transform: scale(1);
    transition: transform 0.2s;
  }

  @media (hover: hover) {
    ._article-link:hover {
      ._title {
        color: ${({ $type }) => {
          switch ($type) {
            case 'post':
              return '#2563eb';
            case 'shorts':
              return '#e11d48';
            case 'clip':
              return '#16a34a';
            default:
              return 'black';
          }
        }};
      }
    }
  }
`;

export default ArticleList;
