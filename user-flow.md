# Mercek — Kullanıcı Akışı

## Genel Akış Diyagramı

```
[Aile Üyesi]          [Sivil Gönüllü]         [Koordinatör/Admin]
      |                      |                         |
      v                      v                         |
 İlan Ver             İhbar Bildir                     |
 Formu Doldur         Formu Doldur                     |
 (isim, fotoğraf,     (konum, fotoğraf,                |
  özellikler)          açıklama, etiketler)             |
      |                      |                         |
      v                      v                         v
  [localStorage]        [localStorage]         Admin Paneli Açılır
  ilan kayıt           ihbar kayıt                     |
      |                      |              ┌───────────┼───────────┐
      └──────────────────────┘              |           |           |
                 |                       Vakalar     İhbarlar    Medya
                 v                       Listesi     Listesi     Sekmesi
         AI Eşleştirme                      |           |           |
         (tag karşılaştırma,                v           v           v
          benzerlik skoru)          Vaka Detayı   İhbar Detayı  Fotoğraf
                 |                  (harita +    (AI eşleşme   Analizi
                 v                  rota)         skoru)      (COCO-SSD)
         Eşleşme Sonucu
         koordinatöre
         gösterilir
```

---

## Akış 1: Aile Üyesi — Kayıp İlanı Vermek

1. Ana sayfada **"İlan Ver"** butonuna tıklar
2. Form açılır:
   - Kayıp kişinin adı, soyadı, yaşı
   - Son görülme tarihi ve konumu
   - Fiziksel özellikler (saç rengi, boy, kıyafet vb.)
   - Fotoğraf yükleme (opsiyonel)
   - İletişim bilgisi
3. **"İlanı Yayınla"** butonuna basar
4. İlan `localStorage`'a kaydedilir
5. Sistem otomatik olarak mevcut ihbarlarla karşılaştırır
6. Eşleşme varsa koordinatöre bildirim düşer

---

## Akış 2: Sivil Gönüllü — İhbar Bildirmek

1. Herhangi bir sayfada **"İhbar Bildir"** butonuna tıklar
2. Form açılır:
   - Görüldüğü konum (metin + haritadan seçim)
   - Görülme tarihi ve saati
   - Açıklama
   - Etiketler (kıyafet rengi, yaş grubu, fiziksel özellik)
   - Fotoğraf yükleme (opsiyonel)
3. **"İhbarı Gönder"** butonuna basar
4. İhbar `localStorage`'a kaydedilir
5. Sistem mevcut kayıp ilanlarıyla eşleştirme yapar

---

## Akış 3: Koordinatör — Admin Paneli

1. `/admin` adresine giriş yapar
2. **Vakalar sekmesi** — Tüm aktif/kapatılmış vakaları görür
   - Her vakada AI eşleşme sayısı, en yüksek skor gösterilir
   - Harita sekmesinde rota görselleştirilmiş şekilde açılır
3. **İhbarlar sekmesi** — Tüm ihbarları inceler
   - Hangi vakaya eşleştiğini, skoru ve eşleşen/eşleşmeyen etiketleri görür
4. **Medya sekmesi** — Fotoğraflı ihbarları görür
   - "Detaylı Görüntüle" butonu ile görseli açar
   - "AI Analizi Başlat" ile COCO-SSD taraması yapar
   - Tespit edilen nesneler bounding box ile gösterilir

---

## Sayfa Haritası

```
/                    → Ana Sayfa (istatistikler, CTA butonları)
/vakalar             → Tüm kayıp ilanları listesi
/vakalar/[id]        → Tek bir vaka detayı + harita
/ihbar               → İhbar bildirme formu
/ilan-ver            → Kayıp ilanı oluşturma formu
/admin               → Koordinatör paneli (vakalar / ihbarlar / harita / medya)
```
