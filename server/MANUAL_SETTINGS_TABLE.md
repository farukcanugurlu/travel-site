# settings Tablosunu Manuel Olarak Oluşturma - Adım Adım

## ✅ Adım Adım Rehber

### Adım 1: PostgreSQL Container'a Bağlan

Live sunucuda (SSH ile bağlısınız):

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb
```

**Beklenen Çıktı:**
```
psql (15.x)
Type "help" for help.

appdb=#
```

### Adım 2: settings Tablosunu Oluştur

PostgreSQL içinde (psql prompt'unda):

```sql
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
```

**Beklenen Çıktı:**
```
CREATE TABLE
```

### Adım 3: Tabloyu Kontrol Et

PostgreSQL içinde:

```sql
\d settings
```

**Beklenen Çıktı:**
```
                                    Table "public.settings"
   Column    |            Type             | Collation | Nullable | Default
-------------+------------------------------+-----------+----------+----------
 id          | text                         |           | not null | singleton
 data        | jsonb                        |           | not null |
 updatedAt   | timestamp(3) without time zone |           | not null |
Indexes:
    "settings_pkey" PRIMARY KEY, btree (id)
```

### Adım 4: PostgreSQL'den Çık

PostgreSQL içinde:

```sql
\q
```

**Beklenen Çıktı:**
```
root@srv1101463:~/travel-site#
```

### Adım 5: Prisma Client'ı Generate Et

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"
```

**Beklenen Çıktı:**
```
Prisma schema loaded from prisma/schema.prisma
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client in 765ms
```

### Adım 6: Backend Container'ını Restart Et

```bash
docker restart travel-site-server
```

**Beklenen Çıktı:**
```
travel-site-server
```

### Adım 7: Logları Kontrol Et

```bash
docker logs travel-site-server --tail 20
```

**Beklenen Çıktı:**
Artık `settings` tablosu hatası görünmemeli. Normal loglar görünmeli.

## Tek Komutla (Alternatif)

Eğer adım adım yapmak istemiyorsanız, tek komutla:

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "CREATE TABLE IF NOT EXISTS \"settings\" (\"id\" TEXT NOT NULL DEFAULT 'singleton', \"data\" JSONB NOT NULL, \"updatedAt\" TIMESTAMP(3) NOT NULL, CONSTRAINT \"settings_pkey\" PRIMARY KEY (\"id\"));" && docker exec -it travel-site-server sh -c "cd /app && npx prisma generate" && docker restart travel-site-server
```

## Kontrol

### settings Tablosunun Var Olduğunu Kontrol Et

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d settings"
```

### Backend Loglarını Kontrol Et

```bash
docker logs travel-site-server --tail 30
```

Artık `settings` tablosu hatası görünmemeli.

## Sorun Giderme

### Eğer "relation already exists" hatası alırsanız:

Tablo zaten var demektir. Sadece Prisma Client'ı generate edin:

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"
docker restart travel-site-server
```

### Eğer "permission denied" hatası alırsanız:

PostgreSQL kullanıcısının yetkilerini kontrol edin:

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\du"
```

## Özet

1. ✅ PostgreSQL container'a bağlan
2. ✅ `settings` tablosunu oluştur
3. ✅ Tabloyu kontrol et
4. ✅ PostgreSQL'den çık
5. ✅ Prisma Client'ı generate et
6. ✅ Backend container'ını restart et
7. ✅ Logları kontrol et

Bu adımları uyguladıktan sonra `settings` tablosu oluşturulacak ve backend hatası çözülecek.

