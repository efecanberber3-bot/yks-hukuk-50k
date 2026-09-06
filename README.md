# Hukuk 50K OS — YKS 2027 EA

7 Eylül 2026 başlangıçlı kişisel YKS 2027 çalışma takip paneli. Hedef: Eşit Ağırlık Hukuk, ilk 50.000 (çalışma bandı 30K).

## V2 özellikleri
- Dashboard: günlük görev %, ders dakikası, streak, son TYT neti
- Bugün: saat blokları, görevler, alışkanlık skoru
- TYT + AYT EA konu yol haritası ve durum seçimi
- Deneme merkezi: TYT/AYT EA netleri ve ders kırılımı
- Analiz: TYT net trendi, son 7 gün çalışma grafiği, haftalık uyum
- Disiplin: 14 günlük uyum takvimi
- Para merkezi: 15.000 TL sabit ana gelir + ek gelir/gider
- Hedef ayarları: günlük çalışma dakikası, paragraf, problem
- JSON yedekleme / geri yükleme
- Açık/koyu tema
- PWA + offline cache
- GitHub Pages uyumlu

## Kullanım
`index.html` dosyasını aç veya GitHub Pages ile yayınla.

## GitHub Pages
1. Yeni repo aç.
2. Bu klasördeki tüm dosyaları repo köküne yükle.
3. Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
4. Site oluştuğunda Chrome'dan “Ana ekrana ekle” ile uygulama gibi kullanabilirsin.

## Veri mimarisi
V2 varsayılan olarak tarayıcı `localStorage` kullanır. Bu sürüm tek kullanıcı ve hızlı prototipleme içindir. Telefon + bilgisayar ortak veri için sonraki aşamada Supabase Auth + Postgres eklenebilir.
