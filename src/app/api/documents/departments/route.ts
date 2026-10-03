import { NextResponse } from 'next/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function GET() {
  try {
    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/departments?limit=100`, {
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ message: 'Bölümler alınamadı.' }, { status: upstream.status });
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Beklenmeyen hata.' }, { status: 500 });
  }
}
