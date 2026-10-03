import { notFound } from 'next/navigation';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { Link } from '@/i18n/navigation';
import { ClubLogoutButton } from '@/components/club/ClubLogoutButton';
import { CATEGORY_COLORS, ClubLogo } from '@/components/club/ClubLogo';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
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
  const tCat = await getTranslations({ locale, namespace: 'home.clubs' });

  if (!club) notFound();

  const posts = await getClubPosts(club.id);
  const now = new Date();
  const upcomingEvents = club.events.filter((e) => new Date(e.startDate) >= now);
  const pastEvents = club.events.filter((e) => new Date(e.startDate) < now);

  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('club_token')?.value;

  const theme = club.themeColor || '#E63946';
  const socialLinks = club.socialLinks as SocialLinks | undefined;

  const categoryLabel = CATEGORY_COLORS[club.category] ? tCat(`categories.${club.category}`) : club.category;
  const socialItems = [
    { href: socialLinks?.instagram, Icon: Instagram, label: t('instagram'), hover: 'hover:border-pink-500/40 hover:text-pink-400' },
    { href: socialLinks?.twitter, Icon: Twitter, label: t('twitter'), hover: 'hover:border-sky-500/40 hover:text-sky-400' },
    { href: socialLinks?.linkedin, Icon: Linkedin, label: t('linkedin'), hover: 'hover:border-blue-500/40 hover:text-blue-400' },
    { href: socialLinks?.youtube, Icon: Youtube, label: t('youtube'), hover: 'hover:border-red-500/40 hover:text-red-400' },
    { href: socialLinks?.website, Icon: Globe, label: t('website'), hover: 'hover:border-white/30 hover:text-text-primary' },
  ].filter((item) => item.href);

  return (
    <>
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        <Image
          src={club.bannerUrl || '/images/iyte/konser-kalabalik.webp'}
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: theme }} />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-32 md:px-12 md:pb-16">
          <div className="mb-8 flex items-center justify-between gap-3">
            <Link href="/clubs" className="inline-flex items-center gap-2 rounded-full border border-border-light bg-background/50 px-4 py-2 text-sm text-text-secondary backdrop-blur transition-colors hover:text-text-primary">
              <ArrowLeft className="h-4 w-4" />
              {t('backHome')}
            </Link>
            <div className="flex items-center gap-2">
              {isLoggedIn && club.slug && (
                <Link
                  href={`/clubs/${club.slug}/dashboard`}
                  className="rounded-full border border-border-light bg-background/50 px-4 py-2 text-xs font-semibold text-text-secondary backdrop-blur transition-colors hover:text-text-primary"
                >
                  Yönet
                </Link>
              )}
              {isLoggedIn && <ClubLogoutButton />}
            </div>
          </div>

          <ScrollReveal className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <div className="w-fit rounded-[1.1rem]" style={{ boxShadow: `0 0 40px ${theme}55` }}>
              <ClubLogo name={club.name} logoUrl={club.logoUrl} color={theme} size={96} />
            </div>
            <div className="min-w-0 flex-1">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur"
                style={{ backgroundColor: `${theme}22`, border: `1px solid ${theme}44`, color: theme }}
              >
                {categoryLabel}
              </span>
              <h1 className="mt-4 break-words text-4xl font-black leading-[0.95] tracking-tighter md:text-7xl">{club.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <strong className="text-text-primary">{club._count.followers}</strong> {t('followers')}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <strong className="text-text-primary">{club._count.events}</strong> {t('events')}
                </span>
                {club.totalRatings > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <strong className="text-text-primary">{club.averageRating.toFixed(1)}</strong> ({club.totalRatings} {t('ratings')})
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-12 md:pb-32">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <aside className="flex flex-col gap-4 lg:order-last">
            <ScrollReveal className="rounded-3xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{t('about')}</h2>
              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-text-secondary">{club.description}</p>
            </ScrollReveal>

            {socialItems.length > 0 && (
              <ScrollReveal className="flex flex-wrap gap-2">
                {socialItems.map(({ href, Icon, label, hover }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors ${hover}`}
                  >
                    <Icon className="h-4 w-4" /> {label}
                  </a>
                ))}
              </ScrollReveal>
            )}
          </aside>

          <div className="flex min-w-0 flex-col gap-12">
            {posts.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <Megaphone className="h-5 w-5" style={{ color: theme }} />
                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">{t('announcements')}</h2>
                </div>
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <ScrollReveal key={post.id} className="overflow-hidden rounded-3xl border border-border bg-surface">
                      {post.imageUrls?.length > 0 && (
                        <div className="relative h-56 w-full md:h-72">
                          <Image src={post.imageUrls[0]} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div className="p-6">
                        <p className="whitespace-pre-wrap leading-relaxed text-text-primary/90">{post.content}</p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
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
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {upcomingEvents.length > 0 && (
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <Calendar className="h-5 w-5" style={{ color: theme }} />
                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">{t('upcomingEvents')}</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {upcomingEvents.map((event) => (
                    <ScrollReveal key={event.id} className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-surface">
                      {event.imageUrl ? (
                        <Image src={event.imageUrl} alt={event.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 20%, ${theme}66, #18181b 70%)` }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="relative p-6">
                        <h3 className="text-xl font-bold leading-snug">{event.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-white/70">{event.description}</p>
                        <div className="mt-3 flex flex-col gap-1 text-sm text-white/70">
                          <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{formatDate(event.startDate)}</span>
                          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</span>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="mb-5 text-lg font-bold text-text-secondary">{t('pastEvents')}</h2>
                <div className="flex flex-col divide-y divide-border rounded-3xl border border-border bg-surface/60">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="p-5">
                      <h3 className="font-semibold text-text-secondary">{event.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{formatDate(event.startDate)}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {club.events.length === 0 && posts.length === 0 && (
              <div className="rounded-3xl border border-border bg-surface p-10 text-center">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-text-disabled" />
                <p className="text-sm text-text-muted">{t('noEvents')}</p>
              </div>
            )}
          </div>
        </div>

        <ScrollReveal className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface p-8 text-center md:p-12">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ backgroundColor: theme }} />
          <p className="relative text-2xl font-black tracking-tight md:text-4xl">{t('downloadApp')}</p>
          <p className="relative mt-2 text-text-secondary">{t('downloadSubtitle')}</p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://apps.apple.com/app/iyte-mobil/id6745141439"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: theme }}
            >
              {t('appStore')}
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.iytemobil"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border-light px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary"
            >
              {t('googlePlay')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
