import { getTranslations } from 'next-intl/server';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { LoginForm } from '@/components/auth/LoginForm';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'login' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-md px-4 md:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-lg md:p-8">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
