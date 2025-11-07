#!/bin/bash

# SSH üzerinden çakışan migration'ları temizleme scripti

echo "🧹 Çakışan migration'ları temizliyoruz..."

# Yöntem 1: Prisma migrate resolve kullanarak (Önerilen)
echo "Yöntem 1: Prisma migrate resolve kullanarak..."
npx prisma migrate resolve --rolled-back 20251104212100_add_popular_field_to_tours 2>/dev/null || echo "Migration bulunamadı veya zaten temizlenmiş"
npx prisma migrate resolve --rolled-back 20251104212234_add_popular_field_to_tours 2>/dev/null || echo "Migration bulunamadı veya zaten temizlenmiş"

echo ""
echo "✅ Temizleme tamamlandı!"
echo "Şimdi 'npx prisma migrate status' komutu ile durumu kontrol edin."

