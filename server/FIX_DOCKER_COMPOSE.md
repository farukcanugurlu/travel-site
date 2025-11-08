# Docker Compose'u Düzeltme - BACKEND_URL Ekleme

## 🔴 Sorun

`docker-compose.yml` dosyasında `server` servisinde `BACKEND_URL` environment variable'ı yok. Bu yüzden backend fotoğraf URL'lerini `localhost:3000` ile oluşturuyor.

## ✅ Çözüm: BACKEND_URL Ekle

### Adım 1: docker-compose.yml Dosyasını Düzenle

Live sunucuda (nano ile açık):

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

### Adım 2: Dosyayı Kaydet

Nano'da:
- `Ctrl + O` (kaydet)
- `Enter` (onayla)
- `Ctrl + X` (çık)

### Adım 3: Container'ı Restart Et

```bash
# Docker compose'u yeniden başlat
cd ~/travel-site
docker compose down
docker compose up -d
```

### Adım 4: Kontrol Et

```bash
# Environment variable'ı kontrol et
docker exec -it travel-site-server sh -c "echo \$BACKEND_URL"
```

**Beklenen Çıktı:**
```
https://www.lexorholiday.com/api
```

### Adım 5: Backend Loglarını Kontrol Et

```bash
docker logs travel-site-server --tail 30
```

## Hızlı Komutlar

### Tek Komutla Düzeltme

```bash
# docker-compose.yml dosyasını düzenle (sed ile)
cd ~/travel-site
sed -i '/DATABASE_URL: postgresql:\/\/appuser:apppassword@postgres:5432\/appdb/a\      BACKEND_URL: https://www.lexorholiday.com/api' docker-compose.yml

# Container'ı restart et
docker compose down
docker compose up -d

# Kontrol et
docker exec -it travel-site-server sh -c "echo \$BACKEND_URL"
```

## Kontrol

### 1. Environment Variable'ı Kontrol Et

```bash
docker exec -it travel-site-server sh -c "env | grep BACKEND_URL"
```

### 2. Backend Loglarını Kontrol Et

```bash
docker logs travel-site-server --tail 30
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

## Özet

1. ✅ `BACKEND_URL: https://www.lexorholiday.com/api` ekle
2. ✅ Dosyayı kaydet
3. ✅ Container'ı restart et
4. ✅ Test et

Bu adımları uyguladıktan sonra fotoğraflar doğru URL ile yüklenecek.

