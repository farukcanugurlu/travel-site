-- Canlı Ortamda Migration Sorununu Çözme SQL Scripti
-- ⚠️ ÖNEMLİ: Bu script'i çalıştırmadan önce veritabanı yedeği alın!

-- 1. Migration geçmişini kontrol edin
SELECT migration_name, finished_at, applied_steps_count 
FROM "_prisma_migrations" 
ORDER BY finished_at DESC;

-- 2. Çakışan migration'ları temizleyin (sadece veritabanında olup local'de olmayanlar)
DELETE FROM "_prisma_migrations" 
WHERE migration_name IN (
  '20251104212100_add_popular_field_to_tours',
  '20251104212234_add_popular_field_to_tours'
);

-- 3. Tours tablosundaki kolonları kontrol edin
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

-- 4. Eğer meetingPointAddress ve meetingPointMapUrl kolonları yoksa, manuel olarak ekleyin:
-- ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "meetingPointAddress" TEXT;
-- ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "meetingPointMapUrl" TEXT;

-- 5. Eğer popular kolonu yoksa, manuel olarak ekleyin:
-- ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "popular" BOOLEAN NOT NULL DEFAULT false;

-- 6. Eğer availableTimes kolonu yoksa, manuel olarak ekleyin:
-- ALTER TABLE "tours" ADD COLUMN IF NOT EXISTS "availableTimes" JSONB;

-- 7. Migration geçmişini tekrar kontrol edin
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
ORDER BY finished_at DESC;

