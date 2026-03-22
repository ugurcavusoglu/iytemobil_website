import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a documents page (protected)
  const isDocumentsPage = /^\/(tr|en)\/documents/.test(pathname);
  const hasToken = request.cookies.has('auth_token');

  if (isDocumentsPage && !hasToken) {
    const locale = pathname.startsWith('/en') ? 'en' : 'tr';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Login page redirect handled client-side by LoginForm
  // (middleware can't verify token validity without calling backend)

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*'],
};
