'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FEATURES } from '@/lib/constants';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import {
  MessageSquare, MessagesSquare, UtensilsCrossed, Bus, Users, Zap,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  MessageSquare, MessagesSquare, UtensilsCrossed, Bus, Users, Zap,
};

export function FeaturesSection() {
  const t = useTranslations();

  return (
    <section id="features" className="section-padding relative">
      <SectionHeading
        title={t('features.sectionTitle')}
        subtitle={t('features.sectionSubtitle')}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {FEATURES.map((feature) => {
          const Icon = iconMap[feature.icon] || MessageSquare;
          return (
            <motion.div
              key={feature.id}
              variants={fadeInUp}
              className="glass-card-hover p-6 group cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <Icon className="w-6 h-6" style={{ color: feature.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">
                {t(feature.titleKey)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t(feature.descriptionKey)}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
