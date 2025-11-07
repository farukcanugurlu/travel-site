# Canlı Ortamda Migration Sorununu Çözme - Hızlı Rehber

## ⚠️ ÖNEMLİ: ÖNCE YEDEK ALIN!
```bash
pg_dump -h [HOST] -U [USER] -d [DATABASE] > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Adım Adım Çözüm

### 1. Migration Durumunu Kontrol Et
```bash
cd server
npx prisma migrate status
```

### 2. Veritabanı Durumunu Kontrol Et

**ÖNEMLİ:** İlk migration henüz uygulanmamış görünüyor ama veritabanında tablolar olabilir. Önce kontrol edin:

```bash
# Veritabanındaki tabloları kontrol et
npx prisma db execute --stdin --schema prisma/schema.prisma <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"
```

**Eğer `tours` tablosu varsa:** Migration geçmişi bozuk demektir. Zaten uygulanmış migration'ları işaretlemeniz gerekir (3. adıma geçin).

**Eğer `tours` tablosu yoksa:** Migration'ları normal şekilde uygulayabilirsiniz (4. adıma geçin).

### 2a. Çakışan Migration'ları Temizle (Sadece gerekirse)

Eğer migration status'ta "migrations from the database are not found locally" hatası varsa:

```bash
# Çakışan migration'ları rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back [migration_name]
```

### 3. Zaten Uygulanmış Migration'ları İşaretle

**Eğer veritabanında tablolar varsa ama migration geçmişi yoksa:**

```bash
# İlk migration'ı applied olarak işaretle (eğer tablolar zaten varsa)
npx prisma migrate resolve --applied 20251020234814_migration1

# Diğer migration'ları da kontrol edip işaretle
npx prisma migrate resolve --applied 20251021003110_add_favorites_table
npx prisma migrate resolve --applied 20251025150853_add_user_fields
npx prisma migrate resolve --applied 20250104_add_popular_field
npx prisma migrate resolve --applied 20250105_remove_category_add_available_times
```

**Not:** Her migration'ı işaretlemeden önce, o migration'ın yaptığı değişikliklerin veritabanında zaten olup olmadığını kontrol edin.

### 4. Kalan Migration'ları Uygula
```bash
npx prisma migrate deploy
```

### 5. Durumu Doğrula
```bash
npx prisma migrate status
# "Database schema is up to date!" mesajını görmelisiniz
```

## ✅ Tamamlandı!

Artık migration'lar senkronize ve veritabanı güncel.

## ❌ YAPMAYIN!
- `prisma migrate reset` - Tüm veriyi siler!
- `prisma db push` - Migration geçmişini atlar (sadece acil durumlarda)

