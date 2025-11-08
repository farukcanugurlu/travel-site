# Live Ortamda Tüm Migration'ları Uygulama

Bu rehber, tüm Prisma migration'larını live (production) ortamında uygulamak için adımları içerir.

## Önemli Notlar

⚠️ **UYARI**: Production ortamında migration uygulamadan önce:
1. **Veritabanı yedeği alın**
2. **Düşük trafik saatlerinde uygulayın**
3. **Migration'ları test ortamında önce deneyin**

## Mevcut Migration'lar

Aşağıdaki migration'lar uygulanacak:
- `20250104_add_meeting_point_fields` - Meeting point alanları
- `20250104_add_popular_field` - Popular alanı
- `20250105_remove_category_add_available_times` - Category kaldırma ve available times ekleme
- `20250125120000_add_age_ranges_and_monthly_pricing` - Yaş aralıkları ve aylık fiyatlandırma
- `20251020234814_migration1` - İlk migration
- `20251021003110_add_favorites_table` - Favorites tablosu
- `20251025150853_add_user_fields` - User alanları
- `20251108013258_add_age_ranges_and_monthly_pricing` - Yaş aralıkları ve aylık fiyatlandırma (güncellenmiş)

## Yöntem 1: Prisma Migrate Deploy (Önerilen)

Bu yöntem, Prisma'nın resmi production migration komutudur. Migration history'yi takip eder ve sadece uygulanmamış migration'ları uygular.

### Adımlar

1. **Docker container'a bağlanın:**
```bash
docker exec -it travel-site-server sh
```

2. **Container içinde server dizinine gidin:**
```bash
cd /app
```

3. **DATABASE_URL'in doğru ayarlandığını kontrol edin:**
```bash
echo $DATABASE_URL
```

4. **Tüm migration'ları uygulayın:**
```bash
npx prisma migrate deploy
```

Bu komut:
- `_prisma_migrations` tablosunu kontrol eder
- Henüz uygulanmamış migration'ları bulur
- Sırayla uygular
- Migration history'yi günceller

5. **Prisma Client'ı yeniden generate edin:**
```bash
npx prisma generate
```

6. **Backend servisini yeniden başlatın:**
```bash
# Container'dan çıkın
exit

# Host'tan container'ı restart edin
docker restart travel-site-server
```

## Yöntem 2: Tek Komutla (Host'tan)

Eğer Docker container'ına direkt erişiminiz varsa:

```bash
# Migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy"

# Prisma Client'ı generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"

# Container'ı restart et
docker restart travel-site-server
```

## Yöntem 3: Docker Compose ile

Eğer docker-compose kullanıyorsanız:

```bash
# Server container'ına gir
docker-compose exec server sh

# Container içinde
cd /app
npx prisma migrate deploy
npx prisma generate
exit

# Container'ı restart et
docker-compose restart server
```

## Migration Durumunu Kontrol Etme

Migration'ların başarıyla uygulandığını kontrol etmek için:

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"
```

Bu komut:
- ✅ Uygulanmış migration'ları gösterir
- ⏳ Uygulanmamış migration'ları gösterir
- ❌ Hataları gösterir

## Veritabanı Şemasını Kontrol Etme

Migration'ların başarıyla uygulandığını doğrulamak için:

```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma db pull"
```

Bu komut mevcut veritabanı şemasını çeker ve `schema.prisma` ile karşılaştırır.

## Özel Migration Kontrolü

Belirli bir tablonun migration'dan sonra doğru oluşturulduğunu kontrol etmek için:

```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "\d tour_packages"
```

Bu komut `tour_packages` tablosunun yapısını gösterir. Şu kolonların olması gerekir:
- `childMaxAge` (INTEGER)
- `infantMaxAge` (INTEGER)
- `monthlyPrices` (JSONB)

## Hata Durumunda

### Migration başarısız olursa:

1. **Hata mesajını kontrol edin:**
```bash
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy" 2>&1
```

2. **Migration history'yi kontrol edin:**
```bash
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10;"
```

3. **Manuel düzeltme gerekirse:**
   - Veritabanı yedeğinden geri yükleyin
   - Migration dosyalarını kontrol edin
   - Hatalı migration'ı düzeltin
   - Tekrar deneyin

### Migration'ı geri alma (Rollback):

Prisma migration'ları otomatik rollback desteklemez. Geri alma için:

1. **Veritabanı yedeğinden geri yükleyin** (en güvenli yöntem)
2. **Manuel SQL ile geri alın** (dikkatli kullanın)

## Migration Sonrası Test

Migration'ları uyguladıktan sonra:

1. **Admin panelden tur ekleyin:**
   - Yaş aralıkları (childMaxAge, infantMaxAge) girebiliyor musunuz?
   - Aylık fiyatlandırma (monthlyPrices) çalışıyor mu?

2. **API endpoint'lerini test edin:**
   - Tur listesi çalışıyor mu?
   - Tur detay sayfası çalışıyor mu?
   - Booking işlemleri çalışıyor mu?

3. **Frontend'i test edin:**
   - Tur detay sayfasında fiyatlar doğru gösteriliyor mu?
   - Booking formu çalışıyor mu?

## Güvenlik Kontrol Listesi

- [ ] Veritabanı yedeği alındı
- [ ] Düşük trafik saatleri seçildi
- [ ] Migration'lar test ortamında denendi
- [ ] DATABASE_URL doğru ayarlandı
- [ ] Migration'lar başarıyla uygulandı
- [ ] Prisma Client generate edildi
- [ ] Backend servisi restart edildi
- [ ] Migration durumu kontrol edildi
- [ ] Veritabanı şeması doğrulandı
- [ ] Admin panel test edildi
- [ ] API endpoint'leri test edildi
- [ ] Frontend test edildi

## Hızlı Komut Referansı

```bash
# Migration'ları uygula
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate deploy"

# Prisma Client generate et
docker exec -it travel-site-server sh -c "cd /app && npx prisma generate"

# Migration durumunu kontrol et
docker exec -it travel-site-server sh -c "cd /app && npx prisma migrate status"

# Container'ı restart et
docker restart travel-site-server

# Migration history'yi görüntüle
docker exec -it travel-site-postgres psql -U appuser -d appdb -c "SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 10;"
```

## Sorun Giderme

### "Migration already applied" hatası:
Bu normaldir. Prisma sadece uygulanmamış migration'ları uygular.

### "Database connection failed" hatası:
- DATABASE_URL'in doğru olduğundan emin olun
- PostgreSQL container'ının çalıştığını kontrol edin: `docker ps`

### "Migration failed" hatası:
- Hata mesajını okuyun
- Veritabanı yedeğinden geri yükleyin
- Migration dosyasını kontrol edin
- Tekrar deneyin

## İletişim

Sorun yaşarsanız:
1. Hata mesajını kaydedin
2. Migration history'yi kontrol edin
3. Veritabanı yedeğinden geri yükleyin
4. Tekrar deneyin

