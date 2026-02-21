'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type CategoryValue =
  | 'SPORTS'
  | 'ART'
  | 'TECHNOLOGY'
  | 'ARCHITECTURE'
  | 'TRAVEL'
  | 'MUSIC'
  | 'ACADEMIC'
  | 'SOCIAL'
  | 'OTHER';

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  category: CategoryValue;
  description: string;
  logoUrl: string;
};

const DEFAULT_FORM: FormState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  category: 'OTHER',
  description: '',
  logoUrl: '',
};

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === 'string') return payload;

  if (Array.isArray(payload)) {
    return payload.filter((item) => typeof item === 'string').join('\n') || fallback;
  }

  if (payload && typeof payload === 'object') {
    const candidate = (payload as { message?: unknown }).message;
    if (typeof candidate === 'string') return candidate;
    if (Array.isArray(candidate)) {
      return candidate.filter((item) => typeof item === 'string').join('\n') || fallback;
    }
  }

  return fallback;
};

export function ClubApplicationForm() {
  const t = useTranslations('clubApplication');
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(
    () =>
      [
        { value: 'SPORTS', label: t('categories.SPORTS') },
        { value: 'ART', label: t('categories.ART') },
        { value: 'TECHNOLOGY', label: t('categories.TECHNOLOGY') },
        { value: 'ARCHITECTURE', label: t('categories.ARCHITECTURE') },
        { value: 'TRAVEL', label: t('categories.TRAVEL') },
        { value: 'MUSIC', label: t('categories.MUSIC') },
        { value: 'ACADEMIC', label: t('categories.ACADEMIC') },
        { value: 'SOCIAL', label: t('categories.SOCIAL') },
        { value: 'OTHER', label: t('categories.OTHER') },
      ] as { value: CategoryValue; label: string }[],
    [t],
  );

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError(t('errors.passwordMismatch'));
      return;
    }

    if (form.password.length < 8) {
      setError(t('errors.passwordMin'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        category: form.category,
        description: form.description.trim(),
        logoUrl: form.logoUrl.trim() || undefined,
      };

      const response = await fetch('/api/club/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(parseErrorMessage(json, t('errors.generic')));
      }

      setSuccess(true);
      setForm(DEFAULT_FORM);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      {success && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-semibold">{t('success.title')}</p>
          </div>
          <p className="text-sm text-emerald-100">{t('success.description')}</p>
          <Link
            href="/"
            className="mt-3 inline-flex text-sm font-medium text-emerald-300 hover:text-emerald-200"
          >
            {t('success.backHome')}
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <div className="flex items-start gap-2 text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <p className="whitespace-pre-line text-sm">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">{t('fields.name')}</label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => onChange('name', event.target.value)}
            required
            minLength={2}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
            placeholder={t('placeholders.name')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">{t('fields.email')}</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
            placeholder={t('placeholders.email')}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">{t('fields.password')}</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
              placeholder={t('placeholders.password')}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">{t('fields.confirmPassword')}</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              required
              minLength={8}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
              placeholder={t('placeholders.confirmPassword')}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">{t('fields.category')}</label>
          <select
            value={form.category}
            onChange={(event) => onChange('category', event.target.value as CategoryValue)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value} className="bg-background">
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">{t('fields.description')}</label>
          <textarea
            value={form.description}
            onChange={(event) => onChange('description', event.target.value)}
            required
            minLength={10}
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
            placeholder={t('placeholders.description')}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">{t('fields.logoUrl')}</label>
          <input
            type="url"
            value={form.logoUrl}
            onChange={(event) => onChange('logoUrl', event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition-colors focus:border-primary"
            placeholder={t('placeholders.logoUrl')}
          />
          <p className="mt-2 text-xs text-text-secondary">{t('hints.logoUrl')}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {t('actions.submitting')}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              {t('actions.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
