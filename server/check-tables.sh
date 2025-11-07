#!/bin/sh

# Veritabanındaki tabloları kontrol et (Docker container için)

echo "📊 Veritabanındaki tabloları kontrol ediliyor..."
echo ""

# SQL dosyasını kullan
npx prisma db execute --file check-tables.sql --schema prisma/schema.prisma

echo ""
echo "✅ Kontrol tamamlandı!"
echo ""
echo "Eğer 'tours' tablosu listede görünüyorsa, migration geçmişi bozuk demektir."
echo "Eğer 'tours' tablosu yoksa, migration'ları normal şekilde uygulayabilirsiniz."

