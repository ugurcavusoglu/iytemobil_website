import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr ? 'Gizlilik Politikasi | IYTE Mobil' : 'Privacy Policy | IYTE Mobile',
    description: isTr
      ? 'IYTE Mobil uygulamasi gizlilik politikasi.'
      : 'Privacy policy for the IYTE Mobile app.',
    alternates: {
      canonical: isTr
        ? 'https://iytemobil.com/tr/privacy-policy'
        : 'https://iytemobil.com/en/privacy-policy',
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isTr ? 'Gizlilik Politikasi' : 'Privacy Policy'}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {isTr ? 'Son guncelleme: 17 Subat 2026' : 'Last updated: February 17, 2026'}
        </p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">{isTr ? '1. Kapsam' : '1. Scope'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Bu politika IYTE Mobil uygulamasinda toplanan, kullanilan ve saklanan verileri aciklar.'
                : 'This policy explains what data is collected, used, and stored in the IYTE Mobile app.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '2. Toplanan Veriler' : '2. Data We Collect'}
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Hesap verileri (ad, kullanici adi, e-posta)' : 'Account data (name, username, email)'}</li>
              <li>{isTr ? 'Profil verileri (profil fotografi, bolum, sinif, ilgi alanlari)' : 'Profile data (photo, department, grade, interests)'}</li>
              <li>{isTr ? 'Icerik verileri (gonderiler, yorumlar, mesajlar)' : 'Content data (posts, comments, messages)'}</li>
              <li>{isTr ? 'Bildirim verileri (push token)' : 'Notification data (push token)'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '3. Veri Kullanimi' : '3. How We Use Data'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Veriler uygulama fonksiyonlari, hesap yonetimi, guvenlik ve bildirim gonderimi amaclariyla kullanilir.'
                : 'Data is used for app functionality, account management, security, and notifications.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '4. Veri Paylasimi' : '4. Data Sharing'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kisisel veriler reklam amacli ucuncu taraflarla satilmaz. Yasal yukumluluklar disinda paylasim yapilmaz.'
                : 'Personal data is not sold for advertising. Data is shared only when legally required.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '5. Hesap Silme ve Veri Silme' : '5. Account & Data Deletion'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kullanicilar uygulama icinden hesaplarini silebilir. Silme sonrasinda veriler yasal gereklilikler haricinde kaldirilir veya anonimlestirilir.'
                : 'Users can delete their account in-app. After deletion, data is removed or anonymized, except where legal retention applies.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '6. Iletisim' : '6. Contact'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr ? 'E-posta: support@iytemobil.com' : 'Email: support@iytemobil.com'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

