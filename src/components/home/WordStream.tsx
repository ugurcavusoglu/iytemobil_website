'use client';

import { useRef } from 'react';
import { useMessages } from 'next-intl';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'framer-motion';

function Row({ words, baseSpeed, outlined }: { words: string[]; baseSpeed: number; outlined?: boolean }) {
  const offset = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [8, -8]);
  const x = useTransform(offset, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    offset.set(offset.get() + direction.current * baseSpeed * (delta / 1000) * (1 + Math.abs(b)));
  });

  const line = words.map((w) => `${w} • `).join('');
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x, skewX: skew }} className="inline-flex">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`pr-6 text-[16vw] font-black leading-[0.95] tracking-tighter md:text-[11vw] ${outlined ? 'text-transparent' : 'text-text-primary'}`}
            style={outlined ? { WebkitTextStroke: '2px #E63946' } : undefined}
          >
            {line}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function WordStream() {
  const messages = useMessages() as { home: { stream: string[] } };
  const words = messages.home.stream;
  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      <Row words={words} baseSpeed={-3} />
      <Row words={[...words].reverse()} baseSpeed={3} outlined />
    </section>
  );
}
