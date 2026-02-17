'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const isTr = locale === 'tr';

  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="IYTE Mobil"
                width={28}
                height={28}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-white">
                IYTE <span className="text-primary">Mobil</span>
              </span>
            </div>
            <p className="text-text-muted text-sm">{t('madeWith')}</p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-text-secondary text-sm font-medium">{t('contact')}</span>
            <a
              href="mailto:iytemobil@gmail.com"
              className="text-text-muted text-sm hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              iytemobil@gmail.com
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/iytemobil"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all"
            >
              <Github className="w-5 h-5 text-text-secondary hover:text-white" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all"
            >
              <Linkedin className="w-5 h-5 text-text-secondary hover:text-white" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              {isTr ? 'Gizlilik Politikasi' : 'Privacy Policy'}
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">
              {isTr ? 'Kullanim Kosullari' : 'Terms of Service'}
            </Link>
            <Link href="/account-deletion" className="hover:text-primary transition-colors">
              {isTr ? 'Hesap Silme' : 'Account Deletion'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
