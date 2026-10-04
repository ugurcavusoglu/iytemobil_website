'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, transform, type MotionValue } from 'framer-motion';

const VIEW_W = 1600;
const VIEW_H = 900;
const STEP = 7;
const STEM_ROW = 560;
const WORD_W = 1020;
const MOUSE_RADIUS = 90;
const SETTLED_ALPHA = 0.4;
const FORM_MS = 1500;

function drawWord(ctx: CanvasRenderingContext2D, font: string) {
  ctx.font = font;
  ctx.letterSpacing = '-28px';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('İYTE', VIEW_W / 2, 470);
}

function rasterizeWord(font: string) {
  const canvas = document.createElement('canvas');
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  drawWord(ctx, font);
  const data = ctx.getImageData(0, 0, VIEW_W, VIEW_H).data;
  const filled = (x: number, y: number) => data[(y * VIEW_W + x) * 4 + 3] > 128;

  const points: number[] = [];
  for (let y = 0; y < VIEW_H; y += STEP) {
    for (let x = 0; x < VIEW_W; x += STEP) {
      if (filled(x, y)) points.push(x, y);
    }
  }

  const runs: [number, number][] = [];
  for (let x = 0; x < VIEW_W; x++) {
    if (!filled(x, STEM_ROW)) continue;
    const start = x;
    while (x < VIEW_W && filled(x, STEM_ROW)) x++;
    runs.push([start, x]);
  }
  const stem = runs[2] ?? [VIEW_W / 2, VIEW_W / 2];
  return { points, focus: { x: (stem[0] + stem[1]) / 2, y: STEM_ROW } };
}

export function HeroWordmark({ progress }: { progress: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('pointermove', onMove);
    let frame = 0;
    let cancelled = false;
    let stopLetters = () => {};
    let removeResize = () => {};

    const font = `900 470px ${getComputedStyle(document.body).fontFamily}`;
    document.fonts.load(font, 'İYTE').then(() => {
      if (cancelled) return;
      const { points, focus } = rasterizeWord(font);
      const count = points.length / 2;
      const pos = new Float32Array(count * 2);
      const delay = new Float32Array(count);
      const red = new Uint8Array(count);
      let width = 0;
      let height = 0;
      let scale = 1;
      let offsetX = 0;
      let offsetY = 0;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        scale = Math.max(width / VIEW_W, Math.min(height / VIEW_H, (width * 0.9) / WORD_W));
        offsetX = (width - VIEW_W * scale) / 2;
        offsetY = (height - VIEW_H * scale) / 2;
      };
      resize();
      window.addEventListener('resize', resize);
      removeResize = () => window.removeEventListener('resize', resize);

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(width, height) * (0.5 + Math.random() * 0.4);
        pos[i * 2] = width / 2 + Math.cos(angle) * radius;
        pos[i * 2 + 1] = height / 2 + Math.sin(angle) * radius;
        delay[i] = Math.random() * 0.35;
        red[i] = Math.random() < 0.3 ? 1 : 0;
      }

      let letters = reduceMotion ? 1 : 0;
      if (!reduceMotion) {
        const controls = animate(0, 1, { delay: (FORM_MS * 0.8) / 1000, duration: 0.9, ease: 'easeInOut', onUpdate: (v) => { letters = v; } });
        stopLetters = () => controls.stop();
      }

      const drawMask = (alpha: number, zoom: number) => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, width, height);
        if (letters === 0) return;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = letters;
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        const center = transform(zoom, [1, 8], [0, 1]);
        ctx.translate(focus.x + (VIEW_W / 2 - focus.x) * center, focus.y + (VIEW_H / 2 - focus.y) * center);
        ctx.scale(zoom, zoom);
        ctx.translate(-focus.x, -focus.y);
        drawWord(ctx, font);
        ctx.restore();
      };

      const drawParticles = (alpha: number, now: number) => {
        const elapsed = (now - start) / FORM_MS;
        const settle = Math.min(1, Math.max(0, (elapsed - 0.85) / 0.6));
        const size = Math.max(1.4, 2.2 * scale);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha * (1 - settle * (1 - SETTLED_ALPHA));
        for (let pass = 0; pass < 2; pass++) {
          ctx.fillStyle = pass ? '#E63946' : '#fafafa';
          for (let i = 0; i < count; i++) {
            if (red[i] !== pass) continue;
            const ix = i * 2;
            const t = Math.min(1, Math.max(0, (elapsed - delay[i]) / 0.65));
            let tx = offsetX + points[ix] * scale + Math.sin(now * 0.0012 + i) * 1.2;
            let ty = offsetY + points[ix + 1] * scale + Math.cos(now * 0.001 + i * 0.7) * 1.2;
            const dx = tx - mouse.x;
            const dy = ty - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_RADIUS) {
              const push = (1 - dist / MOUSE_RADIUS) * 36;
              tx += (dx / (dist || 1)) * push;
              ty += (dy / (dist || 1)) * push;
            }
            if (t > 0) {
              const pull = 0.06 + t * 0.16;
              pos[ix] += (tx - pos[ix]) * pull;
              pos[ix + 1] += (ty - pos[ix + 1]) * pull;
            }
            ctx.fillRect(pos[ix], pos[ix + 1], size, size);
          }
        }
      };

      const start = performance.now();
      let idle = false;
      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);
        const p = progress.get();
        const maskAlpha = transform(p, [0.26, 0.4], [1, 0]);
        const particleAlpha = reduceMotion ? 0 : transform(p, [0, 0.05], [1, 0]);
        if (maskAlpha === 0 && particleAlpha === 0) {
          if (!idle) ctx.clearRect(0, 0, width, height);
          idle = true;
          return;
        }
        idle = false;
        ctx.clearRect(0, 0, width, height);
        if (maskAlpha > 0) drawMask(maskAlpha, transform(p, [0, 0.42], [1, 60]));
        if (particleAlpha > 0) drawParticles(particleAlpha, now);
      };
      frame = requestAnimationFrame(tick);
      setReady(true);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stopLetters();
      removeResize();
      window.removeEventListener('pointermove', onMove);
    };
  }, [progress]);

  return (
    <>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
      {!ready && <div className="absolute inset-0 bg-background" />}
    </>
  );
}
