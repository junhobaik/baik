'use client';

import React from 'react';

import useBookmarkGroups from '@/hooks/useBookmarkGroups';

import BookmarkDataTable from './components/BookmarkDataTable';

const AdminBookmarks = () => {
  const { data, query } = useBookmarkGroups();

  return (
    <div className="h-screen flex flex-col overflow-hidden p-4">
      <BookmarkDataTable
        items={data}
        hasNextItems={query.hasNextPage}
        fetchMoreItems={query.fetchNextPage}
        isLoading={query.isLoading || query.isRefetching || query.isFetching || query.isFetchingNextPage}
      />
    </div>
  );
};

export default AdminBookmarks;
