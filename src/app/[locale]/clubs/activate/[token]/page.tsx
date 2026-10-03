import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AlertCircle } from 'lucide-react';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ClubActivationForm } from '@/components/club/ClubActivationForm';
import { resolveClubApplicationApiBase } from '@/lib/club-application-api';

type Props = { params: Promise<{ locale: string; token: string }> };

type ActivationInfo = {
  club: { name: string; logoUrl: string | null; category: string };
  username: string;
  expiresAt: string;
};

export const metadata: Metadata = {
  title: 'Topluluk Hesabı Aktivasyonu',
  robots: { index: false, follow: false },
};

async function getActivationInfo(token: string): Promise<ActivationInfo | null> {
  try {
    const res = await fetch(
      `${resolveClubApplicationApiBase()}/api/auth/club-activation/${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    return (await res.json()) as ActivationInfo;
  } catch {
    return null;
  }
}

export default async function ClubActivationPage({ params }: Props) {
  const { locale, token } = await params;
  const t = await getTranslations({ locale, namespace: 'clubActivation' });
  const info = await getActivationInfo(token);

  return (
    <>
      <PageHero eyebrow={t('header.label')} title={t('hero.title')} subtitle={t('hero.subtitle')} image="cam-bina-havadan" compact />

      <section className="mx-auto w-full max-w-xl px-6 pb-24 pt-4">
        <ScrollReveal>
          {info ? (
            <ClubActivationForm token={token} clubName={info.club.name} logoUrl={info.club.logoUrl} username={info.username} />
          ) : (
            <div className="rounded-3xl border border-border bg-surface p-6 text-center md:p-8">
              <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400" />
              <h2 className="mb-2 text-2xl font-bold">{t('invalid.title')}</h2>
              <p className="leading-relaxed text-text-secondary">{t('invalid.description')}</p>
              <a
                href="mailto:iytemobil@gmail.com"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t('invalid.contact')}
              </a>
            </div>
          )}
        </ScrollReveal>
      </section>
    </>
  );
}
