'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, transform, useScroll, useSpring, useTransform } from 'framer-motion';
import { Apple, ChevronDown, Play } from 'lucide-react';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';

export function HeroIyte() {
  const t = useTranslations('home.hero');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 140, damping: 32, mass: 0.35 });

  const maskScale = useTransform(scrollYProgress, [0, 0.42], [1, 40]);
  const maskOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.26, 0.4], [1, 0]));
  const photoScale = useTransform(scrollYProgress, [0, 0.6], [1.25, 1]);
  const introFade = useTransform(scrollYProgress, (v) => transform(v, [0, 0.12], [1, 0]));
  const contentOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.58, 0.75], [0, 1]));
  const contentY = useTransform(scrollYProgress, [0.58, 0.8], [60, 0]);
  const shade = useTransform(scrollYProgress, (v) => transform(v, [0.5, 0.75], [0, 0.65]));

  return (
    <section ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden">
        <motion.div style={{ scale: photoScale }} className="absolute inset-0 will-change-transform">
          <Image src="/images/iyte/cam-bina.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>

        <motion.div
          style={{ scale: maskScale, opacity: maskOpacity, transformOrigin: '59% 52%' }}
          className="absolute inset-0 flex items-center justify-center bg-background mix-blend-multiply will-change-transform"
        >
          <span className="select-none text-[38vw] font-black leading-none tracking-[-0.06em] text-white md:text-[30vw]">İYTE</span>
        </motion.div>

        <motion.div style={{ opacity: introFade }} className="pointer-events-none absolute inset-x-0 top-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-text-secondary md:text-sm">{t('eyebrow')}</p>
        </motion.div>
        <motion.div style={{ opacity: introFade }} className="pointer-events-none absolute inset-x-0 bottom-[16vh] text-center">
          <p className="text-lg font-semibold tracking-[0.7em] text-primary md:text-2xl">MOBİL</p>
        </motion.div>
        <motion.div style={{ opacity: introFade }} className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 text-text-muted">
          <span className="text-xs uppercase tracking-[0.3em]">{t('scroll')}</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.div>

        <motion.div style={{ opacity: shade }} className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-[12vh] md:px-16">
          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">
            {t('titleTop')}
            <br />
            <span className="text-primary">{t('titleBottom')}</span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white transition-transform hover:scale-105">
              <Play className="h-5 w-5 fill-current" />
              {t('googlePlay')}
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition-transform hover:scale-105">
              <Apple className="h-5 w-5" />
              {t('appStore')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
