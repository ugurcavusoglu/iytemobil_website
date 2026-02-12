'use client';

import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { STATS } from '@/lib/constants';

export function StatsSection() {
  const t = useTranslations('stats');

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <ScrollReveal>
          <div className="glass-card p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {STATS.map((stat, index) => (
                <div key={stat.labelKey} className="text-center relative">
                  {index > 0 && (
                    <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  )}
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-text-secondary text-sm md:text-base">
                    {t(stat.labelKey.replace('stats.', ''))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
