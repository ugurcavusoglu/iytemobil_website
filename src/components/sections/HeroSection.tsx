'use client';

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Apple, ArrowRight, Play } from 'lucide-react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const t = useTranslations('hero');
  const { scrollY } = useScroll();
  const phoneY = useTransform(scrollY, [0, 600], [0, 80]);
  const glowScale = useTransform(scrollY, [0, 600], [1, 1.4]);
  const words = t('title').split(' ');

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      <motion.div style={{ scale: glowScale }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 animate-aurora rounded-full bg-[radial-gradient(circle,rgba(230,57,70,0.22),transparent_60%)] blur-3xl" />
        <div className="absolute -bottom-1/3 -left-1/4 h-[50vmax] w-[50vmax] animate-aurora rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.10),transparent_60%)] blur-3xl [animation-delay:-9s]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pb-16 pt-28 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-light bg-surface/70 px-4 py-1.5 text-sm text-text-secondary backdrop-blur"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            {t('badge')}
          </motion.div>

          <h1 className="mb-6 text-[2.6rem] font-bold leading-[1.05] tracking-tight md:text-6xl xl:text-7xl">
            {words.map((word, i) => (
              <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.7, ease: EASE }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
            <span className="inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.15 + words.length * 0.07, duration: 0.7, ease: EASE }}
              >
                {t('titleAccent')}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: EASE }}
            className="mb-9 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6, ease: EASE }}
            className="flex flex-wrap items-center gap-3"
          >
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-[0_10px_40px_-10px_rgba(230,57,70,0.7)]"
            >
              <Play className="h-5 w-5 fill-current" />
              {t('googlePlay')}
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl border border-border-light bg-surface/70 px-6 py-3.5 font-semibold text-text-primary transition-colors hover:border-white/20 hover:bg-surface"
            >
              <Apple className="h-5 w-5" />
              {t('appStore')}
            </a>
            <a href="#tour" className="inline-flex items-center gap-1.5 px-2 py-3.5 font-medium text-text-secondary transition-colors hover:text-text-primary">
              {t('learnMore')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </div>

        <motion.div style={{ y: phoneY }} className="relative mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: EASE }}
          >
            <PhoneFrame>
              <video
                className="absolute inset-0 h-full w-full object-cover object-top"
                src="/videos/feed.mp4"
                poster="/videos/feed-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label={t('screenAlt')}
              />
            </PhoneFrame>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
