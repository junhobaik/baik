import type { ActionResult, BookmarkGroup, DefaultDBAttributes } from '@baik/types';

import { request } from './request';

type CreateBookmarkGroupArgs = Omit<BookmarkGroup, keyof DefaultDBAttributes>;
type UpdateBookmarkGroupArgs = Partial<CreateBookmarkGroupArgs> & { id: string };

export const createBookmarkGroup = async (args: CreateBookmarkGroupArgs): Promise<ActionResult> => {
  const param = {
    module: 'dashboard',
    action: 'createBookmarkGroup',
    payload: args,
  };

  return await request(param);
};

export const updateBookmarkGroup = async (args: UpdateBookmarkGroupArgs): Promise<ActionResult> => {
  const param = {
    module: 'dashboard',
    action: 'updateBookmarkGroup',
    payload: args,
  };

  return await request(param);
};

export const deleteBookmarkGroup = async ({ id }: { id: string }): Promise<ActionResult> => {
  const param = {
    module: 'dashboard',
    action: 'deleteBookmarkGroup',
    payload: { id },
  };

  return await request(param);
};

export const getBookmarkGroup = async ({ id }: { id: string }): Promise<ActionResult> => {
  const param = {
    module: 'dashboard',
    action: 'getBookmarkGroup',
    payload: { id },
  };

  return await request(param);
};

export const getAllBookmarkGroups = async (args?: {
  limit?: number;
  lastEvaluatedKey?: Record<string, any>;
}): Promise<ActionResult> => {
  const param = {
    module: 'dashboard',
    action: 'getAllBookmarkGroups',
    payload: args || {},
  };

  return await request(param);
};
