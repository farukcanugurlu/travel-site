# Live Ortamda Migration Uygulama - Adım Adım Komutlar

## ⚠️ ÖNEMLİ: Önce Yedek Alın!

```bash
# Veritabanı yedeği alın (SSH üzerinden)
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Adım Adım Komutlar

### 1. Docker Container'a Bağlan

```bash
docker exec -it travel-site-server sh
```

### 2. Container İçinde Server Dizinine Git

```bash
cd /app
```

### 3. DATABASE_URL'i Kontrol Et (Opsiyonel)

```bash
echo $DATABASE_URL
```

Çıktı şöyle olmalı: `postgresql://appuser:apppassword@postgres:5432/appdb`

### 4. Migration'ları Uygula

```bash
npx prisma migrate deploy
```

Bu komut:
- Tüm migration'ları doğru sırayla uygular
- Migration history'yi günceller
- Sadece uygulanmamış migration'ları çalıştırır

**Beklenen Çıktı:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "appdb", schema "public" at "postgres:5432"

7 migrations found in prisma/migrations

Applying migration `20251020234814_migration1`
Applying migration `20251021003110_add_favorites_table`
Applying migration `20251025150853_add_user_fields`
Applying migration `20251026000000_add_popular_field`
Applying migration `20251026000001_add_meeting_point_fields`
Applying migration `20251026000002_remove_category_add_available_times`
Applying migration `20251026000003_add_age_ranges_and_monthly_pricing`

All migrations have been successfully applied.
```

### 5. Prisma Client'ı Yeniden Generate Et

```bash
npx prisma generate
```

Bu komut Prisma Client'ı yeniden oluşturur ve yeni migration'lardaki değişiklikleri yansıtır.

### 6. Container'dan Çık

```bash
exit
```

### 7. Backend Container'ını Restart Et

```bash
docker restart travel-site-server
```

## Tek Komutla (Alternatif Yöntem)

Eğer container'a girmek istemiyorsanız, tüm komutları tek seferde çalıştırabilirsiniz:

```bash
# Migration'ları uygula ve Prisma Client'ı generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# Container'ı restart et
docker restart travel-site-server
```

## Migration Durumunu Kontrol Et

Migration'ların başarıyla uygulandığını kontrol etmek için:

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

**Beklenen Çıktı:**
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "appdb", schema "public" at "postgres:5432"

7 migrations found in prisma/migrations

Database schema is up to date!
```

## Hata Durumunda

### Eğer "migration failed" hatası alırsanız:

```bash
# Başarısız migration'ı resolve et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate resolve --rolled-back migration_name"

# Tekrar dene
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy"
```

### Eğer "tours table does not exist" hatası alırsanız:

Bu hata artık olmamalı çünkü migration'lar doğru sıraya göre yeniden adlandırıldı. Eğer hala alıyorsanız:

1. Veritabanı yedeğinden geri yükleyin
2. Migration history'yi kontrol edin
3. Tekrar deneyin

## Kontrol Listesi

- [ ] Veritabanı yedeği alındı
- [ ] Docker container'a bağlanıldı
- [ ] Migration'lar uygulandı (`prisma migrate deploy`)
- [ ] Prisma Client generate edildi (`prisma generate`)
- [ ] Container restart edildi
- [ ] Migration durumu kontrol edildi (`prisma migrate status`)
- [ ] Admin panel test edildi
- [ ] API endpoint'leri test edildi

## Hızlı Referans

```bash
# 1. Yedek al
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"

# 3. Container'ı restart et
docker restart travel-site-server

# 4. Durumu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

## Sorun Giderme

### "Database connection failed" hatası:
- PostgreSQL container'ının çalıştığını kontrol edin: `docker ps`
- DATABASE_URL'in doğru olduğundan emin olun

### "Migration already applied" hatası:
- Bu normaldir, Prisma sadece uygulanmamış migration'ları uygular

### "Migration failed" hatası:
- Hata mesajını okuyun
- Veritabanı yedeğinden geri yükleyin
- Migration'ı resolve edin
- Tekrar deneyin

