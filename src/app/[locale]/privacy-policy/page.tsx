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
  const tFooter = await getTranslations({ locale, namespace: 'footer' });

  return (
    <>
      <PageHero eyebrow={tFooter('legal')} title={isTr ? 'Gizlilik Politikasi' : 'Privacy Policy'} subtitle={isTr ? 'Son guncelleme: 17 Subat 2026' : 'Last updated: February 17, 2026'} image="kampus-panorama" compact />

      <section className="mx-auto max-w-3xl px-6 pb-24 pt-4">
        <ScrollReveal className="rounded-3xl border border-border bg-surface px-6 md:px-10">
          <div className="divide-y divide-border [&>div]:py-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '1. Veri Sorumlusu' : '1. Data Controller'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr ? 'IYTE Mobil Gelistirme Ekibi' : 'IYTE Mobile Development Team'}
              </p>
              <p className="mt-1 leading-relaxed text-text-secondary">{isTr ? 'Iletisim: iytemobil@gmail.com' : 'Contact: iytemobil@gmail.com'}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '2. Kapsam' : '2. Scope'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu politika mobil uygulama, uygulama ici servisler, destek surecleri ve resmi web alanlarini kapsar.'
                  : 'This policy covers the mobile app, in-app services, support processes, and official web domains.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '3. Toplanan Veri Kategorileri' : '3. Data Categories Collected'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap verileri (ad, kullanici adi, e-posta)' : 'Account data (name, username, email)'}</li>
                <li>{isTr ? 'Kimlik dogrulama verileri (sifre hash, oturum tokenlari)' : 'Authentication data (password hash, session tokens)'}</li>
                <li>{isTr ? 'Profil verileri (fotograf, bolum, sinif, ilgi alanlari)' : 'Profile data (photo, department, grade, interests)'}</li>
                <li>{isTr ? 'Icerik verileri (post, yorum, mesaj, raporlar)' : 'Content data (posts, comments, messages, reports)'}</li>
                <li>{isTr ? 'Teknik veriler (cihaz bilgisi, uygulama surumu, loglar)' : 'Technical data (device info, app version, logs)'}</li>
                <li>{isTr ? 'Bildirim verileri (push token, bildirim tercihleri)' : 'Notification data (push token, preferences)'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '4. Isleme Amaclari' : '4. Purposes of Processing'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap olusturma, oturum acma ve kimlik dogrulama' : 'Account creation, login, and authentication'}</li>
                <li>{isTr ? 'Uygulama ozelliklerinin saglanmasi ve surekliligi' : 'Providing and maintaining app features'}</li>
                <li>{isTr ? 'Topluluk guvenligi, suistimal ve spam onleme' : 'Community safety, abuse and spam prevention'}</li>
                <li>{isTr ? 'Bildirimlerin gonderilmesi' : 'Delivering notifications'}</li>
                <li>{isTr ? 'Hata analizi ve teknik iyilestirme' : 'Error analysis and technical improvements'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '5. Hukuki Dayanak' : '5. Legal Bases'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Veriler; sozlesmenin ifasi, acik riza (gerektiginde), mesru menfaat ve hukuki yukumluluk dayanaklariyla islenir.'
                  : 'Data is processed under contract performance, consent (where required), legitimate interest, and legal obligations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '6. Veri Paylasimi' : '6. Data Sharing'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kisisel veriler reklam amacli satilmaz. Yalnizca teknik servis saglayicilar ve yasal zorunluluk hallerinde yetkili kurumlarla paylasim yapilir.'
                  : 'Personal data is not sold for advertising. It may be shared only with technical providers and public authorities where legally required.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '7. Yurtdisina Aktarim' : '7. International Transfers'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanilan bulut altyapisi nedeniyle veriler yurtdisinda islenebilir. Uygun teknik ve idari guvenceler uygulanir.'
                  : 'Cloud infrastructure may process data abroad. Appropriate technical and administrative safeguards are applied.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '8. Saklama Sureleri' : '8. Retention Periods'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Hesap verileri: hesap aktif oldugu surece' : 'Account data: while the account remains active'}</li>
                <li>{isTr ? 'Guvenlik loglari: yasal/makul sure boyunca' : 'Security logs: for legal/reasonable retention periods'}</li>
                <li>{isTr ? 'Hesap silme sonrasi: yasal zorunluluk disindaki veriler silinir veya anonimlestirilir' : 'After deletion: non-required data is deleted or anonymized'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '9. Guvenlik Onlemleri' : '9. Security Measures'}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text-secondary marker:text-primary">
                <li>{isTr ? 'Rol tabanli erisim kontrolu' : 'Role-based access control'}</li>
                <li>{isTr ? 'Sifrelerin guvenli hashlenmesi' : 'Secure password hashing'}</li>
                <li>{isTr ? 'Iletisimde sifreli kanallar (TLS)' : 'Encrypted transport channels (TLS)'}</li>
                <li>{isTr ? 'Guvenlik izleme ve olay yonetimi' : 'Security monitoring and incident management'}</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '10. Kullanici Haklari' : '10. User Rights'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Kullanicilar, veriye erisim, duzeltme, silme, islemeyi kisitlama, itiraz ve tasinabilirlik gibi haklarini iytemobil@gmail.com uzerinden kullanabilir.'
                  : 'Users may exercise rights such as access, correction, deletion, restriction, objection, and portability via iytemobil@gmail.com.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '11. Cocuklarin Gizliligi' : '11. Children Privacy'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Uygulama universite toplulugu icin tasarlanmistir ve cocuklara yonelik bir hizmet degildir.'
                  : 'The app is designed for a university community and is not directed to children.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">{isTr ? '12. Politika Guncellemeleri ve Iletisim' : '12. Policy Updates and Contact'}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {isTr
                  ? 'Bu politika guncellenebilir. Onemli degisiklikler duyurulur. Sorulariniz icin: iytemobil@gmail.com'
                  : 'This policy may be updated. Material changes will be announced. Contact: iytemobil@gmail.com'}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
