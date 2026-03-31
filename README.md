# Mercek — Dijital Komuta Merkezi

Kayıp vakalarında ilk 72 saatteki bilgi kirliliğini önlemek için geliştirilmiş, sivil ihbarları yapay zeka ile eş zamanlı analiz eden modern yönetim platformu.

---

## Problem

Türkiye'de her yıl binlerce kayıp vakası yaşanmaktadır. Mevcut süreçte aile bireyleri sosyal medyada dağınık paylaşımlar yaparken gönüllüler ve koordinatörler bu bilgileri manuel olarak takip etmektedir. Bu durum:

- Mükerrer ihbarların gözden kaçmasına
- Kritik ilk saatlerin verimsiz geçmesine
- Koordinasyon eksikliğine

yol açmaktadır. Mercek, bu kaosa dijital bir komuta merkezi olarak müdahale eder.

---

## Özellikler

- **Kayıp İlan Yönetimi** — Aile bireyleri kayıp ilanı oluşturabilir, fotoğraf ve detay ekleyebilir
- **Sivil İhbar Sistemi** — Herkes ihbar bildirebilir, fotoğraf yükleyebilir
- **AI Eşleştirme** — İhbarlar kayıp ilanlarıyla otomatik olarak eşleştirilir, benzerlik skoru gösterilir
- **Görsel Analiz** — TensorFlow.js + COCO-SSD ile fotoğraflarda gerçek zamanlı nesne tespiti
- **Tahmini Rota Haritası** — Birden fazla ihbar bulunan vakalarda harita üzerinde tahmini rota oluşturulur
- **Admin Paneli** — Koordinatörler tüm vakaları, ihbarları ve medya içeriklerini yönetebilir

---

## Yayın Linki

**[https://mercekupschool.netlify.app/](https://mercekupschool.netlify.app/)**

---

## Demo Video

> Yakında eklenecek

---

## Nasıl Çalıştırılır?

### Gereksinimler

- Node.js 18+
- npm

### Kurulum

```bash
# Repoyu klonla
git clone https://github.com/Sudenaze/Mercek.git
cd Mercek

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

### Build

```bash
npm run build
npm start
```

---

## Klasör Yapısı

```
src/
├── app/               # Next.js App Router sayfaları
│   ├── page.tsx       # Ana sayfa
│   ├── vakalar/       # Kayıp ilanları listesi ve detay
│   ├── ihbar/         # İhbar bildirme formu
│   ├── ilan-ver/      # Kayıp ilanı oluşturma
│   └── admin/         # Koordinatör yönetim paneli
├── components/        # Yeniden kullanılabilir UI bileşenleri
└── lib/               # Veri modelleri, store'lar, mock veriler
features/              # Özellik dokümantasyonu
assets/                # Görseller ve ekran görüntüleri
```

---

## Takım

Upschool AI Bootcamp — 2026
