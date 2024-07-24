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

export const getOpenGraphData = async ({ url }: { url: string }): Promise<ActionResult> => {
  const param = {
    module: 'utils',
    action: 'getOpenGraphData',
    payload: {
      url,
    },
  };

  return await request(param);
};

export const getSiteData = async ({ url }: { url: string }): Promise<ActionResult> => {
  const param = {
    module: 'utils',
    action: 'getSiteData',
    payload: {
      url,
    },
  };

  return await request(param);
};
