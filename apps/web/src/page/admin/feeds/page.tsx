'use client';

import React from 'react';

import useFeeds from '@/hooks/useFeeds';

import FeedDataTable from './FeedsDataTable';

const AdminFeedsPage = () => {
  const { data, query } = useFeeds();

  return (
    <div className="h-screen flex flex-col overflow-hidden p-4">
      <FeedDataTable
        items={data}
        hasNextItems={query.hasNextPage}
        fetchMoreItems={query.fetchNextPage}
        isLoading={query.isLoading || query.isRefetching || query.isFetching || query.isFetchingNextPage}
      />
    </div>
  );
};

export default AdminFeedsPage;
