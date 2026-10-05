'use client';

import { useEffect } from 'react';
import Lenis, { type VirtualScrollData } from 'lenis';

const EDGE_PX = 2;
const IDLE_MS = 140;
const GESTURE_GAP_MS = 220;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function snapSections(y: number) {
  return [...document.querySelectorAll<HTMLElement>('[data-snap-stops]')].map((section) => {
    const top = section.getBoundingClientRect().top + y;
    const range = section.offsetHeight - window.innerHeight;
    const stops = section.dataset.snapStops!.split(',').map((s) => top + Number(s) * range);
    return { stops, end: top + section.offsetHeight, duration: Number(section.dataset.snapDuration) || null };
  });
}

function snapTarget(y: number, direction: number) {
  for (const { stops, end, duration } of snapSections(y)) {
    if (direction > 0 && y >= stops[0] - EDGE_PX && y < end - EDGE_PX) {
      const next = stops.find((stop) => stop > y + EDGE_PX);
      return next == null ? { y: end, duration: null } : { y: next, duration };
    }
    if (direction < 0 && y > stops[0] + EDGE_PX && y <= end + EDGE_PX) {
      return { y: [...stops].reverse().find((stop) => stop < y - EDGE_PX)!, duration };
    }
  }
  return null;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let animating = false;
    let lastGestureAt = 0;
    let idleTimer = 0;
    let direction = 1;

    const glideTo = ({ y, duration }: { y: number; duration: number | null }) => {
      const distance = Math.abs(y - lenis.scroll);
      animating = true;
      lenis.scrollTo(y, {
        duration: duration ?? Math.min(1.4, Math.max(0.7, (distance / window.innerHeight) * 0.5)),
        easing: easeInOutCubic,
        lock: true,
        onComplete: () => { animating = false; },
      });
    };

    const onGesture = ({ deltaY, event }: VirtualScrollData) => {
      if (!deltaY) return true;
      const now = performance.now();
      const continuingGesture = now - lastGestureAt < GESTURE_GAP_MS;
      lastGestureAt = now;
      const target = snapTarget(lenis.scroll, Math.sign(deltaY));
      if (target == null && !animating) return true;
      if (event.cancelable) event.preventDefault();
      if (animating || continuingGesture || target == null) return false;
      glideTo(target);
      return false;
    };

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, virtualScroll: onGesture });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    lenis.on('scroll', (instance: Lenis) => {
      if (instance.direction) direction = instance.direction;
      window.clearTimeout(idleTimer);
      if (animating) return;
      idleTimer = window.setTimeout(() => {
        const target = snapTarget(lenis.scroll, direction);
        const atStop = snapSections(lenis.scroll).some(({ stops, end }) => [...stops, end].some((s) => Math.abs(s - lenis.scroll) < EDGE_PX * 2));
        if (target != null && !atStop) glideTo(target);
      }, IDLE_MS);
    });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      lenis.destroy();
    };
  }, []);

  return null;
}
