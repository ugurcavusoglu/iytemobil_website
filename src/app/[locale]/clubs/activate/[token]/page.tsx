import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AlertCircle } from 'lucide-react';
import { GlowEffect } from '@/components/ui/GlowEffect';
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
    <section className="relative min-h-screen overflow-hidden pb-20 pt-28 md:pt-32">
      <div className="absolute inset-0 bg-hero-gradient" />
      <GlowEffect className="left-1/2 top-0 -translate-x-1/2" size="lg" />

      <div className="relative mx-auto w-full max-w-xl px-4 md:px-8">
        {info ? (
          <ClubActivationForm token={token} clubName={info.club.name} logoUrl={info.club.logoUrl} username={info.username} />
        ) : (
          <div className="glass-card p-6 text-center md:p-8">
            <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400" />
            <h1 className="mb-2 text-2xl font-bold">{t('invalid.title')}</h1>
            <p className="text-text-secondary">{t('invalid.description')}</p>
            <a
              href="mailto:iytemobil@gmail.com"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              {t('invalid.contact')}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
