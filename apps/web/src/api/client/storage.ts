import { ActionResult } from '@baik/types';

import { request } from './request';

export const uploadImage = async ({ file, filename }: { file: string; filename: string }): Promise<ActionResult> => {
  const param = {
    module: 'storage',
    action: 'uploadImage',
    payload: {
      file,
      filename,
    },
  };

  return await request(param);
};
