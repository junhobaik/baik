import { auth } from '@/auth';

const BASE_URL = `http://127.0.0.1:4000/local`;

interface RequestParam {
  module: string;
  action: string;
  payload: Record<string, unknown>;
}

export const request = async (param: RequestParam) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  const session = await auth();
  if (session?.sessionToken) {
    headers.set('Authorization', `Bearer ${session?.sessionToken}`);
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ ...param }),
  });

  const responseData = await response.json();

  return responseData;
};
