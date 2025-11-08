# CategoryId Kolonunu Kaldırma

## 🔴 Sorun
Veritabanında `categoryId` kolonu hala var ve NOT NULL constraint'i var. Schema'da kaldırıldı ama veritabanında kaldırılmamış.

## ✅ Çözüm

### ADIM 1: CategoryId Kolonunu Kaldır

PostgreSQL'de çalıştırın:

```sql
-- Önce foreign key constraint'i kaldır
ALTER TABLE "tours" DROP CONSTRAINT IF EXISTS "tours_categoryId_fkey";

-- Sonra categoryId kolonunu kaldır
ALTER TABLE "tours" DROP COLUMN IF EXISTS "categoryId";
```

### ADIM 2: Prisma Client'ı Yeniden Oluştur

Docker container içinde:

```bash
cd /app
npx prisma generate
```

### ADIM 3: Seed'i Tekrar Çalıştır

```bash
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
```

## ✅ Tamamlandı!

Artık seed başarıyla çalışmalı.

---

## 📝 Not

Eğer hala hata alırsanız:
1. Veritabanındaki `tours` tablosunu kontrol edin: `SELECT column_name FROM information_schema.columns WHERE table_name = 'tours';`
2. `categoryId` kolonunun kaldırıldığından emin olun
3. Prisma Client'ı tekrar generate edin
4. Seed'i tekrar çalıştırın

