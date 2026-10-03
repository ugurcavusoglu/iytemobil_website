'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, Loader2, Lock, LogIn, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/i18n/navigation';

const GOOGLE_CLIENT_ID = '63254288459-jen1q5rb2bkmpp4f9pm2v73v0j78ujof.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
        };
      };
    };
  }
}

export function LoginForm() {
  const t = useTranslations('login');
  const { login, loginWithGoogle, user, isLoading } = useAuth();
  const router = useRouter();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/documents');
    }
  }, [isLoading, user, router]);

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential: string }) => {
          setIsGoogleLoading(true);
          setError(null);
          try {
            const result = await loginWithGoogle(response.credential);
            if (!result.ok) setError(result.message || 'Google ile giriş başarısız.');
          } catch {
            setError('Google ile giriş sırasında bir hata oluştu.');
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 400,
        text: 'continue_with',
        shape: 'pill',
      });
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    }
  }, [loginWithGoogle]);

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
        <div className="flex items-start gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="emailOrUsername" className="mb-2 block text-sm font-semibold text-text-secondary">
          {t('fields.emailOrUsername')}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="emailOrUsername"
            type="text"
            required
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder={t('placeholders.emailOrUsername')}
            className="w-full rounded-2xl border border-border bg-surface-light py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-text-secondary">
          {t('fields.password')}
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('placeholders.password')}
            className="w-full rounded-2xl border border-border bg-surface-light py-3.5 pl-11 pr-4 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border-light" />
        <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">{t('or')}</span>
        <div className="h-px flex-1 bg-border-light" />
      </div>

      <div className="relative w-full overflow-hidden rounded-full">
        {isGoogleLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        <div ref={googleBtnRef} className="w-full" />
      </div>
    </form>
  );
}
