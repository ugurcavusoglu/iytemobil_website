'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Apple, Instagram, Mail, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const wordY = useTransform(scrollYProgress, [0, 1], ['40%', '0%']);

  const columns = [
    {
      title: t('explore'),
      links: [
        { href: '/yemek', label: tNav('food') },
        { href: '/ulasim', label: tNav('transport') },
        { href: '/clubs', label: tNav('clubs') },
        { href: '/documents', label: tNav('documents') },
      ],
    },
    {
      title: t('community'),
      links: [
        { href: '/club-application', label: tNav('clubApplication') },
        { href: '/login', label: tNav('login') },
      ],
    },
    {
      title: t('legal'),
      links: [
        { href: '/privacy-policy', label: t('privacy') },
        { href: '/terms-of-service', label: t('terms') },
        { href: '/child-safety', label: t('childSafety') },
        { href: '/account-deletion', label: t('accountDeletion') },
      ],
    },
  ];

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden border-t border-border bg-background">
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-10 pt-20 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-12">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="İYTE Mobil" width={36} height={36} className="rounded-xl" />
            <span className="text-xl font-bold tracking-tight">İYTE <span className="text-primary">Mobil</span></span>
          </div>
          <p className="mt-4 max-w-xs text-text-secondary">{t('tagline')}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105">
              <Play className="h-4 w-4 fill-current" />Google Play
            </a>
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105">
              <Apple className="h-4 w-4" />App Store
            </a>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <a href="mailto:iytemobil@gmail.com" aria-label="E-posta" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors hover:border-primary hover:text-primary"><Mail className="h-4 w-4" /></a>
            <a href="https://instagram.com/iyte.mobil" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-light text-text-secondary transition-colors hover:border-primary hover:text-primary"><Instagram className="h-4 w-4" /></a>
            <a href="mailto:iytemobil@gmail.com" className="ml-2 text-sm text-text-muted transition-colors hover:text-text-primary">iytemobil@gmail.com</a>
          </div>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-text-muted">{column.title}</p>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-text-primary">
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-border px-6 py-6 text-xs text-text-muted md:flex-row md:justify-between md:px-12">
        <span>&copy; {new Date().getFullYear()} {t('copyright')}</span>
        <span>{t('madeWith')}</span>
      </div>

      <div className="pointer-events-none select-none overflow-hidden">
        <motion.p
          style={{ y: wordY, WebkitTextStroke: '1px rgba(230,57,70,0.5)' }}
          className="whitespace-nowrap text-center text-[19vw] font-black leading-[0.8] tracking-tighter text-transparent"
        >
          İYTE MOBİL
        </motion.p>
      </div>
    </footer>
  );
}
