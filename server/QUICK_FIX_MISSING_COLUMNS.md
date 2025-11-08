# Hızlı Çözüm: Eksik Kolonları Ekleme

## 🚀 Tek Komutla Çözüm

Live sunucuda (SSH ile):

```bash
# Schema'yı veritabanıyla senkronize et, Prisma Client'ı generate et ve restart et
docker exec -it travel-site-server sh -c "cd /app && npx prisma db push && npx prisma generate" && docker restart travel-site-server
```

Bu komut:
- ✅ Tüm eksik kolonları otomatik ekler
- ✅ Prisma Client'ı generate eder
- ✅ Container'ı restart eder

## Adım Adım (Container İçinde)

Eğer container içindeyseniz:

```bash
# 1. Container'a bağlan (zaten bağlısınız)
# cd /app

# 2. Schema'yı veritabanıyla senkronize et
npx prisma db push

# 3. Prisma Client'ı generate et
npx prisma generate

# 4. Container'dan çık
exit

# 5. Container'ı restart et
docker restart travel-site-server
```

## Beklenen Çıktı

`prisma db push` komutu şunu göstermeli:

```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "appdb", schema "public" at "postgres:5432"

The following changes will be applied to the database:

  • Added column `included` to table `tours`
  • Added column `excluded` to table `tours`
  • Added column `highlights` to table `tours`
  • Added column `itinerary` to table `tours`
  • Added column `locationLatitude` to table `tours`
  • Added column `locationLongitude` to table `tours`
  • Added column `locationDescription` to table `tours`
  • Added column `type` to table `tours`
  • Added column `groupSize` to table `tours`
  • Added column `languages` to table `tours`
  • Added column `latitude` to table `destinations`
  • Added column `longitude` to table `destinations`
  • Added column `image` to table `destinations`
  • Added column `featured` to table `destinations`
  • Added column `displayOrder` to table `destinations`
  • Added column `author` to table `blog_posts`
  • Added column `tags` to table `blog_posts`
  • Created table `settings`

✔ Push completed successfully.
```

## Kontrol

```bash
# Backend loglarını kontrol et
docker logs travel-site-server --tail 30
```

Artık eksik kolon hataları görünmemeli.

## Not

`prisma db push` migration history'yi güncellemez ama schema'yı veritabanıyla senkronize eder. Bu durumda sorun değil çünkü sadece kolon ekliyoruz.

