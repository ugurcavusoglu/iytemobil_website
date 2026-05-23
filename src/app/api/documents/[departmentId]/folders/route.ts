import { NextRequest, NextResponse } from 'next/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Context = { params: Promise<{ departmentId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { departmentId } = await context.params;
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || '';

    const url = new URL(`${resolveClubApplicationApiBase()}/api/departments/${departmentId}/folders`);
    if (parentId) url.searchParams.set('parentId', parentId);

    const upstream = await fetch(url.toString(), { cache: 'no-store' });
    if (!upstream.ok) return NextResponse.json([], { status: upstream.status });
    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
