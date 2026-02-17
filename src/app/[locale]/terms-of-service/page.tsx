import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr ? 'Kullanim Kosullari | IYTE Mobil' : 'Terms of Service | IYTE Mobile',
    description: isTr
      ? 'IYTE Mobil uygulamasi kullanim kosullari.'
      : 'Terms of service for the IYTE Mobile app.',
    alternates: {
      canonical: isTr
        ? 'https://iytemobil.com/tr/terms-of-service'
        : 'https://iytemobil.com/en/terms-of-service',
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isTr ? 'Kullanim Kosullari' : 'Terms of Service'}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {isTr ? 'Son guncelleme: 17 Subat 2026' : 'Last updated: February 17, 2026'}
        </p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '1. Genel Hukumler' : '1. General Terms'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'IYTE Mobil uygulamasini kullanarak bu kosullari kabul etmis olursunuz.'
                : 'By using IYTE Mobile, you agree to these terms.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '2. Hesap Sorumlulugu' : '2. Account Responsibility'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kullanici, hesabinin guvenliginden ve hesabiyla gerceklestirilen islemlerden sorumludur.'
                : 'Users are responsible for account security and activity under their account.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '3. Yasakli Icerikler' : '3. Prohibited Content'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Nefret soylemi, taciz, tehdit, hakaret' : 'Hate speech, harassment, threats, abuse'}</li>
              <li>{isTr ? 'Yasa disi icerik ve telif ihlali' : 'Illegal content and copyright infringement'}</li>
              <li>{isTr ? 'Sistemi kotuye kullanan otomasyon veya spam' : 'Abusive automation or spam'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '4. Moderasyon ve Yaptirim' : '4. Moderation & Enforcement'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kurallara aykiri icerikler kaldirilabilir; hesaplar gecici veya kalici olarak kisitlanabilir.'
                : 'Violating content may be removed; accounts may be temporarily or permanently restricted.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '5. Sorumlulugun Sinirlandirilmasi' : '5. Limitation of Liability'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Hizmet, mevcut oldugu sekliyle sunulur. Teknik kesinti ve kesintisiz erisim garantisi verilmez.'
                : 'The service is provided as is. Continuous uptime cannot be guaranteed.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

