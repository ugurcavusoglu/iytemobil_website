'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, transform, useScroll, useSpring, useTransform } from 'framer-motion';

const COLUMNS = [
  ['mezuniyet-kep', 'kutuphane', 'bahar-kostum'],
  ['konser-gece', 'kampus-panorama', 'hdt-dans', 'gun-batimi'],
  ['bahar-halay', 'amfi', 'cam-bina-havadan'],
  ['hdt-salon', 'bahar-konser', 'sahil', 'topluluk-stant'],
];
const SHIFTS: [number, number][] = [[0, -260], [-120, 220], [60, -320], [-200, 160]];

function Column({ images, shift, progress, className }: { images: string[]; shift: [number, number]; progress: ReturnType<typeof useScroll>['scrollYProgress']; className?: string }) {
  const y = useTransform(progress, [0, 1], shift);
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-4 will-change-transform ${className ?? ''}`}>
      {images.map((name, i) => (
        <motion.div
          key={name}
          initial={{ clipPath: 'inset(100% 0% 0% 0% round 24px)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: i * 0.08 }}
          className={`group relative overflow-hidden rounded-3xl ${i % 2 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}
        >
          <Image src={`/images/iyte/sm/${name}.webp`} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Moments() {
  const t = useTranslations('home.moments');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 140, damping: 32, mass: 0.35 });
  const titleScale = useTransform(scrollYProgress, [0.15, 0.5], [0.85, 1]);
  const titleOpacity = useTransform(scrollYProgress, (v) => transform(v, [0.1, 0.3, 0.75, 0.9], [0, 1, 1, 0]));

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-40">
      <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="pointer-events-none sticky top-[38vh] z-10 mx-auto max-w-5xl px-6 text-center [text-shadow:0_4px_40px_rgba(0,0,0,0.9)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/80">{t('eyebrow')}</p>
        <h2 className="mt-4 text-4xl font-black leading-[1] tracking-tight text-white md:text-7xl">{t('title')}</h2>
      </motion.div>
      <div className="-mt-[20vh] grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-8">
        {COLUMNS.map((images, i) => (
          <Column key={i} images={images} shift={SHIFTS[i]} progress={scrollYProgress} className={i > 1 ? 'hidden md:flex' : ''} />
        ))}
      </div>
    </section>
  );
}
