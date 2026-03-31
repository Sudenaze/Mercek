# 🤖 Mercek Platformu - Otonom Agent Mimarisi

Bu `.agents` klasörü, **Mercek - Dijital Komuta Merkezi** otonom veri hattını (pipeline) çalıştıran otomasyonları, iş akışlarını (workflows), araçları (tools) ve sistem komutlarını (prompts) içerir. 

Mercek, geleneksel doğrusal (linear) kodlama yerine "otonom agent mimarisi" kullanarak, insan gecikmesini ortadan kaldırır ve 72 saatlik kritik kayıp penceresinde anında reaksiyon süresi elde eder.

## Mimari Özeti

Projemiz, Büyük Dil Modellerini (LLM) ve özelleştirilmiş araçları Agent İş Akışları (Workflows) üzerinden koordine eder. Bu klasör üç ana bileşene ayrılmıştır:

1. **`prompts/`**: Yapay zeka modellerimizin (ör. Gemini) karakterini, kısıtlamalarını ve çıktı formatlarını tanımlayan çekirdek sistem komutları.
2. **`tools/`**: Agent'ların sistemle fiziksel olarak etkileşime girmek için çalıştırdığı yürütülebilir scriptler ve fonksiyonlar (TypeScript/Python). (Ör: Dış API'lere çıkmadan önce PII - Kişisel Verileri temizleme)
3. **`workflows/`**: Yapay zeka orkestrasyon motorlarının otonom olarak okuyup yürütebileceği bildirimsel (declarative) Markdown senaryoları (Ör: Acil durum tırmandırma/yönlendirme protokolleri).

## Neden Agentic (Agent Tabanlı) Bir Yaklaşım?
* **Ölçeklenebilirlik:** Bir kayıp ilanı viral olduğunda binlerce veri noktası (ihbar) aynı anda sisteme düşebilir. İnsan operatörlerin tümünü anında çapraz referansla incelemesi imkansızdır. Bir agent (ajan) bunu yapabilir.
* **Etik & Gizlilik:** KVKK aracı (`pii_sanitizer.ts`) gibi Agent araçları, hassas kişisel verilerin analiz öncesinde sistemden temizlenmesini garanti eder.
* **Sürekli İzleme:** Agent komutları, veritabanını sürekli tarayarak potansiyel eşleşmeleri ve anomalileri (örneğin aynı kırmızı montun iki farklı ilçede görülmesi) arar.

*Bu dizin, Mercek platformunun tamamen otomatikleştirilmiş yapay zeka operasyonlarının "beyni" olarak işlev görmektedir.*
