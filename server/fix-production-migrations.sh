#!/bin/bash

# Canlı Ortamda Migration Sorununu Çözme Scripti
# KULLANMADAN ÖNCE YEDEK ALIN!

echo "⚠️  ÖNEMLİ: Bu script'i çalıştırmadan önce veritabanı yedeği alın!"
echo "Yedek almak için: pg_dump -h [HOST] -U [USER] -d [DATABASE] > backup.sql"
echo ""
read -p "Yedek aldınız mı? (yes/no): " backup_confirmed

if [ "$backup_confirmed" != "yes" ]; then
    echo "❌ Yedek alınmadan devam edilemez!"
    exit 1
fi

echo ""
echo "📊 Migration durumunu kontrol ediliyor..."
npx prisma migrate status

echo ""
echo "🔍 Veritabanındaki migration geçmişi kontrol ediliyor..."
echo "Aşağıdaki SQL komutunu veritabanınızda çalıştırın:"
echo ""
echo "SELECT migration_name, finished_at FROM \"_prisma_migrations\" ORDER BY finished_at DESC;"
echo ""
read -p "Migration geçmişini kontrol ettiniz mi? (yes/no): " history_checked

if [ "$history_checked" != "yes" ]; then
    echo "❌ Migration geçmişini kontrol etmeden devam edilemez!"
    exit 1
fi

echo ""
echo "🧹 Çakışan migration'ları temizliyoruz..."
echo "Aşağıdaki SQL komutunu veritabanınızda çalıştırın:"
echo ""
echo "DELETE FROM \"_prisma_migrations\" WHERE migration_name IN ("
echo "  '20251104212100_add_popular_field_to_tours',"
echo "  '20251104212234_add_popular_field_to_tours'"
echo ");"
echo ""
read -p "SQL komutunu çalıştırdınız mı? (yes/no): " sql_executed

if [ "$sql_executed" != "yes" ]; then
    echo "❌ SQL komutunu çalıştırmadan devam edilemez!"
    exit 1
fi

echo ""
echo "✅ Zaten uygulanmış migration'ları işaretliyoruz..."

# Eğer kolonlar zaten varsa, migration'ları applied olarak işaretle
echo "meetingPointAddress kolonu var mı kontrol ediliyor..."
npx prisma db execute --stdin <<< "SELECT column_name FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'meetingPointAddress';" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ meetingPointAddress kolonu var, migration'ı applied olarak işaretliyoruz..."
    npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
fi

echo "popular kolonu var mı kontrol ediliyor..."
npx prisma db execute --stdin <<< "SELECT column_name FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'popular';" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ popular kolonu var, migration'ı applied olarak işaretliyoruz..."
    npx prisma migrate resolve --applied 20250104_add_popular_field
fi

echo ""
echo "🚀 Kalan migration'ları uyguluyoruz..."
npx prisma migrate deploy

echo ""
echo "✅ Migration durumunu kontrol ediyoruz..."
npx prisma migrate status

echo ""
echo "✨ Tamamlandı! Migration'lar başarıyla uygulandı."

