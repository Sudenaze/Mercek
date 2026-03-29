"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { saveIhbar, generateIhbarId, fileToBase64 } from "@/lib/ihbar-store";

export default function IhbarPage() {
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Fotoğrafı API'ye göndermeden önce base64'e çevir
      let photoDataUrl: string | undefined;
      let photoName: string | undefined;
      if (file) {
        try {
          photoDataUrl = await fileToBase64(file);
          photoName = file.name;
        } catch {
          // Dönüştürme başarısız olursa fotoğrafsız devam et
        }
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, location, photoDataUrl }),
      });

      if (!response.ok) throw new Error("API hatası");

      const data = await response.json();

      const ihbarId = generateIhbarId();
      saveIhbar({
        id: ihbarId,
        timestamp: new Date().toISOString(),
        location: location || "Belirtilmedi",
        description,
        tags: data.tags || [],
        routePredictions: data.routePredictions || [],
        status: "Yeni",
        hasPhoto: !!file,
        photoDataUrl,
        photoName,
      });

      setSubmittedId(ihbarId);
      setSuccess(true);
      setDescription("");
      setLocation("");
      setFile(null);
    } catch (error) {
      console.error("İhbar gönderilirken hata oluştu:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="fixed top-0 left-0 w-[60vw] h-[60vw] bg-indigo-300/20 blur-[150px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[60vw] h-[60vw] bg-blue-300/15 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Mercek Logo" width={36} height={36} className="rounded-xl shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow" />
          <span className="font-black text-slate-700 text-lg tracking-tight">Mercek</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors"
        >
          ← Ana Sayfaya Dön
        </Link>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-6 md:px-10 py-10 pb-20">
        {/* Page Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-bold mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Vatandaş İhbar Formu
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-slate-900 tracking-tight">
            Yeni İhbar Bildirimi
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">
            Kayıp vakası için elinizdeki bilgi ve belgeleri sisteme yükleyerek
            arama çalışmalarına destek olun.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/60 animate-fade-in">
              {success ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 border-4 border-emerald-50 shadow-inner">
                    ✓
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    İhbarınız Alındı
                  </h2>
                  {submittedId && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <span className="text-xs text-indigo-500 font-bold uppercase tracking-wide">Takip No</span>
                      <span className="font-mono font-black text-indigo-700">{submittedId}</span>
                    </div>
                  )}
                  <p className="text-slate-500 max-w-sm text-base leading-relaxed font-medium">
                    Sağladığınız bilgiler komuta merkezine başarıyla iletildi.
                    Yapay zeka analizinden geçerek kişinin olası güzergahı
                    hesaplanıp yetkililerin ekranında acil konum uyarısı olarak
                    düşecektir.
                  </p>
                  <button
                    onClick={() => { setSuccess(false); setSubmittedId(""); }}
                    className="mt-6 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition-colors border border-slate-200 shadow-sm"
                  >
                    Yeni İhbar Yap
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-fade-in">
                  {/* Step 1 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-200">
                        1
                      </span>
                      <label htmlFor="location" className="block text-base font-black text-slate-800">
                        Konum{" "}
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                    </div>
                    <input
                      id="location"
                      type="text"
                      required
                      placeholder="Örn: İstanbul, Kadıköy, Moda Sahili"
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-5 text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-200">
                        2
                      </span>
                      <label htmlFor="description" className="block text-base font-black text-slate-800">
                        Olayın / Kişinin Detayları{" "}
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                    </div>
                    <textarea
                      id="description"
                      rows={5}
                      required
                      placeholder="Örn: Mavi kot pantolonlu, kırmızı montlu, 1.70 boylarında, 30'lu yaşlarda bir adam gördüm. Saat 14:30 sularında Kadıköy rıhtımdan vapura biniyordu..."
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-5 text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-y transition-all shadow-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="text-xs text-slate-400 font-medium pl-1">
                      Ne kadar detaylı olursa yapay zeka analizi o kadar isabetli olur.
                    </p>
                  </div>

                  {/* Step 3 — Fotoğraf/Video */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black text-sm border border-slate-200">
                        3
                      </span>
                      <label className="block text-base font-black text-slate-800">
                        Fotoğraf Yükle{" "}
                        <span className="text-xs text-slate-400 font-semibold">(İsteğe Bağlı)</span>
                      </label>
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all hover:border-indigo-400 group"
                      >
                        <div className="flex flex-col items-center justify-center py-5 text-center px-4">
                          {file ? (
                            <>
                              {/* Preview if image */}
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 text-xl">
                                  📷
                                </div>
                                <div className="text-left">
                                  <span className="font-bold text-indigo-600 block text-sm truncate max-w-[200px]">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-slate-400 font-medium">
                                    {(file.size / 1024).toFixed(0)} KB · Değiştirmek için tıklayın
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-9 h-9 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="text-sm text-slate-600 font-medium">
                                <span className="font-bold text-indigo-600">Yüklemek için tıklayın</span> veya sürükleyip bırakın
                              </p>
                              <p className="text-xs text-slate-400 font-medium mt-1">PNG, JPG — maks. 5MB</p>
                            </>
                          )}
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4 border-t-2 border-slate-100">
                    <button
                      type="submit"
                      disabled={isSubmitting || !description.trim()}
                      className="w-full flex justify-center items-center py-5 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-500/20 text-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Yapay Zeka Analiz Ediyor...
                        </>
                      ) : (
                        "İhbarı Bildir"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-fade-in delay-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 text-lg">⚠️</span>
                <span className="font-black text-amber-800 text-sm">Önemli Uyarı</span>
              </div>
              <p className="text-sm text-amber-700 leading-relaxed font-medium">
                Sistemde yüz tanıma (facial recognition) özellikleri{" "}
                <span className="font-black">KESİNLİKLE</span> kullanılmamaktadır.
                Fiziksel özellikleri (kıyafet rengi, boy, yaş) olabildiğince
                detaylı yazın.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-fade-in delay-200">
              <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                <span>💡</span> İpuçları
              </h3>
              <ul className="flex flex-col gap-3">
                {[
                  "Kıyafet renklerini ve marka varsa belirtin",
                  "Tahmini boy, kilo, yaş aralığı ekleyin",
                  "Tam konumu ve saati yazmaya çalışın",
                  "Hareket yönü veya hedefi biliyorsanız belirtin",
                  "Fotoğraf eklemek eşleşme oranını artırır",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-indigo-400 mt-0.5 font-bold">↳</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* How it works mini */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 animate-fade-in delay-300">
              <h3 className="font-black text-indigo-800 text-sm mb-3 flex items-center gap-2">
                <span>🤖</span> Ne Olacak?
              </h3>
              <p className="text-xs text-indigo-600 font-medium leading-relaxed">
                İhbarınız gönderildikten sonra Gemini AI otomatik olarak
                etiketler oluşturur ve olası güzergahı yetkililere iletir.
                Eklediğiniz görseller Komuta Merkezi'nde görüntülenebilir.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
