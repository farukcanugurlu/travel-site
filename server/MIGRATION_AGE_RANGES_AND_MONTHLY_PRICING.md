# Migration: Age Ranges and Monthly Pricing

Bu migration, `tour_packages` tablosuna şu alanları ekler:
- `childMaxAge`: Child biletinin maksimum yaşı
- `infantMaxAge`: Infant biletinin maksimum yaşı  
- `monthlyPrices`: Ay bazlı fiyatlandırma (JSON)

## Migration Yöntemleri

### Yöntem 1: SQL Script ile (Önerilen - Production için)

1. SQL script'i çalıştırın:
```bash
cd server
psql -U your_username -d your_database -f add_age_ranges_and_monthly_pricing.sql
```

Veya Docker içinde:
```bash
docker exec -i travel-site-db psql -U appuser -d appdb < add_age_ranges_and_monthly_pricing.sql
```

### Yöntem 2: Prisma DB Push (Development için)

```bash
cd server
npx prisma db push
```

**Not**: `db push` production'da kullanılmamalı, sadece development için uygundur.

### Yöntem 3: Manuel SQL (Production için)

Veritabanına bağlanıp aşağıdaki SQL komutlarını çalıştırın:

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
```

## Migration Sonrası

Migration tamamlandıktan sonra:
1. Prisma Client'ı yeniden generate edin:
```bash
cd server
npx prisma generate
```

2. Backend servisini yeniden başlatın.

## Kontrol

Migration'ın başarılı olduğunu kontrol etmek için:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tour_packages' 
AND column_name IN ('childMaxAge', 'infantMaxAge', 'monthlyPrices');
```

Bu sorgu 3 satır döndürmelidir.

