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
  description?: string;
  content: string;
  status: ArticleStatus;
  type: ArticleType;
  published_date: number;
  updated_date: number;
  intl?: {
    en?: {
      title: string;
      content: string;
    };
  } | null;
  keywords?: string;
  pathname?: string;
  url?: string;
  site?: ClipSite;
  thumbnail_img_url?: string;
  is_recommended?: boolean;
  tags?: string[];
  origin_title?: string;
}

export interface PostArticleBase extends ArticleBase {
  type: 'post';
  pathname: string;
  url?: never;
  site?: never;
  origin_title?: never;
}

export interface ShortsArticleBase extends ArticleBase {
  type: 'shorts';
  pathname: string;
  url?: never;
  site?: never;
  is_recommended?: never;
  origin_title?: never;
}

export interface ClipArticleBase extends ArticleBase {
  type: 'clip';
  url: string;
  site: ClipSite;
  description?: never;
  pathname?: never;
  keywords?: never;
  is_recommended?: never;
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
