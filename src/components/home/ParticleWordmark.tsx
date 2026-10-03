'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion, transform, useInView, useScroll, useTransform } from 'framer-motion';

const Scene = dynamic(() => import('./ParticleWordmarkScene'), { ssr: false });

export function ParticleWordmark() {
  const t = useTranslations('home.particles');
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { margin: '600px 0px', once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const captionOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.4, 0.5, 0.7, 0.8], [0, 1, 1, 0]));
  const captionY = useTransform(scrollYProgress, [0.4, 0.55], [30, 0]);

  return (
    <section ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(230,57,70,0.12),transparent_60%)]" />
        {near && <Scene progress={scrollYProgress} />}
        <motion.div style={{ opacity: captionOpacity, y: captionY }} className="pointer-events-none absolute inset-x-0 bottom-[14vh] px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary">{t('eyebrow')}</p>
          <p className="mt-3 text-2xl font-bold md:text-4xl">{t('title')}</p>
        </motion.div>
      </div>
    </section>
  );
}
