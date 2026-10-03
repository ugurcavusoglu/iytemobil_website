'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, FileText, GraduationCap, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { fetchDepartments, type Department } from '@/lib/documents-api';

const FACULTY_ICONS: Record<string, string> = {
  fizik: '⚛️', fotonik: '💡', kimya: '🧪', matematik: '📐',
  'molekuler': '🧬', bilgisayar: '💻', biyomuhendislik: '🦠',
  cevre: '🌿', enerji: '⚡', elektronik: '📡', gida: '🍎',
  insaat: '🏗️', 'kimya-muhendisligi': '⚗️', makina: '⚙️',
  malzeme: '🔬', endustriyel: '🎨', mimarlik: '🏛️',
  sehir: '🏙️', hazirlik: '📚',
};

function getDeptIcon(slug: string): string {
  for (const [key, icon] of Object.entries(FACULTY_ICONS)) {
    if (slug.includes(key)) return icon;
  }
  return '📄';
}

function DepartmentCard({ dept, index, common }: { dept: Department; index: number; common?: boolean }) {
  const t = useTranslations('documents');
  const docCount = dept._count?.departmentDocuments ?? 0;
  const accent = common ? 'group-hover:text-emerald-400' : 'group-hover:text-primary';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05 }}
    >
      <Link
        href={`/documents/${dept.slug}`}
        className={`group relative flex h-full items-center gap-4 overflow-hidden rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
          common
            ? 'border-emerald-500/20 bg-surface hover:border-emerald-500/40'
            : 'border-border bg-surface hover:border-border-light'
        }`}
      >
        {common && <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />}
        <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-surface-light text-2xl">{getDeptIcon(dept.slug)}</span>
        <div className="relative min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-bold leading-snug text-text-primary transition-colors ${accent}`}>{dept.name}</h3>
            {common && (
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                {t('commonCourses')}
              </span>
            )}
          </div>
          <p className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${docCount > 0 ? 'text-text-secondary' : 'text-text-disabled'}`}>
            <FileText className="h-3.5 w-3.5" />
            {docCount > 0 ? `${docCount} ${t('documentCount')}` : t('noDocuments')}
          </p>
        </div>
        <ArrowRight className={`relative h-4 w-4 shrink-0 text-text-disabled transition-all group-hover:translate-x-1 ${accent}`} />
      </Link>
    </motion.div>
  );
}

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

  const allFiltered = departments
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

  const commonDepts = allFiltered.filter((d) => d.isCommon);
  const filtered = allFiltered.filter((d) => !d.isCommon);

  const totalDocs = useMemo(
    () => departments.reduce((sum, d) => sum + (d._count?.departmentDocuments ?? 0), 0),
    [departments],
  );

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-4 rounded-3xl border border-border bg-surface p-5">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-surface-light" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-full bg-surface-light" />
              <div className="h-3 w-1/3 rounded-full bg-surface-light" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <p className="flex items-center gap-2 text-5xl font-black leading-none tracking-tighter md:text-6xl">
              {departments.length}
              <GraduationCap className="h-6 w-6 text-primary" />
            </p>
            <p className="mt-2 text-sm text-text-secondary">{t('departmentCount')}</p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-5xl font-black leading-none tracking-tighter text-primary md:text-6xl">
              {totalDocs}
              <BookOpen className="h-6 w-6" />
            </p>
            <p className="mt-2 text-sm text-text-secondary">{t('documentCount')}</p>
          </div>
        </div>

        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-12 pr-5 text-sm text-text-primary placeholder-text-disabled outline-none transition-colors focus:border-primary/50"
          />
        </div>
      </motion.div>

      {allFiltered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-surface-light">
            <Search className="h-7 w-7 text-text-muted" />
          </div>
          <p className="font-semibold text-text-secondary">{t('noDepartments')}</p>
        </div>
      ) : (
        <>
          {commonDepts.length > 0 && (
            <div className="mb-3 grid gap-3">
              {commonDepts.map((dept, i) => (
                <DepartmentCard key={dept.id} dept={dept} index={i} common />
              ))}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dept, i) => (
              <DepartmentCard key={dept.id} dept={dept} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
