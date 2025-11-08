# Schema'yı Veritabanıyla Senkronize Etme - Pratik Çözüm

## ✅ Pratik Çözüm: Prisma DB Push

`prisma db push` komutu schema'yı veritabanıyla senkronize eder. Migration history'yi güncellemez ama schema'yı veritabanıyla eşitler.

### ⚠️ DİKKAT

`prisma db push` production'da dikkatli kullanılmalıdır çünkü:
- Migration history'yi güncellemez
- Veri kaybına neden olabilir (eğer kolon silme varsa)
- Ancak bu durumda sadece kolon ekliyoruz, bu yüzden güvenli

## Adım Adım

### Adım 1: Container'a Bağlan

```bash
docker exec -it travel-site-server sh
```

### Adım 2: Schema'yı Veritabanıyla Senkronize Et

Container içinde:

```bash
cd /app

# Schema'yı veritabanıyla senkronize et
npx prisma db push
```

**Beklenen Çıktı:**
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

### Adım 3: Prisma Client'ı Generate Et

```bash
npx prisma generate
```

### Adım 4: Container'dan Çık ve Restart Et

```bash
exit
docker restart travel-site-server
```

## Tek Komutla (Önerilen)

```bash
# Schema'yı senkronize et, Prisma Client'ı generate et ve restart et
docker exec -it travel-site-server sh -c "cd /app && npx prisma db push && npx prisma generate" && docker restart travel-site-server
```

## Avantajları

✅ **Hızlı**: Tek komutla tüm eksik kolonları ekler
✅ **Otomatik**: Schema'daki tüm değişiklikleri algılar
✅ **Güvenli**: Sadece eksik kolonları ekler, mevcut verileri korur
✅ **Kolay**: Manuel SQL yazmaya gerek yok

## Dezavantajları

⚠️ **Migration History**: Migration history'yi güncellemez
⚠️ **Production**: Production'da dikkatli kullanılmalı
⚠️ **Rollback**: Rollback yapılamaz (migration history yok)

## Gelecekte Yeni Kolon Eklerken

Schema'ya yeni kolon eklediğinizde:

1. **Local'de test et:**
```bash
cd server
npx prisma db push
```

2. **Live'da uygula:**
```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma db push && npx prisma generate"
docker restart travel-site-server
```

## Alternatif: Migration Oluşturma (Daha Güvenli)

Eğer migration history'yi korumak istiyorsanız:

1. **Local'de migration oluştur:**
```bash
cd server
npx prisma migrate dev --name add_missing_columns
```

2. **Live'a kopyala ve uygula:**
```bash
# Migration dosyasını live'a kopyala
scp -r server/prisma/migrations/* root@srv1101463:~/travel-site/server/prisma/migrations/

# Live'da uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

## Öneri

Bu durumda `prisma db push` kullanın çünkü:
- Sadece kolon ekliyoruz (veri kaybı riski yok)
- Hızlı ve kolay
- Schema'yı veritabanıyla senkronize eder

Gelecekte yeni özellikler eklerken migration oluşturmayı tercih edin.

