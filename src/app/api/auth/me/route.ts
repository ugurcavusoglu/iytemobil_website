import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Yetkisiz.' }, { status: 401 });
    }

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ message: 'Oturum geçersiz.' }, { status: 401 });
    }

    const user = await upstream.json();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: 'Profil alınamadı.' }, { status: 500 });
  }
}
