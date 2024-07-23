import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Article, ArticleType } from '@baik/types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Session } from 'next-auth';
import styled from 'styled-components';

import { variables } from '@/configs';
import { markdownToPlainText } from '@/utils';

import { FilterType } from '../ArchivePage/Screen';

interface ArticleListProps {
  session: Session | null;
  articles: Article[];
  filter: { value: FilterType; set: Dispatch<SetStateAction<FilterType>> };
}

const Chip = ({ type }: { type: ArticleType }) => {
  return (
    <div
      className={clsx([
        'inline-flex px-2 py-[2px] text-xs rounded-lg select-none',
        type === 'post' && 'bg-blue-500 text-white',
        type === 'shorts' && 'bg-rose-400 text-white',
        type === 'clip' && 'bg-green-500 text-white',
      ])}
    >
      {type === 'post' && 'Post'}
      {type === 'shorts' && 'Shorts'}
      {type === 'clip' && 'Clip'}
    </div>
  );
};

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

  const renderArticleContent = useCallback(
    (article: Article) => {
      const plainContent = markdownToPlainText(article.content);
      const date = dayjs(article.updated_date).format('YYYY.MM.DD');
      const path =
        article.type === 'clip' ? article.url : `${pathname}${pathname.endsWith('/') ? '' : '/'}${article.pathname}`;

      const faviconUrl = article.site?.favicon_url;

      return (
        <ArticleItem key={`article-list-item-${article.id}`} className="">
          <div className="flex justify-between py-6">
            <div className="py-1 w-full">
              <div className="flex items-center max-h-6">
                <Chip type={article.type} />
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
                  {article.type === 'clip' && article.title !== article.origin_title ? (
                    <p className="text-sm text-gray-500">[Original title] {article.origin_title}</p>
                  ) : null}

                  <p className="mt-2 line-clamp-1 text-sm text-gray-500 font-light w-full">{plainContent}</p>
                </Link>

                <div className="mt-4 flex text-sm font-light text-gray-600">
                  <p>{date}</p>
                  <span className="mx-1 text-gray-400">|</span>

                  {article.site?.title ? (
                    <Link href={article.site.link} target="_blank" className="flex items-center hover:text-blue-700">
                      {!!faviconUrl && <img src={faviconUrl} alt="" className="w-4 h-4 mr-1" />}
                      <p>{article.site?.title}</p>
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
                    'min-w-40 w-40 aspect-[4/3] overflow-hidden flex justify-center items-center',
                  ])}
                >
                  <img
                    src={article.thumbnail_img_url}
                    alt={article.title}
                    className="min-w-40 w-40 aspect-[4/3] object-cover"
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
    <div className="pt-8">
      <div className="sticky top-16 z-10 border border-dotted h-12 bg-white"></div>
      <ul className="mt-2">{parsedArticles.map(renderArticleContent)}</ul>
    </div>
  );
};

const ArticleItem = styled.li`
  ._thumbnail > img {
    transform: scale(1);
    transition: transform 0.2s;
  }

  @media (hover: hover) {
    ._article-link:hover {
      ._title {
        color: #1671ef;
      }
    }
  }
`;

export default ArticleList;
