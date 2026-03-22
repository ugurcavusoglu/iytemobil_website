'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, FileText, Loader2, GraduationCap, BookOpen } from 'lucide-react';
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

  const totalDocs = useMemo(
    () => departments.reduce((sum, d) => sum + (d._count?.departmentDocuments ?? 0), 0),
    [departments],
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
      {/* Stats bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="text-sm text-zinc-300">
            <span className="font-semibold text-white">{departments.length}</span> bolum
          </span>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm text-zinc-300">
            <span className="font-semibold text-white">{totalDocs}</span> belge
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-primary/50 focus:bg-white/[0.07]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-zinc-500">{t('noDepartments')}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dept) => {
            const docCount = dept._count?.departmentDocuments ?? 0;
            const icon = getDeptIcon(dept.slug);
            return (
              <Link
                key={dept.id}
                href={`/documents/${dept.slug}`}
                className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-primary/30 hover:from-primary/[0.06] hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors leading-snug">
                      {dept.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-zinc-500" />
                      <span className={`text-xs font-medium ${docCount > 0 ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        {docCount > 0 ? `${docCount} belge` : 'Henuz belge yok'}
                      </span>
                    </div>
                  </div>
                  <svg
                    className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
