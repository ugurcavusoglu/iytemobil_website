'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Search, Star, UserRound, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CATEGORY_COLORS, ClubLogo, categoryColor } from './ClubLogo';

export interface DirectoryClub {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  category: string;
  averageRating: number;
  totalRatings: number;
  slug?: string;
  websitePublished?: boolean;
  isActivated?: boolean;
  memberCount?: number;
  _count: { followers: number; events: number };
}

const FEATURED_COUNT = 3;

function ClubCardShell({ club, className, children }: { club: DirectoryClub; className: string; children: React.ReactNode }) {
  const hasPage = club.slug && club.websitePublished;
  return hasPage ? (
    <Link href={`/clubs/${club.slug}`} className={className}>{children}</Link>
  ) : (
    <div className={className}>{children}</div>
  );
}

export function ClubsDirectory({ clubs }: { clubs: DirectoryClub[] }) {
  const t = useTranslations('clubsPage');
  const tHome = useTranslations('home.clubs');
  const locale = useLocale();
  const [category, setCategory] = useState('ALL');

  const categories = useMemo(() => ['ALL', ...Array.from(new Set(clubs.map((c) => c.category))).filter((c) => CATEGORY_COLORS[c])], [clubs]);
  const filtered = category === 'ALL' ? clubs : clubs.filter((c) => c.category === category);
  const featured = filtered.slice(0, FEATURED_COUNT);
  const rest = filtered.slice(FEATURED_COUNT);
  const categoryLabel = (c: string) => (CATEGORY_COLORS[c] ? tHome(`categories.${c}`) : c);

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Search className="h-12 w-12 text-text-disabled" />
        <p className="text-text-muted">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:flex-wrap md:px-0">
        {categories.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${active ? 'text-white' : 'border-border-light text-text-secondary hover:text-text-primary'}`}
              style={active ? { backgroundColor: c === 'ALL' ? '#E63946' : categoryColor(c), borderColor: 'transparent' } : undefined}
            >
              {c === 'ALL' ? tHome('all') : categoryLabel(c)}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 [&>*]:min-w-0">
        {featured.map((club, i) => {
          const color = categoryColor(club.category);
          const hasPage = club.slug && club.websitePublished;
          return (
            <motion.div
              key={`${category}-${club.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <ClubCardShell club={club} className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-surface p-7 transition-colors hover:border-border-light">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-80" style={{ background: `radial-gradient(circle, ${color}66, transparent 65%)` }} />
                <span className="pointer-events-none absolute right-7 top-7 text-6xl font-black text-white/5">{String(i + 1).padStart(2, '0')}</span>
                <ClubLogo name={club.name} logoUrl={club.logoUrl} color={color} size={72} />
                <h3 className="relative mt-6 text-2xl font-bold leading-tight">{club.name}</h3>
                <div className="relative mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full px-3 py-1 font-semibold" style={{ backgroundColor: `${color}22`, color }}>{categoryLabel(club.category)}</span>
                  {club.isActivated === false && (
                    <span className="rounded-full border border-border-light px-3 py-1 text-xs text-text-muted">{t('notActivated')}</span>
                  )}
                </div>
                <p className="relative mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">{club.description}</p>
                <ClubStats club={club} locale={locale} />
                <ClubCta hasPage={!!hasPage} color={color} viewLabel={t('viewPage')} noPageLabel={t('noPage')} />
              </ClubCardShell>
            </motion.div>
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {rest.map((club, i) => {
            const color = categoryColor(club.category);
            const hasPage = club.slug && club.websitePublished;
            return (
              <motion.div
                key={`${category}-${club.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <ClubCardShell club={club} className="group flex h-full flex-col rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-border-light">
                  <div className="flex items-center gap-4">
                    <ClubLogo name={club.name} logoUrl={club.logoUrl} color={color} size={56} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{club.name}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: `${color}22`, color }}>{categoryLabel(club.category)}</span>
                        {club.isActivated === false && (
                          <span className="rounded-full border border-border-light px-2.5 py-0.5 text-xs text-text-muted">{t('notActivated')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-text-secondary">{club.description}</p>
                  <ClubStats club={club} locale={locale} />
                  <ClubCta hasPage={!!hasPage} color={color} viewLabel={t('viewPage')} noPageLabel={t('noPage')} />
                </ClubCardShell>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClubStats({ club, locale }: { club: DirectoryClub; locale: string }) {
  const t = useTranslations('clubsPage');
  return (
    <div className="relative mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-xs text-text-muted">
      {!!club.memberCount && (
        <span className="flex items-center gap-1.5 font-semibold text-text-secondary" title={t('members')}>
          <UserRound className="h-3.5 w-3.5" />
          {t('membersCount', { count: club.memberCount.toLocaleString(locale) })}
        </span>
      )}
      <span className="flex items-center gap-1.5" title={t('followers')}><Users className="h-3.5 w-3.5" />{club._count.followers}</span>
      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{club._count.events}</span>
      {club.totalRatings > 0 && (
        <span className="ml-auto flex items-center gap-1 text-yellow-400/80">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          {club.averageRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function ClubCta({ hasPage, color, viewLabel, noPageLabel }: { hasPage: boolean; color: string; viewLabel: string; noPageLabel: string }) {
  return hasPage ? (
    <div className="relative mt-4 flex items-center justify-between rounded-full px-5 py-2.5 text-sm font-bold" style={{ backgroundColor: `${color}1f`, color }}>
      {viewLabel}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </div>
  ) : (
    <div className="relative mt-4 rounded-full border border-border py-2.5 text-center text-xs text-text-disabled">{noPageLabel}</div>
  );
}
