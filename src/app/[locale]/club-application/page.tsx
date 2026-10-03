import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
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
    <>
      <PageHero eyebrow={t('badge')} title={t('title')} subtitle={t('subtitle')} image="konser-kalabalik" />

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-4 md:px-12 md:pb-32">
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">{t('stepsTitle')}</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step}>
              <ScrollReveal delay={index * 0.08} className="h-full rounded-3xl border border-border bg-surface p-6">
                <span className="text-6xl font-black leading-none tracking-tighter text-primary/80">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-6 leading-relaxed text-text-secondary">{t(`steps.${step}`)}</p>
              </ScrollReveal>
            </li>
          ))}
        </ol>

        <ScrollReveal className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface p-8 md:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <h2 className="relative text-3xl font-black tracking-tight md:text-4xl">{t('contactTitle')}</h2>
          <div className="relative mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <a
              href="mailto:iytemobil@gmail.com"
              className="flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Mail className="h-4 w-4" />
              {t('email')}
            </a>
            <a
              href="https://instagram.com/iyte.mobil"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-border-light py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary"
            >
              <Instagram className="h-4 w-4" />
              {t('instagram')}
            </a>
          </div>
          <div className="relative mt-10 border-t border-border pt-6">
            <p className="max-w-2xl leading-relaxed text-text-secondary">{t('haveLink')}</p>
            <Link
              href="/login?tab=club"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80"
            >
              <LogIn className="h-4 w-4" />
              {t('login')}
            </Link>
          </div>
        </ScrollReveal>

        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>
      </section>
    </>
  );
}
