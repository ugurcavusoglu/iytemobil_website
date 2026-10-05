import { NextRequest, NextResponse } from 'next/server';

const APP_STORE_URL = 'https://apps.apple.com/tr/app/i-yte-mobile/id6761460550?l=tr';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.iytemobil.app';
const FALLBACK_URL = 'https://iytemobil.com/tr#download';

export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const uaLower = ua.toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(uaLower);
  const isAndroid = /android/.test(uaLower);

  if (isIOS) {
    return NextResponse.redirect(APP_STORE_URL, { status: 302 });
  }

  if (isAndroid) {
    return NextResponse.redirect(PLAY_STORE_URL, { status: 302 });
  }

  // Masaüstü veya bilinmeyen cihaz → ana sayfa
  return NextResponse.redirect(FALLBACK_URL, { status: 302 });
}
