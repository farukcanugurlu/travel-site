# Canlı Ortamda Veritabanını Sıfırdan Kurma Rehberi

## ⚠️ ÇOK ÖNEMLİ: ÖNCE YEDEK ALIN!

**Bu işlem TÜM VERİLERİ SİLER!** Önce mutlaka yedek alın:

```bash
# Veritabanı yedeği al
pg_dump -h [HOST] -U [USER] -d [DATABASE] > backup_$(date +%Y%m%d_%H%M%S).sql

# Veya Docker container içindeyse
docker exec travel-site-postgres pg_dump -U appuser appdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Adım Adım: Veritabanını Sıfırdan Kurma

### 1. Yedek Alın (Yukarıdaki komutları kullanın)

### 2. Veritabanını Sıfırla

**Yöntem 1: Prisma migrate reset (Önerilen - Tüm veriyi siler ve migration'ları sıfırdan uygular)**

```bash
cd server

# ⚠️ DİKKAT: Bu komut TÜM VERİLERİ SİLER!
npx prisma migrate reset --force

# Bu komut:
# 1. Tüm tabloları siler
# 2. Migration geçmişini temizler
# 3. Tüm migration'ları sıfırdan uygular
# 4. Seed dosyasını çalıştırır (eğer varsa)
```

**Eğer "relation does not exist" hatası alırsanız:** Migration sırası sorunlu demektir. Şu adımları izleyin:

```bash
# 1. Migration geçmişini temizle
echo "DROP TABLE IF EXISTS \"_prisma_migrations\";" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 2. Tüm tabloları sil
echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | npx prisma db execute --stdin --schema prisma/schema.prisma

# 3. Migration'ları tekrar uygula
npx prisma migrate deploy
```

**Yöntem 2: Manuel olarak (Daha kontrollü)**

```bash
# 1. Tüm tabloları sil
npx prisma db execute --stdin --schema prisma/schema.prisma <<< "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Migration geçmişini temizle
npx prisma db execute --stdin --schema prisma/schema.prisma <<< "DROP TABLE IF EXISTS \"_prisma_migrations\";"

# 3. Migration'ları sıfırdan uygula
npx prisma migrate deploy
```

**Yöntem 3: Docker ile (PostgreSQL container'ı yeniden başlat)**

```bash
# PostgreSQL container'ını durdur ve volume'u sil
docker-compose down -v

# Container'ı tekrar başlat
docker-compose up -d postgres

# Migration'ları uygula
docker exec -it travel-site-server sh
cd /app
npx prisma migrate deploy
```

### 3. Migration'ları Uygula

```bash
# Eğer Yöntem 1 kullandıysanız, bu adım otomatik yapıldı
# Eğer Yöntem 2 veya 3 kullandıysanız:
npx prisma migrate deploy
```

### 4. Seed Verilerini Yükle (İsteğe bağlı)

```bash
# Eğer seed dosyanız varsa
npx prisma db seed
# veya
npm run prisma:seed
```

### 5. Durumu Kontrol Et

```bash
npx prisma migrate status
# "Database schema is up to date!" mesajını görmelisiniz
```

## ✅ Tamamlandı!

Artık veritabanı sıfırdan kuruldu ve tüm migration'lar uygulandı.

## ⚠️ ÖNEMLİ UYARILAR

1. **Yedek almadan hiçbir şey yapmayın!**
2. **Canlı ortamda önemli veriler varsa bu yöntemi kullanmayın!**
3. **Bu işlem geri alınamaz!**
4. **Mümkünse önce test ortamında deneyin!**

## Alternatif: Sadece Migration Geçmişini Temizle

Eğer verileri korumak istiyorsanız, sadece migration geçmişini temizleyip migration'ları tekrar uygulayabilirsiniz:

```bash
# Migration geçmişini temizle (verileri korur)
npx prisma db execute --stdin --schema prisma/schema.prisma <<< "DROP TABLE IF EXISTS \"_prisma_migrations\";"

# Migration'ları tekrar uygula
npx prisma migrate deploy
```

**Not:** Bu yöntem verileri korur ama migration'ları tekrar uygulamaya çalışır. Eğer tablolar zaten varsa hata verebilir.

