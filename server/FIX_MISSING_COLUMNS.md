# Eksik Kolonları Ekleme - Adım Adım

## 🔴 Sorun

Veritabanında birçok kolon eksik:
- `tours.included` - JSONB
- `tours.excluded` - JSONB
- `tours.highlights` - JSONB
- `tours.itinerary` - JSONB
- `tours.locationLatitude` - FLOAT
- `tours.locationLongitude` - FLOAT
- `tours.locationDescription` - TEXT
- `tours.type` - TEXT
- `tours.groupSize` - TEXT
- `tours.languages` - JSONB
- `destinations.latitude` - FLOAT
- `destinations.longitude` - FLOAT
- `destinations.image` - TEXT
- `destinations.featured` - BOOLEAN
- `destinations.displayOrder` - INTEGER
- `blog_posts.author` - TEXT
- `blog_posts.tags` - TEXT[]

## ✅ Çözüm: Migration ile Eksik Kolonları Ekle

### Yöntem 1: Migration Dosyasını Live Ortama Kopyala

Local'den live'a migration dosyasını kopyalayın:

```bash
# SSH ile live sunucuya bağlan
# Migration dizinini oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000005_add_missing_columns

# Migration dosyasını oluştur
nano ~/travel-site/server/prisma/migrations/20251026000005_add_missing_columns/migration.sql
```

İçeriği yapıştırın:

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
```

### Yöntem 2: Container İçinde Migration Oluştur

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Migration dizinini oluştur
mkdir -p prisma/migrations/20251026000005_add_missing_columns

# Migration dosyasını oluştur
cat > prisma/migrations/20251026000005_add_missing_columns/migration.sql << 'EOF'
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
EOF

# Migration'ı uygula
npx prisma migrate deploy

# Prisma Client'ı generate et
npx prisma generate

# Container'dan çık
exit

# Container'ı restart et
docker restart travel-site-server
```

### Yöntem 3: Manuel Olarak SQL Çalıştır

Eğer migration dosyası oluşturmak istemiyorsanız, SQL'i direkt çalıştırabilirsiniz:

```bash
# PostgreSQL'e bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb << 'EOF'
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
EOF

# Prisma Client'ı generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"

# Container'ı restart et
docker restart travel-site-server
```

## Hızlı Çözüm (Önerilen)

Live sunucuda (SSH ile):

```bash
# 1. Migration dizinini oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000005_add_missing_columns

# 2. Migration dosyasını oluştur (tek komutla)
cat > ~/travel-site/server/prisma/migrations/20251026000005_add_missing_columns/migration.sql << 'EOF'
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
EOF

# 3. Container içinde migration'ı uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 4. Container'ı restart et
docker restart travel-site-server
```

## Kontrol

Migration'ın başarıyla uygulandığını kontrol edin:

```bash
# Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"

# Kolonları kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d tours"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d destinations"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d blog_posts"

# Backend loglarını kontrol et
docker logs travel-site-server --tail 30
```

Artık eksik kolon hataları görünmemeli.
