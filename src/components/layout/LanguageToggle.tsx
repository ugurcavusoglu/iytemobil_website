'use client';

import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const pathname = usePathname();

  // Pathname'den locale'i direkt parse et
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'tr';
  const nextLocale = currentLocale === 'tr' ? 'en' : 'tr';

  const toggleLocale = () => {
    const pathWithoutLocale = pathname.replace(/^\/(tr|en)/, '') || '/';
    const newPath = `/${nextLocale}${pathWithoutLocale}`;
    window.location.href = newPath;
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 text-sm hover:scale-105 active:scale-95"
    >
      <Globe className="w-4 h-4 text-text-secondary" />
      <span className="font-medium text-white uppercase">
        {nextLocale.toUpperCase()}
      </span>
    </button>
  );
}
