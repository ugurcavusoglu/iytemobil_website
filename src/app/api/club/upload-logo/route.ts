import { NextResponse } from 'next/server';
import { getClubApiErrorMessage, resolveClubApplicationApiBase } from '@/lib/club-application-api';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Logo dosyasi bulunamadi.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: 'Sadece JPG, PNG veya WEBP dosyalari yuklenebilir.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ message: 'Logo boyutu en fazla 2MB olabilir.' }, { status: 400 });
    }

    const uploadData = new FormData();
    uploadData.append('image', file, file.name);

    const upstream = await fetch(`${resolveClubApplicationApiBase()}/api/upload/club-logo`, {
      method: 'POST',
      body: uploadData,
      cache: 'no-store',
    });

    const json = await upstream.json().catch(() => null);
    if (!upstream.ok) {
      return NextResponse.json(
        { message: getClubApiErrorMessage(json, 'Logo yuklenemedi.') },
        { status: upstream.status || 500 },
      );
    }

    return NextResponse.json(json, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Logo yuklenirken beklenmeyen bir hata olustu.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
