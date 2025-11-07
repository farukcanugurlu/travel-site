# Canlı Ortamda Migration Sorununu Çözme - Hızlı Rehber

## ⚠️ ÖNEMLİ: ÖNCE YEDEK ALIN!
```bash
pg_dump -h [HOST] -U [USER] -d [DATABASE] > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Adım Adım Çözüm

### 1. Migration Durumunu Kontrol Et
```bash
cd server
npx prisma migrate status
```

### 2. Veritabanında Çakışan Migration'ları Temizle

**Yöntem 1: Prisma ile (Önerilen - Sadece SSH'da migration komutları çalıştırabiliyorsanız)**
```bash
# Çakışan migration'ları rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back 20251104212100_add_popular_field_to_tours
npx prisma migrate resolve --rolled-back 20251104212234_add_popular_field_to_tours
```

**Yöntem 2: Prisma db execute ile (SSH'da SQL çalıştırabiliyorsanız)**
```bash
# cleanup-migrations.sql dosyasını kullan
npx prisma db execute --file cleanup-migrations.sql --schema prisma/schema.prisma
```

**Yöntem 3: psql ile (PostgreSQL client varsa)**
```bash
# cleanup-migrations.sql dosyasını kullan
psql -h [HOST] -U [USER] -d [DATABASE] -f cleanup-migrations.sql
```

**Yöntem 4: Tek satır SQL (psql ile)**
```bash
psql -h [HOST] -U [USER] -d [DATABASE] -c "DELETE FROM \"_prisma_migrations\" WHERE migration_name IN ('20251104212100_add_popular_field_to_tours', '20251104212234_add_popular_field_to_tours');"
```

### 3. Zaten Uygulanmış Migration'ları İşaretle
```bash
# Eğer kolonlar zaten varsa (kontrol et)
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
npx prisma migrate resolve --applied 20250104_add_popular_field
```

### 4. Kalan Migration'ları Uygula
```bash
npx prisma migrate deploy
```

### 5. Durumu Doğrula
```bash
npx prisma migrate status
# "Database schema is up to date!" mesajını görmelisiniz
```

## ✅ Tamamlandı!

Artık migration'lar senkronize ve veritabanı güncel.

## ❌ YAPMAYIN!
- `prisma migrate reset` - Tüm veriyi siler!
- `prisma db push` - Migration geçmişini atlar (sadece acil durumlarda)

