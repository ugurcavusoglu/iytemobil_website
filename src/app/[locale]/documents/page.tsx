import { getTranslations } from 'next-intl/server';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { DepartmentsList } from '@/components/documents/DepartmentsList';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'documents' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-5xl px-4 md:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </div>

        <DepartmentsList />
      </div>
    </section>
  );
}
