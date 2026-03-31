# Mercek — Fikir ve Problem Tanımı

## Problem

Türkiye'de kayıp kişi vakalarında bilgi yönetimi büyük ölçüde sosyal medyaya bırakılmıştır. Aile bireyleri Twitter, Facebook ve WhatsApp gruplarında dağınık paylaşımlar yaparken, gönüllüler ve koordinatörler bu bilgileri manuel olarak takip etmeye çalışmaktadır.

Bu süreçte ortaya çıkan kritik sorunlar:

- **Bilgi kirliliği:** Aynı ihbar birden fazla kez iletilmekte, çelişkili bilgiler yayılmaktadır
- **Koordinasyon eksikliği:** Kim neyi takip ediyor, hangi ihbar incelendi, bilgi yok
- **Zaman kaybı:** İlk 72 saat en kritik dönemdir; bu saatler verimsiz geçmektedir
- **Görsel analiz yokluğu:** İhbarlardaki fotoğraflar elle gözden geçirilmektedir

---

## Hedef Kullanıcılar

| Kullanıcı | Rolü |
|---|---|
| **Aile Bireyleri** | Kayıp ilanı oluşturur, ihbarları takip eder |
| **Sivil Gönüllüler** | Gördükleri kişiyi fotoğraf ve konum bilgisiyle ihbar eder |
| **Koordinatörler / Admin** | Tüm vakaları, ihbarları ve eşleştirmeleri yönetir |

---

## Yapay Zekanın Rolü

### 1. İhbar–İlan Eşleştirme
- İhbardaki etiketler (`#kırmızı_mont`, `#yaşlı_kadın` vb.) kayıp ilanlarındaki özelliklerle karşılaştırılır
- Benzerlik skoru (0–100) hesaplanarak koordinatöre sunulur
- Eşleşen ve eşleşmeyen etiketler ayrı ayrı gösterilir

### 2. Görsel Analiz (TensorFlow.js + COCO-SSD)
- İhbara eklenen fotoğraflar tarayıcı içinde analiz edilir
- COCO-SSD modeli ile insan, araç, nesne tespiti yapılır
- Tespit edilen kişinin vücut bölgeleri (baş, gövde, bacaklar) bounding box ile işaretlenir
- Sunucuya fotoğraf gönderilmez; gizlilik korunur

### 3. Tahmini Rota Oluşturma
- Bir kayıp vakasına bağlı birden fazla ihbar varsa, ihbarlar zaman damgasına göre sıralanır
- Son görülme konumundan itibaren harita üzerinde tahmini rota çizilir
- Her vaka için renk kodlu rota ve marker'lar gösterilir

---

## Çözümün Özeti

Mercek, dağınık sosyal medya sürecini merkezi ve yapay zeka destekli bir platforma taşır. İhbarları otomatik olarak analiz ederek koordinatörlerin dikkatini en alakalı vakalara yönlendirir ve kritik ilk saatlerdeki müdahale kapasitesini artırır.
