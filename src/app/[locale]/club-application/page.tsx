import { getTranslations } from 'next-intl/server';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Instagram, LogIn, Mail } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

const STEPS = ['one', 'two', 'three', 'four'] as const;

export default async function ClubApplicationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'clubApplication' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-3xl px-4 md:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {t('badge')}
          </div>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">{t('title')}</h1>
          <p className="max-w-2xl text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="glass-card mb-6 p-6 md:p-8">
          <h2 className="mb-5 text-lg font-semibold">{t('stepsTitle')}</h2>
          <ol className="space-y-4">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <p className="pt-1 text-text-secondary">{t(`steps.${step}`)}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="glass-card p-6 md:p-8">
          <h2 className="mb-5 text-lg font-semibold">{t('contactTitle')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="mailto:iytemobil@gmail.com"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              {t('email')}
            </a>
            <a
              href="https://instagram.com/iyte.mobil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
              {t('instagram')}
            </a>
          </div>
          <p className="mt-6 text-sm text-text-secondary">{t('haveLink')}</p>
          <Link
            href="/login?tab=club"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80"
          >
            <LogIn className="h-4 w-4" />
            {t('login')}
          </Link>
        </div>
      </div>
    </section>
  );
}
