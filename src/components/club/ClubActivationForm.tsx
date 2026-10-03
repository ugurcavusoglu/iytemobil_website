'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Mail, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/constants';

type Props = {
  token: string;
  clubName: string;
  logoUrl: string | null;
  username: string;
};

type Step = 'email' | 'verify' | 'done';

const inputClass =
  'w-full rounded-2xl border border-border bg-surface-light px-4 py-3.5 text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary';
const buttonClass =
  'flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60';

const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'İşlem başarısız.');
  return data;
}

export function ClubActivationForm({ token, clubName, logoUrl, username }: Props) {
  const t = useTranslations('clubActivation');
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const base = `/api/club-activation/${encodeURIComponent(token)}`;

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setInfo('');
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError(t('errors.email'));
    setLoading(true);
    try {
      await post(`${base}/send-code`, { email: email.trim() });
      setStep('verify');
      setInfo(t('verify.sent', { email: email.trim() }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) return setError(t('errors.code'));
    if (!STRONG_PASSWORD.test(password)) return setError(t('errors.password'));
    if (password !== confirmPassword) return setError(t('errors.mismatch'));
    setLoading(true);
    try {
      await post(`${base}/complete`, { email: email.trim(), code, password });
      setStep('done');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15 ring-2 ring-primary/40">
          {logoUrl ? (
            <Image src={logoUrl} alt={clubName} width={64} height={64} className="h-full w-full object-cover" />
          ) : (
            <UsersRound className="h-7 w-7 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary">{t('header.label')}</p>
          <h2 className="truncate text-xl font-bold md:text-2xl">{clubName}</h2>
          <p className="text-sm text-text-secondary">@{username}</p>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p className="whitespace-pre-line">{error}</p>
        </div>
      )}

      {step === 'email' && (
        <form className="space-y-5" onSubmit={sendCode}>
          <p className="text-sm text-text-secondary">{t('email.description')}</p>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('email.label')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email.placeholder')}
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className={buttonClass}>
            <Mail className="h-4 w-4" />
            {loading ? t('email.sending') : t('email.submit')}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form className="space-y-5" onSubmit={complete}>
          {info && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {info} {t('verify.spamHint')}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('verify.code')}</label>
            <input
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              autoComplete="one-time-code"
              className={`${inputClass} tracking-[0.4em]`}
            />
            <div className="mt-2 flex justify-between text-xs">
              <button type="button" onClick={() => { setStep('email'); setCode(''); setError(''); }} className="text-text-secondary hover:text-text-primary">
                {t('verify.changeEmail')}
              </button>
              <button type="button" onClick={() => sendCode()} disabled={loading} className="font-medium text-primary hover:opacity-80">
                {t('verify.resend')}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('verify.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-text-secondary">{t('verify.passwordHint')}</p>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-text-secondary">{t('verify.confirmPassword')}</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className={buttonClass}>
            <ShieldCheck className="h-4 w-4" />
            {loading ? t('verify.submitting') : t('verify.submit')}
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-semibold">{t('done.title')}</p>
            </div>
            <p className="text-sm text-emerald-100">{t('done.description', { username, email: email.trim() })}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              Google Play
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center rounded-full border border-border-light py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary"
            >
              App Store
            </a>
          </div>
          <Link href="/login?tab=club" className="block text-center text-sm font-medium text-primary hover:opacity-80">
            {t('done.panel')}
          </Link>
        </div>
      )}
    </div>
  );
}
