'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';

const FAQ_KEYS = [
  'whatIsIyte',
  'isPaid',
  'platforms',
  'activities',
  'clubs',
] as const;

export function FAQSection() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative">
      <SectionHeading
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_KEYS.map((key, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-white text-base">{t(`${key}.q`)}</span>
                <ChevronDown
                  className={`w-5 h-5 text-text-muted flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <p className="px-5 pb-5 text-text-secondary leading-relaxed">
                      {t(`${key}.a`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
