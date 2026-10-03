import { NextResponse } from 'next/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/upload/club-banner`, {
      method: 'POST',
      body: formData,
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        { message: data?.message || 'Yükleme başarısız.' },
        { status: upstream.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: 'Beklenmeyen bir hata oluştu.' }, { status: 500 });
  }
}
