# Veritabanını Koruma - Local'den Live'a Geçiş

## 🔴 Sorun

`docker compose down` yapınca veritabanı verileri kayboluyor. Local'de yaptığınız değişiklikleri live'a atarken veritabanını korumak gerekiyor.

## ✅ Çözüm: Volume'ları Kullan ve Yedek Al

### 1. Volume'ları Kontrol Et

`docker-compose.yml` dosyasında volume'lar tanımlı olmalı:

```yaml
volumes:
  postgres-data:
```

Bu volume veritabanı verilerini saklar.

### 2. Veritabanı Yedeği Alma

#### Local'de Yedek Al

```bash
# Local'de veritabanı yedeği al
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_local_$(date +%Y%m%d_%H%M%S).sql
```

#### Live'da Yedek Al

```bash
# Live'da veritabanı yedeği al
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_live_$(date +%Y%m%d_%H%M%S).sql
```

### 3. Local'den Live'a Geçiş Adımları

#### Adım 1: Local'de Yedek Al

```bash
# Local'de veritabanı yedeği al
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_local_$(date +%Y%m%d_%H%M%S).sql
```

#### Adım 2: Local'de Migration'ları Uygula

```bash
cd server
npx prisma migrate dev
```

#### Adım 3: Local'de Test Et

```bash
# Local'de test et
npm run start:dev
```

#### Adım 4: Live'da Yedek Al (ÖNEMLİ!)

```bash
# Live'da veritabanı yedeği al
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_live_$(date +%Y%m%d_%H%M%S).sql
```

#### Adım 5: Migration Dosyalarını Live'a Kopyala

```bash
# Local'den live'a migration dosyalarını kopyala
scp -r server/prisma/migrations/* root@srv1101463:~/travel-site/server/prisma/migrations/
```

#### Adım 6: Live'da Migration'ları Uygula

```bash
# Live'da migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

### 4. docker compose down Yaparken Dikkat

#### Volume'ları Koruyarak Down

```bash
# Volume'ları koruyarak down (veriler kalır)
docker compose down
```

#### Volume'ları Silerek Down (DİKKAT!)

```bash
# Volume'ları silerek down (veriler gider!)
docker compose down -v
```

**⚠️ UYARI:** `-v` flag'i volume'ları siler! Kullanmayın!

### 5. Veritabanı Verilerini Geri Yükleme

Eğer veritabanı verileri kaybolursa:

```bash
# Yedekten geri yükle
docker exec -i travel-site-postgres psql -U appuser appdb < backup_local_20250108_120000.sql
```

## 📋 Güvenli Geçiş Kontrol Listesi

### Local'de

- [ ] Veritabanı yedeği alındı
- [ ] Migration'lar oluşturuldu (`prisma migrate dev`)
- [ ] Migration'lar test edildi
- [ ] Kod değişiklikleri commit edildi

### Live'da

- [ ] Veritabanı yedeği alındı (ÖNEMLİ!)
- [ ] Migration dosyaları kopyalandı
- [ ] Migration'lar uygulandı (`prisma migrate deploy`)
- [ ] Prisma Client generate edildi
- [ ] Container restart edildi
- [ ] Test edildi

## 🔧 Hızlı Komut Referansı

### Yedek Alma

```bash
# Local'de
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_local_$(date +%Y%m%d_%H%M%S).sql

# Live'da
docker exec -it travel-site-postgres pg_dump -U appuser appdb > backup_live_$(date +%Y%m%d_%H%M%S).sql
```

### Yedekten Geri Yükleme

```bash
# Local'de
docker exec -i travel-site-postgres psql -U appuser appdb < backup_local_20250108_120000.sql

# Live'da
docker exec -i travel-site-postgres psql -U appuser appdb < backup_live_20250108_120000.sql
```

### Migration'ları Live'a Kopyalama

```bash
# Local'den live'a
scp -r server/prisma/migrations/* root@srv1101463:~/travel-site/server/prisma/migrations/
```

### Live'da Migration Uygulama

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy && npx prisma generate"
docker restart travel-site-server
```

## ⚠️ Önemli Notlar

1. **Her zaman yedek alın** - Özellikle live'da değişiklik yapmadan önce
2. **Volume'ları koruyun** - `docker compose down -v` kullanmayın
3. **Migration'ları test edin** - Production'a göndermeden önce local'de test edin
4. **Yedekleri saklayın** - Yedekleri güvenli bir yerde saklayın

## 🎯 Best Practices

1. **Otomatik Yedekleme** - Her gün otomatik yedek alın
2. **Version Control** - Migration dosyalarını Git'e commit edin
3. **Test Ortamı** - Production'a göndermeden önce test ortamında deneyin
4. **Rollback Planı** - Her zaman geri dönüş planı hazırlayın

## 📚 Ek Kaynaklar

- [Docker Volume Documentation](https://docs.docker.com/storage/volumes/)
- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)

