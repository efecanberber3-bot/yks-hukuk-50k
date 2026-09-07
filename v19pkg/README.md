# Hukuk 50K OS — V13 Ultimate

Premium YKS EA / Hukuk takip paneli.

Özellikler: Dashboard, adaptif koç, günlük görev motoru, Focus Room, konu motoru, deneme merkezi, hata günlüğü, performans, disiplin, finans, Supabase Auth/senkronizasyonu, JSON yedekleme, PWA/offline cache.

GitHub Pages: ZIP içindeki tüm dosyaları repository köküne yükleyin. cloud-config.js içindeki secret/service_role key kullanılmaz. Supabase bağlantısı Ayarlar ekranından yapılabilir.


## Account-aware profile update
The sidebar profile now reads the signed-in Supabase user metadata (`full_name`). On signup, an optional display name can be entered. If no name exists, the personal name is hidden instead of hard-coded, so the same build can be shared by multiple users.
