import { SmoothScroll } from '@/components/home/SmoothScroll';
import { IntroOverlay } from '@/components/home/IntroOverlay';
import { HeroIyte } from '@/components/home/HeroIyte';
import { ExplodedPhone } from '@/components/home/ExplodedPhone';
import { FeatureRail } from '@/components/home/FeatureRail';
import { WordStream } from '@/components/home/WordStream';
import { Moments } from '@/components/home/Moments';
import { ParticleWordmark } from '@/components/home/ParticleWordmark';
import { ClubsSection } from '@/components/home/ClubsSection';
import { Finale } from '@/components/home/Finale';
import { TeamSection } from '@/components/sections/TeamSection';
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
        installUrl: ['https://play.google.com/store/apps/details?id=com.iytemobil.app', 'https://apps.apple.com/tr/app/i-yte-mobile/id6761460550'],
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
              text: 'İYTE Mobil Android\'de Google Play\'den, iPhone\'da App Store\'dan ücretsiz olarak indirilebilir.',
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
          {
            '@type': 'Question',
            name: "Topluluğumu İYTE Mobil'e nasıl eklerim?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Topluluk hesaplarını İYTE Mobil ekibi açar. Topluluğunun yöneticisiysen iytemobil@gmail.com adresinden bize ulaş; hesabını aktifleştirmen için özel bir link gönderelim.',
            },
          },
          {
            '@type': 'Question',
            name: 'Akademik belgeler nasıl yüklenir?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iytemobil.com/tr/documents adresinden bölümünüzü seçip Belge Yükle butonuna tıklayarak PDF, DOC veya DOCX formatında belgeler yükleyebilirsiniz. Yüklenen belgeler onay sonrası yayınlanır.',
            },
          },
          {
            '@type': 'Question',
            name: 'Sosyal akışta anonim paylaşım yapabilir miyim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Evet, İYTE Mobil sosyal akışında anonim itiraf paylaşımı yapabilirsiniz. İtiraf olarak işaretlenen paylaşımlar kimliğiniz gizlenerek yayınlanır.',
            },
          },
          {
            '@type': 'Question',
            name: 'Bildirimler çalışıyor mu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Evet, İYTE Mobil\'de anlık bildirimler aktiftir. Yeni mesaj, beğeni, yorum ve etkinlik bildirimleri anında telefonunuza iletilir.',
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
      <SmoothScroll />
      <IntroOverlay />
      <HeroIyte />
      <ExplodedPhone />
      <FeatureRail />
      <WordStream />
      <Moments />
      <ParticleWordmark />
      <ClubsSection />
      <TeamSection />
      <Finale />
    </>
  );
}
