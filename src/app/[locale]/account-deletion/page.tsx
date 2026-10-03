import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/ui/PageHero';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr ? 'Hesap Silme | İYTE Mobil' : 'Account Deletion | IYTE Mobile',
    description: isTr
      ? 'İYTE Mobil hesap silme ve veri kaldırma süreci.'
      : 'IYTE Mobile account deletion and data removal process.',
    alternates: {
      canonical: isTr
        ? 'https://iytemobil.com/tr/account-deletion'
        : 'https://iytemobil.com/en/account-deletion',
    },
  };
}

export default async function AccountDeletionPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <PageHero eyebrow={tFooter('legal')} title={isTr ? 'Hesap Silme Talimatı' : 'Account Deletion Instructions'} subtitle={isTr ? 'Son güncelleme: 17 Şubat 2026' : 'Last updated: February 17, 2026'} image="kampus-panorama" compact />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <ScrollReveal className="rounded-3xl border border-border bg-surface px-6 md:px-10">
          <div className="divide-y divide-border [&>div]:py-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '1. Uygulama İçindeki Hesap Silme Adımları' : '1. In-App Account Deletion Steps'}</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text-secondary marker:font-semibold marker:text-primary">
                <li>{isTr ? 'Profil > Ayarlar ekranına gidin.' : 'Go to Profile > Settings.'}</li>
                <li>{isTr ? '"Hesabı Kalıcı Olarak Sil" seçeneğine basın.' : 'Tap "Delete Account Permanently".'}</li>
                <li>{isTr ? 'Onay penceresinde işlemi doğrulayın.' : 'Confirm the action in the dialog.'}</li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '2. Silinen Veriler' : '2. Data Deleted'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap kaydı ve profil bilgileri' : 'Account record and profile information'}</li>
                <li>{isTr ? 'Kullanıcıya ait kimliklendirici veriler' : 'User-identifying data'}</li>
                <li>{isTr ? 'Push bildirim tokenları' : 'Push notification tokens'}</li>
                <li>{isTr ? 'Ayar tercihleri ve aktif oturumlar' : 'Preference data and active sessions'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '3. Saklanabilecek Veriler' : '3. Data That May Be Retained'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Yasal zorunluluklar veya güvenlik kayıtları kapsamında bazı veriler sınırlı süre saklanabilir.'
                  : 'Some data may be retained for legal compliance or security records for a limited period.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '4. İşlem Süresi ve Geri Alınabilirlik' : '4. Processing Time and Reversibility'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Silme talebi alındıktan sonra hesap erişimi sonlandırılır. İşlem geri alınmaz. Teknik temizleme süreci makul bir zaman aralığında tamamlanır.'
                  : 'After a deletion request, account access is terminated. The action is irreversible. Backend cleanup completes within a reasonable technical timeframe.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '5. Destek' : '5. Support'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Sorularınız için: iytemobil@gmail.com'
                  : 'For assistance: iytemobil@gmail.com'}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
