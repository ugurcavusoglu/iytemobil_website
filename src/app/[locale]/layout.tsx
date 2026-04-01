import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    metadataBase: new URL('https://iytemobil.com'),
    title: t('title'),
    description: t('description'),
    keywords: [
      'IYTE', 'İYTE', 'IYTE Mobil', 'İYTE Mobil', 'iyte mobil uygulama',
      'izmir yüksek teknoloji enstitüsü', 'iyte kampüs', 'iyte yemek menüsü',
      'iyte yemek', 'iyte otobüs', 'iyte ring servisi', 'iyte ulaşım',
      'iyte sosyal', 'iyte öğrenci', 'iyte etkinlik', 'iyte araç paylaşımı',
      'kampüs uygulaması', 'üniversite uygulaması', 'izmir kampüs'
    ],
    authors: [{ name: 'IYTE Mobil Team' }],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://iytemobil.com',
      siteName: 'IYTE Mobil',
      images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/images/og-image.png'],
    },
    alternates: {
      canonical: `https://iytemobil.com/${locale}`,
      languages: {
        'tr': 'https://iytemobil.com/tr',
        'en': 'https://iytemobil.com/en',
        'x-default': 'https://iytemobil.com/tr',
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-background text-white antialiased font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
