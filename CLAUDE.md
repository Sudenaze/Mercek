# Mercek — Geliştirici Notları

Bu proje **Next.js 16.2.1** (App Router) kullanmaktadır.

## Önemli Notlar

- `src/app/` altındaki tüm sayfalar App Router konvansiyonunu takip eder
- Client-side bileşenler `"use client"` direktifi gerektirir
- Harita bileşeni (`MapComponent`) SSR'de çalışmaz, dinamik import ile yüklenir
- TensorFlow.js modeli ilk çalıştırmada tarayıcıda indirilir (~20MB)

## Geliştirme

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run test     # Vitest testleri
```

## Deployment

Proje **Netlify** üzerinde yayınlanmaktadır.
Canlı adres: [mercekupschool.netlify.app](https://mercekupschool.netlify.app/)
