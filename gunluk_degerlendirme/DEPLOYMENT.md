# Uygulamayı İnternete Yayınlama

Bu uygulama tamamen statik dosyalardan oluştuğu için ücretsiz hosting servisleri kullanılabilir.

## Seçenek 1: GitHub Pages (ÖNERİLEN) ⭐

### Adım 1: GitHub Repository Oluştur

1. https://github.com adresine git
2. Sağ üstten "+" > "New repository" tıkla
3. Repository adı: `gunluk-sorular` (veya istediğin isim)
4. **Public** seçili olsun (ücretsiz için gerekli)
5. "Create repository" butonuna tıkla

### Adım 2: Kodu GitHub'a Gönder

Terminal'de şu komutları çalıştır:

```bash
cd /home/emre/iphone

# GitHub repository URL'ini ekle (kendi kullanıcı adınla değiştir)
git remote add origin https://github.com/KULLANICI_ADIN/gunluk-sorular.git

# Kodu gönder
git branch -M main
git push -u origin main
```

### Adım 3: GitHub Pages'i Etkinleştir

1. GitHub repository sayfasında "Settings" sekmesine git
2. Sol menüden "Pages" seçeneğini bul
3. "Source" kısmında "Deploy from a branch" seç
4. "Branch" kısmında "main" ve "/ (root)" seç
5. "Save" butonuna tıkla

### Adım 4: URL'i Al

Birkaç dakika bekle, sonra:
- Aynı sayfada "Your site is live at https://KULLANICI_ADIN.github.io/gunluk-sorular/" mesajı görünecek
- Bu URL'yi iPhone'da kullan!

**AVANTAJLARI:**
- ✅ Tamamen ücretsiz
- ✅ HTTPS ile güvenli
- ✅ Her zaman açık (24/7)
- ✅ Hızlı
- ✅ Kolay güncelleme (git push ile)

---

## Seçenek 2: Netlify (Alternatif)

1. https://netlify.com adresine git
2. "Sign up" yap (GitHub hesabınla giriş yapabilirsin)
3. "Add new site" > "Import an existing project"
4. GitHub repository'ni seç
5. Deploy et

---

## Seçenek 3: Vercel (Alternatif)

1. https://vercel.com adresine git
2. "Sign up" yap
3. "New Project" > GitHub repository'ni seç
4. Deploy et

---

## Güncelleme Yapmak İstersen

Kod değişikliği yaptıktan sonra:

```bash
cd /home/emre/iphone
git add -A
git commit -m "Güncelleme mesajı"
git push
```

GitHub Pages otomatik olarak güncellenecek (1-2 dakika içinde).

---

## Önemli Not

Tüm veriler (cevaplar, sorular) **iPhone'un tarayıcısında** saklanır, sunucuda değil.
Yani GitHub'a sadece uygulama kodu gidiyor, kişisel verileriniz gitmiyor!
