# Migration'ları Manuel Olarak Doğru Sırayla Uygulama

## Sorun
Prisma migration'ları tarih sırasına göre uygular. `20250104_add_meeting_point_fields` (2025-01-04) `20251020234814_migration1` (2025-10-20) den önce geliyor ama `tours` tablosu henüz oluşturulmamış.

## Çözüm: Migration'ları Manuel Olarak Doğru Sırayla Uygula

SSH'da Docker container içinde şu komutları sırayla çalıştırın:

### 0. Migration Geçmişi Tablosunu Oluştur
```bash
# Önce _prisma_migrations tablosunu oluştur
npx prisma db execute --file fix-migration-history.sql --schema prisma/schema.prisma
```

### 1. İlk Migration (Tours tablosunu oluşturur)
```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle (daha güvenli yöntem)
npx prisma migrate resolve --applied 20251020234814_migration1
```

### 2. Favorites Tablosu
```bash
npx prisma db execute --file prisma/migrations/20251021003110_add_favorites_table/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20251021003110_add_favorites_table
```

### 3. User Fields
```bash
npx prisma db execute --file prisma/migrations/20251025150853_add_user_fields/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20251025150853_add_user_fields
```

### 4. Popular Field
```bash
npx prisma db execute --file prisma/migrations/20250104_add_popular_field/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250104_add_popular_field
```

### 5. Meeting Point Fields
```bash
npx prisma db execute --file prisma/migrations/20250104_add_meeting_point_fields/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
```

### 6. Remove Category, Add Available Times
```bash
npx prisma db execute --file prisma/migrations/20250105_remove_category_add_available_times/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250105_remove_category_add_available_times
```

### 7. Durumu Kontrol Et
```bash
npx prisma migrate status
# "Database schema is up to date!" mesajını görmelisiniz
```

## Alternatif: Tek Komutla (Script)

Eğer `apply-migrations-manually.sh` scriptini kullanmak isterseniz:

```bash
chmod +x apply-migrations-manually.sh
./apply-migrations-manually.sh
```

