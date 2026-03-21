import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || 'Giris basarisiz.' },
        { status: upstream.status },
      );
    }

    const token = data?.token || data?.access_token;
    if (!token) {
      return NextResponse.json({ message: 'Token alinamadi.' }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 gun
    });

    return NextResponse.json({
      user: data.user || data,
      message: 'Giris basarili.',
    });
  } catch {
    return NextResponse.json(
      { message: 'Giris sirasinda beklenmeyen bir hata olustu.' },
      { status: 500 },
    );
  }
}
