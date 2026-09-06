# Hukuk 50K OS — V6 Coach

Kişisel YKS 2027 EA / Hukuk performans paneli.

## V6 yenilikleri
- Adaptif günlük plan: gecikmiş tekrar + konu güveni + konu durumu + son deneme trendi + öncelik ağırlığı.
- Focus tamamlanınca gerçek çalışma dakikası otomatik kaydedilir.
- Günlük hızlı veri: soru ve telefon dakikası.
- Readiness göstergesi: deneme + konu kapsamı + disiplin verilerinden türetilen iç performans metriği; kesin sıralama tahmini değildir.
- Provisional sınav tarihi ve hedef sıralama ayarları.
- V3/V5 yerel verilerinden V6'ya otomatik migration.
- Supabase cloud polling anahtarı V6 localStorage key'ine güncellendi.

## Kurulum
1. `index.html` dosyasını veya GitHub Pages sitesini aç.
2. Supabase'te `supabase-schema.sql` bir kez çalıştır.
3. Panel > Ayarlar > Bulut Senkronizasyonu bölümünde Project URL + Publishable/Anon Key gir.
4. Hesap oluştur / giriş yap.
5. GitHub Pages kullanıyorsan dosyaları repository köküne yükle.

## Güvenlik
Tarayıcıya sadece publishable/anon key konur. `service_role` veya secret key'i GitHub'a ya da browser'a koyma. RLS politikaları `auth.uid()` ile kullanıcı verisini sınırlar.

## Not
2027 YKS'nin resmi sınav tarihi/kılavuzu yayımlandığında Ayarlar'daki provisional tarihi güncelle. Akademik konu ağacı başlangıçta genel TYT + AYT EA çalışma planı olarak tutulmuştur.


## V8 Coach Premium
- Weakness Radar now exposes a live 'NEDEN ZAYIF?' explanation.
- Priority uses coverage, confidence, overdue reviews, stale topics, question accuracy and mock trend.
- One-click action can add the top weakness to tomorrow's plan.
- 'Yarının planını oluştur' builds a ranked study plan from the current signals.
