# settings Tablosu Eksik - Çözüm

## 🔴 Sorun

`settings` tablosu veritabanında yok. İlk migration'da bu tablo oluşturulmamış.

## ✅ Çözüm: settings Tablosunu Manuel Olarak Oluştur

### Adım 1: Container'a Bağlan

```bash
docker exec -it travel-site-server sh
```

### Adım 2: PostgreSQL'e Bağlan

```bash
# PostgreSQL container'a bağlan
docker exec -it travel-site-postgres psql -U appuser -d appdb
```

### Adım 3: settings Tablosunu Oluştur

PostgreSQL içinde:

```sql
-- settings tablosunu oluştur
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- Çıkış
\q
```

### Adım 4: Container'dan Çık

```bash
exit
```

### Adım 5: Backend Container'ını Restart Et

```bash
docker restart travel-site-server
```

## Alternatif: Tek Komutla

Eğer container'a girmek istemiyorsanız:

```bash
# settings tablosunu oluştur
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "CREATE TABLE IF NOT EXISTS \"settings\" (\"id\" TEXT NOT NULL DEFAULT 'singleton', \"data\" JSONB NOT NULL, \"updatedAt\" TIMESTAMP(3) NOT NULL, CONSTRAINT \"settings_pkey\" PRIMARY KEY (\"id\"));"

# Backend container'ını restart et
docker restart travel-site-server
```

## Kontrol

settings tablosunun oluşturulduğunu kontrol etmek için:

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d settings"
```

**Beklenen Çıktı:**
```
                                    Table "public.settings"
   Column    |            Type             | Collation | Nullable | Default
-------------+------------------------------+-----------+----------+----------
 id          | text                        |           | not null | singleton
 data        | jsonb                       |           | not null |
 updatedAt   | timestamp(3) without time zone |           | not null |
Indexes:
    "settings_pkey" PRIMARY KEY, btree (id)
```

## Test Et

Backend container'ını restart ettikten sonra:

```bash
# Logları kontrol et
docker logs travel-site-server --tail 20
```

Artık `settings` tablosu hatası görünmemeli.

## Not

`settings` tablosu singleton pattern kullanır - sadece bir kayıt olur (`id = 'singleton'`). Bu tablo site ayarlarını (logo, sosyal medya linkleri, vb.) saklar.

