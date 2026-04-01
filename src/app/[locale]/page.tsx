import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { FeatureDetailSection } from '@/components/sections/FeatureDetailSection';
import { ScreenshotsSection } from '@/components/sections/ScreenshotsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { DownloadSection } from '@/components/sections/DownloadSection';
import { CTASection } from '@/components/sections/CTASection';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `https://iytemobil.com/${locale}`,
      languages: {
        'tr': 'https://iytemobil.com/tr',
        'en': 'https://iytemobil.com/en',
        'x-default': 'https://iytemobil.com/tr',
      },
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `https://iytemobil.com/${locale}`,
      images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
    },
  };
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://iytemobil.com/#website',
        url: 'https://iytemobil.com',
        name: 'İYTE Mobil',
        description: 'İzmir Yüksek Teknoloji Enstitüsü öğrencileri için kampüs uygulaması',
        inLanguage: ['tr-TR', 'en-US'],
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://iytemobil.com/tr?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://iytemobil.com/#organization',
        name: 'İYTE Mobil',
        url: 'https://iytemobil.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://iytemobil.com/images/og-image.png',
        },
        sameAs: ['https://www.instagram.com/iytemobil'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'iytemobil@gmail.com',
          contactType: 'customer support',
        },
      },
      {
        '@type': 'MobileApplication',
        '@id': 'https://iytemobil.com/#app',
        name: 'İYTE Mobil',
        description: 'İzmir Yüksek Teknoloji Enstitüsü öğrencileri için kampüs uygulaması. İYTE yemek menüsü, otobüs saatleri, sosyal akış, araç paylaşımı ve daha fazlası.',
        operatingSystem: 'Android, iOS',
        applicationCategory: 'EducationApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'TRY',
        },
        installUrl: 'https://play.google.com/store/apps/details?id=com.iytemobil.app',
        screenshot: 'https://iytemobil.com/images/og-image.png',
        featureList: [
          'İYTE yemek menüsü',
          'İYTE otobüs saatleri',
          'İYTE ring servisi',
          'Sosyal akış',
          'Araç paylaşımı',
          'Anlık mesajlaşma',
          'Topluluklar ve etkinlikler',
          'Akademik belgeler',
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <FeatureDetailSection />
      <ScreenshotsSection />
      <TeamSection />
      <DownloadSection />
      <CTASection />
    </>
  );
}
