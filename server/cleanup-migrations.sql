-- SSH üzerinden çalıştırmak için SQL dosyası
-- Kullanım: psql -h [HOST] -U [USER] -d [DATABASE] -f cleanup-migrations.sql

-- Çakışan migration'ları temizle
DELETE FROM "_prisma_migrations" 
WHERE migration_name IN (
  '20251104212100_add_popular_field_to_tours',
  '20251104212234_add_popular_field_to_tours'
);

-- Sonucu kontrol et
SELECT migration_name, finished_at 
FROM "_prisma_migrations" 
ORDER BY finished_at DESC 
LIMIT 10;

