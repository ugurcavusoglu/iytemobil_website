'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { SCROLL_SPRING } from '@/lib/motion';
import { SectionHeader } from './SectionHeader';

const PANELS = [
  { key: 'social', screen: '/images/screens/feed.webp', photo: '/images/iyte/sm/konser-kalabalik.webp', color: '#E63946' },
  { key: 'transport', screen: '/images/screens/transport.webp', photo: '/images/iyte/sm/kampus-yol.webp', color: '#22c55e' },
  { key: 'food', screen: '/images/screens/food.webp', photo: '/images/iyte/sm/kampus-panorama.webp', color: '#f97316' },
  { key: 'clubs', screen: '/images/screens/clubs.webp', photo: '/images/iyte/sm/topluluk-stant.webp', color: '#3b82f6' },
  { key: 'events', screen: '/images/screens/events.webp', photo: '/images/iyte/sm/hdt-sahne.webp', color: '#8b5cf6' },
] as const;

function Panel({ panel, index, progress }: { panel: (typeof PANELS)[number]; index: number; progress: MotionValue<number> }) {
  const t = useTranslations('home.rail.items');
  const center = index / (PANELS.length - 1);
  const wordX = useTransform(progress, [center - 0.3, center + 0.3], ['18%', '-18%']);
  const phoneY = useTransform(progress, [center - 0.25, center, center + 0.25], [80, 0, -80]);
  const phoneRotate = useTransform(progress, [center - 0.25, center, center + 0.25], [6, 0, -6]);

  return (
    <div className="relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden">
      <Image src={panel.photo} alt="" fill sizes="100vw" className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 55%, ${panel.color}33, transparent 60%)` }} />

      <motion.span
        style={{ x: wordX, WebkitTextStroke: `2px ${panel.color}` }}
        className="pointer-events-none absolute select-none whitespace-nowrap text-[26vw] font-black leading-none tracking-tighter text-transparent opacity-40 will-change-transform md:text-[20vw]"
      >
        {t(`${panel.key}.word`)}
      </motion.span>

      <div className="relative mt-[30vh] grid w-full max-w-6xl items-center gap-6 px-6 md:mt-[22vh] md:grid-cols-2 md:gap-10 md:px-12">
        <motion.div style={{ y: phoneY, rotate: phoneRotate }} className="mx-auto">
          <PhoneFrame className="w-[150px] sm:w-[200px] md:w-[240px]">
            <Image src={panel.screen} alt={t(`${panel.key}.title`)} fill sizes="290px" className="object-cover object-top" />
          </PhoneFrame>
        </motion.div>
        <div className="text-center md:text-left">
          <span className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold" style={{ backgroundColor: `${panel.color}22`, color: panel.color }}>
            {String(index + 1).padStart(2, '0')} / {String(PANELS.length).padStart(2, '0')}
          </span>
          <h3 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">{t(`${panel.key}.title`)}</h3>
          <p className="mt-4 text-lg text-text-secondary md:text-xl">{t(`${panel.key}.text`)}</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureRail() {
  const t = useTranslations('home.rail');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scrollYProgress = useSpring(rawProgress, SCROLL_SPRING);
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${(PANELS.length - 1) * 100}vw`]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="features" ref={ref} style={{ height: `${PANELS.length * 100}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-x-0 top-24 z-10 px-6 md:top-28 md:px-16">
          <SectionHeader index="02" eyebrow={t('eyebrow')} title={t('title')} />
        </div>
        <motion.div style={{ x }} className="flex h-full will-change-transform">
          {PANELS.map((panel, i) => (
            <Panel key={panel.key} panel={panel} index={i} progress={scrollYProgress} />
          ))}
        </motion.div>
        <div className="absolute inset-x-6 bottom-8 h-px bg-border-light md:inset-x-12">
          <motion.div style={{ width: bar }} className="h-full bg-primary" />
        </div>
      </div>
    </section>
  );
}
