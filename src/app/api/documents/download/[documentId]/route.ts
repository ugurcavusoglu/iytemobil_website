import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Context = { params: Promise<{ documentId: string }> };

export async function POST(_request: Request, context: Context) {
  try {
    const { documentId } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Yetkisiz.' }, { status: 401 });
    }

    const upstream = await fetch(
      `${resolveClubApplicationApiBase()}/api/departments/documents/${documentId}/download`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { message: 'Indirme sayaci guncellenemedi.' },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Beklenmeyen hata.' }, { status: 500 });
  }
}
