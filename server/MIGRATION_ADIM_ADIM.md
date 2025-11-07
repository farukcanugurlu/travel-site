# Canlı Ortamda Migration Sorununu Çözme - Adım Adım Rehber

## ⚠️ ÖNEMLİ: ÖNCE YEDEK ALIN!

```bash
# Docker container içindeyse
docker exec travel-site-postgres pg_dump -U appuser appdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

---

## 📋 Adım Adım Çözüm

### ADIM 1: Docker Container'a Gir

```bash
docker exec -it travel-site-server sh
```

### ADIM 2: Server Dizinine Git

```bash
cd /app
```

### ADIM 3: Migration Durumunu Kontrol Et

```bash
npx prisma migrate status
```

**Beklenen sonuç:** Hangi migration'ların uygulanmadığını göreceksiniz.

---

### ADIM 4: Migration Geçmişini ve Tabloları Temizle

```bash
# Migration geçmişini temizle
echo "DROP TABLE IF EXISTS \"_prisma_migrations\";" | npx prisma db execute --stdin --schema prisma/schema.prisma

# Tüm tabloları sil (eğer varsa)
echo "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" | npx prisma db execute --stdin --schema prisma/schema.prisma
```

**⚠️ DİKKAT:** Bu komutlar TÜM VERİLERİ SİLER!

---

### ADIM 5: İlk Migration'ı Uygula (Tours Tablosunu Oluşturur)

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251020234814_migration1
```

**Beklenen sonuç:** "Migration 20251020234814_migration1 marked as applied." mesajı.

---

### ADIM 6: Favorites Tablosunu Ekle

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20251021003110_add_favorites_table/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251021003110_add_favorites_table
```

**Beklenen sonuç:** "Migration 20251021003110_add_favorites_table marked as applied." mesajı.

---

### ADIM 7: User Fields Ekle

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20251025150853_add_user_fields/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251025150853_add_user_fields
```

**Beklenen sonuç:** "Migration 20251025150853_add_user_fields marked as applied." mesajı.

---

### ADIM 8: Popular Field Ekle

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20250104_add_popular_field/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20250104_add_popular_field
```

**Beklenen sonuç:** "Migration 20250104_add_popular_field marked as applied." mesajı.

---

### ADIM 9: Meeting Point Fields Ekle

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20250104_add_meeting_point_fields/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
```

**Beklenen sonuç:** "Migration 20250104_add_meeting_point_fields marked as applied." mesajı.

---

### ADIM 10: Category'yi Kaldır, Available Times Ekle

```bash
# Migration SQL'ini uygula
npx prisma db execute --file prisma/migrations/20250105_remove_category_add_available_times/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20250105_remove_category_add_available_times
```

**Beklenen sonuç:** "Migration 20250105_remove_category_add_available_times marked as applied." mesajı.

---

### ADIM 11: Durumu Kontrol Et

```bash
npx prisma migrate status
```

**Beklenen sonuç:** 
```
Database schema is up to date!
```

Eğer bu mesajı görürseniz, ✅ **BAŞARILI!**

---

## ✅ Tamamlandı!

Artık tüm migration'lar uygulandı ve veritabanı güncel.

---

## ❌ Hata Durumunda

### Eğer bir migration başarısız olursa:

1. **Hata mesajını okuyun** - Hangi migration başarısız oldu?
2. **Kolonları kontrol edin:**
   ```bash
   echo "SELECT column_name FROM information_schema.columns WHERE table_name = 'tours';" | npx prisma db execute --stdin --schema prisma/schema.prisma
   ```
3. **Eğer kolonlar varsa:** Migration'ı applied olarak işaretleyin
4. **Eğer kolonlar yoksa:** Migration'ı rolled-back olarak işaretleyip tekrar uygulayın

### Örnek Hata Çözümü:

```bash
# Eğer "column already exists" hatası alırsanız
npx prisma migrate resolve --applied [migration_name]

# Eğer "relation does not exist" hatası alırsanız
npx prisma migrate resolve --rolled-back [migration_name]
# Sonra migration'ı tekrar uygulayın
```

---

## 📝 Notlar

- Her adımı sırayla uygulayın
- Bir adım başarısız olursa, o adımı çözmeden bir sonrakine geçmeyin
- Her adımdan sonra beklenen sonucu kontrol edin
- Sorun yaşarsanız, hata mesajını not edin ve yukarıdaki "Hata Durumunda" bölümüne bakın

---

## 🆘 Yardım

Eğer sorun yaşarsanız:
1. Hata mesajını tam olarak kopyalayın
2. Hangi adımda olduğunuzu belirtin
3. `npx prisma migrate status` çıktısını paylaşın

