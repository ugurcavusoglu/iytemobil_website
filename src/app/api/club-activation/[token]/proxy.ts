import { NextResponse } from 'next/server';
import { getClubApiErrorMessage, resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function forwardToActivationApi(token: string, path: string, init?: RequestInit) {
  try {
    const upstream = await fetch(
      `${resolveClubApplicationApiBase()}/api/auth/club-activation/${encodeURIComponent(token)}${path}`,
      {
        ...init,
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
        cache: 'no-store',
      },
    );
    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(
        { message: getClubApiErrorMessage(json, 'İşlem başarısız.') },
        { status: upstream.status || 500 },
      );
    }
    return NextResponse.json(json, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Sunucuya ulaşılamadı. Lütfen tekrar deneyin.' }, { status: 502 });
  }
}
