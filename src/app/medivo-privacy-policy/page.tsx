import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Medivo',
  description: 'Medivo uygulaması gizlilik politikası.',
};

export default function MedivoPrivacyPolicy() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <h1 className="text-3xl font-bold md:text-4xl">Medivo Gizlilik Politikası</h1>
        <p className="mt-3 text-sm text-zinc-400">Son güncelleme: Nisan 2026</p>

        <div className="mt-8 space-y-6 text-zinc-200">
          <div>
            <h2 className="text-lg font-semibold">1. Giriş</h2>
            <p className="mt-2 text-zinc-300">
              Medivo olarak gizliliğinize saygı duyuyoruz. Bu politika, uygulamamızın hangi verileri
              topladığını ve nasıl kullandığını açıklar.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">2. Toplanan Veriler</h2>
            <p className="mt-2 text-zinc-300">
              Medivo, tüm verileri yalnızca cihazınızda yerel olarak saklar. Sunucularımıza hiçbir
              kişisel veri gönderilmez.
            </p>
            <p className="mt-2 text-zinc-300">Cihazınızda saklanan veriler:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
              <li>Adınız (onboarding sırasında girdiğiniz)</li>
              <li>Eklediğiniz ilaç bilgileri (isim, saat, süre)</li>
              <li>İlaç alım geçmişiniz</li>
              <li>Uygulama tercihleriniz (dil, bildirim ayarları)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold">3. Üçüncü Taraf Paylaşımı</h2>
            <p className="mt-2 text-zinc-300">
              Verileriniz hiçbir üçüncü tarafla paylaşılmaz, satılmaz veya aktarılmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">4. Bildirimler</h2>
            <p className="mt-2 text-zinc-300">
              Uygulama, ilaç hatırlatıcıları için yerel bildirimler gönderir. Bu bildirimler yalnızca
              cihazınızda oluşturulur, dış sunucu kullanılmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">5. Veri Güvenliği</h2>
            <p className="mt-2 text-zinc-300">
              Tüm veriler cihazınızın yerel depolama alanında (AsyncStorage) tutulur. Uygulama
              internet bağlantısı gerektirmez ve hiçbir veriyi dışarıya aktarmaz.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">6. Çocukların Gizliliği</h2>
            <p className="mt-2 text-zinc-300">
              Uygulamamız 13 yaş altı çocuklara yönelik değildir ve bu kişilerden bilerek veri
              toplamayız.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">7. Veri Silme</h2>
            <p className="mt-2 text-zinc-300">
              Uygulamayı cihazınızdan kaldırdığınızda tüm veriler otomatik olarak silinir.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">8. Değişiklikler</h2>
            <p className="mt-2 text-zinc-300">
              Bu politikada yapılacak değişiklikler uygulama güncellemeleriyle duyurulacaktır.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">9. İletişim</h2>
            <p className="mt-2 text-zinc-300">
              Sorularınız için:{' '}
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
