'use client';

import { useState, useEffect, FormEvent, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, Loader2, LogIn } from 'lucide-react';
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
            if (!result.ok) setError(result.message || 'Google ile giris basarisiz.');
          } catch {
            setError('Google ile giris sirasinda bir hata olustu.');
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
        shape: 'rectangular',
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-zinc-500">veya</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="relative w-full overflow-hidden rounded-lg">
        {isGoogleLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/60">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
        <div ref={googleBtnRef} className="w-full" />
      </div>
    </form>
  );
}
