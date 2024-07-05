import type { ActionResult } from '@baik/types';

import { request } from './request';

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
