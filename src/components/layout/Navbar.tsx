'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Apple, LogIn, LogOut, Menu, Play, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';

const LINKS = [
  { href: '/yemek', key: 'food' },
  { href: '/ulasim', key: 'transport' },
  { href: '/clubs', key: 'clubs' },
  { href: '/documents', key: 'documents' },
] as const;

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 300 && y > previous && !open);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const isActive = (href: string) => pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
      >
        <nav
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-4 transition-all duration-500 ${
            scrolled || open ? 'border border-border-light bg-background/90 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]' : 'border border-transparent'
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="İYTE Mobil" width={30} height={30} className="rounded-lg" />
            <span className="text-base font-bold tracking-tight">İYTE <span className="text-primary">Mobil</span></span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="relative rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary">
                {isActive(link.href) && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className={`relative ${isActive(link.href) ? 'text-text-primary' : ''}`}>{t(link.key)}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!isLoading && (
              user ? (
                <button onClick={() => logout()} className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary md:flex">
                  <LogOut className="h-4 w-4" />
                  {t('logout')}
                </button>
              ) : (
                <Link href="/login" className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary md:flex">
                  <LogIn className="h-4 w-4" />
                  {t('login')}
                </Link>
              )
            )}
            <LanguageToggle />
            <a href={`/${locale}#download`} className="hidden rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 md:inline-flex">
              {t('download')}
            </a>
            <button onClick={() => setOpen((v) => !v)} aria-label="Menu" className="flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-white/10 lg:hidden">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-background px-6 pb-10 pt-28 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col gap-2">
              {[{ href: '/', key: 'home' as const }, ...LINKS, { href: '/club-application', key: 'clubApplication' as const }].map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}>
                  <Link href={link.href} className={`block py-2 text-4xl font-black tracking-tight ${isActive(link.href) ? 'text-primary' : 'text-text-primary'}`}>
                    {link.key === 'home' ? 'İYTE Mobil' : t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-auto flex flex-col gap-3">
              {!isLoading && (
                user ? (
                  <button onClick={() => logout()} className="flex items-center gap-2 text-text-secondary"><LogOut className="h-4 w-4" />{t('logout')}</button>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 text-text-secondary"><LogIn className="h-4 w-4" />{t('login')}</Link>
                )
              )}
              <div className="flex gap-3">
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-white"><Play className="h-4 w-4 fill-current" />Google Play</a>
                <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-3 font-semibold text-black"><Apple className="h-4 w-4" />App Store</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
