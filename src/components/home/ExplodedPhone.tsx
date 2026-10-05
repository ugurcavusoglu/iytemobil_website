'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, transform, useScroll, useTransform } from 'framer-motion';
import { Bus, CalendarDays, MessageCircle, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { ExplodeFrames } from './ExplodeFrames';

interface Feature {
  key: string;
  icon: LucideIcon;
  color: string;
  value: string;
}

const FEATURES: Feature[] = [
  { key: 'bus', icon: Bus, color: '#ec4899', value: '08:25' },
  { key: 'menu', icon: UtensilsCrossed, color: '#f97316', value: '850 kcal' },
  { key: 'event', icon: CalendarDays, color: '#a855f7', value: '7 Ekim' },
  { key: 'chat', icon: MessageCircle, color: '#3b82f6', value: '' },
];

function SlotCard({ feature, title, text }: { feature: Feature; title: string; text: string }) {
  const Icon = feature.icon;
  return (
    <>
    <div className="flex h-full items-center justify-center md:hidden" style={{ color: feature.color }}>
      <Icon className="h-[6cqw] w-[6cqw]" />
    </div>
    <div className="hidden h-full flex-col justify-center gap-[0.5cqw] text-left md:flex">
      <span className="flex h-[2.4cqw] w-[2.4cqw] items-center justify-center rounded-[0.7cqw]" style={{ backgroundColor: `${feature.color}33`, color: feature.color }}>
        <Icon className="h-[1.3cqw] w-[1.3cqw]" />
      </span>
      <p className="text-[0.75cqw] font-bold uppercase tracking-[0.15em]" style={{ color: feature.color }}>{title}</p>
      {feature.value && <p className="text-[1.9cqw] font-black leading-none tracking-tight text-white">{feature.value}</p>}
      <p className="text-[0.85cqw] leading-snug text-white/80">{text}</p>
    </div>
    </>
  );
}

export function ExplodedPhone() {
  const t = useTranslations('home.explode');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = scrollYProgress;
  const headerOpacity = useTransform(progress, (v) => transform(v, [0, 0.85, 1], [1, 1, 0]));

  const cards = FEATURES.map((f) => <SlotCard key={f.key} feature={f} title={t(`cards.${f.key}.title`)} text={t(`cards.${f.key}.text`)} />);

  return (
    <section id="app" ref={ref} data-snap-stops="0,0.78" data-snap-duration="1.8" className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div style={{ opacity: headerOpacity }} className="relative z-10 px-6 pt-20 md:px-16 md:pt-24">
          <SectionHeader index="01" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        </motion.div>

        <div className="relative mx-auto mt-6 w-full max-w-[1200px] md:-mt-6">
          <ExplodeFrames progress={progress} cards={cards} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 px-6 md:hidden">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-3">
                <Icon className="h-4 w-4 shrink-0" style={{ color: f.color }} />
                <span className="text-xs font-semibold">{t(`cards.${f.key}.title`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
