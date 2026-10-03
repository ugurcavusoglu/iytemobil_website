import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ message: 'idToken gerekli.' }, { status: 400 });
    }

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || 'Google ile giriş başarısız.' },
        { status: upstream.status },
      );
    }

    const token = data?.token || data?.access_token;
    if (!token) {
      return NextResponse.json({ message: 'Token alınamadı.' }, { status: 500 });
    }

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: data.user, message: 'Giriş başarılı.' });
  } catch {
    return NextResponse.json(
      { message: 'Google ile giriş sırasında beklenmeyen bir hata oluştu.' },
      { status: 500 },
    );
  }
}
