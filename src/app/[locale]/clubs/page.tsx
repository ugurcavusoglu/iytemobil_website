import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { Users, Star, Calendar, ArrowRight, Search } from 'lucide-react';

interface Club {
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
  _count: { followers: number; events: number };
}

const CATEGORY_LABELS: Record<string, { tr: string; en: string }> = {
  SPORTS:       { tr: 'Spor',       en: 'Sports' },
  ART:          { tr: 'Sanat',      en: 'Art' },
  TECHNOLOGY:   { tr: 'Teknoloji',  en: 'Technology' },
  ARCHITECTURE: { tr: 'Mimarlık',   en: 'Architecture' },
  TRAVEL:       { tr: 'Gezi',       en: 'Travel' },
  MUSIC:        { tr: 'Müzik',      en: 'Music' },
  ACADEMIC:     { tr: 'Akademik',   en: 'Academic' },
  SOCIAL:       { tr: 'Sosyal',     en: 'Social' },
  OTHER:        { tr: 'Diğer',      en: 'Other' },
};

const CATEGORY_COLORS: Record<string, string> = {
  SPORTS: '#f97316', ART: '#a855f7', TECHNOLOGY: '#3b82f6',
  ARCHITECTURE: '#14b8a6', TRAVEL: '#22c55e', MUSIC: '#ec4899',
  ACADEMIC: '#f59e0b', SOCIAL: '#06b6d4', OTHER: '#6b7280',
};

async function getClubs(): Promise<Club[]> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs?status=APPROVED&sortBy=followers&limit=100`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.clubs || [];
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'clubsPage' });
  return { title: t('metaTitle'), description: t('metaDesc') };
}

export default async function ClubsPage({ params }: Props) {
  const { locale } = await params;
  const [clubs, t, tNav] = await Promise.all([
    getClubs(),
    getTranslations({ locale, namespace: 'clubsPage' }),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-28">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Users className="h-4 w-4" />
            {tNav('clubs')}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{t('title')}</h1>
          <p className="mt-4 text-lg text-white/50">{t('subtitle')}</p>
        </div>

        {clubs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Search className="h-12 w-12 text-white/20" />
            <p className="text-white/40">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => {
              const categoryLabel = CATEGORY_LABELS[club.category]?.[locale as 'tr' | 'en'] || club.category;
              const color = CATEGORY_COLORS[club.category] || '#6b7280';
              const hasPage = club.slug && club.websitePublished;
              const cardClass = "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl";

              const cardContent = (
                <>
                  <div className="h-1 w-full flex-shrink-0" style={{ background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
                  {hasPage && (
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl"
                      style={{ background: `radial-gradient(ellipse at top left, ${color}10, transparent 60%)` }}
                    />
                  )}
                  <div className="relative flex flex-col flex-1 p-5">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2" style={{ borderColor: `${color}40` }}>
                        {club.logoUrl ? (
                          <Image src={club.logoUrl} alt={club.name} width={64} height={64} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
                            {club.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-white">{club.name}</p>
                        <span className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: `${color}22`, color }}>
                          {categoryLabel}
                        </span>
                        {club.isActivated === false && (
                          <span className="ml-1.5 mt-1 inline-block rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/40">
                            {t('notActivated')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mb-5 flex-1 text-sm leading-relaxed text-white/55 line-clamp-3">{club.description}</p>
                    <div className="mb-4 flex items-center gap-4 border-t border-white/5 pt-4 text-xs text-white/40">
                      <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{club._count.followers}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{club._count.events}</span>
                      {club.totalRatings > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-yellow-400/80">
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                          {club.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {hasPage ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all" style={{ backgroundColor: `${color}22`, border: `1px solid ${color}44` }}>
                        <span style={{ color }}>{t('viewPage')}</span>
                        <ArrowRight className="h-4 w-4" style={{ color }} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center rounded-xl border border-white/8 py-2.5 text-xs text-white/20">{t('noPage')}</div>
                    )}
                  </div>
                </>
              );

              return hasPage ? (
                <Link key={club.id} href={`/clubs/${club.slug}`} className={cardClass}>{cardContent}</Link>
              ) : (
                <div key={club.id} className={cardClass}>{cardContent}</div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
