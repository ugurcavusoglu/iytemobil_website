import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Context = { params: Promise<{ departmentId: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const { departmentId } = await context.params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Yetkisiz.' }, { status: 401 });
    }

    const formData = await request.formData();

    const upstream = await fetch(
      `${resolveClubApplicationApiBase()}/api/departments/${departmentId}/documents`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || 'Yukleme basarisiz.' },
        { status: upstream.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Beklenmeyen hata.' }, { status: 500 });
  }
}
