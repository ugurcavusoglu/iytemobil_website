'use client';

import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const pathname = usePathname();

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
      className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
    >
      <Globe className="h-4 w-4" />
      <span className="font-semibold uppercase">
        {nextLocale.toUpperCase()}
      </span>
    </button>
  );
}
