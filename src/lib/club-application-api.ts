const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === 'string') return payload;

  if (Array.isArray(payload)) {
    return payload.filter((item) => typeof item === 'string').join(', ') || fallback;
  }

  if (payload && typeof payload === 'object') {
    const candidate = (payload as { message?: unknown }).message;
    if (typeof candidate === 'string') return candidate;
    if (Array.isArray(candidate)) {
      return candidate.filter((item) => typeof item === 'string').join(', ') || fallback;
    }
  }

  return fallback;
};

export const resolveClubApplicationApiBase = () => {
  const configured =
    process.env.CLUB_APPLICATION_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const raw = (configured || 'https://api.iytemobil.com').trim();
  return raw.replace(/\/+$/, '').replace(/\/api$/, '');
};

export const getClubUploadToken = async () => {
  const staticToken = process.env.CLUB_APPLICATION_UPLOAD_TOKEN?.trim();
  if (staticToken) return staticToken;

  const email = process.env.CLUB_APPLICATION_UPLOAD_EMAIL?.trim();
  const password = process.env.CLUB_APPLICATION_UPLOAD_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Logo yukleme icin CLUB_APPLICATION_UPLOAD_TOKEN veya login bilgileri tanimli degil.',
    );
  }

  const loginResponse = await fetch(`${resolveClubApplicationApiBase()}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emailOrUsername: email,
      password,
    }),
    cache: 'no-store',
  });

  const loginJson = await loginResponse.json().catch(() => null);
  if (!loginResponse.ok) {
    throw new Error(
      parseErrorMessage(loginJson, 'Logo yukleme icin servis hesabi girisi basarisiz oldu.'),
    );
  }

  const token = loginJson?.token || loginJson?.access_token;
  if (!token || typeof token !== 'string') {
    throw new Error('Logo yukleme icin gecerli token alinamadi.');
  }

  return token;
};

export const getClubApiErrorMessage = parseErrorMessage;
