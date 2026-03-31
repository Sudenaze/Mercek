/**
 * Mercek Agent Aracı: PII (Kişisel Veri) Temizleyici
 * 
 * AÇIKLAMA:
 * KVKK ve veri gizliliği standartlarına uymak için, agent'lar sivil vatandaşlardan 
 * gelen ham ihbar metinlerini Gemini gibi yapay zeka API'lerine göndermeden ÖNCE 
 * mutlaka bu temizleyici (sanitizer) aracından geçirmek zorundadır.
 * Bu araç Regex kuralları kullanarak telefon numaralarını, TC Kimlik numaralarını 
 * ve kesin adresleri maskeler.
 */

export function sanitizeReportData(rawContent: string): string {
  let sanitized = rawContent;

  // Mask Turkish Phone Numbers (05xx xxx xx xx)
  const phoneRegex = /(05\d{2})[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g;
  sanitized = sanitized.replace(phoneRegex, "[TELEFON GİZLENDİ]");

  // Mask TC Kimlik Numbers (11 digits)
  const tcRegex = /\b[1-9][0-9]{10}\b/g;
  sanitized = sanitized.replace(tcRegex, "[TCKN GİZLENDİ]");

  // Mask IBAN
  const ibanRegex = /TR\d{24}/g;
  sanitized = sanitized.replace(ibanRegex, "[IBAN GİZLENDİ]");

  return sanitized;
}

// Eğer bir agent workflow (iş akışı) tarafından doğrudan çalıştırılırsa
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0]) {
    console.log(sanitizeReportData(args[0]));
  } else {
    console.error("Agent Hatası: Temizleyiciye hiç girdi verisi sağlanmadı.");
    process.exit(1);
  }
}
