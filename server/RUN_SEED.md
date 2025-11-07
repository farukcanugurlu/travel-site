# Prisma Seed Çalıştırma Rehberi

## 🌱 Seed Nedir?
Seed, veritabanına başlangıç verileri (örnek veriler) eklemek için kullanılır.

## 📋 Seed Çalıştırma Yöntemleri

### Yöntem 1: npm script ile (Önerilen)

Docker container içinde:

```bash
cd /app
npm run prisma:seed
```

### Yöntem 2: npx prisma db seed

Docker container içinde:

```bash
cd /app
npx prisma db seed
```

### Yöntem 3: ts-node ile direkt

Docker container içinde:

```bash
cd /app
npx ts-node prisma/seed.ts
```

### Yöntem 4: package.json'daki script ile

Docker container içinde:

```bash
cd /app
npm run prisma:seed
```

## ⚠️ Önemli Notlar

1. **Seed çalıştırmadan önce:**
   - Veritabanının hazır olduğundan emin olun
   - Migration'ların uygulandığından emin olun
   - `npx prisma migrate status` ile kontrol edin

2. **Seed ne yapar:**
   - Örnek kullanıcılar oluşturur
   - Örnek destinasyonlar oluşturur
   - Örnek turlar oluşturur
   - Örnek blog kategorileri ve postlar oluşturur

3. **Seed'i tekrar çalıştırırsanız:**
   - Mevcut verileri silip yeniden oluşturabilir
   - Dikkatli olun!

## 🧪 Seed'i Test Et

Seed çalıştırdıktan sonra:

```bash
# Veritabanındaki verileri kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM tours;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM destinations;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM blog_posts;"
```

## ✅ Tamamlandı!

Seed başarıyla çalıştırıldıysa, veritabanında örnek veriler olmalı.

