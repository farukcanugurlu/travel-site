# Blog Posts Hatasını Düzeltme

## 🔴 Sorun
`/api/blog/posts?published=true` endpoint'i 500 hatası veriyor.

## 🔍 Kontrol Et

PostgreSQL'de şu SQL'i çalıştırın:

```sql
-- Blog posts tablosundaki kolonları kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;
```

**Beklenen kolonlar:**
- `id`
- `title`
- `slug`
- `content`
- `excerpt`
- `featuredImage`
- `author` ⚠️ (bu eksik olabilir)
- `tags` ⚠️ (bu eksik olabilir - ARRAY tipinde)
- `published`
- `createdAt`
- `updatedAt`
- `categoryId`

## ✅ Çözüm

Eğer `author` veya `tags` kolonları eksikse, ekleyin:

```sql
-- Author kolonunu ekle
ALTER TABLE "blog_posts" 
ADD COLUMN IF NOT EXISTS "author" TEXT DEFAULT 'Admin';

-- Tags kolonunu ekle (ARRAY tipinde)
ALTER TABLE "blog_posts" 
ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';
```

## 🧪 Test

Backend loglarını kontrol edin:

```bash
docker logs travel-site-server --tail 50 | grep -i blog
```

Veya endpoint'i test edin:
```bash
curl https://www.lexorholiday.com/api/blog/posts?published=true
```

---

## 📝 Not

Eğer başka bir hata varsa, backend loglarını kontrol edin ve hata mesajını paylaşın.

