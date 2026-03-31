# Mercek — Teknoloji Yığını

## Kullanılan Teknolojiler

| Teknoloji | Versiyon | Kullanım Amacı |
|---|---|---|
| **Next.js** | 16.2.1 | Full-stack React framework, App Router |
| **React** | 19.2.4 | UI bileşen kütüphanesi |
| **TypeScript** | 5.x | Tip güvenliği |
| **Tailwind CSS** | v4 | Utility-first CSS styling |
| **TensorFlow.js** | 4.22.0 | Tarayıcı içi makine öğrenmesi |
| **COCO-SSD** | 2.2.3 | Gerçek zamanlı nesne tespiti modeli |
| **Leaflet / React-Leaflet** | 4.x | Harita görselleştirme |
| **Netlify** | — | Deployment ve barındırma |

---

## Teknoloji Seçim Gerekçeleri

### Next.js 16 (App Router)
- Server ve client bileşenleri aynı projede yönetilebiliyor
- Dosya tabanlı routing ile hızlı sayfa yapısı
- Image optimizasyonu built-in

### TensorFlow.js + COCO-SSD
- **Gizlilik öncelikli:** Fotoğraflar sunucuya gönderilmez, analiz tamamen tarayıcıda yapılır
- COCO-SSD 80 farklı nesne sınıfını tanıyabilir (person, vehicle, animal vb.)
- `model.detect(imgElement)` çağrısı `{bbox, class, score}` dizisi döndürür
- Sahte/hardcoded koordinatlar yerine gerçek bounding box kullanılır

### Leaflet / React-Leaflet
- OpenStreetMap tabanlı, ücretsiz ve açık kaynak
- `Polyline`, `Marker`, `divIcon` ile özelleştirilebilir harita bileşenleri
- Türkiye koordinatlarında yüksek harita kalitesi

### Tailwind CSS v4
- Yeni (oxide engine) ile çok daha hızlı derleme
- Utility class'larla hızlı prototipleme
- `bg-gradient-to-br`, `backdrop-blur`, `animate-pulse` gibi modern efektler

### Netlify
- GitHub reposu ile otomatik CI/CD entegrasyonu
- Her push'ta otomatik deploy
- Ücretsiz tier ile yeterli performans

---

## Veri Yönetimi

Proje şu an **mock data + localStorage** mimarisi kullanmaktadır:

- `localStorage['kesisim_ihbars']` — Sivil ihbarlar
- `localStorage['kesisim_ilanlar']` — Aile kayıp ilanları
- `src/lib/mock-persons.ts` — AI eşleştirme sonuçları olan örnek vakalar

Bu mimari, backend entegrasyonu olmadan tam işlevsel bir demo sağlar ve gerçek bir veritabanına (Supabase, PostgreSQL vb.) geçişe hazır tasarlanmıştır.

