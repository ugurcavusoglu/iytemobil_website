'use client';

import { useEffect, useRef } from 'react';
import { motion, transform, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';

export const EXPLODE_VIDEO = {
  frameCount: 0,
  path: '/videos/explode/frame_',
  ext: 'webp',
  width: 1920,
  height: 1080,
  slots: [
    { left: 14, top: 26 },
    { left: 14, top: 66 },
    { left: 46, top: 10 },
    { left: 86, top: 40 },
    { left: 87, top: 72 },
  ],
};

const frameUrl = (i: number) => `${EXPLODE_VIDEO.path}${String(i + 1).padStart(4, '0')}.${EXPLODE_VIDEO.ext}`;

export function ExplodeFrames({ progress, cards }: { progress: MotionValue<number>; cards: React.ReactNode[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const current = useRef(-1);
  const frameIndex = useTransform(progress, (v) => Math.round(transform(v, [0.08, 0.6], [0, EXPLODE_VIDEO.frameCount - 1])));
  const cardsOpacity = useTransform(progress, (v) => transform(v, [0.5, 0.62], [0, 1]));

  const draw = (i: number) => {
    const img = images.current[i];
    const canvas = canvasRef.current;
    if (!canvas || !img?.complete || current.current === i) return;
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    current.current = i;
  };

  useEffect(() => {
    images.current = Array.from({ length: EXPLODE_VIDEO.frameCount }, (_, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(i);
      if (i === 0) img.onload = () => draw(0);
      return img;
    });
  }, []);

  useMotionValueEvent(frameIndex, 'change', (i) => requestAnimationFrame(() => draw(i)));

  return (
    <div className="relative aspect-video w-full max-w-[1400px]">
      <canvas ref={canvasRef} width={EXPLODE_VIDEO.width} height={EXPLODE_VIDEO.height} className="h-full w-full" />
      {cards.map((card, i) => {
        const slot = EXPLODE_VIDEO.slots[i];
        if (!slot) return null;
        return (
          <motion.div key={i} style={{ left: `${slot.left}%`, top: `${slot.top}%`, opacity: cardsOpacity }} className="absolute -translate-x-1/2 -translate-y-1/2 scale-75 md:scale-90 xl:scale-100">
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}
