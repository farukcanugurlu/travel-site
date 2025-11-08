# Bookings Endpoint Hatasını Düzeltme

## 🔴 Sorun
`/api/bookings` endpoint'i 500 hatası veriyor.

## 🔍 Kontrol Et

PostgreSQL'de şu SQL'i çalıştırın:

```sql
-- Bookings tablosundaki kolonları kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;
```

**Beklenen kolonlar:**
- `id`
- `bookingNo`
- `status`
- `adultCount`
- `childCount`
- `infantCount`
- `totalAmount`
- `paymentStatus`
- `pdfUrl`
- `notes`
- `tourDate`
- `specialRequests` ⚠️ (bu eksik olabilir)
- `contactPhone` ⚠️ (bu eksik olabilir)
- `contactEmail` ⚠️ (bu eksik olabilir)
- `createdAt`
- `updatedAt`
- `userId`
- `tourId`
- `packageId`

## ✅ Çözüm

Eğer `specialRequests`, `contactPhone` veya `contactEmail` kolonları eksikse, ekleyin:

```sql
-- Eksik kolonları ekle
ALTER TABLE "bookings" 
ADD COLUMN IF NOT EXISTS "specialRequests" TEXT,
ADD COLUMN IF NOT EXISTS "contactPhone" TEXT,
ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
```

## 🧪 Test

Backend loglarını kontrol edin:

```bash
docker logs travel-site-server --tail 50 | grep -i booking
```

Veya endpoint'i test edin:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://www.lexorholiday.com/api/bookings
```

---

## 📝 Not

Eğer başka bir hata varsa, backend loglarını kontrol edin ve hata mesajını paylaşın.

