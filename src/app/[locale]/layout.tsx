import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    metadataBase: new URL('https://iytemobil.com'),
    title: t('title'),
    description: t('description'),
    keywords: ['IYTE', 'IYTE Mobil', 'kampus', 'universite', 'ogrenci', 'izmir', 'iyte mobil'],
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
      canonical: 'https://iytemobil.com',
      languages: { tr: '/tr', en: '/en' },
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  if (!routing.locales.includes(locale as 'tr' | 'en')) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-background text-white antialiased font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
