'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const SEEN_KEY = 'iyte-intro-seen';
const INTRO_MS = 1900;

export function IntroOverlay() {
  const t = useTranslations('intro');
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {}
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), INTRO_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="absolute h-[60vmax] w-[60vmax] rounded-full bg-primary/20 blur-[120px]"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <div className="relative flex flex-col items-center gap-5">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image src="/images/logo.png" alt="İYTE Mobil" width={96} height={96} priority className="rounded-3xl" />
            </motion.div>
            <div className="overflow-hidden">
              <motion.p
                className="text-3xl font-bold tracking-tight md:text-4xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                İYTE <span className="text-primary">Mobil</span>
              </motion.p>
            </div>
            <motion.div
              className="h-px w-40 origin-left bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.7, ease: 'easeInOut' }}
            />
          </div>
          <button
            onClick={() => setVisible(false)}
            className="absolute bottom-8 right-8 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            {t('skip')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
