'use client';

import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

const line = { hidden: { y: '110%' }, shown: { y: 0, transition: { duration: 0.8, ease: EASE } } };

export function SectionHeader({ index, eyebrow, title, subtitle, align = 'left', className = '' }: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.06 }}
      className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}
    >
      <motion.div
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.6 } } }}
        className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] ${centered ? 'justify-center' : ''}`}
      >
        <span className="text-primary">{index}</span>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
          className="h-px w-10 origin-left bg-primary/60"
        />
        <span className="text-text-secondary">{eyebrow}</span>
      </motion.div>
      <h2 className="mt-5 text-4xl font-black leading-[1] tracking-tight md:text-6xl">
        {title.split(' ').map((word, i) => (
          <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-1 align-bottom">
            <motion.span variants={line} className="inline-block">{word}</motion.span>
          </span>
        ))}
      </h2>
      {subtitle && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
          className="mt-5 text-lg text-text-secondary md:text-xl"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
