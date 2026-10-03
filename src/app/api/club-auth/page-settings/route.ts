import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('club_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const body = await request.json();

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/clubs/me/page-settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || 'Güncelleme başarısız.' },
        { status: upstream.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: 'Beklenmeyen bir hata oluştu.' },
      { status: 500 },
    );
  }
}
