# Live Ortamda Migration Deploy

Live ortamda `prisma migrate deploy` kullanarak migration'ı uygulayabilirsiniz.

## Adımlar

### 1. Migration Dosyasını Kontrol Edin

Migration dosyası oluşturuldu:
- `server/prisma/migrations/20250125120000_add_age_ranges_and_monthly_pricing/migration.sql`

### 2. Live Ortamda Deploy

Docker container içinde:

```bash
# Container'a gir
docker exec -it travel-site-server sh

# Migration'ı deploy et
cd /app
npx prisma migrate deploy

# Prisma Client'ı generate et
npx prisma generate

# Container'dan çık
exit

# Backend'i yeniden başlat
docker restart travel-site-server
```

### 3. Tek Komutla (SSH üzerinden)

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

## Avantajları

- ✅ Migration history tutulur
- ✅ Rollback yapılabilir
- ✅ Production için önerilen yöntem
- ✅ Güvenli ve kontrollü

## Kontrol

Migration'ın başarılı olduğunu kontrol edin:

```bash
docker exec -it travel-site-server sh
cd /app
npx prisma migrate status
```

Veya SQL ile:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tour_packages' 
AND column_name IN ('childMaxAge', 'infantMaxAge', 'monthlyPrices');
```

## Notlar

- `prisma migrate deploy` sadece henüz uygulanmamış migration'ları çalıştırır
- Migration history `_prisma_migrations` tablosunda tutulur
- Eğer migration zaten uygulanmışsa, hiçbir şey yapmaz (idempotent)

