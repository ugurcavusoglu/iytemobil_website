import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { LoginTabs } from '@/components/auth/LoginTabs';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { tab } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'login' });

  return (
    <>
      <PageHero compact eyebrow="IYTE Mobil" title={t('title')} subtitle={t('pageSubtitle')} image="cam-bina-havadan">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background/50 px-5 py-2.5 text-sm font-semibold text-text-secondary backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Link>
      </PageHero>

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-surface p-6 md:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative">
              <LoginTabs defaultTab={tab === 'club' ? 'club' : 'user'} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
