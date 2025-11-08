# Seed Komutları - Hızlı Referans

## 🌱 Seed Nedir?

Seed, veritabanına başlangıç verileri (örnek veriler) eklemek için kullanılır:
- Admin kullanıcısı oluşturur
- Örnek destinasyonlar oluşturur
- Örnek turlar oluşturur
- Örnek blog kategorileri ve postlar oluşturur

## ✅ Seed Çalıştırma Yöntemleri

### Yöntem 1: npm script ile (Önerilen)

**Live sunucuda (SSH ile):**

```bash
# Container'a bağlan
docker exec -it travel-site-server sh

# Container içinde
cd /app

# Seed çalıştır
npm run prisma:seed
```

### Yöntem 2: npx prisma db seed

**Live sunucuda:**

```bash
# Container içinde
docker exec -it travel-site-server sh -c "cd /app && npx prisma db seed"
```

### Yöntem 3: ts-node ile direkt

**Live sunucuda:**

```bash
# Container içinde
docker exec -it travel-site-server sh -c "cd /app && npx ts-node prisma/seed.ts"
```

### Yöntem 4: Tek Komutla (Önerilen)

**Live sunucuda (SSH ile):**

```bash
docker exec -it travel-site-server sh -c "cd /app && npm run prisma:seed"
```

## 📋 Seed Ne Yapar?

Seed dosyası (`prisma/seed.ts`) şunları yapar:

1. **Admin kullanıcısı oluşturur:**
   - Email: `admin@lexor.com`
   - Password: `admin123`
   - Role: `ADMIN`

2. **Örnek destinasyonlar oluşturur:**
   - Antalya
   - Fethiye
   - Bodrum
   - Cappadocia
   - Istanbul

3. **Örnek kullanıcılar oluşturur:**
   - test1@example.com
   - test2@example.com
   - test3@example.com
   - test4@example.com
   - test5@example.com
   - Password: `test123`

4. **Örnek turlar oluşturur:**
   - Fethiye: Blue Lagoon, Butterfly Valley & 12 Islands Cruise
   - Antalya: Old Town & Waterfalls Tour
   - Bodrum: Castle & Ancient Theatre Tour
   - Cappadocia: Hot Air Balloon & Underground City
   - Istanbul: Hagia Sophia & Blue Mosque Tour

5. **Örnek blog kategorileri ve postlar oluşturur**

## ⚠️ Önemli Notlar

1. **Seed çalıştırmadan önce:**
   - Veritabanının hazır olduğundan emin olun
   - Migration'ların uygulandığından emin olun
   - `npx prisma migrate status` ile kontrol edin

2. **Seed'i tekrar çalıştırırsanız:**
   - Mevcut verileri silmez
   - Sadece yeni veriler ekler (eğer yoksa)
   - Mevcut verileri günceller (eğer varsa)

3. **Seed güvenli:**
   - Mevcut verileri silmez
   - Sadece eksik verileri ekler
   - Mevcut verileri günceller

## 🧪 Seed'i Test Et

Seed çalıştırdıktan sonra:

```bash
# Veritabanındaki verileri kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM tours;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM destinations;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM users;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM blog_posts;"
```

## 📝 Beklenen Çıktı

Seed başarıyla çalıştığında:

```
✅ Admin user created: { id: '...', email: 'admin@lexor.com', role: 'ADMIN' }
✅ Destination created: Antalya
✅ Destination created: Fethiye
✅ Destination created: Bodrum
✅ Destination created: Cappadocia
✅ Destination created: Istanbul
✅ User created: test1@example.com
✅ User created: test2@example.com
✅ User created: test3@example.com
✅ User created: test4@example.com
✅ User created: test5@example.com
✅ Tour created: Fethiye: Blue Lagoon, Butterfly Valley & 12 Islands Cruise
✅ Tour created: Antalya: Old Town & Waterfalls Tour
...
```

## 🔧 Hızlı Komut Referansı

### Seed Çalıştırma

```bash
# Tek komutla
docker exec -it travel-site-server sh -c "cd /app && npm run prisma:seed"
```

### Seed Kontrol

```bash
# Veritabanındaki verileri kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM tours;"
```

## ✅ Tamamlandı!

Seed başarıyla çalıştırıldıysa, veritabanında örnek veriler olmalı.

