'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EASE_IN_OUT } from '@/lib/motion';
import { SectionHeader } from './SectionHeader';

const COLUMNS = [
  ['mezuniyet-kep', 'kutuphane', 'bahar-kostum'],
  ['konser-gece', 'kampus-panorama', 'hdt-dans', 'gun-batimi'],
  ['bahar-halay', 'amfi', 'cam-bina-havadan'],
  ['hdt-salon', 'bahar-konser', 'sahil', 'topluluk-stant'],
];
const SHIFTS: [number, number][] = [[80, -180], [200, -120], [120, -240], [240, -100]];

function Column({ images, shift, progress, className }: { images: string[]; shift: [number, number]; progress: ReturnType<typeof useScroll>['scrollYProgress']; className?: string }) {
  const y = useTransform(progress, [0, 1], shift);
  return (
    <motion.div style={{ y }} className={`flex flex-col gap-4 will-change-transform ${className ?? ''}`}>
      {images.map((name, i) => (
        <motion.div key={name} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }} className={`relative ${i % 2 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <div className="group absolute inset-0 overflow-hidden rounded-3xl">
          <Image src={`/images/iyte/sm/${name}.webp`} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent" />
          <motion.div
            variants={{ hidden: { scaleY: 1 }, shown: { scaleY: 0, transition: { duration: 1, ease: EASE_IN_OUT, delay: i * 0.08 } } }}
            className="absolute inset-0 origin-top bg-background will-change-transform"
          />
        </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function Moments() {
  const t = useTranslations('home.moments');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <section ref={ref} className="relative overflow-hidden pb-12 pt-28 md:pt-40">
      <div className="mx-auto mb-16 max-w-7xl px-6 md:mb-24 md:px-16">
        <SectionHeader index="03" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-8">
        {COLUMNS.map((images, i) => (
          <Column key={i} images={images} shift={SHIFTS[i]} progress={scrollYProgress} className={i > 1 ? 'hidden md:flex' : ''} />
        ))}
      </div>
    </section>
  );
}
