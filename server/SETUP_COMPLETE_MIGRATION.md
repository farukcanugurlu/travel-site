# Eksik Kolonları Eklemek İçin Tam Migration

## 🎯 Tek Migration ile Tüm Eksik Kolonları Ekle

### Adım 1: Migration Dosyasını Oluştur

Live sunucuda (SSH ile):

```bash
# Migration dizinini oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000006_sync_missing_columns

# Migration dosyasını oluştur
cat > ~/travel-site/server/prisma/migrations/20251026000006_sync_missing_columns/migration.sql << 'EOF'
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
EOF
```

### Adım 2: Migration'ı Uygula

```bash
# Container içinde migration'ı uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# Container'ı restart et
docker restart travel-site-server
```

### Adım 3: Kontrol Et

```bash
# Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"

# Backend loglarını kontrol et
docker logs travel-site-server --tail 30
```

**Beklenen Çıktı:**
```
Database schema is up to date!
```

## ✅ Artık Her Şey Hazır!

Artık:
- ✅ Tüm eksik kolonlar eklendi
- ✅ Migration history düzgün
- ✅ Gelecekte sadece `prisma migrate deploy` kullanılacak

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

## 📋 Hızlı Komut Referansı

### Migration Oluşturma (Local)

```bash
cd server
npx prisma migrate dev --name migration_name
```

### Migration Uygulama (Live)

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

### Migration Durumunu Kontrol Etme

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

