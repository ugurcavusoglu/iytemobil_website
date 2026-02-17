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
            <h2 className="text-lg font-semibold">{isTr ? '1. Taraflar ve Tanimlar' : '1. Parties and Definitions'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Bu kosullar, IYTE Mobil Gelistirme Ekibi ile uygulamayi kullanan gercek kisiler arasindaki hukuki iliskiyi duzenler.'
                : 'These terms govern the legal relationship between the IYTE Mobile Development Team and end users.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '2. Hizmet Kapsami' : '2. Scope of Service'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Uygulama sosyal akis, topluluk-etkinlik, yemek, ulasim, mesajlasma ve akademik paylasim gibi kampus odakli ozellikler sunar.'
                : 'The app provides campus-focused features such as social feed, clubs/events, food, transportation, messaging, and academic sharing.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '3. Hesap ve Guvenlik' : '3. Account and Security'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Dogru ve guncel bilgi verme sorumlulugu kullanicidadir.' : 'Users must provide accurate and up-to-date information.'}</li>
              <li>{isTr ? 'Hesap guvenligi kullanicinin sorumlulugundadir.' : 'Users are responsible for account security.'}</li>
              <li>{isTr ? 'Supheli erisim durumlarinda destek ekibi bilgilendirilmelidir.' : 'Suspicious access should be reported to support.'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '4. Yasakli Davranislar' : '4. Prohibited Conduct'}</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>{isTr ? 'Hakaret, tehdit, taciz, nefret soylemi' : 'Harassment, threats, hate speech, abuse'}</li>
              <li>{isTr ? 'Yasa disi icerik, dolandiricilik, kimlik taklidi' : 'Illegal content, fraud, impersonation'}</li>
              <li>{isTr ? 'Spam, otomatik bot, sistem manipule etme' : 'Spam, automation bots, system manipulation'}</li>
              <li>{isTr ? 'Telif/fikri mulkiyet ihlali' : 'Copyright or IP infringement'}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '5. Kullanici Icerikleri' : '5. User Content'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kullanici paylastigi icerikten sorumludur ve gerekli haklara sahip oldugunu beyan eder. Hizmetin sunulabilmesi icin teknik olarak gerekli bir kullanim lisansi verir.'
                : 'Users are responsible for submitted content and warrant necessary rights. A limited technical license is granted for service delivery.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '6. Moderasyon ve Yaptirim' : '6. Moderation and Enforcement'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Ihlalin niteligine gore icerik kaldirma, uyari, gecici askiya alma veya kalici hesap kapatma uygulanabilir.'
                : 'Depending on severity, content removal, warnings, temporary suspension, or permanent account termination may apply.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '7. Ucuncu Taraf Servisler' : '7. Third-Party Services'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Uygulama ucuncu taraf servisler kullanabilir. Bu servislerin kendi kosullari ve gizlilik politikalari gecerlidir.'
                : 'The app may rely on third-party services, each governed by its own terms and privacy policy.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '8. Fikri Mulkiyet' : '8. Intellectual Property'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Uygulama yazilimi, marka, logo ve tasarim unsurlari ilgili hak sahiplerine aittir. Izinsiz kullanim yasaktir.'
                : 'Software, branding, logo, and design assets belong to their respective rights holders. Unauthorized use is prohibited.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '9. Hizmette Degisiklik ve Kesintiler' : '9. Service Changes and Interruptions'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Teknik bakim, guvenlik ve urun gelistirme nedenleriyle hizmette degisiklik veya gecici kesinti olabilir.'
                : 'Service changes or temporary interruptions may occur for maintenance, security, or product development.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '10. Sorumlulugun Sinirlandirilmasi' : '10. Limitation of Liability'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Hizmet, hukukun izin verdigi olcude oldugu gibi sunulur. Dolayli veya sonucsal zararlardan sorumluluk sinirlandirilabilir.'
                : 'The service is provided as-is to the extent permitted by law, and liability for indirect or consequential damages may be limited.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '11. Hesap Silme ve Fesih' : '11. Account Deletion and Termination'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Kullanici hesabini uygulama icinden silebilir. Ciddi veya tekrarli ihlallerde hesap sonlandirilabilir.'
                : 'Users can delete their account in-app. Repeated or severe violations may result in account termination.'}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">{isTr ? '12. Uygulanacak Hukuk ve Iletisim' : '12. Governing Law and Contact'}</h2>
            <p className="mt-2 text-zinc-300">
              {isTr
                ? 'Bu kosullar Turkiye Cumhuriyeti hukukuna tabidir. Iletisim: iytemobil@gmail.com'
                : 'These terms are governed by the laws of the Republic of Turkiye. Contact: iytemobil@gmail.com'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
