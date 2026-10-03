'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, animate, motion, useInView } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export interface ShowcaseClub {
  id: string;
  name: string;
  logoUrl?: string;
  category: string;
  memberCount?: number;
}

export interface ShowcaseEvent {
  id: string;
  title: string;
  location?: string;
  startDate: string;
  imageUrl?: string | null;
  club?: { name: string };
}

const CATEGORY_COLORS: Record<string, string> = {
  SPORTS: '#f97316', ART: '#a855f7', TECHNOLOGY: '#3b82f6', ARCHITECTURE: '#14b8a6', TRAVEL: '#22c55e',
  MUSIC: '#ec4899', ACADEMIC: '#f59e0b', SOCIAL: '#06b6d4', OTHER: '#a1a1aa',
};
const FEATURED_COUNT = 3;
const GRID_COUNT = 12;

function CountUp({ value, locale, start }: { value: number; locale: string; start: boolean }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!start) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [start, value]);
  return <span>{shown.toLocaleString(locale)}</span>;
}

function ClubLogo({ club, size }: { club: ShowcaseClub; size: number }) {
  const color = CATEGORY_COLORS[club.category] ?? CATEGORY_COLORS.OTHER;
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-2xl"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, ${color}55)`, padding: 2 }}
    >
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-surface">
        {club.logoUrl ? (
          <Image src={club.logoUrl} alt="" fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <span className="font-black" style={{ color, fontSize: size * 0.42 }}>{club.name.charAt(0)}</span>
        )}
      </div>
    </div>
  );
}

export function ClubsShowcase({ clubs, events }: { clubs: ShowcaseClub[]; events: ShowcaseEvent[] }) {
  const t = useTranslations('home.clubs');
  const locale = useLocale();
  const [category, setCategory] = useState('ALL');
  const countersRef = useRef<HTMLDivElement>(null);
  const countersInView = useInView(countersRef, { once: true, amount: 0.5 });

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(clubs.map((c) => c.category))).filter((c) => CATEGORY_COLORS[c])], [clubs]);
  const filtered = category === 'ALL' ? clubs : clubs.filter((c) => c.category === category);
  const featured = filtered.slice(0, FEATURED_COUNT);
  const rest = filtered.slice(FEATURED_COUNT, FEATURED_COUNT + GRID_COUNT);
  const dateFormat = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' });

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-x-0 top-0 h-[70vh]">
        <Image src="/images/iyte/topluluk-stant.webp" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">{t('eyebrow')}</p>
        <div ref={countersRef} className="mt-6 flex flex-wrap items-end gap-x-14 gap-y-4">
          <div>
            <p className="text-7xl font-black leading-none tracking-tighter md:text-9xl"><CountUp value={clubs.length} locale={locale} start={countersInView} /></p>
            <p className="mt-2 text-text-secondary">{t('clubs')}</p>
          </div>
          <div>
            <p className="text-7xl font-black leading-none tracking-tighter text-primary md:text-9xl"><CountUp value={7} locale={locale} start={countersInView} />K+</p>
            <p className="mt-2 text-text-secondary">{t('students')}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c === category;
            const color = CATEGORY_COLORS[c] ?? '#E63946';
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${active ? 'text-white' : 'border-border-light text-text-secondary hover:text-text-primary'}`}
                style={active ? { backgroundColor: c === 'ALL' ? '#E63946' : color, borderColor: 'transparent' } : undefined}
              >
                {c === 'ALL' ? t('all') : t(`categories.${c}`)}
              </button>
            );
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {featured.map((club, i) => {
              const color = CATEGORY_COLORS[club.category] ?? CATEGORY_COLORS.OTHER;
              return (
                <motion.div
                  layout
                  key={club.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-[2rem] border border-border bg-surface p-7"
                >
                  <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-70" style={{ backgroundColor: color }} />
                  <span className="absolute right-7 top-7 text-6xl font-black text-white/5">{String(i + 1).padStart(2, '0')}</span>
                  <ClubLogo club={club} size={72} />
                  <h3 className="mt-6 text-2xl font-bold leading-tight">{club.name}</h3>
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    <span className="rounded-full px-3 py-1 font-semibold" style={{ backgroundColor: `${color}22`, color }}>{t(`categories.${club.category}`)}</span>
                    {!!club.memberCount && (
                      <span className="flex items-center gap-1.5 text-text-secondary"><Users className="h-4 w-4" />{club.memberCount.toLocaleString(locale)} {t('members')}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div layout className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {rest.map((club, i) => (
              <motion.div
                layout
                key={club.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 p-3 backdrop-blur transition-colors hover:border-border-light"
              >
                <ClubLogo club={club} size={44} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{club.name}</p>
                  {!!club.memberCount && <p className="text-xs text-text-muted">{club.memberCount.toLocaleString(locale)} {t('members')}</p>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Link href="/clubs" className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border-light px-6 py-3 font-semibold transition-colors hover:border-primary hover:text-primary">
          {t('seeAll')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>

        {events.length > 0 && (
          <div className="mt-24">
            <h3 className="text-3xl font-black tracking-tight md:text-5xl">{t('upcoming')}</h3>
            <div className="-mx-6 mt-8 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:-mx-12 md:px-12">
              {events.map((event, i) => (
                <motion.article
                  key={event.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative h-[420px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-border md:w-[360px]"
                >
                  {event.imageUrl ? (
                    <Image src={event.imageUrl} alt="" fill sizes="360px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,57,70,0.45),#18181b_70%)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    {event.club && <p className="text-xs font-semibold uppercase tracking-widest text-primary">{event.club.name}</p>}
                    <h4 className="mt-2 line-clamp-3 text-xl font-bold leading-snug">{event.title}</h4>
                    <p className="mt-3 flex items-center gap-2 text-sm text-white/70"><CalendarDays className="h-4 w-4" />{dateFormat.format(new Date(event.startDate))}</p>
                    {event.location && <p className="mt-1 flex items-center gap-2 text-sm text-white/70"><MapPin className="h-4 w-4" />{event.location}</p>}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
