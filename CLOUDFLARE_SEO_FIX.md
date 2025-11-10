# Cloudflare SEO Sorunu Çözüm Rehberi

## Sorun
Google'da "lexorholiday.com" (www'siz) aratıldığında Cloudflare'in varsayılan sayfası görünüyor. www'li versiyon (`www.lexorholiday.com`) normal çalışıyor, ancak Google'da www'siz versiyon çıkıyor ve Cloudflare sayfası görünüyor.

## Nedenler
1. **Google'ın Önbelleği**: Google'ın önbelleğinde eski bir sayfa olabilir
2. **Cloudflare DNS Ayarları**: Cloudflare'in proxy modu veya güvenlik ayarları Google botlarını etkileyebilir
3. **Cloudflare "Under Attack Mode"**: Bu mod aktifse, Google botları engellenebilir
4. **Meta Tag'ler**: HTML'de doğru meta tag'ler olmayabilir (ÇÖZÜLDÜ)

## Çözüm Adımları

### 1. Cloudflare Dashboard Ayarları

#### A. DNS Ayarları
1. Cloudflare Dashboard'a giriş yapın: https://dash.cloudflare.com
2. `lexorholiday.com` domain'ini seçin
3. **DNS** sekmesine gidin
4. Aşağıdaki kayıtları kontrol edin:
   - **A Record**: `@` veya `www` → IP adresiniz (Proxied: ✅ (turuncu bulut))
   - **CNAME**: `www` → `lexorholiday.com` (Proxied: ✅)

#### B. SSL/TLS Ayarları
1. **SSL/TLS** sekmesine gidin
2. **Encryption mode**: "Full" veya "Full (strict)" seçin
3. **Always Use HTTPS**: ✅ Açık olmalı
4. **Automatic HTTPS Rewrites**: ✅ Açık olmalı

#### C. Speed Ayarları
1. **Speed** sekmesine gidin
2. **Auto Minify**: HTML, CSS, JavaScript için açık olabilir
3. **Brotli**: ✅ Açık olmalı

#### D. Caching Ayarları
1. **Caching** sekmesine gidin
2. **Caching Level**: "Standard" seçin
3. **Browser Cache TTL**: "Respect Existing Headers" seçin

#### E. Security Ayarları
1. **Security** sekmesine gidin
2. **Security Level**: "Medium" veya "Low" seçin (Google botlarını engellememek için)
3. **Challenge Passage**: 30 dakika
4. **Browser Integrity Check**: ✅ Açık olabilir
5. **Under Attack Mode**: ❌ **KAPALI OLMALI** (Google botlarını engeller)

#### F. Page Rules (ÖNEMLİ - www'siz versiyondan www'li versiyona redirect!)
1. **Rules** → **Page Rules** sekmesine gidin
2. Aşağıdaki kuralları oluşturun (ÖNCELİK SIRASI ÖNEMLİ!):

**Kural 1: www'siz versiyondan www'li versiyona Redirect (EN ÜSTTE OLMALI!)**
- URL Pattern: `http://lexorholiday.com/*`
- Settings:
  - Forwarding URL: `https://www.lexorholiday.com/$1`
  - Status Code: `301 Permanent Redirect`
  - **ÖNEMLİ**: Bu kural en üstte olmalı (priority 1)

**Kural 2: www'siz HTTPS versiyondan www'li HTTPS versiyona Redirect**
- URL Pattern: `https://lexorholiday.com/*`
- Settings:
  - Forwarding URL: `https://www.lexorholiday.com/$1`
  - Status Code: `301 Permanent Redirect`
  - **ÖNEMLİ**: Bu kural ikinci sırada olmalı (priority 2)

**Kural 3: Ana Sayfa için Cache Bypass**
- URL Pattern: `www.lexorholiday.com/`
- Settings:
  - Cache Level: Bypass
  - Edge Cache TTL: 2 hours

**Kural 4: Google Botları için Bypass**
- URL Pattern: `*googlebot*`
- Settings:
  - Security Level: Off
  - Cache Level: Bypass

### 2. Google Search Console Ayarları

1. Google Search Console'a giriş yapın: https://search.google.com/search-console
2. **ÖNEMLİ**: Hem `lexorholiday.com` hem de `www.lexorholiday.com` için property ekleyin
3. **Preferred Domain** ayarını yapın:
   - **Settings** → **Domain Settings** → **Preferred Domain**
   - `www.lexorholiday.com` seçin (www'li versiyonu tercih edilen domain yapın)
4. **URL Inspection** → `https://www.lexorholiday.com` URL'sini test edin
5. **Sitemaps** → `https://www.lexorholiday.com/sitemap.xml` ekleyin
6. **Indexing** → **Request Indexing** butonuna tıklayın (ana sayfa için)
7. **URL Removal** → Eğer www'siz versiyon index'lenmişse, kaldırma isteği gönderin

### 3. Google Önbelleğini Temizleme

#### Yöntem 1: Google Search Console
1. Google Search Console → **URL Inspection**
2. `https://www.lexorholiday.com` URL'sini girin
3. **Request Indexing** butonuna tıklayın

#### Yöntem 2: Google Cache Temizleme
1. Google'da şunu arayın: `cache:lexorholiday.com`
2. Eğer eski bir sayfa görünüyorsa, Google'ın önbelleğini temizlemesi gerekiyor
3. Bu işlem 1-2 hafta sürebilir

#### Yöntem 3: www'siz Versiyonu Kaldırma
1. Google Search Console → **Removals** → **New Request**
2. `https://lexorholiday.com` URL'sini ekleyin
3. "Temporarily hide" seçin
4. Google'ın www'li versiyonu indexlemesini bekleyin

### 4. Meta Tag Kontrolleri (YAPILDI ✅)

- ✅ `index.html` dosyasına tüm meta tag'ler eklendi
- ✅ Open Graph tag'leri eklendi
- ✅ Twitter Card tag'leri eklendi
- ✅ Canonical URL eklendi
- ✅ Robots meta tag eklendi

### 5. Server-Side Rendering (SSR) Önerisi

Eğer sorun devam ederse, Next.js'e geçiş yaparak Server-Side Rendering (SSR) kullanabilirsiniz. Bu, Google botlarının sayfayı daha iyi indexlemesini sağlar.

## Test Adımları

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - URL: `https://www.lexorholiday.com`
   - Test edin ve hataları düzeltin

2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - URL: `https://www.lexorholiday.com`
   - "Scrape Again" butonuna tıklayın

3. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - URL: `https://www.lexorholiday.com`
   - Test edin

4. **Google Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - URL: `https://www.lexorholiday.com`
   - Test edin

## Beklenen Sonuç

- Google'da arama yapınca **www'li versiyon** (`www.lexorholiday.com`) çıkmalı
- www'siz versiyon (`lexorholiday.com`) otomatik olarak www'li versiyona yönlendirilmeli
- Google'da arama yapınca sitenizin gerçek başlığı ve açıklaması görünmeli
- Cloudflare'in varsayılan sayfası görünmemeli
- Open Graph görselleri sosyal medyada doğru görünmeli

## Notlar

- **ÖNEMLİ**: Cloudflare Page Rules'da redirect kuralları en üstte olmalı (priority 1 ve 2)
- Değişikliklerin Google'da görünmesi 1-2 hafta sürebilir
- Cloudflare ayarlarını değiştirdikten sonra 24-48 saat bekleyin
- Google Search Console'da düzenli olarak kontrol edin
- www'siz versiyondan www'li versiyona redirect çalışıp çalışmadığını test edin:
  - Tarayıcıda `http://lexorholiday.com` yazın → `https://www.lexorholiday.com`'a yönlendirilmeli
  - Tarayıcıda `https://lexorholiday.com` yazın → `https://www.lexorholiday.com`'a yönlendirilmeli

## Destek

Sorun devam ederse:
1. Cloudflare Support'a başvurun
2. Google Search Console'da sorun bildirin
3. Server-side rendering (SSR) kullanmayı düşünün

