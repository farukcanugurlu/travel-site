# settings Migration Durumunu Kontrol Etme

## 🔍 Kontrol Adımları

### 1. Migration Dosyasının Var Olduğunu Kontrol Et

Container içinde:

```bash
# Migration dosyasını kontrol et
ls -la prisma/migrations/20251026000004_add_settings_table/

# Migration dosyasının içeriğini kontrol et
cat prisma/migrations/20251026000004_add_settings_table/migration.sql
```

### 2. Migration Durumunu Kontrol Et

```bash
# Migration durumunu kontrol et
npx prisma migrate status
```

### 3. settings Tablosunun Var Olup Olmadığını Kontrol Et

```bash
# PostgreSQL'e bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb

# settings tablosunu kontrol et
\d settings

# Veya SQL ile
SELECT table_name FROM information_schema.tables WHERE table_name = 'settings';

# Çıkış
\q
```

## Olası Durumlar

### Durum 1: Migration Dosyası Var Ama Tablo Yok

Eğer migration dosyası var ama `settings` tablosu yoksa:

```bash
# Migration'ı manuel olarak uygula
npx prisma db execute --file prisma/migrations/20251026000004_add_settings_table/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251026000004_add_settings_table

# Prisma Client'ı generate et
npx prisma generate
```

### Durum 2: Migration History'de Kayıtlı Ama Tablo Yok

Eğer migration history'de kayıtlı ama tablo yoksa:

```bash
# Migration'ı rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back 20251026000004_add_settings_table

# Migration'ı tekrar uygula
npx prisma migrate deploy
```

### Durum 3: Tablo Zaten Var

Eğer `settings` tablosu zaten varsa:

```bash
# Migration'ı applied olarak işaretle (eğer history'de yoksa)
npx prisma migrate resolve --applied 20251026000004_add_settings_table

# Prisma Client'ı generate et
npx prisma generate

# Container'ı restart et
docker restart travel-site-server
```

## Hızlı Kontrol Komutları

```bash
# 1. Migration dosyasını kontrol et
docker exec -it travel-site-server sh -c "ls -la /app/prisma/migrations/20251026000004_add_settings_table/"

# 2. Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"

# 3. settings tablosunu kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d settings"
```

## Çözüm: Manuel Tablo Oluşturma

Eğer migration ile uğraşmak istemiyorsanız, tabloyu manuel olarak oluşturabilirsiniz:

```bash
# settings tablosunu manuel olarak oluştur
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "CREATE TABLE IF NOT EXISTS \"settings\" (\"id\" TEXT NOT NULL DEFAULT 'singleton', \"data\" JSONB NOT NULL, \"updatedAt\" TIMESTAMP(3) NOT NULL, CONSTRAINT \"settings_pkey\" PRIMARY KEY (\"id\"));"

# Migration'ı applied olarak işaretle (eğer migration dosyası varsa)
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate resolve --applied 20251026000004_add_settings_table"

# Prisma Client'ı generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"

# Container'ı restart et
docker restart travel-site-server
```

