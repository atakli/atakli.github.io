# Günlük Sorular - iPhone Web Uygulaması

Bu uygulama, iPhone'da web tarayıcısı üzerinden çalışan bir Progressive Web App (PWA) olarak tasarlanmıştır. Ana ekrana eklenebilir ve günlük sağlık soruları sorarak cevapları kaydeder.

## Özellikler

- 📱 iPhone ana ekranına eklenebilir
- 🔔 Günlük bildirimler (belirlenen saatte)
- 💾 Cevapları localStorage'da saklar
- 📊 Geçmiş cevapları görüntüleme
- ➕ Yeni sorular ekleme
- 📥 Veriyi JSON olarak indirme

## Kurulum

### 1. Uygulamayı Sunma

Uygulamayı bir web sunucusu üzerinden sunmanız gerekiyor. Birkaç seçenek:

#### Seçenek A: Python HTTP Sunucusu (Yerel Test)
```bash
# Python 3
python3 -m http.server 8000

# Veya Python 2
python -m SimpleHTTPServer 8000
```

#### Seçenek B: Node.js HTTP Sunucusu
```bash
npx http-server -p 8000
```

#### Seçenek C: PHP Sunucusu
```bash
php -S localhost:8000
```

### 2. iPhone'dan Erişim

1. Bilgisayarınızın yerel IP adresini bulun:
   ```bash
   # Linux/Mac
   ip addr show | grep "inet " | grep -v 127.0.0.1

   # Veya
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. iPhone'unuzda Safari'yi açın ve şu adrese gidin:
   ```
   http://[BILGISAYAR_IP]:8000
   ```
   Örnek: `http://192.168.1.100:8000`

### 3. Ana Ekrana Ekleme

1. Safari'de uygulama açıkken, paylaş düğmesine (📤) dokunun
2. "Ana Ekrana Ekle" seçeneğini seçin
3. İsim girin ve "Ekle"ye dokunun
4. Artık uygulama iPhone ana ekranında bir simge olarak görünecek

### 4. Otomatik Hatırlatıcı Kurma (Önerilen)

iPhone'un yerleşik "Kısayollar" özelliğini kullanarak otomatik hatırlatıcı kurabilirsiniz:

1. Uygulamayı açın
2. "📱 iPhone Hatırlatıcı Kur" düğmesine dokunun
3. Talimatları okuyun ve "Tamam" deyin (talimatlar kopyalanacak)
4. iPhone'da "Kısayollar" uygulamasını açın
5. Adım adım talimatları takip edin

Bu şekilde her gün belirlediğiniz saatte iPhone otomatik olarak uygulamayı açacak!

## Kullanım

### Günlük Soru Cevaplama
- Ana ekranda günün sorusu görünür
- "Evet" veya "Hayır" düğmelerine dokunarak cevaplayın
- Cevap otomatik olarak kaydedilir

### Geçmiş Görüntüleme
- "Geçmiş Cevapları Görüntüle" düğmesine dokunun
- Tüm geçmiş cevapları tarih sırasıyla görün
- İstenmeyen cevapları silebilirsiniz
- Tüm veriyi JSON olarak indirebilirsiniz

### Soru Yönetimi
- "Soruları Yönet" düğmesine dokunun
- Yeni soru eklemek için metin kutusuna yazın ve "Ekle"ye dokunun
- Mevcut soruları silebilirsiniz
- İlk soru her zaman günün sorusu olarak gösterilir

## Teknik Detaylar

### Veri Depolama
Tüm veriler tarayıcının localStorage'ında saklanır:
- Sorular listesi
- Cevaplar (tarih, soru, cevap)
- Bildirim saati
- Son cevaplama tarihi

### Bildirimler
- Uygulama her dakika kontrol eder
- Belirlenen saatte bildirim gönderir
- Aynı gün tekrar bildirim göndermez
- iOS Safari'de bildirimler için sayfanın açık kalması gerekir

### PWA Özellikleri
- Service Worker ile offline çalışma
- Ana ekrana eklenebilir
- Tam ekran modunda çalışır
- iOS güvenli alan desteği

## Önemli Notlar

✅ **iPhone Kısayollar Otomasyonu (En İyi Çözüm):**
- iPhone'un yerleşik "Kısayollar" uygulaması ile tam otomatik çalışır
- Her gün belirlediğiniz saatte otomatik olarak uygulamayı açar
- Bildirim izni gerektirmez
- %100 güvenilir çalışır
- iOS 16.7.10'da mükemmel şekilde çalışır

⚠️ **Görsel Hatırlatıcılar:**
- Uygulamayı açtığınızda bugün cevaplanmadıysa sarı uyarı kutusu görürsünüz
- "⚠️ Cevaplanmadı" badge'i gösterilir
- Cevap verdikten sonra "✓ Bugün Cevaplandı" olarak değişir

⚠️ **Veri Güvenliği:**
- Tüm veriler cihazınızda saklanır
- Hiçbir veri sunucuya gönderilmez
- Tarayıcı verilerini temizlerseniz veriler silinir

## Geliştirme

Dosya yapısı:
```
iphone/
├── index.html          # Ana HTML dosyası
├── style.css           # Stiller
├── app.js              # Uygulama mantığı
├── service-worker.js   # PWA service worker
├── manifest.json       # PWA manifest
├── icon.svg            # Uygulama ikonu
└── README.md           # Bu dosya
```

## Sorun Giderme

**Kısayollar otomasyonu çalışmıyor:**
- Kısayollar uygulamasında "Otomasyon" sekmesini kontrol edin
- "Çalıştırmadan Önce Sor" seçeneğinin KAPALI olduğundan emin olun
- Saatin doğru ayarlandığını kontrol edin
- iPhone'un internete bağlı olduğundan emin olun

**Uygulama yüklenmiyor:**
- HTTP sunucusunun çalıştığından emin olun
- Firewall ayarlarını kontrol edin
- iPhone ve bilgisayarın aynı ağda olduğundan emin olun

**Veriler kayboldu:**
- Tarayıcı önbelleğini temizlemeyin
- Safari gizli modunda kullanmayın
- Düzenli olarak veriyi JSON olarak yedekleyin
