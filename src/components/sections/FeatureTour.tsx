'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Bus, MessageCircle, MessagesSquare, Trophy, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { PhoneFrame } from '@/components/ui/PhoneFrame';

const STEPS: { key: string; screen: string; icon: LucideIcon; color: string }[] = [
  { key: 'social', screen: '/images/screens/feed.webp', icon: MessageCircle, color: '#E63946' },
  { key: 'transport', screen: '/images/screens/transport.webp', icon: Bus, color: '#22c55e' },
  { key: 'food', screen: '/images/screens/food.webp', icon: UtensilsCrossed, color: '#f97316' },
  { key: 'clubs', screen: '/images/screens/events.webp', icon: Users, color: '#8b5cf6' },
  { key: 'chat', screen: '/images/screenshots/chat.jpg', icon: MessagesSquare, color: '#3b82f6' },
  { key: 'points', screen: '/images/screenshots/badges.jpg', icon: Trophy, color: '#eab308' },
];

export function FeatureTour() {
  const t = useTranslations('tour');
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = STEPS[active];

  return (
    <section id="tour" className="relative px-4 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t('eyebrow')}</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{t('title')}</h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="sticky top-24 hidden h-[calc(100vh-8rem)] items-center justify-center md:flex">
            <div className="relative">
              <motion.div
                className="absolute -inset-16 rounded-full blur-3xl"
                animate={{ backgroundColor: `${current.color}33` }}
                transition={{ duration: 0.6 }}
              />
              <PhoneFrame>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.screen}
                    className="absolute inset-0"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <Image src={current.screen} alt={t(`${current.key}.title`)} fill sizes="290px" className="object-cover object-top" />
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>
            </div>
          </div>

          <div>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-index={i}
                  className="flex min-h-[60vh] flex-col justify-center py-10 md:min-h-[80vh]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20%' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`transition-opacity duration-500 ${i === active ? 'md:opacity-100' : 'md:opacity-40'}`}
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${step.color}1f`, color: step.color }}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold md:text-4xl">{t(`${step.key}.title`)}</h3>
                    <p className="mb-6 max-w-md text-lg leading-relaxed text-text-secondary">{t(`${step.key}.description`)}</p>
                    <ul className="flex flex-wrap gap-2">
                      {t(`${step.key}.tags`).split('|').map((tag) => (
                        <li key={tag} className="rounded-full border border-border-light bg-surface px-3 py-1 text-sm text-text-secondary">{tag}</li>
                      ))}
                    </ul>
                    <PhoneFrame className="mx-auto mt-10 w-[230px] md:hidden">
                      <Image src={step.screen} alt={t(`${step.key}.title`)} fill sizes="230px" className="object-cover object-top" />
                    </PhoneFrame>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
