'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { Apple, Smartphone } from 'lucide-react';

export function DownloadSection() {
  const t = useTranslations('download');

  return (
    <section id="download" className="section-padding relative overflow-hidden">
      <GlowEffect className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" size="lg" />

      <SectionHeading
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <ScrollReveal className="max-w-xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* App Store */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full sm:w-auto"
          >
            <div className="glass-card px-6 py-4 flex items-center gap-4 cursor-not-allowed opacity-70">
              <Apple className="w-10 h-10 text-white" />
              <div>
                <p className="text-xs text-text-muted">{t('comingSoon')}</p>
                <p className="text-lg font-semibold text-white">{t('appStore')}</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium animate-glow-pulse">
              {t('comingSoon')}
            </div>
          </motion.div>

          {/* Google Play */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full sm:w-auto"
          >
            <div className="glass-card px-6 py-4 flex items-center gap-4 cursor-not-allowed opacity-70">
              <Smartphone className="w-10 h-10 text-white" />
              <div>
                <p className="text-xs text-text-muted">{t('comingSoon')}</p>
                <p className="text-lg font-semibold text-white">{t('googlePlay')}</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium animate-glow-pulse">
              {t('comingSoon')}
            </div>
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
