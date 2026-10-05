'use client';

import { useEffect, useRef } from 'react';
import { motion, transform, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion';

export const EXPLODE_VIDEO = {
  frameCount: 121,
  path: '/videos/explode/frame_',
  width: 1920,
  height: 1080,
  slots: [
    { x: 71.6, y: 21.6, w: 13.6, h: 23.1 },
    { x: 71.7, y: 48.6, w: 13.7, h: 22.8 },
    { x: 71.8, y: 75.5, w: 13.7, h: 22.8 },
    { x: 87.3, y: 48.0, w: 13.5, h: 33.0 },
  ],
};

const SCRUB: [number, number] = [0.04, 0.72];
const CARDS_IN: [number, number] = [0.6, 0.75];
const COARSE_STEP = 8;
const frameUrl = (i: number) => `${EXPLODE_VIDEO.path}${String(i + 1).padStart(4, '0')}.webp`;

function loadOrder() {
  const coarse = Array.from({ length: Math.ceil(EXPLODE_VIDEO.frameCount / COARSE_STEP) }, (_, i) => i * COARSE_STEP);
  const rest = Array.from({ length: EXPLODE_VIDEO.frameCount }, (_, i) => i).filter((i) => i % COARSE_STEP !== 0);
  return [...coarse, EXPLODE_VIDEO.frameCount - 1, ...rest];
}

export function ExplodeFrames({ progress, cards }: { progress: MotionValue<number>; cards: React.ReactNode[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(ImageBitmap | null)[]>([]);
  const shown = useRef(-1);
  const wanted = useRef(0);
  const frameIndex = useTransform(progress, (v) => Math.round(transform(v, SCRUB, [0, EXPLODE_VIDEO.frameCount - 1])));
  const cardsOpacity = useTransform(progress, (v) => transform(v, CARDS_IN, [0, 1]));
  const cardsScale = useTransform(progress, (v) => transform(v, CARDS_IN, [0.92, 1]));

  const draw = (i: number) => {
    wanted.current = i;
    let pick = i;
    while (pick > 0 && !frames.current[pick]) pick--;
    const bitmap = frames.current[pick];
    const canvas = canvasRef.current;
    if (!canvas || !bitmap || shown.current === pick) return;
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    shown.current = pick;
  };

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current!;
    canvas.width = Math.min(EXPLODE_VIDEO.width, Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio, 2)));
    canvas.height = Math.round((canvas.width * EXPLODE_VIDEO.height) / EXPLODE_VIDEO.width);
    frames.current = new Array(EXPLODE_VIDEO.frameCount).fill(null);
    const load = async (i: number) => {
      const blob = await fetch(frameUrl(i)).then((r) => r.blob());
      if (cancelled) return;
      frames.current[i] = await createImageBitmap(blob, { resizeWidth: canvas.width, resizeHeight: canvas.height, resizeQuality: 'medium' });
      if (i <= wanted.current) {
        shown.current = -1;
        draw(wanted.current);
      }
    };
    const order = loadOrder();
    (async () => {
      for (let start = 0; start < order.length && !cancelled; start += 6) {
        await Promise.all(order.slice(start, start + 6).map(load));
      }
    })();
    return () => {
      cancelled = true;
      frames.current.forEach((b) => b?.close());
    };
  }, []);

  useMotionValueEvent(frameIndex, 'change', (i) => requestAnimationFrame(() => draw(i)));

  return (
    <div ref={boxRef} className="relative aspect-video w-full [container-type:inline-size]">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0">
        {cards.map((card, i) => {
          const slot = EXPLODE_VIDEO.slots[i];
          if (!slot) return null;
          return (
            <motion.div
              key={i}
              style={{ left: `${slot.x - slot.w / 2}%`, top: `${slot.y - slot.h / 2}%`, width: `${slot.w}%`, height: `${slot.h}%`, opacity: cardsOpacity, scale: cardsScale }}
              className="absolute flex flex-col justify-center overflow-hidden rounded-[1.1cqw] bg-black/65 p-[1.1cqw]"
            >
              {card}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
