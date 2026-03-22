import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const redirect = request.nextUrl.searchParams.get('redirect') || '/tr/documents';

  if (!token) {
    return NextResponse.json({ message: 'Token gerekli.' }, { status: 400 });
  }

  // Verify token by calling backend /auth/me
  try {
    const res = await fetch(`${resolveClubApplicationApiBase()}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      // Invalid token — redirect to login
      return NextResponse.redirect(new URL('/tr/login', request.url));
    }

    // Token is valid — set cookie and redirect
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 gun
    });

    return NextResponse.redirect(new URL(redirect, request.url));
  } catch {
    return NextResponse.redirect(new URL('/tr/login', request.url));
  }
}
