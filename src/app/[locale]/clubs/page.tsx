import { getTranslations } from 'next-intl/server';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';
import { PageHero } from '@/components/ui/PageHero';
import { ClubsDirectory, type DirectoryClub } from '@/components/club/ClubsDirectory';

async function getClubs(): Promise<DirectoryClub[]> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/clubs?status=APPROVED&sortBy=members&limit=200`,
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
  const [clubs, t, tNav, tHome] = await Promise.all([
    getClubs(),
    getTranslations({ locale, namespace: 'clubsPage' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'home.clubs' }),
  ]);

  return (
    <>
      <PageHero eyebrow={tNav('clubs')} title={t('title')} subtitle={t('subtitle')} image="topluluk-stant">
        {clubs.length > 0 && (
          <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
            <div>
              <p className="text-4xl font-black leading-none tracking-tighter md:text-5xl">{clubs.length.toLocaleString(locale)}</p>
              <p className="mt-1 text-sm text-text-secondary">{tHome('clubs')}</p>
            </div>
            <div>
              <p className="text-4xl font-black leading-none tracking-tighter text-primary md:text-5xl">7K+</p>
              <p className="mt-1 text-sm text-text-secondary">{tHome('students')}</p>
            </div>
          </div>
        )}
      </PageHero>

      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-4 md:px-12 md:pb-32">
        <ClubsDirectory clubs={clubs} />
      </section>
    </>
  );
}
