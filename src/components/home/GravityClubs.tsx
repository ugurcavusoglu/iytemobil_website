'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface GravityClub {
  id: string;
  name: string;
  logoUrl?: string;
  color: string;
}

const MAX_BODIES = 28;
const WALL = 200;

export function GravityClubs({ clubs, hint }: { clubs: GravityClub[]; hint: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(boxRef, { once: true, amount: 0.4 });
  const [ready, setReady] = useState(false);
  const items = clubs.slice(0, MAX_BODIES);

  useEffect(() => {
    if (!inView) return;
    let cleanup = () => {};
    let cancelled = false;

    import('matter-js').then((Matter) => {
      if (cancelled) return;
      const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;
      const box = boxRef.current!;
      const width = box.clientWidth;
      const height = box.clientHeight;
      const size = width < 640 ? 52 : 76;

      const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const walls = [
        Bodies.rectangle(width / 2, height + WALL / 2, width * 2, WALL, { isStatic: true }),
        Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
        Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, { isStatic: true }),
      ];
      const bodies = items.map((_, i) =>
        Bodies.rectangle(
          size + Math.random() * (width - size * 2),
          -i * size * 0.9 - Math.random() * 200,
          size,
          size,
          { chamfer: { radius: size * 0.28 }, restitution: 0.45, friction: 0.15, frictionAir: 0.012, angle: (Math.random() - 0.5) * 1.2 },
        ),
      );
      Composite.add(engine.world, [...walls, ...bodies]);

      const mouse = Mouse.create(box);
      const wheel = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
      box.removeEventListener('wheel', wheel);
      box.removeEventListener('mousewheel', wheel);
      box.removeEventListener('DOMMouseScroll', wheel);
      const drag = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
      Composite.add(engine.world, drag);

      const runner = Runner.create();
      Runner.run(runner, engine);
      setReady(true);

      let frame = requestAnimationFrame(function sync() {
        bodies.forEach((body, i) => {
          const el = itemRefs.current[i];
          if (!el) return;
          el.style.transform = `translate3d(${body.position.x - size / 2}px, ${body.position.y - size / 2}px, 0) rotate(${body.angle}rad)`;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        });
        frame = requestAnimationFrame(sync);
      });

      const shake = () => bodies.forEach((b) => Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.05, y: -0.08 * b.mass }));
      box.addEventListener('dblclick', shake);

      cleanup = () => {
        cancelAnimationFrame(frame);
        box.removeEventListener('dblclick', shake);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [inView, items]);

  return (
    <div ref={boxRef} className="relative mt-12 h-[420px] cursor-grab touch-pan-y select-none overflow-hidden rounded-[2rem] border border-border bg-surface/40 active:cursor-grabbing md:h-[480px]">
      <p className="pointer-events-none absolute inset-x-0 top-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">{hint}</p>
      {items.map((club, i) => (
        <div
          key={club.id}
          ref={(el) => { itemRefs.current[i] = el; }}
          title={club.name}
          className={`absolute left-0 top-0 overflow-hidden rounded-[28%] border border-border-light bg-surface-light shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] will-change-transform ${ready ? '' : 'opacity-0'}`}
        >
          {club.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={club.logoUrl} alt="" draggable={false} className="pointer-events-none h-full w-full object-cover" />
          ) : (
            <span className="pointer-events-none flex h-full w-full items-center justify-center text-2xl font-black text-white" style={{ background: `linear-gradient(135deg, ${club.color}, ${club.color}88)` }}>{club.name.charAt(0)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
