# Hukuk 50K OS — Premium V4 Cloud

Kişisel YKS EA → Hukuk hedefi için premium performans/alışkanlık/finans takip paneli.

## V4 yenilikleri
- Supabase Auth (e-posta + şifre)
- Çoklu cihaz bulut senkronizasyonu
- RLS ile kullanıcı bazlı veri izolasyonu
- Yerel çalışma devam eder; bulut bağlantısı isteğe bağlıdır
- Ayarlar ekranından Supabase Project URL + Publishable/Anon Key yapılandırması
- Otomatik, debounced bulut kaydı
- Manuel senkronizasyon / çıkış
- V3'teki günlük plan, konu motoru, deneme, performans, disiplin, finans ve PWA özellikleri korunur

## 1) Supabase projesini aç
Supabase Dashboard'dan bir proje oluştur.

## 2) Veritabanını hazırla
Supabase → SQL Editor → `supabase-schema.sql` dosyasının tamamını çalıştır.

## 3) Data API erişimi
`public.user_state` tablosunun API'den erişilebilir olduğundan emin ol. RLS açıktır ve yalnızca authenticated kullanıcı kendi `user_id` satırına erişebilir.

## 4) Uygulamayı yapılandır
GitHub Pages sitesinde `Ayarlar → Bulut Senkronizasyonu` bölümüne:
- Project URL
- Publishable/Anon Key

gir ve bağlantıyı kaydet.

**service_role / secret key tarayıcıya veya GitHub'a koyma.**

## 5) Auth
Supabase Authentication → Providers altında Email aktif olsun. E-posta doğrulama açıksa kayıt sonrası doğrulama e-postası gelir.

## GitHub Pages
`main` branch + `/root` (veya repository ayarındaki seçili kök klasör) ile yayınla.

## Veri modeli
Tüm uygulama durumu tek bir `jsonb` kaydında, kullanıcı başına bir satır olarak saklanır. İleride görev/konu/deneme tablolarına normalleştirmek mümkündür; V4'te öncelik güvenli ve kolay yedeklenebilir kişisel cloud state modelidir.
