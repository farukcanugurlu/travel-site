#!/bin/sh

# Migration sırası sorununu çözme scripti
# Migration'ları doğru sırayla uygulamak için

echo "🔧 Migration sırası sorunu çözülüyor..."
echo ""

# 1. Migration geçmişini tamamen temizle
echo "1️⃣ Migration geçmişini temizliyoruz..."
echo "DROP TABLE IF EXISTS \"_prisma_migrations\";" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 2. Tüm tabloları sil (eğer varsa)
echo ""
echo "2️⃣ Tüm tabloları siliyoruz..."
echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 3. Migration'ları sırayla uygula
echo ""
echo "3️⃣ Migration'ları doğru sırayla uyguluyoruz..."
npx prisma migrate deploy

echo ""
echo "✅ Tamamlandı!"
echo "Şimdi 'npx prisma migrate status' komutu ile durumu kontrol edin."

