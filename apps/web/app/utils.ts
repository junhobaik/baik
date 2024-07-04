import { auth } from '@/auth';

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const session = await auth();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${session?.user?.id}`);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
