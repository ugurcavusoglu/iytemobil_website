import { NextRequest, NextResponse } from 'next/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Context = { params: Promise<{ folderId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { folderId } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';

    const upstream = await fetch(
      `${resolveClubApplicationApiBase()}/api/departments/folders/${folderId}/documents?page=${page}&limit=100`,
      { cache: 'no-store' },
    );
    if (!upstream.ok) return NextResponse.json({ documents: [] }, { status: upstream.status });
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ documents: [] }, { status: 500 });
  }
}
