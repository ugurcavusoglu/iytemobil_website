import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr ? 'Hesap Silme | IYTE Mobil' : 'Account Deletion | IYTE Mobile',
    description: isTr
      ? 'IYTE Mobil hesap silme ve veri kaldirma sureci.'
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

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isTr ? 'Hesap Silme Talimati' : 'Account Deletion Instructions'}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {isTr ? 'Son guncelleme: 17 Subat 2026' : 'Last updated: February 17, 2026'}
        </p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">{isTr ? '1. Uygulama Icindeki Hesap Silme Adimlari' : '1. In-App Account Deletion Steps'}</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Profil > Ayarlar ekranina gidin.' : 'Go to Profile > Settings.'}</li>
              <li>{isTr ? '"Hesabi Kalici Olarak Sil" secenegine basin.' : 'Tap "Delete Account Permanently".'}</li>
              <li>{isTr ? 'Onay penceresinde islemi dogrulayin.' : 'Confirm the action in the dialog.'}</li>
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '2. Silinen Veriler' : '2. Data Deleted'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Hesap kaydi ve profil bilgileri' : 'Account record and profile information'}</li>
              <li>{isTr ? 'Kullaniciya ait kimliklendirici veriler' : 'User-identifying data'}</li>
              <li>{isTr ? 'Push bildirim tokenlari' : 'Push notification tokens'}</li>
              <li>{isTr ? 'Ayar tercihleri ve aktif oturumlar' : 'Preference data and active sessions'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '3. Saklanabilecek Veriler' : '3. Data That May Be Retained'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Yasal zorunluluklar veya guvenlik kayitlari kapsaminda bazi veriler sinirli sure saklanabilir.'
                : 'Some data may be retained for legal compliance or security records for a limited period.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '4. Islem Suresi ve Geri Alinabilirlik' : '4. Processing Time and Reversibility'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Silme talebi alindiktan sonra hesap erisimi sonlandirilir. Islem geri alinmaz. Teknik temizleme sureci makul bir zaman araliginda tamamlanir.'
                : 'After a deletion request, account access is terminated. The action is irreversible. Backend cleanup completes within a reasonable technical timeframe.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '5. Destek' : '5. Support'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Sorulariniz icin: iytemobil@gmail.com'
                : 'For assistance: iytemobil@gmail.com'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
