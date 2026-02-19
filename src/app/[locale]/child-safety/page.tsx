import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return {
    title: isTr
      ? 'Cocuk Guvenligi Standartlari | IYTE Mobil'
      : 'Child Safety Standards | IYTE Mobile',
    description: isTr
      ? 'IYTE Mobil cocuk guvenligi ve CSAE onleme standartlari.'
      : 'IYTE Mobile child safety and CSAE prevention standards.',
    alternates: {
      canonical: isTr
        ? 'https://iytemobil.com/tr/child-safety'
        : 'https://iytemobil.com/en/child-safety',
    },
  };
}

export default async function ChildSafetyPage({ params }: Props) {
  const { locale } = await params;
  const isTr = locale === 'tr';

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isTr ? 'Cocuk Guvenligi Standartlari' : 'Child Safety Standards'}
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          {isTr ? 'Son guncelleme: 19 Subat 2026' : 'Last updated: February 19, 2026'}
        </p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '1. Taahhut' : '1. Commitment'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'IYTE Mobil, cocuklarin cinsel istismari ve cocuk istismarina (CSAE) karsi sifir tolerans ilkesini benimser.'
                : 'IYTE Mobile adopts a zero-tolerance policy against child sexual abuse and exploitation (CSAE).'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '2. Yasakli Icerik ve Davranislar' : '2. Prohibited Content and Behavior'}
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                {isTr
                  ? 'CSAM (cocuk cinsel istismari materyali) olusturma, paylasma, depolama veya baglanti verme'
                  : 'Creating, sharing, storing, or linking to CSAM'}
              </li>
              <li>
                {isTr
                  ? 'Cocuklarin cinsel olarak somurulmesini tesvik eden her turlu iletisim veya icerik'
                  : 'Any communication or content that promotes sexual exploitation of children'}
              </li>
              <li>
                {isTr
                  ? 'Cocuklarla uygunsuz iletisim kurma, kandirma veya bulusma girisimleri'
                  : 'Grooming, inappropriate contact, or attempts to arrange child meetings'}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '3. Tespit ve Moderasyon' : '3. Detection and Moderation'}
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>
                {isTr
                  ? 'Kullanici raporlari ve moderasyon surecleri aktif olarak uygulanir'
                  : 'User reports and moderation workflows are actively enforced'}
              </li>
              <li>
                {isTr
                  ? 'Supheli icerikler kaldirilir, ilgili hesaplar askiya alinabilir veya kalici olarak kapatilabilir'
                  : 'Suspicious content is removed; related accounts may be suspended or permanently terminated'}
              </li>
              <li>
                {isTr
                  ? 'Yasal yukumluluk durumunda ilgili resmi makamlarla is birligi yapilir'
                  : 'We cooperate with relevant legal authorities when required'}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '4. Bildirim ve Sikayet' : '4. Reporting and Complaints'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kullanicilar uygulama icindeki raporlama mekanizmasini kullanabilir veya dogrudan e-posta ile bildirim yapabilir: iytemobil@gmail.com'
                : 'Users can report via in-app reporting tools or directly by email: iytemobil@gmail.com'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '5. Iletisim Noktasi' : '5. Point of Contact'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Cocuk guvenligi politikasi ve uygulamalariyla ilgili resmi iletisim adresi: iytemobil@gmail.com'
                : 'Official contact for child safety policy and practices: iytemobil@gmail.com'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isTr ? '6. Kapsam' : '6. Scope'}
            </h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Bu standartlar IYTE Mobil uygulamasinin tum kullanici icerikleri, mesajlasma alanlari ve topluluk etkilesimleri icin gecerlidir.'
                : 'These standards apply to all user-generated content, messaging areas, and community interactions in IYTE Mobile.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

