'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { Apple, Smartphone } from 'lucide-react';
import { PLAY_STORE_URL, APP_STORE_URL } from '@/lib/constants';

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
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-4 flex items-center gap-4 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
            >
              <Apple className="w-10 h-10 text-white" />
              <div>
                <p className="text-xs text-primary font-medium">{t('iosLive')}</p>
                <p className="text-lg font-semibold text-white">{t('appStore')}</p>
              </div>
            </a>
          </motion.div>

          {/* Google Play */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-full sm:w-auto"
          >
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-4 flex items-center gap-4 hover:bg-white/10 hover:border-primary/30 transition-all duration-300"
            >
              <Smartphone className="w-10 h-10 text-white" />
              <div>
                <p className="text-xs text-primary font-medium">{t('androidLive')}</p>
                <p className="text-lg font-semibold text-white">{t('googlePlay')}</p>
              </div>
            </a>
          </motion.div>
        </div>
      </ScrollReveal>
    </section>
  );
}
