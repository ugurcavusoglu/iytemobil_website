import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { Link } from '@/i18n/navigation';
import { ClubLogoutButton } from '@/components/club/ClubLogoutButton';
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
  Megaphone,
  Heart,
  MessageCircle,
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

interface ClubPost {
  id: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  _count: { likes: number; comments: number };
}

interface Club {
  id: string;
  slug?: string;
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
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.club;
  } catch {
    return null;
  }
}

async function getClubPosts(clubId: string): Promise<ClubPost[]> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs/${clubId}/posts?limit=20`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
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
  const { slug, locale } = await params;
  const club = await getClub(slug);
  const t = await getTranslations({ locale, namespace: 'clubPage' });

  if (!club) notFound();

  const posts = await getClubPosts(club.id);
  const now = new Date();
  const upcomingEvents = club.events.filter((e) => new Date(e.startDate) >= now);
  const pastEvents = club.events.filter((e) => new Date(e.startDate) < now);

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('club_token')?.value;

  const theme = club.themeColor || '#dc2626';
  const socialLinks = club.socialLinks as SocialLinks | undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Tema rengi şeridi */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${theme}, ${theme}44)` }} />

      <div className="relative mx-auto max-w-4xl px-4 pb-20">
        {/* Top bar: geri + dashboard/logout */}
        <div className="flex items-center justify-between pt-5 pb-2">
          <Link href="/clubs" className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
          <div className="flex items-center gap-2">
            {isLoggedIn && club.slug && (
              <Link
                href={`/clubs/${club.slug}/dashboard`}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:text-white"
              >
                Yönet
              </Link>
            )}
            {isLoggedIn && <ClubLogoutButton />}
          </div>
        </div>

        {/* Club header */}
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          <div
            className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-xl"
            style={{ boxShadow: `0 0 20px ${theme}33` }}
          >
            {club.logoUrl ? (
              <Image src={club.logoUrl} alt={club.name} width={80} height={80} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white" style={{ background: theme }}>
                {club.name[0]}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white md:text-3xl">{club.name}</h1>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${theme}22`, border: `1px solid ${theme}44`, color: theme }}
              >
                {CATEGORY_LABELS[club.category] || club.category}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {club._count.followers} {t('followers')}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {club._count.events} {t('events')}
              </span>
              {club.totalRatings > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {club.averageRating.toFixed(1)} ({club.totalRatings} {t('ratings')})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h2 className="mb-3 text-base font-semibold text-white">{t('about')}</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{club.description}</p>
        </div>

        {/* Social links */}
        {socialLinks && Object.values(socialLinks).some(Boolean) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-pink-500/40 hover:text-pink-400">
                <Instagram className="h-4 w-4" /> {t('instagram')}
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-sky-500/40 hover:text-sky-400">
                <Twitter className="h-4 w-4" /> {t('twitter')}
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-blue-500/40 hover:text-blue-400">
                <Linkedin className="h-4 w-4" /> {t('linkedin')}
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-red-500/40 hover:text-red-400">
                <Youtube className="h-4 w-4" /> {t('youtube')}
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white">
                <Globe className="h-4 w-4" /> {t('website')}
              </a>
            )}
          </div>
        )}

        {/* Posts feed */}
        {posts.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Megaphone className="h-5 w-5" style={{ color: theme }} />
              <h2 className="text-lg font-semibold text-white">{t('announcements')}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  {post.imageUrls?.length > 0 && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <div className="relative h-56 w-full">
                        <Image src={post.imageUrls[0]} alt="" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{post.content}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {post._count?.likes ?? post.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {post._count?.comments ?? post.commentsCount}
                    </span>
                    <span className="ml-auto">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming events */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" style={{ color: theme }} />
              <h2 className="text-lg font-semibold text-white">{t('upcomingEvents')}</h2>
            </div>
            <div className="flex flex-col gap-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
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
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(event.startDate)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past events */}
        {pastEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-base font-semibold text-white/50">{t('pastEvents')}</h2>
            <div className="flex flex-col gap-3">
              {pastEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 opacity-70">
                  <h3 className="mb-1 text-sm font-semibold text-white">{event.title}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(event.startDate)}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {club.events.length === 0 && posts.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Calendar className="mx-auto mb-3 h-10 w-10 text-white/20" />
            <p className="text-sm text-white/40">{t('noEvents')}</p>
          </div>
        )}

        {/* App CTA */}
        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: `linear-gradient(135deg, ${theme}22, ${theme}11)`, border: `1px solid ${theme}33` }}
        >
          <p className="mb-1 text-base font-semibold text-white">{t('downloadApp')}</p>
          <p className="mb-4 text-sm text-white/60">{t('downloadSubtitle')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://apps.apple.com/app/iyte-mobil/id6745141439"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: theme }}
            >
              {t('appStore')}
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.iytemobil"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              {t('googlePlay')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
