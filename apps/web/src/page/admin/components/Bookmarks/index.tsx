'use client';

import React from 'react';

import useBookmarkGroups from '@/hooks/useBookmarkGroups';

import BookmarkDataTable from './BookmarkDataTable';

const AdminBookmarks = () => {
  const { data, query } = useBookmarkGroups();

  return (
    <div className="h-full">
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
