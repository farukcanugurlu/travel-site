# Tüm Sorunları Düzeltme - Adım Adım

## 🔍 Tespit Edilen Sorunlar

1. ❌ `popular` kolonu eksik
2. ❌ `categoryId` kolonu hala var (kaldırılmalı)
3. ❌ `settings` tablosu eksik
4. ❌ Migration geçmişinde duplicate kayıt var

---

## 📋 Çözüm Adımları

### ADIM 1: Popular Kolonunu Ekle

PostgreSQL'de çalıştırın:

```sql
ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "popular" BOOLEAN NOT NULL DEFAULT false;
```

**Beklenen sonuç:** `ALTER TABLE` mesajı

---

### ADIM 2: CategoryId Kolonunu Kaldır

PostgreSQL'de çalıştırın:

```sql
-- Önce foreign key constraint'i kaldır
ALTER TABLE "tours" DROP CONSTRAINT IF EXISTS "tours_categoryId_fkey";

-- Sonra categoryId kolonunu kaldır
ALTER TABLE "tours" DROP COLUMN IF EXISTS "categoryId";
```

**Beklenen sonuç:** `ALTER TABLE` mesajları

---

### ADIM 3: Settings Tablosunu Oluştur

PostgreSQL'de çalıştırın:

```sql
-- Settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- İlk default veriyi ekle (boş JSON)
INSERT INTO "settings" ("id", "data", "updatedAt") 
VALUES ('singleton', '{}', NOW())
ON CONFLICT ("id") DO NOTHING;
```

**Beklenen sonuç:** `CREATE TABLE` ve `INSERT` mesajları

---

### ADIM 4: Migration Geçmişini Düzelt

Docker container içinde:

```bash
docker exec -it travel-site-server sh
cd /app

# Popular field migration'ını applied olarak işaretle
npx prisma migrate resolve --applied 20250104_add_popular_field
```

PostgreSQL'de:

```sql
-- NULL finished_at olan duplicate migration'ı sil
DELETE FROM "_prisma_migrations" 
WHERE migration_name = '20251020234814_migration1' 
AND finished_at IS NULL;
```

---

### ADIM 5: Durumu Kontrol Et

Docker container içinde:

```bash
npx prisma migrate status
```

**Beklenen sonuç:** `Database schema is up to date!`

PostgreSQL'de:

```sql
-- Tours tablosundaki kolonları kontrol et
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

-- Settings tablosunu kontrol et
SELECT * FROM "settings";
```

---

## ✅ Tamamlandı!

Artık:
- ✅ `popular` kolonu eklendi
- ✅ `categoryId` kolonu kaldırıldı
- ✅ `settings` tablosu oluşturuldu
- ✅ Migration geçmişi düzeltildi

---

## 🧪 Test

Backend loglarını kontrol edin:

```bash
docker logs travel-site-server --tail 20
```

Artık `settings` tablosu hatası görünmemeli.

