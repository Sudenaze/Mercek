# Mercek — AI Agent Altyapısı

Bu klasör, Mercek platformunun otomasyon ve yapay zeka agent bileşenlerini içerir.

## Klasör Yapısı

```
.agents/
├── prompts/
│   └── gemini_incident_analyzer.md    # Vaka analizi için Gemini prompt şablonu
├── tools/
│   └── pii_sanitizer.ts               # Kişisel veri temizleme aracı
└── workflows/
    └── emergency_escalation.md        # Acil durum eskalasyon iş akışı
```

## Agent Rolleri

| Agent | Görev |
|---|---|
| **Incident Analyzer** | Gelen ihbarları analiz eder, anahtar etiketleri çıkarır |
| **PII Sanitizer** | İhbarlardaki kişisel verileri anonim hale getirir |
| **Emergency Escalation** | Yüksek eşleşme skorlu vakaları koordinatöre iletir |
