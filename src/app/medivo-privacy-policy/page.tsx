import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikasi | Medivo',
  description: 'Medivo uygulamasi gizlilik politikasi.',
};

export default function MedivoPrivacyPolicy() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">Medivo Gizlilik Politikasi</h1>
        <p className="mt-3 text-sm text-zinc-400">Son guncelleme: Nisan 2026</p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">1. Giris</h2>
            <p className="mt-2 text-zinc-300">
              Medivo olarak gizliliginize saygi duyuyoruz. Bu politika, uygulamamizin hangi verileri
              topladigini ve nasil kullandigini aciklar.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">2. Toplanan Veriler</h2>
            <p className="mt-2 text-zinc-300">
              Medivo, tum verileri yalnizca cihazinizda yerel olarak saklar. Sunucularimiza hicbir
              kisisel veri gonderilmez.
            </p>
            <p className="mt-2 text-zinc-300">Cihazinizda saklanan veriler:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>Adiniz (onboarding sirasinda girdiginiz)</li>
              <li>Eklediginiz ilac bilgileri (isim, saat, sure)</li>
              <li>Ilac alim gecmisiniz</li>
              <li>Uygulama tercihleriniz (dil, bildirim ayarlari)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">3. Ucuncu Taraf Paylasimi</h2>
            <p className="mt-2 text-zinc-300">
              Verileriniz hicbir ucuncu tarafla paylasilmaz, satilmaz veya aktarilmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">4. Bildirimler</h2>
            <p className="mt-2 text-zinc-300">
              Uygulama, ilac hatirlaticilari icin yerel bildirimler gonderir. Bu bildirimler yalnizca
              cihazinizda olusturulur, dis sunucu kullanilmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">5. Veri Guvenligi</h2>
            <p className="mt-2 text-zinc-300">
              Tum veriler cihazinizin yerel depolama alaninda (AsyncStorage) tutulur. Uygulama
              internet baglantisi gerektirmez ve hicbir veriyi disariya aktarmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">6. Cocuklarin Gizliligi</h2>
            <p className="mt-2 text-zinc-300">
              Uygulamamiz 13 yas alti cocuklara yonelik degildir ve bu kisilerden bilerek veri
              toplamayiz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">7. Veri Silme</h2>
            <p className="mt-2 text-zinc-300">
              Uygulamayi cihazinizdan kaldirdiginizda tum veriler otomatik olarak silinir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">8. Degisiklikler</h2>
            <p className="mt-2 text-zinc-300">
              Bu politikada yapilacak degisiklikler uygulama guncellemeleriyle duyurulacaktir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">9. Iletisim</h2>
            <p className="mt-2 text-zinc-300">
              Sorulariniz icin:{' '}
              <a href="mailto:univo.techno@gmail.com" className="text-primary hover:underline">
                univo.techno@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
