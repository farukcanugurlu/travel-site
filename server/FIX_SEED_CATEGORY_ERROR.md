# Seed CategoryId Hatasını Düzeltme

## 🔴 Sorun
Seed çalışırken `categoryId` null constraint violation hatası alıyorsunuz.

## 🔍 Neden?
Prisma Client güncel değil. Schema'da `categoryId` kaldırıldı ama Prisma Client eski schema'yı kullanıyor.

## ✅ Çözüm

### ADIM 1: Prisma Client'ı Yeniden Oluştur

Docker container içinde:

```bash
cd /app
npx prisma generate
```

### ADIM 2: Seed'i Tekrar Çalıştır

```bash
npx ts-node --compiler-options '{"module":"commonjs"}' prisma/seed.ts
```

## ✅ Tamamlandı!

Artık seed başarıyla çalışmalı.

---

## 📝 Not

Eğer hala hata alırsanız:
1. Backend container'ı yeniden başlatın: `docker restart travel-site-server`
2. Prisma Client'ı tekrar generate edin
3. Seed'i tekrar çalıştırın

