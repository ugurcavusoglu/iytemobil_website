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
    title: isTr
      ? 'Çocuk Güvenliği Standartları | İYTE Mobil'
      : 'Child Safety Standards | IYTE Mobile',
    description: isTr
      ? 'İYTE Mobil çocuk güvenliği ve CSAE önleme standartları.'
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
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <PageHero eyebrow={tFooter('legal')} title={isTr ? 'Çocuk Güvenliği Standartları' : 'Child Safety Standards'} subtitle={isTr ? 'Son güncelleme: 19 Şubat 2026' : 'Last updated: February 19, 2026'} image="kampus-panorama" compact />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <ScrollReveal className="rounded-3xl border border-border bg-surface px-6 md:px-10">
          <div className="divide-y divide-border [&>div]:py-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '1. Taahhüt' : '1. Commitment'}
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'İYTE Mobil, çocukların cinsel istismarı ve çocuk istismarına (CSAE) karşı sıfır tolerans ilkesini benimser.'
                  : 'IYTE Mobile adopts a zero-tolerance policy against child sexual abuse and exploitation (CSAE).'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '2. Yasaklı İçerik ve Davranışlar' : '2. Prohibited Content and Behavior'}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>
                  {isTr
                    ? 'CSAM (çocuk cinsel istismarı materyali) oluşturma, paylaşma, depolama veya bağlantı verme'
                    : 'Creating, sharing, storing, or linking to CSAM'}
                </li>
                <li>
                  {isTr
                    ? 'Çocukların cinsel olarak sömürülmesini teşvik eden her türlü iletişim veya içerik'
                    : 'Any communication or content that promotes sexual exploitation of children'}
                </li>
                <li>
                  {isTr
                    ? 'Çocuklarla uygunsuz iletişim kurma, kandırma veya buluşma girişimleri'
                    : 'Grooming, inappropriate contact, or attempts to arrange child meetings'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '3. Tespit ve Moderasyon' : '3. Detection and Moderation'}
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>
                  {isTr
                    ? 'Kullanıcı raporları ve moderasyon süreçleri aktif olarak uygulanır'
                    : 'User reports and moderation workflows are actively enforced'}
                </li>
                <li>
                  {isTr
                    ? 'Şüpheli içerikler kaldırılır, ilgili hesaplar askıya alınabilir veya kalıcı olarak kapatılabilir'
                    : 'Suspicious content is removed; related accounts may be suspended or permanently terminated'}
                </li>
                <li>
                  {isTr
                    ? 'Yasal yükümlülük durumunda ilgili resmi makamlarla iş birliği yapılır'
                    : 'We cooperate with relevant legal authorities when required'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '4. Bildirim ve Şikayet' : '4. Reporting and Complaints'}
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanıcılar uygulama içindeki raporlama mekanizmasını kullanabilir veya doğrudan e-posta ile bildirim yapabilir: iytemobil@gmail.com'
                  : 'Users can report via in-app reporting tools or directly by email: iytemobil@gmail.com'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '5. İletişim Noktası' : '5. Point of Contact'}
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Çocuk güvenliği politikası ve uygulamalarıyla ilgili resmi iletişim adresi: iytemobil@gmail.com'
                  : 'Official contact for child safety policy and practices: iytemobil@gmail.com'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                {isTr ? '6. Kapsam' : '6. Scope'}
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu standartlar İYTE Mobil uygulamasının tüm kullanıcı içerikleri, mesajlaşma alanları ve topluluk etkileşimleri için geçerlidir.'
                  : 'These standards apply to all user-generated content, messaging areas, and community interactions in IYTE Mobile.'}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

