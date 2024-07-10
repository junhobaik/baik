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
