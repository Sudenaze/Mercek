"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { mockPersons, MissingPerson } from "@/lib/mock-persons";
import { getStoredIlanlar, StoredIlan } from "@/lib/ilan-store";

function storedIlanToMissingPerson(ilan: StoredIlan): MissingPerson {
  const words = ilan.name.trim().split(/\s+/);
  const initials = words.map((w) => w[0]?.toUpperCase() ?? "").join(".") + ".";
  return {
    id: ilan.id,
    name: ilan.name,
    initials,
    age: ilan.age,
    gender: ilan.gender,
    hasPhoto: ilan.hasPhoto,
    height: ilan.height || "—",
    build: ilan.build || "—",
    hairColor: ilan.hairColor || "—",
    eyeColor: ilan.eyeColor || "—",
    distinguishingFeatures: ilan.distinguishingFeatures || "",
    lastSeenClothing: ilan.lastSeenClothing || "—",
    lastSeenDate: ilan.lastSeenDate,
    lastSeenTime: ilan.lastSeenTime || "—",
    lastSeenLocation: ilan.lastSeenLocation,
    coordinates: [41.0082, 28.9784],
    circumstances: ilan.circumstances,
    reportedBy: ilan.reportedBy,
    contactPhone: ilan.contactPhone,
    status: "Aktif",
    priority: "Normal",
    openedDate: ilan.timestamp,
    matchedReports: [],
  };
}

type FilterTab = "Tümü" | "Aktif" | "Bulundu" | "Kapatıldı";

const statusConfig = {
  Aktif:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",  dot: "bg-amber-500",   pulse: true  },
  Bulundu:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", pulse: false },
  Kapatıldı: { bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200",  dot: "bg-slate-400",   pulse: false },
};

const priorityConfig = {
  Kritik: { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100"    },
  Yüksek: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  Normal: { bg: "bg-slate-50",  text: "text-slate-500",  border: "border-slate-200"  },
};

function getBestMatch(p: MissingPerson) {
  if (p.matchedReports.length === 0) return null;
  return p.matchedReports.reduce((best, r) => r.matchScore > best.matchScore ? r : best);
}

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const months = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function getDuration(openedDate: string, closedDate?: string) {
  const end = closedDate ? new Date(closedDate) : new Date();
  const hours = Math.floor((end.getTime() - new Date(openedDate).getTime()) / 3600000);
  return hours < 24 ? `${hours} saat` : `${Math.floor(hours / 24)} gün`;
}

export default function VakalarPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Tümü");
  const [search, setSearch] = useState("");
  const [storedPersons, setStoredPersons] = useState<MissingPerson[]>([]);

  useEffect(() => {
    setStoredPersons(getStoredIlanlar().map(storedIlanToMissingPerson));
    const onFocus = () => setStoredPersons(getStoredIlanlar().map(storedIlanToMissingPerson));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const allPersons = [...storedPersons, ...mockPersons];

  const filtered = allPersons.filter((p) => {
    const matchesTab = activeTab === "Tümü" || p.status === activeTab;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.lastSeenLocation.toLowerCase().includes(q) ||
      p.matchedReports.some((r) => r.matchedTags.some((t) => t.toLowerCase().includes(q))) ||
      p.circumstances.toLowerCase().includes(q) ||
      p.distinguishingFeatures.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const counts = {
    Tümü:      allPersons.length,
    Aktif:     allPersons.filter((p) => p.status === "Aktif").length,
    Bulundu:   allPersons.filter((p) => p.status === "Bulundu").length,
    Kapatıldı: allPersons.filter((p) => p.status === "Kapatıldı").length,
  };

  const tabs: FilterTab[] = ["Tümü", "Aktif", "Bulundu", "Kapatıldı"];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-[60vw] h-[60vw] bg-indigo-300/15 blur-[160px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-300/10 blur-[140px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto w-full border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <span className="text-white font-black text-base">M</span>
          </div>
          <span className="font-black text-slate-800 text-lg tracking-tight">Mercek</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/ilan-ver" className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-bold text-sm rounded-xl transition-colors">
            + İlan Ver
          </Link>
          <Link href="/admin" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors hidden md:block">
            Komuta Paneli
          </Link>
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors">
            ← Ana Sayfa
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-10 pb-20">
        {/* Page Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-bold mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Kayıp Vaka Yönetimi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
            Kayıp İlanları
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-xl">
            Yakınları tarafından açılan kayıp ilanları. Her ilan, kişiyi tanımlayan detaylı bilgiler ve ihbar eşleşmelerini içerir.
          </p>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Toplam Vaka", value: counts["Tümü"],      bg: "bg-white",      text: "text-slate-800",   border: "border-slate-200" },
            { label: "Aktif",       value: counts["Aktif"],     bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-100" },
            { label: "Bulundu",     value: counts["Bulundu"],   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
            { label: "Kapatıldı",  value: counts["Kapatıldı"], bg: "bg-slate-50",   text: "text-slate-500",   border: "border-slate-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`text-4xl font-black ${s.text} mb-1`}>{s.value}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1.5 shadow-sm w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-black ${
                  activeTab === tab ? "bg-indigo-500/50 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Vaka ID, konum veya etiket ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Cases List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl">
            <span className="text-5xl mb-4 opacity-40">🔍</span>
            <p className="font-bold text-slate-400 text-lg">Sonuç bulunamadı.</p>
            <p className="text-slate-400 text-sm mt-1">Farklı bir arama veya filtre deneyin.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filtered.map((p) => {
              const sc = statusConfig[p.status];
              const pc = priorityConfig[p.priority];
              const isActive = p.status === "Aktif";
              const bestMatch = getBestMatch(p);

              return (
                <div
                  key={p.id}
                  className={`bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden ${
                    isActive ? "border-slate-200 hover:border-indigo-200" : "border-slate-100"
                  }`}
                >
                  {/* Top accent bar */}
                  {isActive && (
                    <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-400" />
                  )}

                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">

                      {/* LEFT: Identity + Physical Description */}
                      <div className="flex-1 min-w-0">
                        {/* Header row: badges + ID */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                            {p.id}
                          </span>
                          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${sc.pulse ? "animate-pulse" : ""}`} />
                            {p.status}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                            {p.priority}
                          </span>
                          {p.hasPhoto && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                              📷 Fotoğraflı
                            </span>
                          )}
                        </div>

                        {/* Name + avatar */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 shrink-0 ${
                            isActive
                              ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {p.initials.split(".")[0]}
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-xl leading-tight">{p.name}</div>
                            <div className="text-sm text-slate-500 font-semibold mt-0.5">{p.gender} · {p.age} yaş</div>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-medium">
                              <span>Bildiren: {p.reportedBy}</span>
                              <span>·</span>
                              <span>{p.contactPhone}</span>
                            </div>
                          </div>
                        </div>

                        {/* Physical description grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Boy", value: p.height },
                            { label: "Yapı", value: p.build },
                            { label: "Saç", value: p.hairColor },
                            { label: "Göz", value: p.eyeColor },
                          ].map((attr) => (
                            <div key={attr.label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                              <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">{attr.label}</div>
                              <div className="text-xs font-bold text-slate-700">{attr.value}</div>
                            </div>
                          ))}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 col-span-2 sm:col-span-1">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Kıyafet</div>
                            <div className="text-xs font-bold text-slate-700 line-clamp-2">{p.lastSeenClothing}</div>
                          </div>
                        </div>

                        {/* Distinguishing features */}
                        {p.distinguishingFeatures && (
                          <div className="flex items-start gap-2 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                            <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                            <div>
                              <div className="text-xs font-black text-amber-700 uppercase tracking-wide mb-0.5">Ayırt Edici Özellik</div>
                              <div className="text-xs font-semibold text-amber-800">{p.distinguishingFeatures}</div>
                            </div>
                          </div>
                        )}

                        {/* Circumstances */}
                        <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-indigo-100 pl-3 line-clamp-3">
                          {p.circumstances}
                        </p>
                      </div>

                      {/* RIGHT: Location + Dates + Match info + Actions */}
                      <div className="lg:w-64 flex flex-col gap-3 shrink-0">
                        {/* Last seen */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1.5">Son Görülme</div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                            <span className="text-slate-400">📍</span>
                            {p.lastSeenLocation}
                          </div>
                          <div className="text-xs font-semibold text-slate-500">
                            {formatShortDate(p.lastSeenDate)} · {p.lastSeenTime}
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                          <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">
                            {isActive ? "Açık Süre" : "Toplam Süre"}
                          </div>
                          <div className={`text-sm font-black ${isActive ? "text-amber-600" : "text-slate-500"}`}>
                            {getDuration(p.openedDate, p.closedDate)}
                            {isActive && <span className="ml-1 text-amber-400 text-xs font-medium">(devam ediyor)</span>}
                          </div>
                        </div>

                        {/* Best match score */}
                        {bestMatch ? (
                          <div className={`border rounded-xl px-4 py-3 ${
                            bestMatch.matchScore >= 90
                              ? "bg-emerald-50 border-emerald-200"
                              : bestMatch.matchScore >= 75
                              ? "bg-indigo-50 border-indigo-200"
                              : "bg-slate-50 border-slate-200"
                          }`}>
                            <div className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">
                              En Yüksek Eşleşme
                            </div>
                            <div className={`text-2xl font-black mb-0.5 ${
                              bestMatch.matchScore >= 90 ? "text-emerald-600"
                              : bestMatch.matchScore >= 75 ? "text-indigo-600"
                              : "text-slate-600"
                            }`}>
                              %{bestMatch.matchScore}
                            </div>
                            <div className="text-xs text-slate-500 font-semibold">
                              {p.matchedReports.length} ihbar eşleşmesi
                            </div>
                            {/* Match score bar */}
                            <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  bestMatch.matchScore >= 90 ? "bg-emerald-500"
                                  : bestMatch.matchScore >= 75 ? "bg-indigo-500"
                                  : "bg-slate-400"
                                }`}
                                style={{ width: `${bestMatch.matchScore}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">İhbar Eşleşmesi</div>
                            <div className="text-sm text-slate-400 font-semibold">Henüz yok</div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
