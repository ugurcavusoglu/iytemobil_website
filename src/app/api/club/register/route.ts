import { NextResponse } from 'next/server';

const resolveApiBase = () => {
  const configured =
    process.env.CLUB_APPLICATION_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const raw = (configured || 'https://api.iytemobil.com').trim();
  return raw.replace(/\/+$/, '').replace(/\/api$/, '');
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const upstream = await fetch(`${resolveApiBase()}/api/auth/club/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const responseText = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json';

    return new Response(responseText, {
      status: upstream.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Basvuru gonderilirken beklenmeyen bir hata olustu.' },
      { status: 500 },
    );
  }
}
