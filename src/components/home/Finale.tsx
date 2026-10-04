'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Apple, Play } from 'lucide-react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';
import { Magnetic } from '@/components/ui/Magnetic';
import { SCROLL_SPRING } from '@/lib/motion';

function Letters({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <motion.span
      className={`inline-block overflow-hidden pb-2 ${className ?? ''}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.035, delayChildren: delay }}
    >
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          variants={{ hidden: { y: '110%' }, shown: { y: 0 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function Finale() {
  const t = useTranslations('home.finale');
  const tHero = useTranslations('home.hero');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scrollYProgress = useSpring(rawProgress, SCROLL_SPRING);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const phoneY = useTransform(scrollYProgress, [0.3, 1], [160, 0]);

  return (
    <section id="download" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={{ scale: photoScale }} className="absolute inset-0">
        <Image src="/images/iyte/mezuniyet-kep.webp" alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-6 py-28 md:grid-cols-[1.3fr_1fr] md:px-12">
        <div>
          <h2 className="text-6xl font-black leading-[0.9] tracking-tighter md:text-[9rem]">
            <Letters text={t('top')} />
            <br />
            <Letters text={t('bottom')} className="text-primary" delay={0.25} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 text-lg text-white/70 md:text-xl"
          >
            {t('text')}
          </motion.p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" />
                {tHero('googlePlay')}
              </a>
            </Magnetic>
            <Magnetic>
              <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-semibold text-black transition-transform hover:scale-105">
                <Apple className="h-5 w-5" />
                {tHero('appStore')}
              </a>
            </Magnetic>
          </div>
        </div>
        <motion.div style={{ y: phoneY }} className="mx-auto hidden md:block">
          <PhoneFrame>
            <video className="absolute inset-0 h-full w-full object-cover object-top" src="/videos/feed.mp4" poster="/videos/feed-poster.jpg" autoPlay muted loop playsInline />
          </PhoneFrame>
        </motion.div>
      </div>
    </section>
  );
}
