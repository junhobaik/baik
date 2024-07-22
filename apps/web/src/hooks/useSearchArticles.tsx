'use client';

import { useEffect, useState } from 'react';

import { Article } from '@baik/types';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';

type AlgoliaHit = {
  objectID: string;
  _highlightResult?: any;
} & Article;

interface UseSearchArticlesProps {
  searchValue?: string;
  hitsPerPage?: number;
  publishedOnly?: boolean;
}

interface UseSearchArticlesResult {
  items: Article[];
}

const searchClient: SearchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY as string,
);
const index: SearchIndex = searchClient.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME as string);

const parseHits = (hits: AlgoliaHit[]): Article[] => {
  return hits.map((hit) => {
    const { _highlightResult, objectID, ...rest } = hit;
    return rest as Article;
  });
};

const useSearchArticles = (props: UseSearchArticlesProps): UseSearchArticlesResult => {
  const { searchValue = '', hitsPerPage = 5, publishedOnly = false } = props;
  const [hits, setHits] = useState<Article[]>([]);

  useEffect(() => {
    if (searchValue.trim()) {
      index
        .search<Article>(searchValue, {
          hitsPerPage: hitsPerPage,
          ...(publishedOnly && { filters: 'status:published' }),
        })
        .then(({ hits }) => {
          const items = parseHits(hits);
          setHits(items);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setHits([]);
    }
  }, [searchValue, hitsPerPage, publishedOnly]);

  return {
    items: hits,
  };
};

export default useSearchArticles;
