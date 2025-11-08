# settings Tablosu için Migration Ekleme

## ✅ Yeni Migration Oluşturuldu

`20251026000004_add_settings_table` migration'ı oluşturuldu. Bu migration `settings` tablosunu oluşturur.

## Live Ortamda Uygulama

### 1. Migration Dosyasını Live Ortama Kopyala

Migration dosyasını live sunucuya kopyalayın:

```bash
# Local'den live'a kopyala (SSH üzerinden)
scp -r server/prisma/migrations/20251026000004_add_settings_table root@srv1101463:~/travel-site/server/prisma/migrations/
```

### 2. Live Ortamda Migration'ı Uygula

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Migration'ı uygula
npx prisma migrate deploy

# Prisma Client'ı generate et
npx prisma generate

# Container'dan çık
exit

# Container'ı restart et
docker restart travel-site-server
```

## Alternatif: Tek Komutla

```bash
# Migration'ı uygula ve Prisma Client'ı generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# Container'ı restart et
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

## Not

Manuel migration oluşturmak sorun değil - Prisma migration'ları sadece SQL dosyalarıdır. Önemli olan:
- ✅ Doğru SQL syntax kullanmak
- ✅ Migration dosyasını doğru dizine koymak
- ✅ Migration adını doğru sıraya göre vermek

Bu migration doğru sırada (`20251026000004`) ve doğru SQL'i içeriyor.

