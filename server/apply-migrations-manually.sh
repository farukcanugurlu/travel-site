#!/bin/sh

# Migration'ları manuel olarak doğru sırayla uygulama scripti
# Migration sırası sorununu çözmek için

echo "🔧 Migration'ları manuel olarak doğru sırayla uyguluyoruz..."
echo ""

# 1. İlk migration'ı uygula (tours tablosunu oluşturur)
echo "1️⃣ İlk migration'ı uyguluyoruz (20251020234814_migration1)..."
npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20251020234814_migration1', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 2. Favorites tablosunu ekle
echo ""
echo "2️⃣ Favorites tablosunu ekliyoruz (20251021003110_add_favorites_table)..."
npx prisma db execute --file prisma/migrations/20251021003110_add_favorites_table/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20251021003110_add_favorites_table', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 3. User fields ekle
echo ""
echo "3️⃣ User fields ekliyoruz (20251025150853_add_user_fields)..."
npx prisma db execute --file prisma/migrations/20251025150853_add_user_fields/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20251025150853_add_user_fields', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 4. Popular field ekle
echo ""
echo "4️⃣ Popular field ekliyoruz (20250104_add_popular_field)..."
npx prisma db execute --file prisma/migrations/20250104_add_popular_field/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20250104_add_popular_field', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 5. Meeting point fields ekle
echo ""
echo "5️⃣ Meeting point fields ekliyoruz (20250104_add_meeting_point_fields)..."
npx prisma db execute --file prisma/migrations/20250104_add_meeting_point_fields/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20250104_add_meeting_point_fields', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 6. Remove category, add available times
echo ""
echo "6️⃣ Category'yi kaldırıp available times ekliyoruz (20250105_remove_category_add_available_times)..."
npx prisma db execute --file prisma/migrations/20250105_remove_category_add_available_times/migration.sql --schema prisma/schema.prisma

# Migration geçmişine ekle
echo "INSERT INTO \"_prisma_migrations\" (migration_name, checksum, finished_at, applied_steps_count) VALUES ('20250105_remove_category_add_available_times', '', NOW(), 1);" | npx prisma db execute --stdin --schema prisma/schema.prisma

echo ""
echo "✅ Tüm migration'lar uygulandı!"
echo "Şimdi 'npx prisma migrate status' komutu ile durumu kontrol edin."

