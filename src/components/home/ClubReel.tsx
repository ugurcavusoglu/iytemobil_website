'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { ArrowRight, Dices, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ClubLogo, categoryColor } from '@/components/club/ClubLogo';
import type { ShowcaseClub } from './ClubsShowcase';

const ROW_H = 76;
const VISIBLE = 5;
const CENTER = Math.floor(VISIBLE / 2);
const SPIN_ROWS = 32;
const SPIN_SECONDS = 2.8;

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function ClubReel({ clubs }: { clubs: ShowcaseClub[] }) {
  const t = useTranslations('home.clubs');
  const locale = useLocale();
  const [strip, setStrip] = useState(() => clubs.slice(0, VISIBLE));
  const [result, setResult] = useState<ShowcaseClub | null>(null);
  const [spinning, setSpinning] = useState(false);
  const y = useMotionValue(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning || clubs.length < 2) return;
    const centerIndex = Math.round(-y.get() / ROW_H) + CENTER;
    const visible = strip.slice(centerIndex - CENTER, centerIndex + CENTER + 1);
    const current = strip[centerIndex];
    const [target] = shuffled(clubs.filter((c) => c.id !== current.id));
    const others = shuffled(clubs.filter((c) => c.id !== target.id));
    const filler = others.slice(0, SPIN_ROWS);
    const tail = others.slice(SPIN_ROWS, SPIN_ROWS + CENTER);
    const next = [...visible, ...filler, target, ...tail];

    setStrip(next);
    setSpinning(true);
    y.set(0);
    animate(y, -(visible.length + filler.length - CENTER) * ROW_H, {
      duration: SPIN_SECONDS,
      ease: [0.15, 0.85, 0.25, 1],
      onComplete: () => {
        setResult(target);
        setSpinning(false);
        if (window.innerWidth < 768) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },
    });
  };

  const color = result ? categoryColor(result.category) : '#E63946';
  const hasPage = result?.slug && result.websitePublished;

  return (
    <div className="mt-16 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] [&>*]:min-w-0">
      <div className="rounded-[2rem] border border-border bg-surface p-4">
        <div className="relative overflow-hidden rounded-3xl bg-background" style={{ height: ROW_H * VISIBLE }}>
          <motion.div style={{ y }} className="will-change-transform">
            {strip.map((club, i) => (
              <div key={`${i}-${club.id}`} className="flex items-center gap-3 px-4" style={{ height: ROW_H }}>
                <ClubLogo name={club.name} logoUrl={club.logoUrl} color={categoryColor(club.category)} size={48} />
                <p className="truncate font-semibold">{club.name}</p>
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-2 rounded-2xl border-2 transition-colors duration-500"
            style={{ top: ROW_H * CENTER, height: ROW_H, borderColor: spinning ? 'rgba(255,255,255,0.12)' : color }}
          />
        </div>
        <button
          onClick={spin}
          disabled={spinning}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
        >
          <Dices className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
          {result ? t('reelAgain') : t('reelSpin')}
        </button>
      </div>

      <div ref={resultRef} className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-7 md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-50 transition-colors duration-700" style={{ background: `radial-gradient(circle, ${color}55, transparent 65%)` }} />
        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-primary">{t('reelEyebrow')}</p>
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-6"
            >
              <ClubLogo name={result.name} logoUrl={result.logoUrl} color={color} size={80} />
              <h3 className="mt-6 text-3xl font-black leading-tight tracking-tight md:text-4xl">{result.name}</h3>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full px-3 py-1 font-semibold" style={{ backgroundColor: `${color}22`, color }}>{t(`categories.${result.category}`)}</span>
                {!!result.memberCount && (
                  <span className="flex items-center gap-1.5 text-text-secondary"><Users className="h-4 w-4" />{result.memberCount.toLocaleString(locale)} {t('members')}</span>
                )}
              </div>
              {result.description && <p className="mt-4 line-clamp-3 leading-relaxed text-text-secondary">{result.description}</p>}
              {hasPage && (
              <Link
                href={`/clubs/${result.slug}`}
                className="group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold transition-colors"
                style={{ backgroundColor: `${color}1f`, color }}
              >
                {t('reelVisit')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              )}
            </motion.div>
          ) : (
            <motion.div key="empty" exit={{ opacity: 0, y: -12 }} className="relative mt-6">
              <h3 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">{t('reelTitle')}</h3>
              <p className="mt-4 max-w-md leading-relaxed text-text-secondary">{t('reelEmpty', { count: `${Math.floor(clubs.length / 10) * 10}+` })}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
