import { notFound } from 'next/navigation';
import Image from 'next/image';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { Link } from '@/i18n/navigation';
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  Clock,
} from 'lucide-react';

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  website?: string;
}

interface ClubEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  themeColor?: string;
  socialLinks?: SocialLinks;
  category: string;
  averageRating: number;
  totalRatings: number;
  _count: { followers: number; events: number };
  events: ClubEvent[];
}

async function getClub(slug: string): Promise<Club | null> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs/page/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.club;
  } catch {
    return null;
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  SPORTS: 'Spor',
  ART: 'Sanat',
  TECHNOLOGY: 'Teknoloji',
  ARCHITECTURE: 'Mimarlık',
  TRAVEL: 'Gezi',
  MUSIC: 'Müzik',
  ACADEMIC: 'Akademik',
  SOCIAL: 'Sosyal',
  OTHER: 'Diğer',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) return { title: 'Topluluk Bulunamadı' };
  return {
    title: `${club.name} | İYTE Mobil`,
    description: club.description.slice(0, 160),
    openGraph: {
      title: club.name,
      description: club.description.slice(0, 160),
      images: club.bannerUrl ? [{ url: club.bannerUrl }] : [],
    },
  };
}

export default async function ClubPublicPage({ params }: Props) {
  const { slug } = await params;
  const club = await getClub(slug);

  if (!club) {
    notFound();
  }

  const theme = club.themeColor || '#dc2626';
  const socialLinks = club.socialLinks as SocialLinks | undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Banner */}
      <div className="relative h-56 w-full overflow-hidden md:h-72 lg:h-80">
        {club.bannerUrl ? (
          <Image src={club.bannerUrl} alt="banner" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${theme}33, ${theme}11)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 pb-20">
        {/* Back link */}
        <Link
          href="/"
          className="mb-4 mt-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Link>

        {/* Club header */}
        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div
            className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-[#0a0a0f] shadow-xl"
            style={{ boxShadow: `0 0 32px ${theme}55` }}
          >
            {club.logoUrl ? (
              <Image src={club.logoUrl} alt={club.name} width={112} height={112} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white" style={{ background: theme }}>
                {club.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{club.name}</h1>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: `${theme}33`, border: `1px solid ${theme}55`, color: theme }}
              >
                {CATEGORY_LABELS[club.category] || club.category}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {club._count.followers} takipçi
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {club._count.events} etkinlik
              </span>
              {club.totalRatings > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {club.averageRating.toFixed(1)} ({club.totalRatings} değerlendirme)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="mb-3 text-base font-semibold text-white">Hakkımızda</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{club.description}</p>
        </div>

        {/* Social links */}
        {socialLinks && Object.values(socialLinks).some(Boolean) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-pink-500/40 hover:text-pink-400">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-sky-500/40 hover:text-sky-400">
                <Twitter className="h-4 w-4" /> Twitter
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-blue-500/40 hover:text-blue-400">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-red-500/40 hover:text-red-400">
                <Youtube className="h-4 w-4" /> YouTube
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
                <Globe className="h-4 w-4" /> Web Sitesi
              </a>
            )}
          </div>
        )}

        {/* Upcoming events */}
        {club.events.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-white">Yaklaşan Etkinlikler</h2>
            <div className="flex flex-col gap-4">
              {club.events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  {event.imageUrl && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="mb-1 font-semibold text-white">{event.title}</h3>
                    <p className="mb-3 text-sm text-white/60 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {club.events.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-white/20" />
            <p className="text-sm text-white/40">Henüz yaklaşan etkinlik yok</p>
          </div>
        )}

        {/* App CTA */}
        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: `linear-gradient(135deg, ${theme}22, ${theme}11)`, border: `1px solid ${theme}33` }}
        >
          <p className="mb-1 text-base font-semibold text-white">İYTE Mobil'i İndir</p>
          <p className="mb-4 text-sm text-white/60">Etkinlikleri takip et, topluluğa katıl</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://apps.apple.com/app/iyte-mobil/id6745141439"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: theme }}
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.iytemobil"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              Google Play
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
