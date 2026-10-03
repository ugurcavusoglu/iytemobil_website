'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { LogIn, Users } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { ClubLoginForm } from '@/components/club/ClubLoginForm';

type Tab = 'user' | 'club';

export function LoginTabs({ defaultTab }: { defaultTab?: Tab }) {
  const t = useTranslations('login');
  const [tab, setTab] = useState<Tab>(defaultTab ?? 'user');

  const tabs = [
    { key: 'user' as const, icon: LogIn, label: t('userTab') },
    { key: 'club' as const, icon: Users, label: t('clubTab') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="mb-7 flex gap-1 rounded-full border border-border bg-surface-container p-1">
        {tabs.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all ${
              tab === key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'user' ? <LoginForm /> : <ClubLoginForm />}

      {tab === 'user' && (
        <div className="mt-6 rounded-2xl bg-surface-container px-4 py-3.5 text-center">
          <p className="text-sm text-text-muted">
            {t('noAccount')}{' '}
            <a href="/indir" className="font-semibold text-primary hover:underline">
              {t('registerInApp')}
            </a>
          </p>
        </div>
      )}
    </motion.div>
  );
}
