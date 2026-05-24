'use client';

import { useState } from 'react';
import { LogIn, Users } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { ClubLoginForm } from '@/components/club/ClubLoginForm';

type Tab = 'user' | 'club';

export function LoginTabs({ defaultTab }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab ?? 'user');

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <button
          onClick={() => setTab('user')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            tab === 'user'
              ? 'bg-primary text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <LogIn className="h-4 w-4" />
          Kullanici Girisi
        </button>
        <button
          onClick={() => setTab('club')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            tab === 'club'
              ? 'bg-primary text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Topluluk Girisi
        </button>
      </div>

      {tab === 'user' ? <LoginForm /> : <ClubLoginForm />}
    </div>
  );
}
