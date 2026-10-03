'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PageHero } from '@/components/ui/PageHero';
import { fetchDepartments, type Department } from '@/lib/documents-api';
import { DocumentsView } from './DocumentsView';

export function DepartmentDocumentsWrapper({ slug }: { slug: string }) {
  const t = useTranslations('documents');
  const [department, setDepartment] = useState<Department | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchDepartments()
      .then((deps) => {
        const found = deps.find((d) => d.slug === slug);
        if (found) {
          setDepartment(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  const heroTitle = isLoading ? ' ' : department?.name ?? t('departmentNotFound');

  return (
    <>
      <PageHero
        key={isLoading ? 'loading' : 'loaded'}
        compact
        eyebrow={t('title')}
        title={heroTitle}
        subtitle={department ? t('departmentSubtitle') : undefined}
        image="kutuphane"
      >
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background/50 px-5 py-2.5 text-sm font-semibold text-text-secondary backdrop-blur transition-colors hover:border-primary hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToDepartments')}
        </Link>
      </PageHero>

      <section className="pb-24 pt-4 md:pb-32">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            !notFound && department && <DocumentsView departmentId={department.id} />
          )}
        </div>
      </section>
    </>
  );
}
