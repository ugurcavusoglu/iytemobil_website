'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const SEEN_KEY = 'iyte-intro-seen';
const INTRO_MS = 2300;
const EASE = [0.76, 0, 0.24, 1] as const;

export function IntroOverlay() {
  const t = useTranslations('home.intro');
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <motion.div
            className="absolute h-[70vmax] w-[70vmax] rounded-full bg-primary/25 blur-[140px]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
          <svg viewBox="0 0 1000 320" className="relative w-[86vw] max-w-[1100px]" aria-label="İYTE">
            <motion.text
              x="50%"
              y="250"
              textAnchor="middle"
              className="font-sans"
              style={{ fontSize: 300, fontWeight: 900, letterSpacing: '-0.04em' }}
              fill="#fafafa"
              stroke="#E63946"
              strokeWidth={3}
              strokeDasharray={1400}
              initial={{ strokeDashoffset: 1400, fillOpacity: 0 }}
              animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
              transition={{ strokeDashoffset: { duration: 1.2, ease: 'easeInOut' }, fillOpacity: { delay: 1, duration: 0.5 } }}
            >
              İYTE
            </motion.text>
          </svg>
          <div className="relative mt-2 overflow-hidden">
            <motion.p
              className="text-xl font-semibold tracking-[0.6em] text-primary md:text-2xl"
              initial={{ y: '120%' }}
              animate={{ y: 0 }}
              transition={{ delay: 1.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              MOBİL
            </motion.p>
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
