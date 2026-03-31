---
description: Kayıp Kişi İhbarları İçin Acil Durum Tırmandırma Protokolü İş Akışı
---

# Acil Durum Tırmandırma Protokolü

Bu iş akışı (workflow), otonom bir AI agent'ın, kayıp bir kişi için yüksek güvenilirlikte (resmi: >%90) bir eşleşme bulduğunda (özellikle ilk 72 saatlik kritik pencerede) nasıl reaksiyon göstermesi gerektiğini belirler.

## Ön Koşullar
- Agent'ın `notification_service` (bildirim servisi) aracına erişimi olmalıdır.
- `gemini_incident_analyzer` (olay analizcisi) güven skorunu 0.90'ın üzerinde olarak işaretlemiş olmalıdır.

## İş Akışı Yürütme Adımları

// turbo
1. **İhbar Bütünlüğünü Doğrula**
   - İhbarın mükerrer (kopya) veya bilinen bir asılsız ihbar olmadığını doğrulamak için validation (doğrulama) aracını çalıştır.
   - Komut: `npm run agent:validate-report -- --reportId ${REPORT_ID}`

2. **Kesişim / Müdahale Vektörünü Hesapla**
   - Kayıp kişinin bilinen son koordinatlarına ve bölgesel topoğrafyaya dayanarak olası sonraki 3 lokasyonu tahmin etmesi için yapay zekayı kullan.
   - Komut: `npm run agent:predict-route -- --coordinates ${LAT},${LNG} --radius 5km`

// turbo-all
3. **Saha Tırmandırmasını (Eskalasyon) Başlat**
   - Tahmin edilen sınır çizgileri aktif geçiş merkezleriyle (vapurlar, metrolar, otoyollar) kesişiyorsa, saha ekiplerini SMS API üzerinden bilgilendir.
   - Komut: `npm run agent:notify-field -- --urgency CRITICAL --message "Vaka ${VAKA_ID} için yüksek eşleşme tespiti! Hedeflenen bölge: ${PREDICTED_HUB}."`

4. **Komuta Merkezi Panelini Güncelle**
   - Veritabanındaki ihbar durumunu `"Saha Operasyonu"` olarak anında değiştir.
   - Komut: `npm run agent:update-db --status "Saha Operasyonu" --reportId ${REPORT_ID}`
