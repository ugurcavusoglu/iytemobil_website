'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, transform, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Award, Bus, CalendarDays, Heart, MessageCircle, UtensilsCrossed } from 'lucide-react';
import { SCROLL_SPRING } from '@/lib/motion';
import { SectionHeader } from './SectionHeader';
import { EXPLODE_VIDEO, ExplodeFrames } from './ExplodeFrames';

const OPEN: [number, number, number, number] = [0.12, 0.38, 0.72, 0.9];

interface Piece {
  key: string;
  x: number;
  y: number;
  z: number;
  rotate: number;
  float: number;
  content: React.ReactNode;
}

function useExplode(progress: MotionValue<number>, target: number) {
  return useTransform(progress, (v) => transform(v, OPEN, [0, target, target, 0]));
}

function FloatingPiece({ piece, progress, tiltX, tiltY }: { piece: Piece; progress: MotionValue<number>; tiltX: MotionValue<number>; tiltY: MotionValue<number> }) {
  const x = useExplode(progress, piece.x);
  const y = useExplode(progress, piece.y);
  const z = useExplode(progress, piece.z);
  const rotate = useExplode(progress, piece.rotate);
  const opacity = useTransform(progress, (v) => transform(v, [0.1, 0.22, 0.8, 0.92], [0, 1, 1, 0]));
  const driftX = useTransform(tiltY, (v) => v * piece.z * 0.08);
  const driftY = useTransform(tiltX, (v) => -v * piece.z * 0.08);
  const transformStyle = useMotionTemplate`translate3d(calc(-50% + ${x}px + ${driftX}px), calc(-50% + ${y}px + ${driftY}px), ${z}px) rotate(${rotate}deg)`;

  return (
    <motion.div style={{ transform: transformStyle, opacity }} className="absolute left-1/2 top-1/2 will-change-transform">
      <motion.div animate={{ y: [0, -piece.float, 0], rotate: [0, piece.float / 6, 0] }} transition={{ duration: 4 + piece.float / 6, repeat: Infinity, ease: 'easeInOut' }}>
        {piece.content}
      </motion.div>
    </motion.div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border-light bg-surface/90 p-4 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl ${className}`}>{children}</div>;
}

export function ExplodedPhone() {
  const t = useTranslations('home.explode');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  const tiltX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });

  const sceneRotateY = useTransform(progress, [0, 0.4, 0.9], [-24, -14, -24]);
  const sceneRotateX = useTransform(progress, [0, 0.4, 0.9], [10, 4, 10]);
  const rotateY = useTransform([sceneRotateY, tiltY], ([a, b]: number[]) => a + b);
  const rotateX = useTransform([sceneRotateX, tiltX], ([a, b]: number[]) => a + b);

  const backZ = useExplode(progress, -220);
  const frameZ = useExplode(progress, -80);
  const screenZ = useExplode(progress, 90);
  const screenScale = useExplode(progress, 0.06);
  const backTransform = useMotionTemplate`translateZ(${backZ}px)`;
  const frameTransform = useMotionTemplate`translateZ(${frameZ}px)`;
  const screenTransform = useMotionTemplate`translateZ(${screenZ}px) scale(${useTransform(screenScale, (v) => 1 + v)})`;


  const onMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
    tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 12);
  };

  const pieces: Piece[] = [
    {
      key: 'bus', x: -420, y: -170, z: 180, rotate: -8, float: 14,
      content: (
        <Card className="w-56">
          <p className="text-[10px] font-bold tracking-[0.2em] text-pink-400">{t('nextTrip')}</p>
          <p className="mt-1 text-4xl font-black tracking-tighter">08:25</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary"><Bus className="h-3.5 w-3.5 text-pink-400" />Gülbahçe → İYTE → İzmir</p>
        </Card>
      ),
    },
    {
      key: 'menu', x: 410, y: -190, z: 140, rotate: 7, float: 18,
      content: (
        <Card className="w-56">
          <p className="flex items-center gap-1.5 text-sm font-bold"><UtensilsCrossed className="h-4 w-4 text-orange-400" />{t('menu')}</p>
          <ul className="mt-2 space-y-1 text-xs text-text-secondary">
            <li>Mercimek Çorbası</li>
            <li>Tavuk Sote</li>
            <li>Şehriyeli Pilav</li>
          </ul>
          <span className="mt-2 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">850 kcal</span>
        </Card>
      ),
    },
    {
      key: 'event', x: -440, y: 120, z: 120, rotate: 5, float: 12,
      content: (
        <Card className="w-60 overflow-hidden p-0">
          <div className="relative h-24"><Image src="/images/iyte/sm/hdt-sahne.webp" alt="" fill sizes="240px" className="object-cover" /></div>
          <div className="p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Halk Dansları</p>
            <p className="text-sm font-bold leading-tight">{t('event')}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-text-muted"><CalendarDays className="h-3 w-3" />7 Ekim · 10:30</p>
          </div>
        </Card>
      ),
    },
    {
      key: 'chat', x: 420, y: 110, z: 200, rotate: -6, float: 16,
      content: (
        <div className="space-y-2">
          <div className="w-48 rounded-2xl rounded-bl-md bg-surface-light px-3 py-2 text-xs shadow-xl">{t('chatIn')}</div>
          <div className="ml-10 w-40 rounded-2xl rounded-br-md bg-primary px-3 py-2 text-xs text-white shadow-xl">{t('chatOut')}</div>
        </div>
      ),
    },
    {
      key: 'badge', x: -230, y: -250, z: 260, rotate: -4, float: 20,
      content: (
        <Card className="flex items-center gap-3 py-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400"><Award className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-bold">{t('badge')}</p>
            <p className="text-[11px] text-amber-400">+50 XP</p>
          </div>
        </Card>
      ),
    },
    {
      key: 'like', x: 250, y: -240, z: 240, rotate: 12, float: 22,
      content: (
        <div className="flex items-center gap-2 rounded-full border border-border-light bg-surface/90 px-4 py-2 shadow-xl backdrop-blur-xl">
          <Heart className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-bold">128</span>
          <MessageCircle className="ml-2 h-4 w-4 text-text-secondary" />
          <span className="text-sm font-bold">24</span>
        </div>
      ),
    },
  ];

  return (
    <section id="app" ref={ref} className="relative h-[300vh]">
      <div onMouseMove={onMove} className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden [perspective:1600px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(230,57,70,0.16),transparent_60%)]" />

        <div className="absolute inset-x-0 top-24 z-20 px-6 md:top-28 md:px-16">
          <SectionHeader index="01" eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        </div>

        {EXPLODE_VIDEO.frameCount > 0 ? (
          <div className="mt-[18vh] w-full px-4 md:mt-[10vh]">
            <ExplodeFrames progress={progress} cards={pieces.filter((p) => p.key !== 'like').map((p) => p.content)} />
          </div>
        ) : (
        <motion.div style={{ rotateX, rotateY }} className="relative mt-[40vh] h-[560px] w-[280px] scale-[0.5] [transform-style:preserve-3d] sm:mt-[30vh] sm:scale-[0.65] lg:mt-[24vh] lg:scale-[0.75]">
          <motion.div style={{ transform: backTransform }} className="absolute inset-0 flex items-center justify-center rounded-[2.8rem] border border-border-light bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-2xl">
            <Image src="/images/logo.png" alt="" width={72} height={72} className="rounded-2xl opacity-80" />
          </motion.div>
          <motion.div style={{ transform: frameTransform }} className="absolute inset-0 rounded-[2.8rem] border-[10px] border-zinc-800 shadow-[0_0_60px_rgba(230,57,70,0.25)]" />
          <motion.div style={{ transform: screenTransform }} className="absolute inset-[10px] overflow-hidden rounded-[2.2rem] bg-background">
            <Image src="/images/screens/feed.webp" alt="" fill sizes="280px" className="object-cover object-top" />
          </motion.div>
          {pieces.map((piece) => (
            <FloatingPiece key={piece.key} piece={piece} progress={progress} tiltX={tiltX} tiltY={tiltY} />
          ))}
        </motion.div>
        )}
      </div>
    </section>
  );
}
