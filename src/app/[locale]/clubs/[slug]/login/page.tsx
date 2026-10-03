import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ClubLoginForm } from '@/components/club/ClubLoginForm';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

type Props = { params: Promise<{ slug: string; locale: string }> };

export default async function ClubLoginPage({ params }: Props) {
  const { slug, locale } = await params;
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: 'clubLogin' }),
    getTranslations({ locale, namespace: 'nav' }),
  ]);

  return (
    <>
      <PageHero eyebrow={tNav('clubs')} title={t('title')} subtitle={t('subtitle')} image="cam-bina-havadan" compact />

      <section className="mx-auto w-full max-w-md px-6 pb-24 pt-4">
        <Link
          href={`/clubs/${slug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToClub')}
        </Link>

        <ScrollReveal className="rounded-3xl border border-border bg-surface p-6 md:p-8">
          <ClubLoginForm />
        </ScrollReveal>
      </section>
    </>
  );
}
