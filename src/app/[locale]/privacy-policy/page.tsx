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
    title: isTr ? 'Gizlilik Politikası | İYTE Mobil' : 'Privacy Policy | IYTE Mobile',
    description: isTr
      ? 'İYTE Mobil uygulaması gizlilik politikası.'
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
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <PageHero eyebrow={tFooter('legal')} title={isTr ? 'Gizlilik Politikası' : 'Privacy Policy'} subtitle={isTr ? 'Son güncelleme: 17 Şubat 2026' : 'Last updated: February 17, 2026'} image="kampus-panorama" compact />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <ScrollReveal className="rounded-3xl border border-border bg-surface px-6 md:px-10">
          <div className="divide-y divide-border [&>div]:py-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '1. Veri Sorumlusu' : '1. Data Controller'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr ? 'İYTE Mobil Geliştirme Ekibi' : 'IYTE Mobile Development Team'}
              </p>
              <p className="mt-1 leading-relaxed text-text-secondary">{isTr ? 'İletişim: iytemobil@gmail.com' : 'Contact: iytemobil@gmail.com'}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '2. Kapsam' : '2. Scope'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu politika mobil uygulama, uygulama içi servisler, destek süreçleri ve resmi web alanlarını kapsar.'
                  : 'This policy covers the mobile app, in-app services, support processes, and official web domains.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '3. Toplanan Veri Kategorileri' : '3. Data Categories Collected'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap verileri (ad, kullanıcı adı, e-posta)' : 'Account data (name, username, email)'}</li>
                <li>{isTr ? 'Kimlik doğrulama verileri (şifre hash, oturum tokenları)' : 'Authentication data (password hash, session tokens)'}</li>
                <li>{isTr ? 'Profil verileri (fotoğraf, bölüm, sınıf, ilgi alanları)' : 'Profile data (photo, department, grade, interests)'}</li>
                <li>{isTr ? 'İçerik verileri (post, yorum, mesaj, raporlar)' : 'Content data (posts, comments, messages, reports)'}</li>
                <li>{isTr ? 'Teknik veriler (cihaz bilgisi, uygulama sürümü, loglar)' : 'Technical data (device info, app version, logs)'}</li>
                <li>{isTr ? 'Bildirim verileri (push token, bildirim tercihleri)' : 'Notification data (push token, preferences)'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '4. İşleme Amaçları' : '4. Purposes of Processing'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap oluşturma, oturum açma ve kimlik doğrulama' : 'Account creation, login, and authentication'}</li>
                <li>{isTr ? 'Uygulama özelliklerinin sağlanması ve sürekliliği' : 'Providing and maintaining app features'}</li>
                <li>{isTr ? 'Topluluk güvenliği, suistimal ve spam önleme' : 'Community safety, abuse and spam prevention'}</li>
                <li>{isTr ? 'Bildirimlerin gönderilmesi' : 'Delivering notifications'}</li>
                <li>{isTr ? 'Hata analizi ve teknik iyileştirme' : 'Error analysis and technical improvements'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '5. Hukuki Dayanak' : '5. Legal Bases'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Veriler; sözleşmenin ifası, açık rıza (gerektiğinde), meşru menfaat ve hukuki yükümlülük dayanaklarıyla işlenir.'
                  : 'Data is processed under contract performance, consent (where required), legitimate interest, and legal obligations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '6. Veri Paylaşımı' : '6. Data Sharing'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kişisel veriler reklam amaçlı satılmaz. Yalnızca teknik servis sağlayıcılar ve yasal zorunluluk hallerinde yetkili kurumlarla paylaşım yapılır.'
                  : 'Personal data is not sold for advertising. It may be shared only with technical providers and public authorities where legally required.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '7. Yurtdışına Aktarım' : '7. International Transfers'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanılan bulut altyapısı nedeniyle veriler yurtdışında işlenebilir. Uygun teknik ve idari güvenceler uygulanır.'
                  : 'Cloud infrastructure may process data abroad. Appropriate technical and administrative safeguards are applied.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '8. Saklama Süreleri' : '8. Retention Periods'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap verileri: hesap aktif olduğu sürece' : 'Account data: while the account remains active'}</li>
                <li>{isTr ? 'Güvenlik logları: yasal/makul süre boyunca' : 'Security logs: for legal/reasonable retention periods'}</li>
                <li>{isTr ? 'Hesap silme sonrası: yasal zorunluluk dışındaki veriler silinir veya anonimleştirilir' : 'After deletion: non-required data is deleted or anonymized'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '9. Güvenlik Önlemleri' : '9. Security Measures'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Rol tabanlı erişim kontrolü' : 'Role-based access control'}</li>
                <li>{isTr ? 'Şifrelerin güvenli hashlenmesi' : 'Secure password hashing'}</li>
                <li>{isTr ? 'İletişimde şifreli kanallar (TLS)' : 'Encrypted transport channels (TLS)'}</li>
                <li>{isTr ? 'Güvenlik izleme ve olay yönetimi' : 'Security monitoring and incident management'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '10. Kullanıcı Hakları' : '10. User Rights'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanıcılar, veriye erişim, düzeltme, silme, işlemeyi kısıtlama, itiraz ve taşınabilirlik gibi haklarını iytemobil@gmail.com üzerinden kullanabilir.'
                  : 'Users may exercise rights such as access, correction, deletion, restriction, objection, and portability via iytemobil@gmail.com.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '11. Çocukların Gizliliği' : '11. Children Privacy'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Uygulama üniversite topluluğu için tasarlanmıştır ve çocuklara yönelik bir hizmet değildir.'
                  : 'The app is designed for a university community and is not directed to children.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '12. Politika Güncellemeleri ve İletişim' : '12. Policy Updates and Contact'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu politika güncellenebilir. Önemli değişiklikler duyurulur. Sorularınız için: iytemobil@gmail.com'
                  : 'This policy may be updated. Material changes will be announced. Contact: iytemobil@gmail.com'}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
