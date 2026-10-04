'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function SectionRail({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex" aria-label="sections">
      {sections.map((s, i) => {
        const isActive = s.id === active;
        return (
          <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-3">
            <span className="relative flex h-6 w-6 items-center justify-center">
              {isActive && <motion.span layoutId="rail-dot" className="absolute inset-0 rounded-full border border-primary" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-text-disabled group-hover:bg-text-secondary'}`} />
            </span>
            <span className={`text-xs font-semibold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-text-primary' : 'text-text-muted'} -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}>
              {i === 0 ? s.label : `${String(i).padStart(2, '0')} ${s.label}`}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
