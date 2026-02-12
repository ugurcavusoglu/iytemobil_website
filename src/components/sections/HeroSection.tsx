'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';
import { GlowEffect } from '@/components/ui/GlowEffect';
import dynamic from 'next/dynamic';

const PhoneScene = dynamic(() => import('@/components/three/PhoneScene').then(m => m.PhoneScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-96 rounded-3xl bg-surface border border-white/10 animate-pulse" />
    </div>
  ),
});

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="top-1/4 left-1/2 -translate-x-1/2" size="lg" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              IYTE Mobil
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="block"
              >
                {t('title')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-500 to-primary"
              >
                {t('titleAccent')}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-text-secondary text-lg md:text-xl max-w-lg mb-8 leading-relaxed"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#download"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
              >
                <Download className="w-5 h-5" />
                {t('cta')}
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold text-white transition-all duration-300"
              >
                {t('learnMore')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Right - 3D Phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[500px] lg:h-[600px] hidden md:block"
          >
            <PhoneScene />
          </motion.div>

          {/* Mobile fallback - simple phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="md:hidden flex justify-center"
          >
            <div className="relative w-56 h-[440px] rounded-[2.5rem] bg-surface border-2 border-white/10 p-2 shadow-2xl">
              <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-primary/20 via-surface to-surface flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">iM</span>
                  </div>
                  <p className="text-text-secondary text-sm">IYTE Mobil</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <ChevronDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
