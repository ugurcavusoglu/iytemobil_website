'use client';

import { useEffect, useRef } from 'react';
import { motion, transform, useInView, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';

export const EXPLODE_VIDEO = {
  frameCount: 121,
  path: '/videos/explode/frame_',
  width: 1600,
  height: 900,
  slots: [
    { x: 71.6, y: 21.6, w: 13.6, h: 23.1 },
    { x: 71.7, y: 48.6, w: 13.7, h: 22.8 },
    { x: 71.8, y: 75.5, w: 13.7, h: 22.8 },
    { x: 87.3, y: 48.0, w: 13.5, h: 33.0 },
  ],
};

const SCRUB: [number, number] = [0.04, 0.72];
const CARDS_IN: [number, number] = [0.6, 0.75];
const frameUrl = (i: number) => `${EXPLODE_VIDEO.path}${String(i + 1).padStart(4, '0')}.webp`;

export function ExplodeFrames({ progress, cards }: { progress: MotionValue<number>; cards: React.ReactNode[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const shown = useRef(-1);
  const wanted = useRef(0);
  const near = useInView(boxRef, { once: true, margin: '1500px 0px' });
  const frameIndex = useTransform(progress, (v) => Math.round(transform(v, SCRUB, [0, EXPLODE_VIDEO.frameCount - 1])));
  const cardsOpacity = useTransform(progress, (v) => transform(v, CARDS_IN, [0, 1]));
  const cardsScale = useTransform(progress, (v) => transform(v, CARDS_IN, [0.92, 1]));

  const draw = (i: number) => {
    wanted.current = i;
    let pick = i;
    while (pick > 0 && !images.current[pick]?.complete) pick--;
    const img = images.current[pick];
    const canvas = canvasRef.current;
    if (!canvas || !img?.complete || !img.naturalWidth || shown.current === pick) return;
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    shown.current = pick;
  };

  useEffect(() => {
    if (!near) return;
    images.current = Array.from({ length: EXPLODE_VIDEO.frameCount }, (_, i) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (i <= wanted.current) draw(wanted.current);
      };
      img.src = frameUrl(i);
      return img;
    });
  }, [near]);

  useMotionValueEvent(frameIndex, 'change', (i) => requestAnimationFrame(() => draw(i)));

  return (
    <div ref={boxRef} className="relative aspect-video w-full [container-type:inline-size]">
      <canvas ref={canvasRef} width={EXPLODE_VIDEO.width} height={EXPLODE_VIDEO.height} className="h-full w-full" />
      <div className="absolute inset-0 hidden md:block">
        {cards.map((card, i) => {
          const slot = EXPLODE_VIDEO.slots[i];
          if (!slot) return null;
          return (
            <motion.div
              key={i}
              style={{ left: `${slot.x - slot.w / 2}%`, top: `${slot.y - slot.h / 2}%`, width: `${slot.w}%`, height: `${slot.h}%`, opacity: cardsOpacity, scale: cardsScale }}
              className="absolute flex flex-col justify-center overflow-hidden rounded-[1.1cqw] bg-black/60 p-[1.1cqw] backdrop-blur-[2px]"
            >
              {card}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
