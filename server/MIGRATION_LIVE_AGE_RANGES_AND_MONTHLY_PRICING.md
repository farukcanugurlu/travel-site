# Live Ortamda Migration: Age Ranges and Monthly Pricing

Bu migration'ı live (production) ortamında uygulamak için aşağıdaki adımları izleyin.

## Migration İçeriği

Bu migration `tour_packages` tablosuna şu kolonları ekler:
- `childMaxAge` (INTEGER) - Child biletinin maksimum yaşı
- `infantMaxAge` (INTEGER) - Infant biletinin maksimum yaşı
- `monthlyPrices` (JSONB) - Ay bazlı fiyatlandırma

## Live Ortamda Uygulama

### Yöntem 1: Docker Container İçinde SQL Script (Önerilen)

1. SQL script'i Docker container'a kopyalayın:
```bash
docker cp server/add_age_ranges_and_monthly_pricing.sql travel-site-server:/app/
```

2. Container içinde SQL'i çalıştırın:
```bash
docker exec -it travel-site-server sh
cd /app
psql -U appuser -d appdb -f add_age_ranges_and_monthly_pricing.sql
```

### Yöntem 2: Direkt SQL Komutları

Docker container içinde veya veritabanına direkt bağlanarak:

```bash
docker exec -it travel-site-server sh
psql -U appuser -d appdb
```

Sonra SQL komutlarını çalıştırın:

```sql
-- Add childMaxAge column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "childMaxAge" INTEGER;

-- Add infantMaxAge column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "infantMaxAge" INTEGER;

-- Add monthlyPrices JSON column
ALTER TABLE "tour_packages" 
ADD COLUMN IF NOT EXISTS "monthlyPrices" JSONB;

-- Exit psql
\q
```

### Yöntem 3: Prisma DB Push (Dikkatli Kullanın)

**UYARI**: `db push` production'da kullanılırken dikkatli olunmalıdır. Verileri etkilemez ama migration history'yi güncellemez.

```bash
docker exec -it travel-site-server sh
cd /app
npx prisma db push
npx prisma generate
```

## Migration Sonrası

1. **Prisma Client'ı yeniden generate edin:**
```bash
docker exec -it travel-site-server sh
cd /app
npx prisma generate
```

2. **Backend servisini yeniden başlatın:**
```bash
docker restart travel-site-server
```

## Kontrol

Migration'ın başarılı olduğunu kontrol edin:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tour_packages' 
AND column_name IN ('childMaxAge', 'infantMaxAge', 'monthlyPrices');
```

Bu sorgu 3 satır döndürmelidir:
- `childMaxAge` | `integer`
- `infantMaxAge` | `integer`
- `monthlyPrices` | `jsonb`

## Geri Alma (Rollback)

Eğer geri almak isterseniz:

```sql
ALTER TABLE "tour_packages" DROP COLUMN IF EXISTS "childMaxAge";
ALTER TABLE "tour_packages" DROP COLUMN IF EXISTS "infantMaxAge";
ALTER TABLE "tour_packages" DROP COLUMN IF EXISTS "monthlyPrices";
```

**Not**: Geri alma işlemi bu kolonlardaki tüm verileri silecektir.

## Güvenlik Notları

1. Migration'ı uygulamadan önce **veritabanı yedeği** alın
2. Production'da migration'ı **düşük trafik saatlerinde** uygulayın
3. Migration sonrası **test edin** - admin panelden tur ekleyip ay bazlı fiyat girebiliyor musunuz kontrol edin

