// packages/types/src/archive.ts
import type { DefaultDBAttributes } from './common';

export type ArticleStatus = 'draft' | 'published' | 'private';
export type ArticleType = 'post' | 'shorts' | 'clip';

export interface ClipSite {
  title: string;
  link: string;
  favicon_url?: string;
  description?: string;
}

export interface ArticleBase {
  title: string;
  content: string;
  status: ArticleStatus;
  type: ArticleType;
  published_date: number;
  updated_date: number;

  keywords?: string[];
  pathname?: string;
  url?: string;
  site?: ClipSite;
}

export interface PostArticleBase extends ArticleBase {
  type: 'post';
  pathname: string;
  url?: never;
  site?: never;
}

export interface ShortsArticleBase extends ArticleBase {
  type: 'shorts';
  pathname: string;
  url?: never;
  site?: never;
}

export interface ClipArticleBase extends ArticleBase {
  type: 'clip';
  url: string;
  origin_title: string;
  site: ClipSite;

  pathname?: never;
  keywords?: never;
}

export interface ArticleGSIAttributes {
  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;
  GSI3PK: string;
  GSI3SK: string;
  GSI4PK: string;
  GSI4SK: string;
}

export type PostArticle = PostArticleBase & DefaultDBAttributes & ArticleGSIAttributes;
export type ShortsArticle = ShortsArticleBase & DefaultDBAttributes & ArticleGSIAttributes;
export type ClipArticle = ClipArticleBase & DefaultDBAttributes & ArticleGSIAttributes;

export type Article = PostArticle | ShortsArticle | ClipArticle;
