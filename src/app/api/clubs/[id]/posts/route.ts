import { NextResponse } from 'next/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs/${id}/posts?limit=50`,
      { cache: 'no-store' },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) return NextResponse.json({ posts: [] });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
