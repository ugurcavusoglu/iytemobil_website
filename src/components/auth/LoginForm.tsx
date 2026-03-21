'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function LoginForm() {
  const t = useTranslations('login');
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(emailOrUsername, password);
      if (!result.ok) {
        setError(result.message || t('errors.generic'));
      }
    } catch {
      setError(t('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="emailOrUsername" className="mb-1.5 block text-sm font-medium text-zinc-300">
          {t('fields.emailOrUsername')}
        </label>
        <input
          id="emailOrUsername"
          type="text"
          required
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          placeholder={t('placeholders.emailOrUsername')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-300">
          {t('fields.password')}
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('placeholders.password')}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('actions.submitting')}
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            {t('actions.submit')}
          </>
        )}
      </button>
    </form>
  );
}
