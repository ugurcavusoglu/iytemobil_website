import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a documents page (protected)
  const isDocumentsPage = /^\/(tr|en)\/documents/.test(pathname);
  const isLoginPage = /^\/(tr|en)\/login/.test(pathname);
  const hasToken = request.cookies.has('auth_token');

  if (isDocumentsPage && !hasToken) {
    const locale = pathname.startsWith('/en') ? 'en' : 'tr';
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isLoginPage && hasToken) {
    const locale = pathname.startsWith('/en') ? 'en' : 'tr';
    return NextResponse.redirect(new URL(`/${locale}/documents`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*'],
};
