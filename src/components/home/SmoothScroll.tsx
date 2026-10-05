'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

const IDLE_MS = 140;
const AT_STOP_PX = 4;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function nextSnapTarget(y: number, direction: number) {
  for (const section of document.querySelectorAll<HTMLElement>('[data-snap-stops]')) {
    const top = section.getBoundingClientRect().top + y;
    const range = section.offsetHeight - window.innerHeight;
    if (range <= 0) continue;
    const stops = section.dataset.snapStops!.split(',').map((s) => top + Number(s) * range);
    const end = top + section.offsetHeight;
    if (y <= stops[0] || y >= end) continue;
    if ([...stops, end].some((stop) => Math.abs(stop - y) < AT_STOP_PX)) return null;
    return direction > 0 ? stops.find((stop) => stop > y) ?? end : [...stops].reverse().find((stop) => stop < y) ?? null;
  }
  return null;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    let direction = 1;
    let snapping = false;
    let touching = false;
    let idleTimer = 0;

    const snap = () => {
      if (touching) return;
      const y = lenis.scroll;
      const target = nextSnapTarget(y, direction);
      if (target == null) return;
      snapping = true;
      lenis.scrollTo(target, {
        duration: Math.min(1.6, Math.max(0.6, (Math.abs(target - y) / window.innerHeight) * 0.55)),
        easing: easeInOutCubic,
        onComplete: () => { snapping = false; },
      });
    };

    lenis.on('scroll', (instance: Lenis) => {
      if (instance.direction) direction = instance.direction;
      window.clearTimeout(idleTimer);
      if (!snapping) idleTimer = window.setTimeout(snap, IDLE_MS);
    });

    const onUserInput = () => { snapping = false; };
    const onTouchStart = () => { touching = true; snapping = false; };
    const onTouchEnd = () => {
      touching = false;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(snap, IDLE_MS);
    };
    window.addEventListener('wheel', onUserInput, { passive: true });
    window.addEventListener('keydown', onUserInput);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('keydown', onUserInput);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      lenis.destroy();
    };
  }, []);

  return null;
}
