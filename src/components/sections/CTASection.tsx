'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { ArrowUp } from 'lucide-react';

export function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <GlowEffect className="top-1/2 left-1/4 -translate-y-1/2" size="lg" color="rgba(220, 38, 38, 0.08)" />
      <GlowEffect className="top-1/2 right-1/4 -translate-y-1/2" size="md" color="rgba(249, 115, 22, 0.08)" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('title')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary">
              {t('titleAccent')}
            </span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            <ArrowUp className="w-5 h-5" />
            {t('button')}
          </motion.a>
        </ScrollReveal>
      </div>
    </section>
  );
}
