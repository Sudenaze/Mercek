"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { saveIlan, generateIlanId, fileToBase64 } from "@/lib/ilan-store";

export default function IlanVerPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [build, setBuild] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [distinguishingFeatures, setDistinguishingFeatures] = useState("");
  const [lastSeenClothing, setLastSeenClothing] = useState("");
  const [lastSeenDate, setLastSeenDate] = useState("");
  const [lastSeenTime, setLastSeenTime] = useState("");
  const [lastSeenLocation, setLastSeenLocation] = useState("");
  const [circumstances, setCircumstances] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photoDataUrl: string | undefined;
      let photoName: string | undefined;
      if (file) {
        try {
          photoDataUrl = await fileToBase64(file);
          photoName = file.name;
        } catch {}
      }
      const ilanId = generateIlanId();
      saveIlan({
        id: ilanId,
        timestamp: new Date().toISOString(),
        name,
        age: parseInt(age) || 0,
        gender,
        hasPhoto: !!file,
        photoDataUrl,
        photoName,
        height,
        build,
        hairColor,
        eyeColor,
        distinguishingFeatures,
        lastSeenClothing,
        lastSeenDate,
        lastSeenTime,
        lastSeenLocation,
        circumstances,
        reportedBy,
        contactPhone,
      });
      setSubmittedId(ilanId);
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">İlan Oluşturuldu</h2>
          <p className="text-slate-500 font-medium mb-6">
            Kaydınız başarıyla alındı. İlanınız kayıp listesinde görünecek ve yapay zeka ile ihbarlarla eşleştirilecek.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-8">
            <div className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">Takip Numaranız</div>
            <div className="text-2xl font-black text-indigo-700 font-mono">{submittedId}</div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/vakalar"
              className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors"
            >
              İlanları Görüntüle →
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-[60vw] h-[60vw] bg-amber-300/10 blur-[160px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-indigo-300/10 blur-[140px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto w-full border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25">
            <span className="text-white font-black text-base">M</span>
          </div>
          <span className="font-black text-slate-800 text-lg tracking-tight">Mercek</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/vakalar" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors hidden md:block">
            Kayıp İlanları
          </Link>
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors">
            ← Ana Sayfa
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-10 pb-20">
        {/* Page Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Kayıp Yakınları
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            Kayıp İlanı Oluştur
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl">
            Sevdiğiniz hakkında detaylı bilgileri girin. Bu bilgiler yapay zeka eşleştirme sisteminin
            gelen ihbarlarla bağlantı kurmasına yardımcı olur.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Main Form ─── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* 1 — Kişi Bilgileri */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-black border border-indigo-100">1</span>
                  Kayıp Kişi Bilgileri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ad Soyad *</label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Tam adını giriniz"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Yaş *</label>
                    <input
                      type="number" required min="0" max="120" value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Yaş"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Cinsiyet *</label>
                    <select required value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                      <option value="">Seçiniz</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                      <option value="Erkek Çocuğu">Erkek Çocuğu</option>
                      <option value="Kız Çocuğu">Kız Çocuğu</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2 — Fiziksel Özellikler */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-black border border-indigo-100">2</span>
                  Fiziksel Özellikler
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Boy</label>
                    <input
                      type="text" value={height} onChange={(e) => setHeight(e.target.value)}
                      placeholder="örn. 1.72 m"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Vücut Yapısı</label>
                    <select value={build} onChange={(e) => setBuild(e.target.value)} className={inputClass}>
                      <option value="">Seçiniz</option>
                      <option value="İnce yapılı">İnce yapılı</option>
                      <option value="Orta yapılı">Orta yapılı</option>
                      <option value="Kilolu">Kilolu</option>
                      <option value="İri yapılı">İri yapılı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Saç Rengi / Stili</label>
                    <input
                      type="text" value={hairColor} onChange={(e) => setHairColor(e.target.value)}
                      placeholder="örn. Uzun, koyu kahverengi"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Göz Rengi</label>
                    <select value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} className={inputClass}>
                      <option value="">Seçiniz</option>
                      <option value="Kahverengi">Kahverengi</option>
                      <option value="Siyah">Siyah</option>
                      <option value="Mavi">Mavi</option>
                      <option value="Yeşil">Yeşil</option>
                      <option value="Gri">Gri</option>
                      <option value="Ela">Ela</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ayırt Edici Özellikler</label>
                    <textarea
                      value={distinguishingFeatures} onChange={(e) => setDistinguishingFeatures(e.target.value)}
                      placeholder="Dövme, iz, gözlük, doğum lekesi, protez gibi belirgin özellikler..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Son Görülen Kıyafet</label>
                    <textarea
                      value={lastSeenClothing} onChange={(e) => setLastSeenClothing(e.target.value)}
                      placeholder="Renk, tarz ve mümkünse marka dahil tüm kıyafet detayları..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* 3 — Son Görülme */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-black border border-indigo-100">3</span>
                  Son Görülme Bilgileri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tarih *</label>
                    <input
                      type="date" required value={lastSeenDate} onChange={(e) => setLastSeenDate(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Saat</label>
                    <input
                      type="time" value={lastSeenTime} onChange={(e) => setLastSeenTime(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Son Görüldüğü Yer *</label>
                    <input
                      type="text" required value={lastSeenLocation} onChange={(e) => setLastSeenLocation(e.target.value)}
                      placeholder="İlçe, mahalle veya belirli bir yer adı"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Koşullar / Ek Bilgiler *</label>
                    <textarea
                      required value={circumstances} onChange={(e) => setCircumstances(e.target.value)}
                      placeholder="Nasıl kayboldu? Son bilinen durumu, olası güzergahlar, sağlık durumu gibi tüm bilgileri buraya yazın..."
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* 4 — İletişim */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-slate-800 text-lg mb-5 flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-black border border-indigo-100">4</span>
                  İletişim Bilgileri
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kim Bildiriyor? *</label>
                    <input
                      type="text" required value={reportedBy} onChange={(e) => setReportedBy(e.target.value)}
                      placeholder="örn. Eşi, Annesi, Ablası..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">İletişim Telefonu *</label>
                    <input
                      type="tel" required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="05XX XXX XXXX"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* 5 — Fotoğraf */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-slate-800 text-lg mb-1 flex items-center gap-2">
                  <span className="w-7 h-7 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-black border border-indigo-100">5</span>
                  Fotoğraf
                  <span className="text-xs font-medium text-slate-400 ml-1">(İsteğe bağlı)</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  Güncel bir fotoğraf yüklemek yapay zeka eşleştirme doğruluğunu artırır.
                </p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    file
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30"
                  }`}
                >
                  <input
                    ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  {file ? (
                    <div>
                      <div className="text-emerald-600 font-black text-base mb-1">📷 {file.name}</div>
                      <div className="text-xs text-emerald-600 font-medium">
                        {(file.size / 1024).toFixed(0)} KB · Değiştirmek için tıklayın
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">📷</div>
                      <div className="font-bold text-slate-600 text-sm mb-1">Görsel Yükle</div>
                      <div className="text-xs text-slate-400">JPG, PNG veya WEBP · Maks. 10 MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_18px_40px_-10px_rgba(79,70,229,0.65)] hover:-translate-y-0.5 text-lg"
              >
                {isSubmitting ? "Kaydediliyor..." : "İlan Oluştur →"}
              </button>
            </form>
          </div>

          {/* ─── Sidebar ─── */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-slate-800 mb-4">Ne Olacak?</h3>
              <ul className="flex flex-col gap-3">
                {[
                  { icon: "✅", text: "İlanınız kayıp listesinde anında yayınlanır." },
                  { icon: "🤖", text: "Yapay zeka, mevcut ihbarlarla eşleştirmeye çalışır." },
                  { icon: "🔔", text: "Yüksek eşleşme tespit edilince koordinatörler bilgilendirilir." },
                  { icon: "🔒", text: "İletişim bilgileriniz maskelenmiş biçimde gösterilir." },
                ].map((item) => (
                  <li key={item.icon} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <span className="text-base mt-0.5">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="font-black text-amber-800 mb-2 flex items-center gap-2">
                ⚠️ Önemli
              </h3>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                Bu sistem resmi kayıp ihbar platformu <strong>değildir</strong>.
                Acil durumlarda lütfen{" "}
                <strong>155 (Polis)</strong> veya <strong>112 (Acil)</strong>{" "}
                numaralarını arayın.
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
              <h3 className="font-black text-indigo-800 mb-3">İpuçları</h3>
              <ul className="flex flex-col gap-2 text-sm text-indigo-700 font-medium">
                <li>• Fiziksel özellikleri mümkün olduğunca ayrıntılı yazın</li>
                <li>• Son görülen kıyafet kritik önem taşır</li>
                <li>• Ayırt edici özellikler eşleşme başarısını artırır</li>
                <li>• Güncel fotoğraf yüklemek doğruluk oranını yükseltir</li>
              </ul>
            </div>

            <Link
              href="/vakalar"
              className="flex items-center justify-between px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="font-bold text-slate-800 text-sm">Mevcut İlanları Gör</div>
                <div className="text-xs text-slate-400 font-medium">Tüm kayıp ilanlarına göz atın</div>
              </div>
              <span className="text-slate-400 group-hover:text-indigo-600 transition-colors font-bold">→</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
