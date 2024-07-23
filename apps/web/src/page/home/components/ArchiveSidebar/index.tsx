import React, { useMemo } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Article } from '@baik/types';

interface ArchiveSidebarProps {
  articles: Article[];
}

const ArchiveSidebar = (props: ArchiveSidebarProps) => {
  const { articles } = props;
  const pathname = usePathname();

  const filteredPosts = useMemo(() => {
    const posts = articles.filter((article) => article.type === 'post');
    return {
      recent: posts.slice(0, 10),
      recommended: posts.filter((article) => article.is_recommended).slice(0, 10),
    };
  }, [articles]);

  return (
    <div className="hidden lg:!flex min-w-80 ml-8 pl-4 mt-8 border-l">
      <div className="flex-grow">
        <p className="text-sm text-gray-500 mb-2">Recent Posts</p>
        {filteredPosts.recent.map((article) => {
          return (
            <Link href={`${pathname}${pathname.endsWith('/') ? '' : '/'}${article.pathname}`}>
              <p key={`recent-article-item-${article.id}`} className="py-1 text-gray-800 hover:text-blue-500">
                {article.title}
              </p>
            </Link>
          );
        })}

        <p className="text-sm text-gray-500 mb-2 mt-12">Recommended Posts</p>
        {filteredPosts.recommended.map((article) => {
          return (
            <Link href={`${pathname}${pathname.endsWith('/') ? '' : '/'}${article.pathname}`}>
              <p key={`recent-article-item-${article.id}`} className="py-1 text-gray-800 hover:text-blue-500">
                {article.title}
              </p>
            </Link>
          );
        })}
        {!filteredPosts.recommended.length && <p className="text-gray-400 text-xs font-light">Empty</p>}

        <p className="text-sm text-gray-500 mb-2 mt-16">Tags</p>
        <p className="text-gray-400 text-xs font-light">Empty</p>
      </div>
    </div>
  );
};

export default ArchiveSidebar;
