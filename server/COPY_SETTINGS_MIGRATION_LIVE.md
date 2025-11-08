# settings Migration'ını Live Ortama Kopyalama

## 🔴 Sorun

Live ortamda yeni migration dosyası (`20251026000004_add_settings_table`) yok. Bu yüzden "No pending migrations to apply" diyor.

## ✅ Çözüm: Migration Dosyasını Live Ortama Kopyala

### Yöntem 1: SSH ile Dosya Kopyalama

Local bilgisayarınızdan (Windows'tan):

```bash
# Migration dosyasını live sunucuya kopyala
scp -r server/prisma/migrations/20251026000004_add_settings_table root@srv1101463:~/travel-site/server/prisma/migrations/
```

### Yöntem 2: Live Sunucuda Manuel Oluşturma

Live sunucuda (SSH ile bağlanın):

```bash
# Migration dizinini oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000004_add_settings_table

# Migration dosyasını oluştur
nano ~/travel-site/server/prisma/migrations/20251026000004_add_settings_table/migration.sql
```

İçeriği yapıştırın:

```sql
-- CreateTable
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
```

Kaydedin (Ctrl+O, Enter, Ctrl+X).

### Yöntem 3: Docker Container İçinde Oluşturma

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Migration dizinini oluştur
mkdir -p prisma/migrations/20251026000004_add_settings_table

# Migration dosyasını oluştur
cat > prisma/migrations/20251026000004_add_settings_table/migration.sql << 'EOF'
-- CreateTable
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
EOF

# Migration'ı uygula
npx prisma migrate deploy

# Prisma Client'ı generate et
npx prisma generate

# Container'dan çık
exit

# Container'ı restart et
docker restart travel-site-server
```

## Hızlı Çözüm (Önerilen)

Live sunucuda (SSH ile):

```bash
# 1. Migration dizinini oluştur
mkdir -p ~/travel-site/server/prisma/migrations/20251026000004_add_settings_table

# 2. Migration dosyasını oluştur (tek komutla)
cat > ~/travel-site/server/prisma/migrations/20251026000004_add_settings_table/migration.sql << 'EOF'
-- CreateTable
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
EOF

# 3. Container içinde migration'ı uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 4. Container'ı restart et
docker restart travel-site-server
```

## Kontrol

Migration'ın başarıyla uygulandığını kontrol edin:

```bash
# Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"

# settings tablosunu kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d settings"
```

**Beklenen Çıktı:**
```
Applying migration `20251026000004_add_settings_table`

All migrations have been successfully applied.
```

## Alternatif: Manuel Tablo Oluşturma

Eğer migration dosyasını kopyalamak istemiyorsanız, tabloyu manuel olarak oluşturabilirsiniz:

```bash
# settings tablosunu manuel olarak oluştur
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "CREATE TABLE IF NOT EXISTS \"settings\" (\"id\" TEXT NOT NULL DEFAULT 'singleton', \"data\" JSONB NOT NULL, \"updatedAt\" TIMESTAMP(3) NOT NULL, CONSTRAINT \"settings_pkey\" PRIMARY KEY (\"id\"));"

# Backend container'ını restart et
docker restart travel-site-server
```

Bu yöntem migration history'yi güncellemez, ama tabloyu oluşturur.

