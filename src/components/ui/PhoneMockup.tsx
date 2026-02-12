'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const screenshots = [
  '/images/screenshots/feed.jpg',
  '/images/screenshots/chat.jpg',
  '/images/screenshots/food.jpg',
  '/images/screenshots/clubs.jpg',
  '/images/screenshots/events.jpg',
  '/images/screenshots/profile.jpg',
];

export function PhoneMockup() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 3000); // Her 3 saniyede bir değişir

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-orange-500/20 blur-3xl" />

      {/* Phone frame */}
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-[280px] h-[570px] rounded-[3rem] bg-black p-3 shadow-2xl border border-gray-800"
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20 flex items-center justify-center">
            <div className="w-16 h-4 bg-gray-900 rounded-full" />
          </div>

          {/* Screen */}
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={screenshots[currentIndex]}
                  alt="App Screenshot"
                  fill
                  className="object-contain"
                  sizes="280px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Indicators */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {screenshots.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
