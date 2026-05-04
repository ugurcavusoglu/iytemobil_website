import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('club_token')?.value;

    if (!token) {
      return NextResponse.json({ club: null }, { status: 401 });
    }

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/clubs/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ club: null }, { status: 401 });
    }

    const data = await upstream.json().catch(() => null);
    return NextResponse.json({ club: data?.club || null });
  } catch {
    return NextResponse.json({ club: null }, { status: 500 });
  }
}
