import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { FeatureDetailSection } from '@/components/sections/FeatureDetailSection';
import { ScreenshotsSection } from '@/components/sections/ScreenshotsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { DownloadSection } from '@/components/sections/DownloadSection';
import { CTASection } from '@/components/sections/CTASection';
import { FAQSection } from '@/components/sections/FAQSection';
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
      {
        '@type': 'FAQPage',
        '@id': 'https://iytemobil.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'İYTE Mobil uygulaması nedir?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'İYTE Mobil, İzmir Yüksek Teknoloji Enstitüsü öğrencileri için geliştirilmiş kapsamlı bir kampüs uygulamasıdır. Yemek menüsü, otobüs saatleri, sosyal akış, araç paylaşımı, anlık mesajlaşma ve akademik belgeler gibi özellikler sunar.',
            },
          },
          {
            '@type': 'Question',
            name: 'İYTE Mobil hangi platformlarda kullanılabilir?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'İYTE Mobil şu anda Android cihazlarda Google Play Store üzerinden ücretsiz olarak indirilebilir. iOS versiyonu yakında App Store\'da yayınlanacaktır.',
            },
          },
          {
            '@type': 'Question',
            name: 'İYTE yemek menüsünü uygulamadan görebilir miyim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Evet, İYTE Mobil uygulaması üzerinden yemekhane ve KYK yurt günlük menülerini görüntüleyebilir, kampüs restoranlarını keşfedebilir ve değerlendirme yapabilirsiniz.',
            },
          },
          {
            '@type': 'Question',
            name: 'İYTE ring servisi saatlerine uygulamadan ulaşabilir miyim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Evet, İYTE Mobil üzerinden İYTE ring servis saatlerini, ESHOT bağlantı saatlerini hafta içi ve hafta sonu programları ayrı ayrı görüntüleyebilirsiniz.',
            },
          },
          {
            '@type': 'Question',
            name: 'İYTE Mobil ücretli mi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Hayır, İYTE Mobil tamamen ücretsizdir. Google Play Store\'dan ücretsiz olarak indirebilirsiniz.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://iytemobil.com/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Ana Sayfa',
            item: 'https://iytemobil.com/tr',
          },
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
      <FAQSection />
      <DownloadSection />
      <CTASection />
    </>
  );
}
