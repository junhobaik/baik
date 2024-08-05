// apps/web/src/api/client/archive.ts
import type { ActionResult } from '@baik/types';

import { request } from './request';

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

export const getArticleByPathname = async (args: { pathname: string }): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getArticleByPathname',
    payload: args,
  };

  return await request(param);
};

export const getPublishedArticleByPathname = async (args: { pathname: string }): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getPublishedArticleByPathname',
    payload: args,
  };

  return await request(param);
};

export const getAllPublishedArticles = async (args?: {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'archive',
    action: 'getAllPublishedArticles',
    payload: args || {},
  };

  return await request(param);
};
