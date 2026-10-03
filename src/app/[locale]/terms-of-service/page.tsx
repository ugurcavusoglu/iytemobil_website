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
    title: isTr ? 'Kullanım Koşulları | İYTE Mobil' : 'Terms of Service | IYTE Mobile',
    description: isTr
      ? 'İYTE Mobil uygulaması kullanım koşulları.'
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
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <PageHero eyebrow={tFooter('legal')} title={isTr ? 'Kullanım Koşulları' : 'Terms of Service'} subtitle={isTr ? 'Son güncelleme: 17 Şubat 2026' : 'Last updated: February 17, 2026'} image="kampus-panorama" compact />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <ScrollReveal className="rounded-3xl border border-border bg-surface px-6 md:px-10">
          <div className="divide-y divide-border [&>div]:py-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '1. Taraflar ve Tanımlar' : '1. Parties and Definitions'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu koşullar, İYTE Mobil Geliştirme Ekibi ile uygulamayı kullanan gerçek kişiler arasındaki hukuki ilişkiyi düzenler.'
                  : 'These terms govern the legal relationship between the IYTE Mobile Development Team and end users.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '2. Hizmet Kapsamı' : '2. Scope of Service'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Uygulama sosyal akış, topluluk-etkinlik, yemek, ulaşım, mesajlaşma ve akademik paylaşım gibi kampüs odaklı özellikler sunar.'
                  : 'The app provides campus-focused features such as social feed, clubs/events, food, transportation, messaging, and academic sharing.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '3. Hesap ve Güvenlik' : '3. Account and Security'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Doğru ve güncel bilgi verme sorumluluğu kullanıcıdadır.' : 'Users must provide accurate and up-to-date information.'}</li>
                <li>{isTr ? 'Hesap güvenliği kullanıcının sorumluluğundadır.' : 'Users are responsible for account security.'}</li>
                <li>{isTr ? 'Şüpheli erişim durumlarında destek ekibi bilgilendirilmelidir.' : 'Suspicious access should be reported to support.'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '4. Yasaklı Davranışlar' : '4. Prohibited Conduct'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hakaret, tehdit, taciz, nefret söylemi' : 'Harassment, threats, hate speech, abuse'}</li>
                <li>{isTr ? 'Yasa dışı içerik, dolandırıcılık, kimlik taklidi' : 'Illegal content, fraud, impersonation'}</li>
                <li>{isTr ? 'Spam, otomatik bot, sistem manipüle etme' : 'Spam, automation bots, system manipulation'}</li>
                <li>{isTr ? 'Telif/fikri mülkiyet ihlali' : 'Copyright or IP infringement'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '5. Kullanıcı İçerikleri' : '5. User Content'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanıcı paylaştığı içerikten sorumludur ve gerekli haklara sahip olduğunu beyan eder. Hizmetin sunulabilmesi için teknik olarak gerekli bir kullanım lisansı verir.'
                  : 'Users are responsible for submitted content and warrant necessary rights. A limited technical license is granted for service delivery.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '6. Moderasyon ve Yaptırım' : '6. Moderation and Enforcement'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'İhlalin niteliğine göre içerik kaldırma, uyarı, geçici askıya alma veya kalıcı hesap kapatma uygulanabilir.'
                  : 'Depending on severity, content removal, warnings, temporary suspension, or permanent account termination may apply.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '7. Üçüncü Taraf Servisler' : '7. Third-Party Services'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Uygulama üçüncü taraf servisler kullanabilir. Bu servislerin kendi koşulları ve gizlilik politikaları geçerlidir.'
                  : 'The app may rely on third-party services, each governed by its own terms and privacy policy.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '8. Fikri Mülkiyet' : '8. Intellectual Property'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Uygulama yazılımı, marka, logo ve tasarım unsurları ilgili hak sahiplerine aittir. İzinsiz kullanım yasaktır.'
                  : 'Software, branding, logo, and design assets belong to their respective rights holders. Unauthorized use is prohibited.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '9. Hizmette Değişiklik ve Kesintiler' : '9. Service Changes and Interruptions'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Teknik bakım, güvenlik ve ürün geliştirme nedenleriyle hizmette değişiklik veya geçici kesinti olabilir.'
                  : 'Service changes or temporary interruptions may occur for maintenance, security, or product development.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '10. Sorumluluğun Sınırlandırılması' : '10. Limitation of Liability'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Hizmet, hukukun izin verdiği ölçüde olduğu gibi sunulur. Dolaylı veya sonuçsal zararlardan sorumluluk sınırlandırılabilir.'
                  : 'The service is provided as-is to the extent permitted by law, and liability for indirect or consequential damages may be limited.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '11. Hesap Silme ve Fesih' : '11. Account Deletion and Termination'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanıcı hesabını uygulama içinden silebilir. Ciddi veya tekrarlı ihlallerde hesap sonlandırılabilir.'
                  : 'Users can delete their account in-app. Repeated or severe violations may result in account termination.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '12. Uygulanacak Hukuk ve İletişim' : '12. Governing Law and Contact'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. İletişim: iytemobil@gmail.com'
                  : 'These terms are governed by the laws of the Republic of Turkiye. Contact: iytemobil@gmail.com'}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
