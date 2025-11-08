# Profesyonel Veritabanı Kurulumu - Migration History Düzeltme

## 🎯 Hedef

Veritabanını schema ile senkronize etmek ve migration history'yi düzeltmek. Gelecekte sadece `prisma migrate deploy` kullanılacak.

## ✅ Profesyonel Çözüm: Baseline Migration

### Adım 1: Mevcut Veritabanı Durumunu Kontrol Et

Live sunucuda:

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Mevcut veritabanı şemasını çek (schema.prisma ile karşılaştır)
npx prisma db pull
```

Bu komut mevcut veritabanı şemasını `schema.prisma` ile karşılaştırır.

### Adım 2: Schema ile Veritabanı Arasındaki Farkları Gör

```bash
# Migration durumunu kontrol et
npx prisma migrate status
```

Bu komut schema ile veritabanı arasındaki farkları gösterir.

### Adım 3: Eksik Kolonları Eklemek İçin Migration Oluştur

**Local'de (development):**

```bash
cd server

# Schema'yı değiştirmeden, sadece migration oluştur
npx prisma migrate dev --name sync_missing_columns --create-only
```

Bu komut migration dosyasını oluşturur ama uygulamaz.

### Adım 4: Migration Dosyasını Düzenle

Oluşturulan migration dosyasını kontrol edin ve eksik kolonları ekleyin:

```bash
# Migration dosyasını kontrol et
cat prisma/migrations/[timestamp]_sync_missing_columns/migration.sql
```

### Adım 5: Migration'ı Live Ortama Kopyala ve Uygula

**Live sunucuda:**

```bash
# Migration dosyasını live'a kopyala (SSH ile)
# Local'den: scp -r server/prisma/migrations/[timestamp]_sync_missing_columns root@srv1101463:~/travel-site/server/prisma/migrations/

# Veya live'da manuel oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000006_sync_missing_columns
nano ~/travel-site/server/prisma/migrations/20251026000006_sync_missing_columns/migration.sql
```

Migration içeriği:

```sql
-- Add missing columns to tours table
ALTER TABLE "tours" 
ADD COLUMN IF NOT EXISTS "included" JSONB,
ADD COLUMN IF NOT EXISTS "excluded" JSONB,
ADD COLUMN IF NOT EXISTS "highlights" JSONB,
ADD COLUMN IF NOT EXISTS "itinerary" JSONB,
ADD COLUMN IF NOT EXISTS "locationLatitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "locationLongitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "locationDescription" TEXT,
ADD COLUMN IF NOT EXISTS "type" TEXT,
ADD COLUMN IF NOT EXISTS "groupSize" TEXT,
ADD COLUMN IF NOT EXISTS "languages" JSONB;

-- Add missing columns to destinations table
ALTER TABLE "destinations"
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "image" TEXT,
ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER DEFAULT 0;

-- Add missing columns to blog_posts table
ALTER TABLE "blog_posts"
ADD COLUMN IF NOT EXISTS "author" TEXT DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create settings table if not exists
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
```

### Adım 6: Migration'ı Uygula

```bash
# Container içinde
cd /app

# Migration'ı uygula
npx prisma migrate deploy

# Prisma Client'ı generate et
npx prisma generate

# Container'dan çık
exit

# Container'ı restart et
docker restart travel-site-server
```

### Adım 7: Migration History'yi Kontrol Et

```bash
# Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

**Beklenen Çıktı:**
```
Database schema is up to date!
```

## 🎯 Gelecekte Yeni Migration Eklerken

### Local'de (Development)

```bash
cd server

# 1. Schema'yı değiştir
# prisma/schema.prisma dosyasını düzenle

# 2. Migration oluştur
npx prisma migrate dev --name migration_name

# 3. Test et
npx prisma migrate deploy
```

### Live'da (Production)

```bash
# 1. Migration dosyalarını live'a kopyala
scp -r server/prisma/migrations/* root@srv1101463:~/travel-site/server/prisma/migrations/

# 2. Migration'ı uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 3. Container'ı restart et
docker restart travel-site-server
```

## 📋 Kontrol Listesi

- [ ] Mevcut veritabanı durumu kontrol edildi
- [ ] Schema ile veritabanı arasındaki farklar belirlendi
- [ ] Eksik kolonları eklemek için migration oluşturuldu
- [ ] Migration live ortama kopyalandı
- [ ] Migration uygulandı (`prisma migrate deploy`)
- [ ] Prisma Client generate edildi
- [ ] Container restart edildi
- [ ] Migration durumu kontrol edildi
- [ ] Backend logları kontrol edildi

## 🔧 Hızlı Komut Referansı

### Local'de Migration Oluşturma

```bash
cd server
npx prisma migrate dev --name migration_name
```

### Live'da Migration Uygulama

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

### Migration Durumunu Kontrol Etme

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

## ⚠️ Önemli Notlar

1. **Her zaman local'de migration oluşturun** - Production'da migration oluşturmayın
2. **Migration dosyalarını Git'e commit edin** - Version control için önemli
3. **Migration'ları test edin** - Production'a göndermeden önce local'de test edin
4. **Migration history'yi koruyun** - Migration history'yi silmeyin veya değiştirmeyin

## 🎓 Best Practices

1. **Migration'ları küçük tutun** - Her migration tek bir değişiklik yapmalı
2. **Migration'ları geri alınabilir yapın** - Rollback migration'ları hazırlayın
3. **Migration'ları test edin** - Production'a göndermeden önce test edin
4. **Migration history'yi koruyun** - Migration history'yi silmeyin

## 📚 Kaynaklar

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Migrate Best Practices](https://www.prisma.io/docs/guides/migrate/production-troubleshooting)

