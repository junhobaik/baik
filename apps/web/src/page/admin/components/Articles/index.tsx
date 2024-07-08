'use client';

import { useMemo, useState } from 'react';

import { Article } from '@baik/types';
import { Input } from '@nextui-org/react';

import useArticles from '@/hooks/useArticles';
import useSearchArticles from '@/hooks/useSearchArticles';

import ArticlesDataTable from './ArticlesDataTable';

const AdminArticles = () => {
  const { data, query } = useArticles();
  const [searchValue, setSearchValue] = useState('' as string);

  const { items: searchedItems } = useSearchArticles({ searchValue, hitsPerPage: 10 });
  const isSearching = searchValue.trim() !== '';

  const items = useMemo(() => {
    // @ts-ignore
    return isSearching ? (searchedItems as Article[]) : data;
  }, [isSearching, searchedItems, data]);

  return (
    <div className="h-screen flex flex-col overflow-hidden p-4">
      <div className="mb-4 flex justify-between">
        <div></div>
        <div className="w-1/3">
          <Input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            label="제목 또는 내용으로 검색"
            description="최대 10개의 가장 일치하는 항목만 표기됩니다."
            size="sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ArticlesDataTable
          items={items}
          hasNextItems={query.hasNextPage}
          fetchMoreItems={query.fetchNextPage}
          isLoading={query.isLoading || query.isRefetching || query.isFetching || query.isFetchingNextPage}
        />
      </div>
    </div>
  );
};

export default AdminArticles;
