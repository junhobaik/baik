// apps/web/src/api/client/archive.ts
import type { ActionResult, ArticleBase, DefaultDBAttributes } from '@baik/types';

import { request } from './request';

type CreateArticleArgs = Omit<ArticleBase, keyof DefaultDBAttributes> & {
  pathname?: string;
  url?: string;
  origin_title?: string;
  site?: { title: string; link: string; favicon_url?: string; description?: string };
};

type UpdateArticleArgs = { id: string } & Partial<CreateArticleArgs>;

export const createArticle = async (args: CreateArticleArgs): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'createArticle',
    payload: args,
  };

  return await request(param);
};

export const updateArticle = async (args: UpdateArticleArgs): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'updateArticle',
    payload: args,
  };

  return await request(param);
};

export const deleteArticle = async ({ id }: { id: string }): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'deleteArticle',
    payload: { id },
  };

  return await request(param);
};

export const getArticle = async ({ id }: { id: string }): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticle',
    payload: { id },
  };

  return await request(param);
};

export const getAllArticles = async (args?: {
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getAllArticles',
    payload: args || {},
  };

  return await request(param);
};

export const getArticlesByStatus = async (args: {
  status: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticlesByStatus',
    payload: args,
  };

  return await request(param);
};

export const getArticlesByType = async (args: {
  type: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticlesByType',
    payload: args,
  };

  return await request(param);
};

export const getArticlesByTypeStatus = async (args: {
  type: string;
  status: string;
  orderBy?: 'created_at' | 'updated_date';
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticlesByTypeStatus',
    payload: args,
  };

  return await request(param);
};

export const getArticleByPathname = async (args: {
  pathname: string;
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticleByPathname',
    payload: args,
  };

  return await request(param);
};

export const getArticleByPathnamePublic = async (args: {
  pathname: string;
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticleByPathnamePublic',
    payload: args,
  };

  return await request(param);
};

export const getAllArticlesPublic = async (args?: {
  limit?: number;
  orderBy?: 'created_at' | 'updated_date';
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getAllArticlesPublic',
    payload: args || {},
  };

  return await request(param);
};
