# Cloudflare: www'den non-www'e Redirect Yapma

## Adım 1: Cloudflare Dashboard'a Giriş
1. https://dash.cloudflare.com adresine gidin
2. `lexorholiday.com` domain'ini seçin

## Adım 2: Redirect Rules Oluşturma

### Yöntem 1: Redirect Rules (Önerilen - Yeni Sistem)

1. **Rules** → **Redirect Rules** sekmesine gidin
2. **Create rule** butonuna tıklayın
3. Aşağıdaki kuralları oluşturun:

#### Kural 1: HTTP www'den HTTPS non-www'e Redirect
- **Rule name**: `www to non-www HTTP`
- **If**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `www.lexorholiday.com`
  - AND
  - Field: `Scheme`
  - Operator: `equals`
  - Value: `http`
- **Then**:
  - Action: `Redirect`
  - Status code: `301`
  - Destination URL: `https://lexorholiday.com/$1`
  - Preserve query string: ✅ (Açık)

#### Kural 2: HTTPS www'den HTTPS non-www'e Redirect
- **Rule name**: `www to non-www HTTPS`
- **If**: 
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `www.lexorholiday.com`
  - AND
  - Field: `Scheme`
  - Operator: `equals`
  - Value: `https`
- **Then**:
  - Action: `Redirect`
  - Status code: `301`
  - Destination URL: `https://lexorholiday.com/$1`
  - Preserve query string: ✅ (Açık)

### Yöntem 2: Page Rules (Eski Sistem - Hala Çalışıyor)

Eğer Redirect Rules bulamazsanız, eski Page Rules sistemini kullanabilirsiniz:

1. **Rules** → **Page Rules** sekmesine gidin
2. **Create Page Rule** butonuna tıklayın
3. Aşağıdaki kuralları oluşturun:

#### Kural 1: www HTTP'den non-www HTTPS'e Redirect
- **URL Pattern**: `http://www.lexorholiday.com/*`
- **Settings**:
  - **Forwarding URL**: `https://lexorholiday.com/$1`
  - **Status Code**: `301 Permanent Redirect`
  - **Priority**: 1 (En üstte olmalı)

#### Kural 2: www HTTPS'den non-www HTTPS'e Redirect
- **URL Pattern**: `https://www.lexorholiday.com/*`
- **Settings**:
  - **Forwarding URL**: `https://lexorholiday.com/$1`
  - **Status Code**: `301 Permanent Redirect`
  - **Priority**: 2 (İkinci sırada olmalı)

## Adım 3: DNS Kayıtlarını Kontrol Etme

DNS kayıtlarınız şu şekilde olmalı:

### A Record (Root Domain)
- **Type**: A
- **Name**: `@` (root)
- **IPv4 address**: `72.61.87.27`
- **Proxy status**: ✅ Proxied (Turuncu bulut)
- **TTL**: Auto

### A Record (www)
- **Type**: A
- **Name**: `www`
- **IPv4 address**: `72.61.87.27`
- **Proxy status**: ✅ Proxied (Turuncu bulut)
- **TTL**: Auto

**NOT**: www kaydını silmeyin! Redirect çalışması için her iki kayıt da (www ve non-www) olmalı ve Proxied olmalı.

## Adım 4: SSL/TLS Ayarları

1. **SSL/TLS** sekmesine gidin
2. **Encryption mode**: "Full" veya "Full (strict)" seçin
3. **Always Use HTTPS**: ✅ Açık olmalı
4. **Automatic HTTPS Rewrites**: ✅ Açık olmalı

## Adım 5: Test Etme

Redirect'in çalışıp çalışmadığını test edin:

1. Tarayıcıda `http://www.lexorholiday.com` yazın → `https://lexorholiday.com`'a yönlendirilmeli
2. Tarayıcıda `https://www.lexorholiday.com` yazın → `https://lexorholiday.com`'a yönlendirilmeli
3. Tarayıcıda `http://www.lexorholiday.com/about` yazın → `https://lexorholiday.com/about`'a yönlendirilmeli

### Online Test Araçları:
- **Redirect Checker**: https://www.redirect-checker.org/
- **HTTP Status Code Checker**: https://httpstatus.io/

## Önemli Notlar

1. **DNS Kayıtları**: www kaydını silmeyin! Redirect çalışması için her iki kayıt da (www ve non-www) Proxied olmalı.

2. **Kural Sırası**: Redirect Rules'da kuralların sırası önemlidir. Daha spesifik kurallar (www) daha genel kurallardan (non-www) önce gelmelidir.

3. **Propagation**: Değişikliklerin yayılması 5-30 dakika sürebilir. Bazen 24 saate kadar sürebilir.

4. **Cache**: Cloudflare cache'ini temizlemek için:
   - **Caching** → **Configuration** → **Purge Everything** butonuna tıklayın

5. **Google Search Console**: 
   - Google Search Console'da preferred domain'i `lexorholiday.com` (non-www) olarak ayarlayın
   - Sitemap'i güncelleyin: `https://lexorholiday.com/sitemap.xml`

## Sorun Giderme

### Redirect Çalışmıyor
1. DNS kayıtlarının Proxied olduğundan emin olun
2. Redirect Rules'ın aktif olduğunu kontrol edin
3. Cloudflare cache'ini temizleyin
4. Tarayıcı cache'ini temizleyin (Ctrl+Shift+Delete)
5. Farklı bir tarayıcıda test edin

### SSL Sertifika Hatası
1. SSL/TLS → **Edge Certificates** → **Always Use HTTPS** açık olmalı
2. **Automatic HTTPS Rewrites** açık olmalı
3. Birkaç dakika bekleyin, sertifika otomatik olarak oluşturulur

### Loop (Döngü) Hatası
- Redirect Rules'da yanlış URL pattern kullanmış olabilirsiniz
- Kuralları kontrol edin ve düzeltin

## Beklenen Sonuç

- ✅ `http://www.lexorholiday.com` → `https://lexorholiday.com` (301 redirect)
- ✅ `https://www.lexorholiday.com` → `https://lexorholiday.com` (301 redirect)
- ✅ `http://www.lexorholiday.com/about` → `https://lexorholiday.com/about` (301 redirect)
- ✅ Tüm alt sayfalar doğru şekilde yönlendirilir
- ✅ Query string'ler korunur: `http://www.lexorholiday.com/?id=123` → `https://lexorholiday.com/?id=123`

