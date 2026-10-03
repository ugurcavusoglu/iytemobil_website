import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { ClubsShowcase, type ShowcaseClub, type ShowcaseEvent } from './ClubsShowcase';

const REVALIDATE_SECONDS = 300;
const MAX_EVENTS = 8;

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${resolveClubApplicationApiBase()}/api${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function ClubsSection() {
  const [clubsRes, eventsRes] = await Promise.all([
    getJson<{ clubs: ShowcaseClub[] }>('/clubs?status=APPROVED&sortBy=members&limit=200'),
    getJson<{ events: ShowcaseEvent[] }>('/events?limit=30'),
  ]);
  const clubs = clubsRes?.clubs ?? [];
  const now = Date.now();
  const events = (eventsRes?.events ?? [])
    .filter((e) => new Date(e.startDate).getTime() > now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, MAX_EVENTS);

  if (clubs.length === 0) return null;
  return <ClubsShowcase clubs={clubs} events={events} />;
}
