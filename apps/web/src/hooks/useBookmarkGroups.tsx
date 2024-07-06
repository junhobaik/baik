'use client';

import { useMemo } from 'react';

import type { BookmarkGroup } from '@baik/types';
import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/api';

interface UseBookmarkGroupsProps {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  limit?: number;
}

interface UseBookmarkGroupsResult {
  query: ReturnType<typeof useInfiniteQuery>;
  data: BookmarkGroup[];
}

const useBookmarkGroups = (props?: UseBookmarkGroupsProps): UseBookmarkGroupsResult => {
  const { enabled = true, refetchOnWindowFocus = false, retry = 5, limit = 100 } = props || {};

  const fetchBookmarkGroups = async ({ pageParam = undefined }) => {
    console.debug('fetch, useBookmarkGroups', { pageParam });
    try {
      const res = await api.client.dashboard.getAllBookmarkGroups({
        limit: limit,
        lastEvaluatedKey: pageParam,
      });
      if (!res.data?.items) {
        throw new Error('Not found, bookmarkGroups');
      }
      return {
        items: res.data.items,
        nextCursor: res.data.lastEvaluatedKey,
      };
    } catch (error) {
      throw new Error('Fetch failed, bookmarkGroups');
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['bookmarkGroups', refetchOnWindowFocus, limit],
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

export default useBookmarkGroups;
