import { getTranslations } from 'next-intl/server';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { ClubApplicationForm } from '@/components/club/ClubApplicationForm';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ClubApplicationPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'clubApplication' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-4xl px-4 md:px-8">
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

        <ClubApplicationForm />
      </div>
    </section>
  );
}
