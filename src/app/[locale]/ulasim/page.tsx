'use client';

import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, ArrowRight, RefreshCw } from 'lucide-react';

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

const DEFAULT_COLOR = { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', text: '#E63946', badge: 'rgba(220,38,38,0.15)' };

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

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
            <Bus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">IYTE Mobil</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">{t.title}</h1>
          <p className="text-base text-zinc-400">{t.subtitle}</p>
        </div>

        {/* Day Tabs */}
        <div className="mb-8 flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
          {DAY_ORDER.map((day) => {
            const isActive = selectedDay === day;
            const isToday = day === getCurrentDay();
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: isActive ? '#E63946' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : '#9ca3af',
                  border: isToday && !isActive ? '1px solid rgba(220,38,38,0.4)' : '1px solid transparent',
                }}
              >
                {DAYS[day]}
                {isToday && (
                  <span className="ml-1.5 text-xs opacity-70">({t.today})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-zinc-400">{t.loading}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([busCode, busData]) => {
              const color = BUS_COLORS[busCode] || DEFAULT_COLOR;
              const directionsForDay = Object.entries(busData.directions).filter(
                ([, dir]) => (dir.days[selectedDay]?.length ?? 0) > 0
              );
              if (directionsForDay.length === 0) return null;

              return (
                <div
                  key={busCode}
                  className="rounded-2xl border p-5"
                  style={{ backgroundColor: color.bg, borderColor: color.border }}
                >
                  {/* Bus code badge */}
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-bold"
                      style={{ backgroundColor: color.badge, color: color.text }}
                    >
                      {LINE_LABELS[busCode]?.badge ?? busCode}
                    </div>
                    <p className="font-semibold text-white">{LINE_LABELS[busCode]?.[locale === 'en' ? 'en' : 'tr'] ?? busData.busName}</p>
                  </div>

                  {/* Directions */}
                  <div className="space-y-4">
                    {directionsForDay.map(([dirKey, dir]) => {
                      const daySchedules = dir.days[selectedDay];
                      return (
                        <div key={dirKey}>
                          {/* Direction header */}
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: color.text }}>
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="font-medium">{dir.from}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                              <span className="font-medium">{dir.to}</span>
                            </div>
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{ backgroundColor: color.badge, color: color.text }}
                            >
                              {daySchedules.length} {t.departures}
                            </span>
                          </div>

                          {/* Time grid */}
                          <div className="flex flex-wrap gap-2">
                            {daySchedules.map((s) => (
                              <div
                                key={s.id}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                                style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                              >
                                <Clock className="h-3 w-3" style={{ color: color.text }} />
                                <span className="text-sm font-mono text-white">{s.departureTime}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* No bus for selected day */}
            {Object.values(grouped).every((busData) =>
              Object.values(busData.directions).every((dir) => !dir.days[selectedDay]?.length)
            ) && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
                <Bus className="mx-auto mb-3 h-10 w-10 text-zinc-600" />
                <p className="text-zinc-400">{t.noSchedule}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
