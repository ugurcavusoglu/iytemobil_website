import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/ui/PageHero';
import { DepartmentsList } from '@/components/documents/DepartmentsList';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DocumentsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'documents' });
  const nav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <>
      <PageHero eyebrow={nav('documents')} title={t('title')} subtitle={t('subtitle')} image="kutuphane" />

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <DepartmentsList />
        </div>
      </section>
    </>
  );
}
