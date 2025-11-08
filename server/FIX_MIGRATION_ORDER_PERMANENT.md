# Migration Sırası Sorununu Kalıcı Çözüm

## 🔴 Sorun

Prisma migration'ları dosya adına göre alfabetik/sayısal sırayla uygular. Mevcut migration dosyalarının adları yanlış sırada:

- `20250104_add_meeting_point_fields` (2025-01-04) - **Önce geliyor ama `tours` tablosu henüz yok!**
- `20250104_add_popular_field` (2025-01-04) - **Önce geliyor ama `tours` tablosu henüz yok!**
- `20250105_remove_category_add_available_times` (2025-01-05)
- `20250125120000_add_age_ranges_and_monthly_pricing` (2025-01-25)
- `20251020234814_migration1` (2025-10-20) - **İlk migration, tüm tabloları oluşturur - SONRA geliyor!**
- `20251021003110_add_favorites_table` (2025-10-21)
- `20251025150853_add_user_fields` (2025-10-25)
- `20251108013258_add_age_ranges_and_monthly_pricing` (2025-11-08) - **Duplicate, kaldırılmalı**

## ✅ Kalıcı Çözüm

Migration dosyalarını doğru sıraya göre yeniden adlandırmalıyız. Prisma migration'ları dosya adına göre sıralar, bu yüzden dosya adlarını düzeltmeliyiz.

### Doğru Sıra

1. `20251020234814_migration1` → **İlk migration (tüm tabloları oluşturur)**
2. `20251021003110_add_favorites_table` → Favorites tablosu
3. `20251025150853_add_user_fields` → User alanları
4. `20250104_add_popular_field` → Popular alanı
5. `20250104_add_meeting_point_fields` → Meeting point alanları
6. `20250105_remove_category_add_available_times` → Category kaldırma
7. `20250125120000_add_age_ranges_and_monthly_pricing` → Yaş aralıkları
8. `20251108013258_add_age_ranges_and_monthly_pricing` → **Duplicate, kaldırılmalı**

### Yeniden Adlandırma Planı

Migration dosyalarını doğru sıraya göre yeniden adlandırmak için:

1. İlk migration zaten doğru: `20251020234814_migration1`
2. İkinci migration zaten doğru: `20251021003110_add_favorites_table`
3. Üçüncü migration zaten doğru: `20251025150853_add_user_fields`
4. Dördüncü migration: `20250104_add_popular_field` → `20251026000000_add_popular_field`
5. Beşinci migration: `20250104_add_meeting_point_fields` → `20251026000001_add_meeting_point_fields`
6. Altıncı migration: `20250105_remove_category_add_available_times` → `20251026000002_remove_category_add_available_times`
7. Yedinci migration: `20250125120000_add_age_ranges_and_monthly_pricing` → `20251026000003_add_age_ranges_and_monthly_pricing`
8. Sekizinci migration: `20251108013258_add_age_ranges_and_monthly_pricing` → **SİLİN**

## ⚠️ ÖNEMLİ: Production'da Dikkatli Olun!

Migration dosyalarını yeniden adlandırmak migration history'yi etkileyebilir. Bu işlemi yapmadan önce:

1. **Veritabanı yedeği alın**
2. **Test ortamında deneyin**
3. **Migration history'yi kontrol edin**

## Adımlar

### 1. Duplicate Migration'ı Kaldır

```bash
# Duplicate migration'ı kaldır
rm -rf server/prisma/migrations/20251108013258_add_age_ranges_and_monthly_pricing
```

### 2. Migration Dosyalarını Yeniden Adlandır

**Windows PowerShell:**
```powershell
cd server/prisma/migrations

# Popular field migration'ını yeniden adlandır
Rename-Item -Path "20250104_add_popular_field" -NewName "20251026000000_add_popular_field"

# Meeting point fields migration'ını yeniden adlandır
Rename-Item -Path "20250104_add_meeting_point_fields" -NewName "20251026000001_add_meeting_point_fields"

# Remove category migration'ını yeniden adlandır
Rename-Item -Path "20250105_remove_category_add_available_times" -NewName "20251026000002_remove_category_add_available_times"

# Age ranges migration'ını yeniden adlandır
Rename-Item -Path "20250125120000_add_age_ranges_and_monthly_pricing" -NewName "20251026000003_add_age_ranges_and_monthly_pricing"
```

**Linux/Mac:**
```bash
cd server/prisma/migrations

# Popular field migration'ını yeniden adlandır
mv 20250104_add_popular_field 20251026000000_add_popular_field

# Meeting point fields migration'ını yeniden adlandır
mv 20250104_add_meeting_point_fields 20251026000001_add_meeting_point_fields

# Remove category migration'ını yeniden adlandır
mv 20250105_remove_category_add_available_times 20251026000002_remove_category_add_available_times

# Age ranges migration'ını yeniden adlandır
mv 20250125120000_add_age_ranges_and_monthly_pricing 20251026000003_add_age_ranges_and_monthly_pricing

# Duplicate migration'ı kaldır
rm -rf 20251108013258_add_age_ranges_and_monthly_pricing
```

### 3. Migration History'yi Kontrol Et

```bash
cd server
npx prisma migrate status
```

### 4. Test Et

```bash
# Test ortamında migration'ları uygula
npx prisma migrate deploy
```

## Gelecekte Bu Sorunu Önlemek İçin

### Migration Oluştururken

1. **Her zaman `prisma migrate dev` kullanın** - Bu komut migration'ları otomatik olarak doğru sırayla oluşturur
2. **Manuel migration dosyası oluşturmayın** - Prisma'nın otomatik oluşturduğu migration'ları kullanın
3. **Migration adlarını değiştirmeyin** - Prisma'nın verdiği adları kullanın

### Migration Dosyası Adlandırma Kuralı

Prisma migration dosyaları şu formatta olmalı:
```
YYYYMMDDHHMMSS_migration_name
```

Örnek:
- `20251026000000_add_popular_field` ✅
- `20251026000001_add_meeting_point_fields` ✅
- `20250104_add_popular_field` ❌ (tarih sırası yanlış)

### Migration Oluşturma Rehberi

```bash
# 1. Schema'yı değiştir
# prisma/schema.prisma dosyasını düzenle

# 2. Migration oluştur
npx prisma migrate dev --name migration_name

# 3. Migration'ı test et
npx prisma migrate deploy

# 4. Commit et
git add prisma/migrations
git commit -m "Add migration: migration_name"
```

## Sorun Giderme

### Migration History Bozulursa

Eğer migration history bozulursa:

```bash
# Migration'ı resolve et
npx prisma migrate resolve --applied migration_name

# Veya rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back migration_name
```

### Migration Dosyası Yanlış Sırada Olursa

Eğer yeni bir migration yanlış sırada oluşturulursa:

1. Migration dosyasını doğru tarihle yeniden adlandır
2. Migration history'yi kontrol et
3. Test et

## Kontrol Listesi

- [ ] Duplicate migration kaldırıldı
- [ ] Migration dosyaları doğru sıraya göre yeniden adlandırıldı
- [ ] Migration history kontrol edildi
- [ ] Test ortamında migration'lar uygulandı
- [ ] Production'da migration'lar uygulandı
- [ ] Gelecekte doğru migration oluşturma rehberi hazırlandı

