# Live Ortamda Migration Sorunu - tours Tablosu Yok

## 🔴 Sorun

`tours` tablosu henüz oluşturulmamış ama migration'lar `tours` tablosuna kolon eklemeye çalışıyor. Bu, migration'ların yanlış sırayla uygulanmaya çalışıldığı anlamına geliyor.

## ✅ Çözüm: İlk Migration'ı Önce Manuel Uygula

### Adım 1: Başarısız Migration'ı Resolve Et

Container içinde (zaten bağlısınız):

```bash
# Başarısız migration'ı rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back 20250104_add_meeting_point_fields
```

### Adım 2: İlk Migration'ı Manuel Olarak Uygula

İlk migration'ı (`20251020234814_migration1`) manuel olarak uygulayın - bu migration tüm tabloları oluşturur:

```bash
# İlk migration'ı uygula
npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma
```

### Adım 3: İlk Migration'ı Applied Olarak İşaretle

```bash
# İlk migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251020234814_migration1
```

### Adım 4: Diğer Migration'ları Uygula

Şimdi diğer migration'ları uygulayabilirsiniz:

```bash
npx prisma migrate deploy
```

### Adım 5: Prisma Client'ı Generate Et

```bash
npx prisma generate
```

### Adım 6: Container'dan Çık ve Restart Et

```bash
exit
docker restart travel-site-server
```

## Alternatif: Tüm Migration History'yi Temizle ve Sıfırdan Başla

Eğer yukarıdaki yöntem işe yaramazsa, migration history'yi temizleyip sıfırdan başlayabilirsiniz:

### ⚠️ DİKKAT: Bu yöntem migration history'yi sıfırlar!

```bash
# Container içinde
cd /app

# Migration history'yi temizle (sadece migration history, veriler kalır)
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "TRUNCATE TABLE _prisma_migrations;"

# Şimdi tüm migration'ları uygula
npx prisma migrate deploy
```

## Kontrol: tours Tablosu Var mı?

Önce `tours` tablosunun var olup olmadığını kontrol edin:

```bash
# PostgreSQL container'a bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb

# Tabloları listele
\dt

# tours tablosunu kontrol et
\d tours

# Çıkış
\q
```

**Eğer `tours` tablosu yoksa:**
- İlk migration'ı manuel olarak uygulayın (Adım 2)

**Eğer `tours` tablosu varsa:**
- Sadece başarısız migration'ı resolve edin ve tekrar deneyin

## Tek Komutla Çözüm (Container Dışından)

Eğer container'dan çıktıysanız:

```bash
# 1. Başarısız migration'ı resolve et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate resolve --rolled-back 20250104_add_meeting_point_fields"

# 2. İlk migration'ı manuel olarak uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma"

# 3. İlk migration'ı applied olarak işaretle
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate resolve --applied 20251020234814_migration1"

# 4. Diğer migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 5. Container'ı restart et
docker restart travel-site-server
```

## Beklenen Çıktı

### Adım 2 (İlk Migration'ı Uygulama):
```
Executing SQL from file: prisma/migrations/20251020234814_migration1/migration.sql
```

### Adım 4 (Diğer Migration'ları Uygulama):
```
Applying migration `20251021003110_add_favorites_table`
Applying migration `20251025150853_add_user_fields`
Applying migration `20251026000000_add_popular_field`
Applying migration `20251026000001_add_meeting_point_fields`
Applying migration `20251026000002_remove_category_add_available_times`
Applying migration `20251026000003_add_age_ranges_and_monthly_pricing`

All migrations have been successfully applied.
```

## Sorun Giderme

### Eğer "file not found" hatası alırsanız:

Migration dosyasının yolunu kontrol edin:

```bash
# Container içinde
ls -la prisma/migrations/20251020234814_migration1/
```

### Eğer "permission denied" hatası alırsanız:

Dosya izinlerini kontrol edin:

```bash
# Container içinde
chmod +r prisma/migrations/20251020234814_migration1/migration.sql
```

### Eğer hala "tours table does not exist" hatası alırsanız:

İlk migration'ın başarıyla uygulandığını kontrol edin:

```bash
# PostgreSQL container'a bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d tours"
```

Eğer tablo yoksa, ilk migration'ı tekrar uygulayın.

## Özet

1. ✅ Başarısız migration'ı resolve et (`--rolled-back`)
2. ✅ İlk migration'ı manuel olarak uygula (`db execute`)
3. ✅ İlk migration'ı applied olarak işaretle (`--applied`)
4. ✅ Diğer migration'ları uygula (`migrate deploy`)
5. ✅ Prisma Client'ı generate et (`generate`)
6. ✅ Container'ı restart et

