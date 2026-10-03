'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Bus, Clock, MapPin } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

const API_URL = 'https://api.iytemobil.com/api';
const WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const NEXT_COUNT = 5;
const VISIBLE_TIMES = 10;

const LINES: Record<string, { color: string; image: string; label: string }> = {
  '882': { color: '#3b82f6', image: '/images/app/transport-bus.webp', label: '882' },
  '883': { color: '#8b5cf6', image: '/images/app/transport-bus.webp', label: '883' },
  '982': { color: '#10b981', image: '/images/app/transport-bus.webp', label: '982' },
  RING: { color: '#f59e0b', image: '/images/app/transport-ring.webp', label: 'RING' },
  DOLMUS: { color: '#ec4899', image: '/images/app/transport-minibus.webp', label: 'DOLMUŞ' },
};
const DEFAULT_LINE = { color: '#E63946', image: '/images/app/transport-bus.webp', label: '' };

const TEXT = {
  tr: {
    eyebrow: 'ESHOT · Ring · Dolmuş',
    title: 'Ulaşım',
    subtitle: 'Ring, dolmuş ve ESHOT seferleri. Sıradaki sefer bir bakışta.',
    next: 'Sonraki seferler',
    nextTrip: 'SONRAKİ SEFER',
    left: 'dk kaldı',
    min: 'dk',
    hours: 'sa',
    from: 'Nereden',
    to: 'Nereye',
    anywhere: 'Her yer',
    today: 'Bugün',
    tomorrow: 'Yarın',
    lines: 'Hatlar',
    noTrips: 'Bu güzergâh için sefer bulunamadı.',
    noMoreToday: 'Bugün için başka sefer yok.',
    noNext: 'Bugün için kalan sefer yok.',
    showAll: 'Tüm saatleri göster',
    showLess: 'Daha az göster',
    days: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  },
  en: {
    eyebrow: 'ESHOT · Shuttle · Minibus',
    title: 'Transit',
    subtitle: 'Shuttle, minibus and ESHOT departures. Next trip at a glance.',
    next: 'Next departures',
    nextTrip: 'NEXT TRIP',
    left: 'min left',
    min: 'min',
    hours: 'h',
    from: 'From',
    to: 'To',
    anywhere: 'Anywhere',
    today: 'Today',
    tomorrow: 'Tomorrow',
    lines: 'Lines',
    noTrips: 'No trips found for this route.',
    noMoreToday: 'No more trips today.',
    noNext: 'No more departures today.',
    showAll: 'Show all times',
    showLess: 'Show less',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
};

type Text = (typeof TEXT)['tr'];

interface BusSchedule {
  id: string;
  busCode: string;
  busName?: string;
  dayOfWeek: string;
  departureTime: string;
  from: string;
  to: string;
}

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const routeStops = (s: BusSchedule) => {
  const stops = s.busCode === 'DOLMUS' ? s.busName?.split(' - ')[1]?.split(' -> ') : undefined;
  return stops && stops.length > 2 ? stops : [s.from, s.to];
};

const lineOf = (code: string) => LINES[code] ?? { ...DEFAULT_LINE, label: code };

async function fetchSchedules(): Promise<BusSchedule[]> {
  try {
    const res = await fetch(`${API_URL}/bus`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (Object.values(data).flat() as BusSchedule[]);
  } catch {
    return [];
  }
}

function useNowMinutes() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  return now.getHours() * 60 + now.getMinutes();
}

function formatLeft(mins: number, t: Text) {
  if (mins < 60) return `${mins} ${t.left}`;
  return `${Math.floor(mins / 60)} ${t.hours} ${mins % 60} ${t.left}`;
}

function NextCard({ trip, nowMinutes, t }: { trip: BusSchedule; nowMinutes: number; t: Text }) {
  const line = lineOf(trip.busCode);
  const left = toMinutes(trip.departureTime) - nowMinutes;
  const progress = Math.max(0.05, Math.min(1, 1 - left / 120));
  return (
    <div className="relative h-[300px] w-[85vw] max-w-[520px] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-border md:h-[320px]">
      <Image src={line.image} alt="" fill sizes="520px" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 md:p-8">
        <span className="w-fit rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-white" style={{ backgroundColor: line.color }}>{t.nextTrip}</span>
        <p className="mt-3 text-7xl font-black leading-none tracking-tighter md:text-8xl">{trip.departureTime}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-lg px-2.5 py-1 text-sm font-bold text-white" style={{ backgroundColor: line.color }}>{line.label}</span>
          <span className="text-lg font-semibold">{routeStops(trip).join(' → ')}</span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold" style={{ color: line.color }}>
          <Clock className="h-4 w-4" />
          {formatLeft(left, t)}
        </p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundColor: line.color }} />
        </div>
      </div>
    </div>
  );
}

function StopLine({ stops, from, to, color }: { stops: string[]; from: string; to: string; color: string }) {
  return (
    <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
      {stops.map((stop, i) => (
        <div key={stop} className="flex min-w-0 flex-1 items-center gap-2 last:flex-none">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: stop === from ? color : stop === to ? '#E63946' : '#52525b' }} />
          <span className={`shrink-0 ${stop === from ? 'font-semibold text-text-primary' : 'text-text-muted'}`}>{stop}</span>
          {i < stops.length - 1 && <span className="h-px min-w-4 flex-1 border-t border-dashed border-border-light" />}
        </div>
      ))}
    </div>
  );
}

function RouteCard({ trips, isToday, nowMinutes, t }: { trips: BusSchedule[]; isToday: boolean; nowMinutes: number; t: Text }) {
  const [expanded, setExpanded] = useState(false);
  const first = trips[0];
  const line = lineOf(first.busCode);
  const stops = routeStops(first);
  const nextIndex = isToday ? trips.findIndex((s) => toMinutes(s.departureTime) >= nowMinutes) : -1;
  const start = isToday && !expanded && nextIndex >= 0 ? nextIndex : 0;
  const visible = expanded ? trips : trips.slice(start, start + VISIBLE_TIMES);
  const allPassed = isToday && nextIndex === -1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface p-5 md:p-6"
    >
      <span className="absolute inset-y-6 left-0 w-1 rounded-r-full" style={{ backgroundColor: line.color }} />
      <div className="flex items-center gap-3">
        <span className="shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold text-white" style={{ backgroundColor: line.color }}>{line.label}</span>
        <h3 className="truncate text-lg font-bold">{stops.join(' → ')}</h3>
      </div>
      {first.busName && first.busCode !== 'DOLMUS' && <p className="mt-1 truncate text-sm text-text-muted">{first.busName}</p>}
      <StopLine stops={stops} from={first.from} to={first.to} color={line.color} />

      {allPassed && !expanded ? (
        <p className="mt-4 text-sm text-text-muted">{t.noMoreToday}</p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {visible.map((s) => {
            const mins = toMinutes(s.departureTime) - nowMinutes;
            const past = isToday && mins < 0;
            const isNext = isToday && s === trips[nextIndex];
            return (
              <div
                key={s.id}
                className={`rounded-2xl border px-2 py-2.5 text-center ${isNext ? '' : 'border-border bg-surface-light'} ${past ? 'opacity-35' : ''}`}
                style={isNext ? { backgroundColor: `${line.color}26`, borderColor: `${line.color}66` } : undefined}
              >
                <p className="text-base font-bold" style={isNext ? { color: line.color } : undefined}>{s.departureTime}</p>
                {isToday && !past && mins < 180 && <p className="text-[11px] text-text-muted">{mins} {t.min}</p>}
              </div>
            );
          })}
        </div>
      )}
      {(trips.length > VISIBLE_TIMES || allPassed) && (
        <button onClick={() => setExpanded((v) => !v)} className="mt-4 text-sm font-semibold text-primary">
          {expanded ? t.showLess : `${t.showAll} (${trips.length})`}
        </button>
      )}
    </motion.div>
  );
}

function Select({ label, value, options, onChange, anywhere }: { label: string; value: string; options: string[]; onChange: (v: string) => void; anywhere?: string }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">{label}</span>
      <span className="flex items-center gap-2">
        <MapPin className="h-5 w-5 shrink-0 text-primary" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 cursor-pointer appearance-none truncate bg-transparent text-xl font-bold text-text-primary outline-none md:text-2xl"
        >
          {anywhere && <option value="" className="bg-surface">{anywhere}</option>}
          {options.map((o) => (
            <option key={o} value={o} className="bg-surface">{o}</option>
          ))}
        </select>
      </span>
    </label>
  );
}

export default function UlasimPage() {
  const locale = useLocale();
  const t = TEXT[locale === 'en' ? 'en' : 'tr'];
  const nowMinutes = useNowMinutes();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('İYTE');
  const [to, setTo] = useState('');
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    fetchSchedules().then((data) => {
      setSchedules(data);
      setLoading(false);
    });
  }, []);

  const todayIndex = new Date().getDay();
  const selectedDay = WEEK[(todayIndex + dayOffset) % 7];
  const isToday = dayOffset === 0;

  const origins = useMemo(() => Array.from(new Set(schedules.filter((s) => s.from !== s.to).map((s) => s.from))).sort((a, b) => a.localeCompare(b, 'tr')), [schedules]);
  const destinations = useMemo(() => Array.from(new Set(schedules.filter((s) => s.from === from && s.to !== from).map((s) => s.to))).sort((a, b) => a.localeCompare(b, 'tr')), [schedules, from]);

  const nextTrips = useMemo(() => {
    const seen = new Set<string>();
    return schedules
      .filter((s) => s.dayOfWeek === WEEK[todayIndex] && toMinutes(s.departureTime) >= nowMinutes && s.from !== s.to)
      .sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime))
      .filter((s) => {
        const key = `${s.busCode}|${s.busName}|${s.from}|${s.departureTime}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, NEXT_COUNT);
  }, [schedules, todayIndex, nowMinutes]);

  const routes = useMemo(() => {
    const groups = new Map<string, BusSchedule[]>();
    for (const s of schedules) {
      if (s.dayOfWeek !== selectedDay || s.from !== from || s.to === s.from || (to && s.to !== to)) continue;
      const key = `${s.busCode}|${s.from}|${s.to}|${s.busName ?? ''}`;
      groups.set(key, [...(groups.get(key) ?? []), s]);
    }
    return Array.from(groups.entries()).map(([key, trips]) => [key, trips.sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime))] as const);
  }, [schedules, selectedDay, from, to]);

  const swap = () => {
    if (!to) return;
    setFrom(to);
    setTo(from);
  };

  return (
    <>
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} image="kampus-yol" compact />

      <section className="pb-6 pt-4">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-text-secondary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            {t.next}
          </p>
        </div>
        <div className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-[300px] w-[85vw] max-w-[520px] shrink-0 animate-pulse rounded-[2rem] bg-surface md:h-[320px]" />)
            : nextTrips.map((trip) => <NextCard key={trip.id} trip={trip} nowMinutes={nowMinutes} t={t} />)}
          {!loading && nextTrips.length === 0 && (
            <div className="flex h-40 w-full items-center justify-center rounded-[2rem] border border-border bg-surface text-text-muted">{t.noNext}</div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex items-center gap-3 rounded-[2rem] border border-border bg-surface p-5 md:p-7">
            <Select label={t.from} value={from} options={origins} onChange={(v) => { setFrom(v); setTo(''); }} />
            <button
              onClick={swap}
              disabled={!to}
              aria-label="swap"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform duration-300 hover:rotate-180 disabled:opacity-40"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </button>
            <Select label={t.to} value={to} options={destinations} onChange={setTo} anywhere={t.anywhere} />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 7 }).map((_, offset) => {
              const active = offset === dayOffset;
              const label = offset === 0 ? t.today : offset === 1 ? t.tomorrow : t.days[(todayIndex + offset) % 7];
              return (
                <button
                  key={offset}
                  onClick={() => setDayOffset(offset)}
                  className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${active ? 'text-white' : 'border border-border-light text-text-secondary hover:text-text-primary'}`}
                >
                  {active && <motion.span layoutId="day-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-baseline gap-3">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">{t.lines}</h2>
            <span className="rounded-full bg-primary/15 px-3 py-0.5 text-sm font-bold text-primary">{routes.length}</span>
          </div>

          <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-surface" />)
                : routes.map(([key, trips]) => <RouteCard key={`${key}|${selectedDay}`} trips={trips} isToday={isToday} nowMinutes={nowMinutes} t={t} />)}
            </AnimatePresence>
          </div>
          {!loading && routes.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface py-16 text-text-muted">
              <Bus className="h-10 w-10" />
              <p>{t.noTrips}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
