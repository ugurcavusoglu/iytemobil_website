'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  compact?: boolean;
  children?: React.ReactNode;
}

export function PageHero({ eyebrow, title, subtitle, image, compact, children }: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const words = title.split(' ');

  return (
    <section ref={ref} className={`relative flex items-end overflow-hidden ${compact ? 'min-h-[46vh]' : 'min-h-[62vh]'}`}>
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0 will-change-transform">
        <Image src={`/images/iyte/${image}.webp`} alt="" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-32 md:px-12 md:pb-16">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block rounded-full border border-border-light bg-background/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-primary backdrop-blur"
          >
            {eyebrow}
          </motion.span>
        )}
        <h1 className="mt-5 text-[2.6rem] font-black leading-[0.95] tracking-tighter [overflow-wrap:anywhere] [hyphens:auto] sm:text-5xl md:text-8xl">
          {words.map((word, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-1 align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 max-w-2xl text-lg text-text-secondary md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="mt-8">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
