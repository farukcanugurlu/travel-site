-- Veritabanındaki tabloları kontrol et
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

