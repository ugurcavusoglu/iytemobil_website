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

async function getClubs(): Promise<Club[]> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs?status=APPROVED&sortBy=followers&limit=100`,
      { next: { revalidate: 120 } },
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
  const [clubs, t] = await Promise.all([
    getClubs(),
    getTranslations({ locale, namespace: 'clubsPage' }),
  ]);

  const tNav = await getTranslations({ locale, namespace: 'nav' });

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-28">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Users className="h-4 w-4" />
            {tNav('clubs')}
          </div>
          <h1 className="text-3xl font-bold md:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-text-secondary">{t('subtitle')}</p>
        </div>

        {clubs.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Search className="h-12 w-12 text-white/20" />
            <p className="text-white/40">{t('empty')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => {
              const categoryLabel = CATEGORY_LABELS[club.category]?.[locale as 'tr' | 'en'] || club.category;
              return (
                <div
                  key={club.id}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8"
                >
                  {/* Logo + isim */}
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                      {club.logoUrl ? (
                        <Image src={club.logoUrl} alt={club.name} width={56} height={56} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/20 text-xl font-bold text-primary">
                          {club.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{club.name}</p>
                      <span className="text-xs text-white/40">{categoryLabel}</span>
                    </div>
                  </div>

                  {/* Açıklama */}
                  <p className="mb-4 flex-1 text-sm leading-relaxed text-white/60 line-clamp-3">
                    {club.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {club._count.followers}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {club._count.events}
                    </span>
                    {club.totalRatings > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {club.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  {club.slug && club.websitePublished ? (
                    <Link
                      href={`/clubs/${club.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
                    >
                      {t('viewPage')} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center rounded-xl border border-white/10 py-2 text-sm text-white/30">
                      {t('noPage')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
