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

export const getClubApiErrorMessage = parseErrorMessage;
