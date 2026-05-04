'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, LogIn, LogOut, FileText, Users } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { NAV_LINKS } from '@/lib/constants';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const t = useTranslations('nav');
  const { user, isLoading, logout } = useAuth();
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === '/';
  const navHref = (anchor: string) => isHome ? anchor : `/${locale}/${anchor}`;
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);
  const backgroundColor = useTransform(bgOpacity, (v) => `rgba(10, 10, 10, ${v})`);
  const borderBottomColor = useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor,
        borderBottomColor,
        borderBottomWidth: '1px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href={`/${locale}`} className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="IYTE Mobil"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-bold text-lg text-white">
            IYTE <span className="text-primary">Mobil</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = isHome && activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={navHref(link.href)}
                className={`text-sm transition-colors duration-300 relative ${
                  isActive ? 'text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                {t(link.labelKey.replace('nav.', ''))}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                  />
                )}
              </a>
            );
          })}
          <Link
            href="/clubs"
            className="text-sm text-text-secondary transition-colors hover:text-white"
          >
            {t('clubs')}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/clubs/login"
            className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-all hover:border-white/20 hover:text-white md:inline-flex"
          >
            <Users className="h-3.5 w-3.5" />
            {t('clubLogin')}
          </Link>

          <Link
            href="/club-application"
            className="hidden rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/80 md:inline-flex"
          >
            {t('clubApplication')}
          </Link>

          {!isLoading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/documents"
                    className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-all hover:text-white md:inline-flex"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {t('documents')}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-all hover:text-red-400 md:inline-flex"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {t('logout')}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition-all hover:text-white md:inline-flex"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  {t('login')}
                </Link>
              )}
            </>
          )}

          <LanguageToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-lg border-t border-white/5"
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          <Link
            href="/clubs"
            className="py-2 text-sm text-text-secondary transition-colors hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            {t('clubs')}
          </Link>

          <Link
            href="/clubs/login"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-300 transition-all hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <Users className="h-4 w-4" />
            {t('clubLogin')}
          </Link>

          <Link
            href="/club-application"
            className="rounded-lg border border-primary/40 bg-primary/15 px-3 py-2 text-center text-sm font-semibold text-primary transition-all hover:border-primary hover:bg-primary/25"
            onClick={() => setIsOpen(false)}
          >
            {t('clubApplication')}
          </Link>

          {!isLoading && user && (
            <Link
              href="/documents"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-300 transition-all hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <FileText className="h-4 w-4" />
              {t('documents')}
            </Link>
          )}

          {NAV_LINKS.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = isHome && activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={navHref(link.href)}
                className={`text-sm transition-colors py-2 ${
                  isActive ? 'text-white font-medium' : 'text-text-secondary hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t(link.labelKey.replace('nav.', ''))}
              </a>
            );
          })}

          {!isLoading && (
            user ? (
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition-all hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition-all hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <LogIn className="h-4 w-4" />
                {t('login')}
              </Link>
            )
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}
