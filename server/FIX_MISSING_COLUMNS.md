# Eksik Kolonları Ekleme - Hızlı Rehber

## 🔴 Sorun
Schema'da tanımlı kolonlar veritabanında yok:
- `destinations.latitude`
- `destinations.longitude`
- `destinations.image`
- `destinations.featured`
- `destinations.displayOrder`
- `tours.included`
- `tours.excluded`
- `tours.highlights`
- `tours.itinerary`
- `tours.locationLatitude`
- `tours.locationLongitude`
- `tours.locationDescription`
- `tours.type`
- `tours.groupSize`
- `tours.languages`

## ✅ Çözüm

### ADIM 1: Eksik Kolonları Ekle

PostgreSQL'de çalıştırın:

```sql
-- Destinations tablosuna eksik kolonları ekle
ALTER TABLE "destinations" 
ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "image" TEXT,
ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "displayOrder" INTEGER DEFAULT 0;

-- Tours tablosuna eksik kolonları ekle
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
```

### ADIM 2: Prisma Client'ı Yeniden Oluştur

Docker container içinde:

```bash
npx prisma generate
```

### ADIM 3: Durumu Kontrol Et

```bash
# Backend loglarını kontrol et
docker logs travel-site-server --tail 20
```

Artık hatalar görünmemeli.

---

## ✅ Tamamlandı!

Artık tüm eksik kolonlar eklendi ve veritabanı schema ile uyumlu.

