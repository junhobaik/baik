import { ActionResult } from '@baik/types';

import { request } from './request';

export const translate = async ({ text, option }: { text: string; option?: string }): Promise<ActionResult> => {
  const param = {
    module: 'utils',
    action: 'translate',
    payload: {
      text,
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

export const getRSSFeedUrl = async ({ url }: { url: string }): Promise<ActionResult> => {
  const param = {
    module: 'utils',
    action: 'getRSSFeedUrl',
    payload: {
      url,
    },
  };

  return await request(param);
};
