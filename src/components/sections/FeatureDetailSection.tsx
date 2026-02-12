'use client';

import { useTranslations } from 'next-intl';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { MessageSquare, MessagesSquare, UtensilsCrossed, Bus } from 'lucide-react';

const details = [
  {
    titleKey: 'featureDetail.socialTitle',
    descKey: 'featureDetail.socialDesc',
    Icon: MessageSquare,
    color: '#dc2626',
    gradient: 'from-red-600/10',
  },
  {
    titleKey: 'featureDetail.chatTitle',
    descKey: 'featureDetail.chatDesc',
    Icon: MessagesSquare,
    color: '#3B82F6',
    gradient: 'from-blue-600/10',
  },
  {
    titleKey: 'featureDetail.foodTitle',
    descKey: 'featureDetail.foodDesc',
    Icon: UtensilsCrossed,
    color: '#F97316',
    gradient: 'from-orange-600/10',
  },
  {
    titleKey: 'featureDetail.transportTitle',
    descKey: 'featureDetail.transportDesc',
    Icon: Bus,
    color: '#22C55E',
    gradient: 'from-green-600/10',
  },
];

export function FeatureDetailSection() {
  const t = useTranslations();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-24">
        {details.map((detail, index) => {
          const isEven = index % 2 === 0;
          const { Icon } = detail;

          return (
            <div
              key={detail.titleKey}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-16`}
            >
              {/* Visual */}
              <ScrollReveal direction={isEven ? 'left' : 'right'} className="flex-1 w-full">
                <div className="relative">
                  <GlowEffect
                    color={`${detail.color}20`}
                    size="lg"
                    className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                  <div className={`relative aspect-[4/3] rounded-2xl bg-gradient-to-br ${detail.gradient} to-transparent border border-white/5 flex items-center justify-center`}>
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${detail.color}15` }}
                    >
                      <Icon className="w-12 h-12" style={{ color: detail.color }} />
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Text */}
              <ScrollReveal direction={isEven ? 'right' : 'left'} className="flex-1">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{ backgroundColor: `${detail.color}15`, color: detail.color }}
                >
                  <Icon className="w-4 h-4" />
                  {t(detail.titleKey)}
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  {t(detail.titleKey)}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {t(detail.descKey)}
                </p>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
