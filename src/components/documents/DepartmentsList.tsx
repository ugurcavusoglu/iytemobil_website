'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, FileText, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { fetchDepartments, type Department } from '@/lib/documents-api';

export function DepartmentsList() {
  const t = useTranslations('documents');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDepartments()
      .then(setDepartments)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-primary/50"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-500">{t('noDepartments')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept) => {
            const docCount = dept._count?.documents ?? dept.documentCount ?? 0;
            return (
              <Link
                key={dept.id}
                href={`/documents/${dept.slug}`}
                className="group rounded-xl border border-white/10 bg-surface/50 p-4 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-surface/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
                    <FileText className="h-3 w-3" />
                    {docCount}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
