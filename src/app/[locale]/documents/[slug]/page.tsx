import { GlowEffect } from '@/components/ui/GlowEffect';
import { DepartmentDocumentsWrapper } from '@/components/documents/DepartmentDocumentsWrapper';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DepartmentDocumentsPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'documents' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-5xl px-4 md:px-8">
        <Link
          href="/documents"
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToDepartments')}
        </Link>

        <DepartmentDocumentsWrapper slug={slug} />
      </div>
    </section>
  );
}
