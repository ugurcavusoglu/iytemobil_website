'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !department) {
    return <p className="py-10 text-center text-sm text-zinc-500">{t('departmentNotFound')}</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold md:text-3xl">{department.name}</h1>
        <p className="text-sm text-text-secondary">{t('departmentSubtitle')}</p>
      </div>
      <DocumentsView departmentId={department.id} />
    </div>
  );
}
