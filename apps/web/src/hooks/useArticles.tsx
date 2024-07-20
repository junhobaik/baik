'use client';

import { useMemo } from 'react';

import type { Article } from '@baik/types';
import { useInfiniteQuery } from '@tanstack/react-query';

import api from '@/api';

interface UseArticlesProps {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  limit?: number;
}

interface UseArticlesResult {
  query: ReturnType<typeof useInfiniteQuery>;
  data: Article[];
}

const useArticles = (props?: UseArticlesProps): UseArticlesResult => {
  const { enabled = true, refetchOnWindowFocus = false, retry = 5, limit = 100 } = props || {};

  const fetchBookmarkGroups = async ({ pageParam = undefined }) => {
    try {
      const res = await api.client.archive.getAllArticles({
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
    queryKey: ['articles', refetchOnWindowFocus, limit],
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

export default useArticles;
