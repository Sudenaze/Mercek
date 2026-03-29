import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, location, photoDataUrl } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const hasPhoto = photoDataUrl && typeof photoDataUrl === "string" && photoDataUrl.includes(",");

    const prompt = `Sen bir arama kurtarma dijital komuta merkezi yapay zeka asistanısın. Sana sunulan sivil kayıp ihbarını analiz etmeli ve KESİNLİKLE aşağıdaki SAF JSON formatında yanıt vermelisin. Açıklama cümlesi veya markdown kullanma. Sadece geçerli, parse edilebilir JSON oluştur:
{
  "tags": ["#kırmızı_mont", "#30_yaşlarında", vb.],
  "routePredictions": [
    "Kişinin en son görüldüğü noktadan şu yöne veya ulaşım aracına (metro/vapur) geçmiş olma ihtimali tespit edildi.",
    "Bölgedeki X kameralarının incelenmesi önerilir."
  ]
}

Biyometrik veya yüz tanıma analizi yapma. Tahminleri acil durum uzmanı mantığıyla yap. Yalnızca mantıklı olası güzergah ve komuta merkezi için eylem önerileri oluştur.${
  hasPhoto
    ? "\n\nEk olarak bir fotoğraf gönderildi. Fotoğraftaki kişinin kıyafeti, saç rengi, fiziksel yapısı gibi görsel özellikleri de etiketlere dahil et. Yüz tanıma yapma."
    : ""
}

İhbar Metni: "${description}"
${location ? `İhbar Konumu: "${location}"` : ""}
`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any[] = [{ text: prompt }];

    if (hasPhoto) {
      const [header, base64Data] = (photoDataUrl as string).split(",");
      const mimeType = header.split(":")[1]?.split(";")[0] ?? "image/jpeg";
      parts.push({ inlineData: { mimeType, data: base64Data } });
    }

    const result = await geminiModel.generateContent(parts);
    const responseText = result.response.text();

    // Markdown kod bloklarını temizle
    const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsedData: { tags: string[]; routePredictions: string[] } = { tags: [], routePredictions: [] };

    try {
      parsedData = JSON.parse(jsonStr);
    } catch {
      console.error("JSON parse error from Gemini:", jsonStr);
      parsedData.tags = responseText.split(",").filter((t: string) => t.includes("#"));
      parsedData.routePredictions = ["AI yorumu otonom olarak parçalanamadı, ancak veriler kaydedildi."];
    }

    return NextResponse.json({
      success: true,
      originalText: description,
      location: location || "Belirtilmedi",
      tags: parsedData.tags,
      routePredictions: parsedData.routePredictions,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze description" },
      { status: 500 }
    );
  }
}
