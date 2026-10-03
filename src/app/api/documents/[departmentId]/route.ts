import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Context = { params: Promise<{ departmentId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { departmentId } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const upstream = await fetch(
      `${resolveClubApplicationApiBase()}/api/departments/${departmentId}/documents?page=${page}&limit=${limit}`,
      { headers, cache: 'no-store' },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { message: 'Belgeler alınamadı.' },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Beklenmeyen hata.' }, { status: 500 });
  }
}
