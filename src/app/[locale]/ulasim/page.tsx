'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';

const API_URL = 'https://api.iytemobil.com/api';

const DAYS_TR: Record<string, string> = {
  MONDAY: 'Pazartesi',
  TUESDAY: 'Salı',
  WEDNESDAY: 'Çarşamba',
  THURSDAY: 'Perşembe',
  FRIDAY: 'Cuma',
  SATURDAY: 'Cumartesi',
  SUNDAY: 'Pazar',
};

const DAYS_EN: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const getCurrentDay = (): string => {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  return days[new Date().getDay()];
};

interface BusSchedule {
  id: string;
  busCode: string;
  busName: string;
  dayOfWeek: string;
  departureTime: string;
  from: string;
  to: string;
  fromLocation?: string;
  toLocation?: string;
}

interface GroupedSchedules {
  [busCode: string]: {
    busName: string;
    directions: {
      [directionKey: string]: {
        from: string;
        to: string;
        days: { [day: string]: BusSchedule[] };
      };
    };
  };
}

async function fetchAllSchedules(): Promise<BusSchedule[]> {
  try {
    const res = await fetch(`${API_URL}/bus`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && !data.schedules) {
      return Object.values(data).flat() as BusSchedule[];
    }
    if (data.schedules) return data.schedules;
    return [];
  } catch {
    return [];
  }
}

function groupSchedules(schedules: BusSchedule[]): GroupedSchedules {
  const grouped: GroupedSchedules = {};
  for (const s of schedules) {
    const from = s.from ?? s.fromLocation ?? '';
    const to = s.to ?? s.toLocation ?? '';
    if (!grouped[s.busCode]) {
      grouped[s.busCode] = { busName: s.busName, directions: {} };
    }
    const dirKey = `${from}→${to}`;
    if (!grouped[s.busCode].directions[dirKey]) {
      grouped[s.busCode].directions[dirKey] = { from, to, days: {} };
    }
    if (!grouped[s.busCode].directions[dirKey].days[s.dayOfWeek]) {
      grouped[s.busCode].directions[dirKey].days[s.dayOfWeek] = [];
    }
    grouped[s.busCode].directions[dirKey].days[s.dayOfWeek].push(s);
  }
  for (const code of Object.keys(grouped)) {
    for (const dir of Object.keys(grouped[code].directions)) {
      for (const day of Object.keys(grouped[code].directions[dir].days)) {
        grouped[code].directions[dir].days[day].sort((a, b) =>
          a.departureTime.localeCompare(b.departureTime)
        );
      }
    }
  }
  return grouped;
}

const BUS_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  '882': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#3b82f6', badge: 'rgba(59,130,246,0.15)' },
  '883': { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', text: '#8b5cf6', badge: 'rgba(139,92,246,0.15)' },
  '982': { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: '#10b981', badge: 'rgba(16,185,129,0.15)' },
  'RING': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b', badge: 'rgba(245,158,11,0.15)' },
  'DOLMUS': { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', text: '#ec4899', badge: 'rgba(236,72,153,0.15)' },
};

const LINE_LABELS: Record<string, { tr: string; en: string; badge: string }> = {
  DOLMUS: { tr: 'Gülbahçe – İYTE – İzmir / Urla dolmuşları', en: 'Gülbahçe – IZTECH – İzmir / Urla minibuses', badge: 'DOLMUŞ' },
  RING: { tr: 'Ring servisi', en: 'Campus shuttle', badge: 'RING' },
};

const DEFAULT_COLOR = { bg: 'rgba(230,57,70,0.08)', border: 'rgba(230,57,70,0.25)', text: '#E63946', badge: 'rgba(230,57,70,0.15)' };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function UlasimPage() {
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
  const [locale, setLocale] = useState('tr');

  useEffect(() => {
    const lang = document.documentElement.lang || navigator.language || 'tr';
    setLocale(lang.startsWith('en') ? 'en' : 'tr');
  }, []);

  useEffect(() => {
    fetchAllSchedules().then((data) => {
      setSchedules(data);
      setLoading(false);
    });
  }, []);

  const grouped = groupSchedules(schedules);
  const DAYS = locale === 'en' ? DAYS_EN : DAYS_TR;

  const t = {
    title: locale === 'en' ? 'Bus Schedules' : 'Otobüs Saatleri',
    subtitle: locale === 'en'
      ? 'ESHOT bus lines and campus ring/minibus schedules'
      : 'ESHOT otobüs hatları ve kampüs ring/dolmuş saatleri',
    noSchedule: locale === 'en' ? 'No schedule for this day.' : 'Bu gün için sefer bulunamadı.',
    from: locale === 'en' ? 'From' : 'Nereden',
    to: locale === 'en' ? 'To' : 'Nereye',
    departures: locale === 'en' ? 'departures' : 'sefer',
    loading: locale === 'en' ? 'Loading...' : 'Yükleniyor...',
    today: locale === 'en' ? 'Today' : 'Bugün',
  };

  const hasNoSchedule = Object.values(grouped).every((busData) =>
    Object.values(busData.directions).every((dir) => !dir.days[selectedDay]?.length)
  );

  return (
    <>
      <PageHero eyebrow="ESHOT · Ring · Dolmuş" title={t.title} subtitle={t.subtitle} image="kampus-yol" />

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="-mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:px-0"
          >
            {DAY_ORDER.map((day) => {
              const isActive = selectedDay === day;
              const isToday = day === getCurrentDay();
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'border-transparent bg-primary text-white shadow-lg shadow-primary/20'
                      : isToday
                        ? 'border-primary/40 bg-surface text-text-primary'
                        : 'border-border-light text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {DAYS[day]}
                  {isToday && <span className="ml-1.5 text-xs font-medium opacity-70">({t.today})</span>}
                </button>
              );
            })}
          </motion.div>

          {loading ? (
            <div className="grid items-start gap-4 lg:grid-cols-2" aria-label={t.loading}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl border border-border bg-surface p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-12 w-14 rounded-2xl bg-surface-light" />
                    <div className="h-4 w-40 rounded-full bg-surface-light" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <div key={j} className="h-8 w-20 rounded-full bg-surface-light" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : hasNoSchedule ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-border bg-surface px-6 py-16 text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-light">
                <Bus className="h-7 w-7 text-text-muted" />
              </div>
              <p className="text-lg font-bold text-text-primary">{t.noSchedule}</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedDay}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.07 }}
              className="grid items-start gap-4 lg:grid-cols-2"
            >
              {Object.entries(grouped).map(([busCode, busData]) => {
                const color = BUS_COLORS[busCode] || DEFAULT_COLOR;
                const directionsForDay = Object.entries(busData.directions).filter(
                  ([, dir]) => (dir.days[selectedDay]?.length ?? 0) > 0
                );
                if (directionsForDay.length === 0) return null;

                return (
                  <motion.div
                    key={busCode}
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6"
                  >
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-25 blur-3xl"
                      style={{ backgroundColor: color.text }}
                    />
                    <div className="relative mb-6 flex items-center gap-3">
                      <div
                        className="flex h-12 min-w-14 items-center justify-center rounded-2xl px-3 text-base font-black tracking-tight"
                        style={{ backgroundColor: color.badge, color: color.text }}
                      >
                        {LINE_LABELS[busCode]?.badge ?? busCode}
                      </div>
                      <p className="min-w-0 text-lg font-bold leading-snug text-text-primary">
                        {LINE_LABELS[busCode]?.[locale === 'en' ? 'en' : 'tr'] ?? busData.busName}
                      </p>
                    </div>

                    <div className="relative space-y-6">
                      {directionsForDay.map(([dirKey, dir]) => {
                        const daySchedules = dir.days[selectedDay];
                        return (
                          <div key={dirKey}>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                              <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm font-semibold" style={{ color: color.text }}>
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span>{dir.from}</span>
                                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                                <span>{dir.to}</span>
                              </div>
                              <span
                                className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                                style={{ backgroundColor: color.badge, color: color.text }}
                              >
                                {daySchedules.length} {t.departures}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {daySchedules.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-center gap-1.5 rounded-full border border-border bg-surface-light px-3 py-1.5"
                                >
                                  <Clock className="h-3 w-3" style={{ color: color.text }} />
                                  <span className="font-mono text-sm tabular-nums text-text-primary">{s.departureTime}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
