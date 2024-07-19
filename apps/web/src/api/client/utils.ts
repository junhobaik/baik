import { ActionResult } from '@baik/types';

import { request } from './request';

export const translate = async ({
  text,
  language,
  option,
}: {
  text: string;
  language: string;
  option?: string;
}): Promise<ActionResult> => {
  const param = {
    module: 'utils',
    action: 'translate',
    payload: {
      text,
      language,
      option,
    },
  };

  return await request(param);
};
