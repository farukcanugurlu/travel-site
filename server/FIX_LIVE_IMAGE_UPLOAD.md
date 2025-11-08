# Live Ortamda Fotoğraf Yükleme Sorunu - Çözüm

## 🔴 Sorun

Live ortamda fotoğraflar yüklenmiyor. Hata mesajı:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:3000/uploads/images/1762623683415-wn8wynioi.jpg
```

**Neden:** Backend `BACKEND_URL` environment variable'ını kullanıyor ama live ortamda bu ayarlanmamış. Bu yüzden fotoğraf URL'leri `localhost:3000` ile oluşturuluyor.

## ✅ Çözüm: BACKEND_URL Environment Variable'ını Ayarla

### Adım 1: Docker Compose Dosyasını Kontrol Et

Live sunucuda `docker-compose.yml` dosyasını kontrol edin:

```bash
cat ~/travel-site/docker-compose.yml
```

### Adım 2: BACKEND_URL Environment Variable'ını Ekle

`docker-compose.yml` dosyasında `server` servisine `BACKEND_URL` ekleyin:

```yaml
server:
  build:
    context: ./server
    dockerfile: Dockerfile
  container_name: travel-site-server
  restart: always
  environment:
    NODE_ENV: production
    DATABASE_URL: postgresql://appuser:apppassword@postgres:5432/appdb
    BACKEND_URL: https://www.lexorholiday.com/api  # Bu satırı ekleyin
  depends_on:
    - postgres
  volumes:
    - ./server/uploads:/app/uploads
  ports:
    - "3000:3000"
  networks:
    - travel-network
```

### Adım 3: Container'ı Restart Et

```bash
# Docker compose'u yeniden başlat
cd ~/travel-site
docker compose down
docker compose up -d
```

### Adım 4: Kontrol Et

```bash
# Container loglarını kontrol et
docker logs travel-site-server --tail 30

# Environment variable'ı kontrol et
docker exec -it travel-site-server sh -c "echo \$BACKEND_URL"
```

**Beklenen Çıktı:**
```
https://www.lexorholiday.com/api
```

## Alternatif: .env Dosyası Kullanma

Eğer `.env` dosyası kullanıyorsanız:

### Adım 1: .env Dosyasını Oluştur/Düzenle

Live sunucuda:

```bash
# .env dosyasını oluştur veya düzenle
nano ~/travel-site/server/.env
```

İçeriği:

```env
NODE_ENV=production
DATABASE_URL=postgresql://appuser:apppassword@postgres:5432/appdb
BACKEND_URL=https://www.lexorholiday.com/api
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
```

### Adım 2: Docker Compose'u Güncelle

`docker-compose.yml` dosyasında `.env` dosyasını kullan:

```yaml
server:
  build:
    context: ./server
    dockerfile: Dockerfile
  container_name: travel-site-server
  restart: always
  env_file:
    - ./server/.env  # Bu satırı ekleyin
  depends_on:
    - postgres
  volumes:
    - ./server/uploads:/app/uploads
  ports:
    - "3000:3000"
  networks:
    - travel-network
```

### Adım 3: Container'ı Restart Et

```bash
cd ~/travel-site
docker compose down
docker compose up -d
```

## Kontrol

### 1. Backend Loglarını Kontrol Et

```bash
docker logs travel-site-server --tail 30
```

### 2. Environment Variable'ı Kontrol Et

```bash
docker exec -it travel-site-server sh -c "echo \$BACKEND_URL"
```

### 3. Fotoğraf Yüklemeyi Test Et

Admin panelden bir fotoğraf yükleyin ve URL'ini kontrol edin. URL şöyle olmalı:

```
https://www.lexorholiday.com/api/uploads/images/1762623683415-wn8wynioi.jpg
```

`localhost:3000` ile başlamamalı.

## Sorun Giderme

### Eğer hala `localhost:3000` görüyorsanız:

1. **Container'ı restart edin:**
```bash
docker restart travel-site-server
```

2. **Environment variable'ı kontrol edin:**
```bash
docker exec -it travel-site-server sh -c "env | grep BACKEND_URL"
```

3. **Backend loglarını kontrol edin:**
```bash
docker logs travel-site-server --tail 50
```

### Eğer fotoğraflar hala yüklenmiyorsa:

1. **Static file serving'i kontrol edin:**
```bash
# Backend loglarında şunu görmelisiniz:
# ✅ Uploads directory exists
```

2. **Uploads dizinini kontrol edin:**
```bash
docker exec -it travel-site-server sh -c "ls -la /app/uploads/images/"
```

3. **Fotoğraf URL'ini test edin:**
```bash
# Browser'da şu URL'i açın:
# https://www.lexorholiday.com/api/uploads/images/[dosya-adı].jpg
```

## Özet

1. ✅ `BACKEND_URL` environment variable'ını ayarla
2. ✅ Docker compose'u güncelle
3. ✅ Container'ı restart et
4. ✅ Test et

Bu adımları uyguladıktan sonra fotoğraflar doğru URL ile yüklenecek.

