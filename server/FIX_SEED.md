# Seed Çalıştırma Sorununu Düzeltme

## 🔴 Sorun
`ts-node` TypeScript dosyasını çalıştıramıyor.

## ✅ Çözüm Yöntemleri

### Yöntem 1: tsx kullan (Önerilen)

Docker container içinde:

```bash
cd /app
npx tsx prisma/seed.ts
```

### Yöntem 2: ts-node'u düzgün yapılandır

Docker container içinde:

```bash
cd /app
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
```

### Yöntem 3: Node.js ile direkt çalıştır (Eğer build edilmişse)

Docker container içinde:

```bash
cd /app
node dist/prisma/seed.js
```

### Yöntem 4: package.json'u güncelle

`package.json`'da seed script'ini güncelle:

```json
"prisma:seed": "tsx prisma/seed.ts"
```

Sonra:
```bash
npm run prisma:seed
```

## 🧪 Test

Seed çalıştırdıktan sonra:

```bash
# Veritabanındaki verileri kontrol et
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM tours;"
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT COUNT(*) FROM destinations;"
```

## ✅ Tamamlandı!

Seed başarıyla çalıştırıldıysa, veritabanında örnek veriler olmalı.

