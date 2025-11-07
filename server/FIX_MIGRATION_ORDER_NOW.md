# Migration Sırası Sorununu Çözme - ŞİMDİ

## 🔴 Sorun
`tours` tablosu yok ama migration'lar `tours` tablosuna kolon eklemeye çalışıyor.

## ✅ Çözüm: Migration'ları Manuel Olarak Doğru Sırayla Uygula

### ADIM 1: Başarısız Migration'ı Resolve Et

Docker container içinde:

```bash
# Başarısız migration'ı rolled-back olarak işaretle
npx prisma migrate resolve --rolled-back 20250104_add_meeting_point_fields
```

---

### ADIM 2: İlk Migration'ı Uygula (Tours Tablosunu Oluşturur)

Docker container içinde:

```bash
# İlk migration'ı uygula
npx prisma db execute --file prisma/migrations/20251020234814_migration1/migration.sql --schema prisma/schema.prisma

# Migration'ı applied olarak işaretle
npx prisma migrate resolve --applied 20251020234814_migration1
```

---

### ADIM 3: Favorites Tablosunu Ekle

```bash
npx prisma db execute --file prisma/migrations/20251021003110_add_favorites_table/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20251021003110_add_favorites_table
```

---

### ADIM 4: User Fields Ekle

```bash
npx prisma db execute --file prisma/migrations/20251025150853_add_user_fields/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20251025150853_add_user_fields
```

---

### ADIM 5: Popular Field Ekle

```bash
npx prisma db execute --file prisma/migrations/20250104_add_popular_field/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250104_add_popular_field
```

---

### ADIM 6: Meeting Point Fields Ekle

```bash
npx prisma db execute --file prisma/migrations/20250104_add_meeting_point_fields/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250104_add_meeting_point_fields
```

---

### ADIM 7: Category'yi Kaldır, Available Times Ekle

```bash
npx prisma db execute --file prisma/migrations/20250105_remove_category_add_available_times/migration.sql --schema prisma/schema.prisma
npx prisma migrate resolve --applied 20250105_remove_category_add_available_times
```

---

### ADIM 8: Settings Tablosunu Oluştur

PostgreSQL'de:

```sql
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "settings" ("id", "data", "updatedAt") 
VALUES ('singleton', '{}', NOW())
ON CONFLICT ("id") DO NOTHING;
```

---

### ADIM 9: Durumu Kontrol Et

```bash
npx prisma migrate status
```

**Beklenen sonuç:** `Database schema is up to date!`

---

## ✅ Tamamlandı!

Artık tüm migration'lar doğru sırayla uygulandı.

