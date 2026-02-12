'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { NAV_LINKS } from '@/lib/constants';
import Image from 'next/image';

export function Navbar() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(10, 10, 10, ${v})`),
        borderBottomColor: useTransform(borderOpacity, (v) => `rgba(255, 255, 255, ${v})`),
        borderBottomWidth: '1px',
        backdropFilter: 'blur(12px)',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
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
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
            >
              {t(link.labelKey.replace('nav.', ''))}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
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
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-secondary hover:text-white transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t(link.labelKey.replace('nav.', ''))}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}
