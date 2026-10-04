'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, transform, useScroll, useTransform } from 'framer-motion';
import { Apple, ChevronDown, Play } from 'lucide-react';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';
import { Magnetic } from '@/components/ui/Magnetic';

export function HeroIyte() {
  const t = useTranslations('home.hero');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const maskScale = useTransform(scrollYProgress, [0, 0.42], [1, 40]);
  const maskOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.26, 0.4], [1, 0]));
  const photoScale = useTransform(scrollYProgress, [0, 0.6], [1.25, 1]);
  const introFade = useTransform(scrollYProgress, (v) => transform(v, [0, 0.12], [1, 0]));
  const contentOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.58, 0.75], [0, 1]));
  const contentY = useTransform(scrollYProgress, [0.58, 0.8], [60, 0]);
  const exitFade = useTransform(scrollYProgress, (v) => transform(v, [0.88, 1], [0, 1]));
  const shade = useTransform(scrollYProgress, (v) => transform(v, [0.5, 0.75], [0, 0.65]));

  return (
    <section id="top" ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden">
        <motion.div style={{ scale: photoScale }} className="absolute inset-0 will-change-transform">
          <Image src="/images/iyte/cam-bina.webp" alt="" fill priority sizes="100vw" className="object-cover" />
        </motion.div>

        <motion.div style={{ scale: maskScale, opacity: maskOpacity, transformOrigin: '59% 52%' }} className="absolute inset-0 will-change-transform">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1600 900" aria-hidden>
            <defs>
              <mask id="iyte-mask">
                <rect width="1600" height="900" fill="white" />
                <text x="800" y="470" textAnchor="middle" dominantBaseline="middle" fontSize="470" fontWeight="900" letterSpacing="-28" fontFamily="Inter, system-ui, sans-serif" fill="black">İYTE</text>
              </mask>
            </defs>
            <rect width="1600" height="900" fill="#09090b" mask="url(#iyte-mask)" />
          </svg>
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
            <Magnetic>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-white transition-transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" />
                {t('googlePlay')}
              </a>
            </Magnetic>
            <Magnetic>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-semibold text-black transition-transform hover:scale-105">
                <Apple className="h-5 w-5" />
                {t('appStore')}
              </a>
            </Magnetic>
          </div>
        </motion.div>
        <motion.div style={{ opacity: exitFade }} className="pointer-events-none absolute inset-0 bg-background" />
      </div>
    </section>
  );
}
