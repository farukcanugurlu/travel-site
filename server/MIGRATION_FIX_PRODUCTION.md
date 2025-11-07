# Canlı Ortamda Migration Sorununu Çözme Rehberi

## Sorun
Canlı ortamda migration'lar senkronize değil ve `tours` tablosu eksik veya migration geçmişi bozuk.

## Güvenli Çözüm Adımları

### 1. ÖNCE YEDEK ALIN! ⚠️
```bash
# Veritabanı yedeği alın
pg_dump -h [HOST] -U [USER] -d [DATABASE] > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Migration Durumunu Kontrol Edin
```bash
cd server
npx prisma migrate status
```

### 3. Veritabanındaki Migration Geçmişini Kontrol Edin
```sql
-- PostgreSQL'de çalıştırın
SELECT * FROM "_prisma_migrations" ORDER BY finished_at DESC;
```

### 4. Çakışan Migration'ları Temizleyin
```sql
-- Sadece veritabanında olup local'de olmayan migration'ları silin
DELETE FROM "_prisma_migrations" 
WHERE migration_name IN (
  '20251104212100_add_popular_field_to_tours',
  '20251104212234_add_popular_field_to_tours'
);
```

### 5. Zaten Uygulanmış Migration'ları İşaretleyin
```bash
# Eğer kolonlar zaten varsa, migration'ları applied olarak işaretleyin
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
npx prisma migrate resolve --applied 20250104_add_popular_field
```

### 6. Eksik Migration'ları Uygulayın
```bash
# Kalan migration'ları uygulayın
npx prisma migrate deploy
```

### 7. Durumu Doğrulayın
```bash
npx prisma migrate status
```

## Alternatif: Schema'yı Doğrudan Senkronize Etme (Dikkatli!)

Eğer migration geçmişi tamamen bozuksa ve veritabanı şeması güncel değilse:

```bash
# ÖNCE YEDEK ALIN!
# Sonra schema'yı veritabanına push edin (migration geçmişini atlar)
npx prisma db push --accept-data-loss

# Sonra migration geçmişini manuel olarak düzeltin
```

## Önemli Notlar

1. **Yedek almadan hiçbir şey yapmayın!**
2. **Canlı ortamda `prisma migrate reset` KULLANMAYIN!** (Tüm veriyi siler)
3. **Migration'ları resolve etmeden önce veritabanı şemasını kontrol edin**
4. **Her adımı test ortamında önce deneyin**

## Hata Durumunda

Eğer bir hata alırsanız:
1. Migration'ı `--rolled-back` olarak işaretleyin
2. Veritabanı şemasını manuel olarak düzeltin
3. Migration'ı tekrar `--applied` olarak işaretleyin

```bash
npx prisma migrate resolve --rolled-back [migration_name]
# Manuel düzeltme yapın
npx prisma migrate resolve --applied [migration_name]
```

