# Live Ortamda Başarısız Migration'ı Çözme

## 🔴 Sorun

Live ortamda `20250104_add_meeting_point_fields` migration'ı başarısız olarak işaretlenmiş. Bu migration'ı resolve etmemiz gerekiyor.

## ✅ Çözüm Adımları

### 1. Başarısız Migration'ı Resolve Et

Docker container içinde:

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Başarısız migration'ı rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back 20250104_add_meeting_point_fields
```

**Açıklama:**
- `--rolled-back`: Migration'ın geri alındığını işaretler
- Bu migration'ı migration history'den kaldırır
- Yeni migration'ların uygulanmasına izin verir

### 2. Migration'ları Tekrar Uygula

```bash
npx prisma migrate deploy
```

Bu komut artık tüm migration'ları doğru sırayla uygulayacak.

### 3. Prisma Client'ı Generate Et

```bash
npx prisma generate
```

### 4. Container'dan Çık ve Restart Et

```bash
exit
docker restart travel-site-server
```

## Alternatif: Eğer Migration Zaten Uygulanmışsa

Eğer `meetingPointAddress` ve `meetingPointMapUrl` kolonları zaten `tours` tablosunda varsa, migration'ı `applied` olarak işaretleyebiliriz:

```bash
# Container içinde
cd /app

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields

# Migration'ları uygula
npx prisma migrate deploy
```

## Kontrol: Kolonlar Var mı?

Önce kolonların var olup olmadığını kontrol edin:

```bash
# PostgreSQL container'a bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb

# Kolonları kontrol et
\d tours

# Veya SQL ile
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours' 
AND column_name IN ('meetingPointAddress', 'meetingPointMapUrl');

# Çıkış
\q
```

**Eğer kolonlar varsa:**
- Migration'ı `--applied` olarak işaretleyin

**Eğer kolonlar yoksa:**
- Migration'ı `--rolled-back` olarak işaretleyin
- Sonra `prisma migrate deploy` ile tekrar uygulayın

## Tek Komutla Çözüm

Eğer kolonların var olup olmadığını bilmiyorsanız, önce `rolled-back` olarak işaretleyin:

```bash
# 1. Başarısız migration'ı resolve et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate resolve --rolled-back 20250104_add_meeting_point_fields"

# 2. Migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 3. Container'ı restart et
docker restart travel-site-server
```

## Beklenen Çıktı

`prisma migrate resolve` komutu şunu göstermeli:

```
Migration `20250104_add_meeting_point_fields` marked as rolled back.
```

Sonra `prisma migrate deploy` komutu tüm migration'ları uygulayacak:

```
Applying migration `20251020234814_migration1`
Applying migration `20251021003110_add_favorites_table`
Applying migration `20251025150853_add_user_fields`
Applying migration `20251026000000_add_popular_field`
Applying migration `20251026000001_add_meeting_point_fields`
Applying migration `20251026000002_remove_category_add_available_times`
Applying migration `20251026000003_add_age_ranges_and_monthly_pricing`

All migrations have been successfully applied.
```

## Sorun Giderme

### Eğer "migration not found" hatası alırsanız:

Migration history'yi kontrol edin:

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY finished_at DESC;"
```

### Eğer hala sorun yaşarsanız:

1. Migration history'yi temizleyin (dikkatli!):
```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "DELETE FROM _prisma_migrations WHERE migration_name = '20250104_add_meeting_point_fields';"
```

2. Migration'ları tekrar uygulayın:
```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy"
```

## Özet

1. ✅ Başarısız migration'ı resolve et (`--rolled-back` veya `--applied`)
2. ✅ Migration'ları uygula (`prisma migrate deploy`)
3. ✅ Prisma Client'ı generate et (`prisma generate`)
4. ✅ Container'ı restart et

