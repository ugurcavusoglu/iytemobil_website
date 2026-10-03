import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

interface ClubSummary {
  id: string;
  name: string;
  logoUrl?: string;
  slug?: string;
  memberCount?: number;
}

interface EventSummary {
  id: string;
  title: string;
  location?: string;
  startDate: string;
  imageUrl?: string | null;
  club?: { name: string; logoUrl?: string };
}

const REVALIDATE_SECONDS = 300;
const MAX_EVENTS = 3;

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${resolveClubApplicationApiBase()}/api${path}`, { next: { revalidate: REVALIDATE_SECONDS } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

function ClubChip({ club, membersLabel }: { club: ClubSummary; membersLabel: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-surface-light">
        {club.logoUrl && <Image src={club.logoUrl} alt="" fill sizes="40px" className="object-cover" />}
      </div>
      <div className="pr-2">
        <p className="whitespace-nowrap text-sm font-semibold">{club.name}</p>
        {!!club.memberCount && <p className="text-xs text-text-muted">{club.memberCount} {membersLabel}</p>}
      </div>
    </div>
  );
}

export async function CampusPulse() {
  const [t, locale, clubsRes, eventsRes] = await Promise.all([
    getTranslations('pulse'),
    getLocale(),
    getJson<{ clubs: ClubSummary[] }>('/clubs?status=APPROVED&sortBy=members&limit=200'),
    getJson<{ events: EventSummary[] }>('/events?limit=20'),
  ]);
  const clubs = clubsRes?.clubs ?? [];
  const now = Date.now();
  const events = (eventsRes?.events ?? [])
    .filter((e) => new Date(e.startDate).getTime() > now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, MAX_EVENTS);
  const totalMembers = clubs.reduce((sum, c) => sum + (c.memberCount ?? 0), 0);
  const half = Math.ceil(clubs.length / 2);
  const rows = [clubs.slice(0, half), clubs.slice(half)];
  const dateFormat = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric', month: 'long', weekday: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul',
  });

  if (clubs.length === 0 && events.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t('eyebrow')}</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{t('title')}</h2>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="text-4xl font-bold md:text-5xl">{clubs.length}</p>
              <p className="text-sm text-text-muted">{t('clubCount')}</p>
            </div>
            {totalMembers > 0 && (
              <div>
                <p className="text-4xl font-bold md:text-5xl">{totalMembers.toLocaleString(locale)}+</p>
                <p className="text-sm text-text-muted">{t('memberCount')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {clubs.length > 0 && (
        <div className="space-y-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          {rows.map((row, i) => (
            <div key={i} className={`flex w-max gap-4 animate-marquee hover:[animation-play-state:paused] ${i === 1 ? '[animation-direction:reverse]' : ''}`}>
              {[...row, ...row].map((club, j) => <ClubChip key={`${club.id}-${j}`} club={club} membersLabel={t('members')} />)}
            </div>
          ))}
        </div>
      )}

      {events.length > 0 && (
        <div className="mx-auto mt-20 max-w-6xl px-4 md:px-8">
          <h3 className="mb-6 text-xl font-bold md:text-2xl">{t('upcoming')}</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {events.map((event) => (
              <article key={event.id} className="group overflow-hidden rounded-3xl border border-border bg-surface transition-colors hover:border-primary/30">
                <div className="relative aspect-[16/9] bg-surface-container">
                  {event.imageUrl ? (
                    <Image src={event.imageUrl} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,57,70,0.35),transparent_60%)]" />
                  )}
                </div>
                <div className="p-5">
                  {event.club && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{event.club.name}</p>}
                  <h4 className="mb-3 line-clamp-2 font-semibold">{event.title}</h4>
                  <p className="flex items-center gap-2 text-sm text-text-secondary"><CalendarDays className="h-4 w-4" />{dateFormat.format(new Date(event.startDate))}</p>
                  {event.location && <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary"><MapPin className="h-4 w-4" />{event.location}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/clubs" className="inline-flex items-center gap-2 font-medium text-text-secondary transition-colors hover:text-text-primary">
          {t('allClubs')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
