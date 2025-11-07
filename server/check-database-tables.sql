-- Veritabanındaki tabloları kontrol et
-- SSH'da çalıştır: npx prisma db execute --stdin --schema prisma/schema.prisma < check-database-tables.sql

-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Tours tablosu var mı kontrol et
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'tours'
) AS tours_table_exists;

-- Tours tablosundaki kolonları listele
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours' 
ORDER BY ordinal_position;

