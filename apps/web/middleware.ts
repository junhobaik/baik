import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { match } from 'path-to-regexp';

import { auth } from '@/auth';

const MATCHERS = {
  AUTH: ['/admin/*', '/archive/write', '/archive/clip'],
  SIGN_IN: ['/api/auth/signout/*', '/api/auth/signin/*'],
};

const isMatch = (pathname: string, urls: string[]): boolean => urls.some((url) => !!match(url)(pathname));

const addXPathnameHeader = (request: NextRequest): Headers => {
  const headers = new Headers(request.headers);
  headers.set('x-pathname', request.nextUrl.pathname);
  return headers;
};

const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const country = request.geo?.country ?? 'KR';

  const headers = addXPathnameHeader(request);
  const { pathname } = request.nextUrl;

  const session = await auth();

  if (isMatch(pathname, MATCHERS.AUTH)) {
    if (!session) {
      return NextResponse.redirect(new URL('/api/auth/signin', request.url));
    }
  }

  if (isMatch(pathname, MATCHERS.SIGN_IN)) {
    if (session) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
  }

  if (country !== 'KR' && pathname === '/archive') {
    return NextResponse.redirect(new URL(`/archive/en`, request.url));
  }

  return NextResponse.next({ request: { headers } });
};

export { middleware };
