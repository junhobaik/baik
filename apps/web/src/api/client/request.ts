import { getSession } from 'next-auth/react';

import { BASE_URL } from '@/configs/variables';

interface RequestParam {
  module: string;
  action: string;
  payload: Record<string, unknown>;
}

export const request = async (param: RequestParam) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const session = await getSession();
  if (session?.sessionToken) {
    headers.set('Authorization', `Bearer ${session?.sessionToken}`);
  }

  console.debug(`🔺 [${param.module}>${param.action}]`, {
    method: 'POST',
    headers: headers,
    body: param,
  });

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ ...param }),
  });

  const responseData = await response.json();

  console.debug(`🔹 [${param.module}>${param.action}]`, {
    payload: param.payload,
    response: responseData,
  });

  return responseData;
};
