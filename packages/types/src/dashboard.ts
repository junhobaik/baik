// packages/types/src/dashboard.ts
import type { DefaultDBAttributes } from './common';

export interface BookmarkItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  favicon_url?: string;
}

export interface BookmarkGroupBase {
  title: string;
  description?: string;
  collapsed: boolean;
  order: number;
  items: BookmarkItem[];
}

export type BookmarkGroup = BookmarkGroupBase & DefaultDBAttributes;

export interface FeedArticle {
  [key: string]: any;
}

export type FeedType = 'rss' | 'crawler';

export interface FeedItemBase {
  url: string;
  type: FeedType;
  selector?: string;
  data: {
    title: string;
    description: string;
    favicon_url?: string;
    items: FeedArticle[];
  };
}

export interface CrawlerFeedItemBase extends FeedItemBase {
  type: 'crawler';
  selector: string;
}

export interface RssFeedItemBase extends FeedItemBase {
  type: 'rss';
  selector?: never;
}

export type RSSFeedItem = RssFeedItemBase & DefaultDBAttributes;
export type CrawlerFeedItem = CrawlerFeedItemBase & DefaultDBAttributes;

export type FeedItem = RSSFeedItem | CrawlerFeedItem;
