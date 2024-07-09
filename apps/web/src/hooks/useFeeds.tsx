'use client';

import { useMemo } from 'react';

import type { FeedItem } from '@baik/types';
import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/api';

interface UseFeedsProps {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  limit?: number;
}

interface UseFeedsResult {
  query: ReturnType<typeof useInfiniteQuery>;
  data: FeedItem[];
}

const useFeeds = (props?: UseFeedsProps): UseFeedsResult => {
  const { enabled = true, refetchOnWindowFocus = false, retry = 5, limit = 100 } = props || {};

  const fetchBookmarkGroups = async ({ pageParam = undefined }) => {
    console.debug('fetch, useFeeds', { pageParam });
    try {
      const res = await api.client.dashboard.getAllFeedItems({
        limit: limit,
        lastEvaluatedKey: pageParam,
      });
      if (!res.data?.items) {
        throw new Error('Not found, feeds');
      }
      return {
        items: res.data.items,
        nextCursor: res.data.lastEvaluatedKey,
      };
    } catch (error) {
      throw new Error('Fetch failed, feeds');
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['feeds', refetchOnWindowFocus, limit],
    queryFn: ({ pageParam }) => fetchBookmarkGroups({ pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: refetchOnWindowFocus,
    enabled: enabled,
    retry: retry,
  });

  const { data } = query;

  const parsedData = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  return {
    query,
    data: parsedData,
  };
};

export default useFeeds;
