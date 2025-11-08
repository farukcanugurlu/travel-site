-- CategoryId kolonunu ve foreign key constraint'ini kaldır

-- Önce foreign key constraint'i kaldır
ALTER TABLE "tours" DROP CONSTRAINT IF EXISTS "tours_categoryId_fkey";

-- Sonra categoryId kolonunu kaldır
ALTER TABLE "tours" DROP COLUMN IF EXISTS "categoryId";

