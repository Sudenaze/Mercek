# Mercek — Özellikler

Tüm kaynak kodları `src/` klasöründe bulunmaktadır. Bu dosya her özelliğin nerede implement edildiğini açıklar.

> **Not:** Bu proje Next.js framework'ü kullandığından kaynak kodların tamamı `src/` klasöründe bulunmaktadır. `features/` klasörü özellik dokümantasyonunu içermektedir.

---

## Özellik Listesi

### 1. Ana Sayfa (`src/app/page.tsx`)
- Hero section ile platforma giriş
- İstatistik kartları (aktif vaka, ihbar, eşleşme sayıları)
- Kayıp ilanları listesi (canlı, localStorage'dan)
- Nasıl çalışır adım adım açıklama

### 2. Kayıp İlanı Oluşturma (`src/app/ilan-ver/page.tsx`)
- Çok adımlı form: kişisel bilgiler → son görülme → fiziksel özellikler
- Fotoğraf yükleme ve base64 dönüşümü
- localStorage'a kayıt (`kesisim_ilanlar`)
- Otomatik ilan ID üretimi

### 3. İhbar Bildirme (`src/app/ihbar/page.tsx`)
- Konum girişi (metin tabanlı)
- Etiket sistemi (kıyafet rengi, yaş grubu, fiziksel özellik)
- Fotoğraf yükleme
- localStorage'a kayıt (`kesisim_ihbars`)

### 4. Kayıp İlanları Listesi (`src/app/vakalar/page.tsx`)
- Tüm aktif ilanların listelenmesi
- Filtreleme (şehir, cinsiyet, yaş)
- Responsive kart tasarımı

### 5. Vaka Detay Sayfası (`src/app/vakalar/[id]/page.tsx`)
- Kişi bilgileri ve fotoğraf
- AI eşleştirme sonuçları (skora göre sıralı ihbarlar)
- Leaflet haritasında son görülme konumu

### 6. Admin / Koordinatör Paneli (`src/app/admin/page.tsx`)
- **Vakalar sekmesi:** Tüm vakaların yönetimi, AI eşleşme istatistikleri
- **İhbarlar sekmesi:** Tüm ihbarların listesi, eşleşme detayları
- **Harita sekmesi:** Tüm konumlar + renk kodlu tahmini rotalar
- **Medya sekmesi:** Fotoğraflı ihbarlar, COCO-SSD görsel analizi

### 7. Harita Bileşeni (`src/components/MapComponent.tsx`)
- React-Leaflet tabanlı interaktif harita
- Vaka bazlı renk kodlu rotalar (`Polyline`)
- Özel marker ikonları (başlangıç noktası, ihbar konumu)
- Tahmini rota hesaplama (zaman damgasına göre sıralı waypoint'ler)

### 8. AI Eşleştirme (`src/lib/mock-persons.ts`, `src/lib/ihbar-store.ts`)
- Tag tabanlı benzerlik skoru hesaplama
- Eşleşen / eşleşmeyen etiket ayrıştırma
- matchScore (0–100) üretimi

### 9. Görsel AI Analizi (`src/app/admin/page.tsx` — MediaDetailModal)
- TensorFlow.js + COCO-SSD entegrasyonu
- Tarayıcı içi nesne tespiti (gizlilik korumalı)
- SVG overlay ile bounding box görselleştirme
- Baş, gövde, bacak bölgesi ayrıştırma

---

## Veri Katmanı

| Dosya | Açıklama |
|---|---|
| `src/lib/mock-persons.ts` | Örnek kayıp vakaları ve AI eşleştirme sonuçları |
| `src/lib/ihbar-store.ts` | İhbar kayıt/okuma işlemleri (localStorage) |
| `src/lib/ilan-store.ts` | Kayıp ilanı kayıt/okuma işlemleri (localStorage) |
