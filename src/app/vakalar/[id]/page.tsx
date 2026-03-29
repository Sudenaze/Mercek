"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { mockPersons, MatchedReport } from "@/lib/mock-persons";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function MatchScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#10b981" : score >= 75 ? "#6366f1" : score >= 60 ? "#f59e0b" : "#94a3b8";

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="absolute" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={radius}
          fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
      </svg>
      <span className="font-black text-slate-800 text-base leading-none">%{score}</span>
    </div>
  );
}

function MatchCard({ report, index }: { report: MatchedReport; index: number }) {
  const isHighScore = report.matchScore >= 90;
  const isMedScore  = report.matchScore >= 75;

  return (
    <div className={`border rounded-2xl p-5 ${
      isHighScore ? "bg-emerald-50/50 border-emerald-200"
      : isMedScore ? "bg-indigo-50/50 border-indigo-200"
      : "bg-slate-50 border-slate-200"
    }`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <MatchScoreRing score={report.matchScore} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-black text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              {report.reportId}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isHighScore ? "bg-emerald-100 text-emerald-700"
              : isMedScore ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-500"
            }`}>
              {isHighScore ? "Güçlü Eşleşme" : isMedScore ? "Olası Eşleşme" : "Zayıf Eşleşme"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>📍</span>
            <span>{report.location}</span>
          </div>
          <div className="text-xs text-slate-400 font-medium mt-0.5">
            {formatDate(report.timestamp)}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 mb-4">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1.5">İhbar Açıklaması</div>
        <p className="text-sm text-slate-700 leading-relaxed">"{report.summary}"</p>
      </div>

      {/* Tags comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-xs font-black text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Eşleşen Etiketler ({report.matchedTags.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.matchedTags.map((tag) => (
              <span key={tag} className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {report.unmatchedTags.length > 0 && (
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              Eşleşmeyen Etiketler ({report.unmatchedTags.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {report.unmatchedTags.map((tag) => (
                <span key={tag} className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 line-through decoration-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match score bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
          <span>Eşleşme skoru</span>
          <span>%{report.matchScore}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isHighScore ? "bg-emerald-500"
              : isMedScore ? "bg-indigo-500"
              : "bg-amber-400"
            }`}
            style={{ width: `${report.matchScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function VakaDetailPage({ params }: { params: { id: string } }) {
  const person = mockPersons.find((p) => p.id === params.id);
  if (!person) notFound();

  const sc = statusConfig[person.status];
  const pc = priorityConfig[person.priority];
  const isActive = person.status === "Aktif";

  const sortedReports = [...person.matchedReports].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-[60vw] h-[60vw] bg-indigo-300/15 blur-[160px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[50vw] h-[50vw] bg-blue-300/10 blur-[140px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto w-full border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/logo.png" alt="Mercek Logo" width={36} height={36} className="rounded-xl shadow-md shadow-indigo-500/25" />
          <span className="font-black text-slate-800 text-lg tracking-tight">Mercek</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/vakalar" className="text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors">
            ← Tüm İlanlar
          </Link>
          {isActive && (
            <Link href="/admin" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
              Komuta'da Aç
            </Link>
          )}
        </div>
      </nav>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-10 pb-20">
        {/* Page breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold mb-8">
          <Link href="/vakalar" className="hover:text-indigo-600 transition-colors">Kayıp İlanları</Link>
          <span>›</span>
          <span className="text-slate-600 font-mono font-black">{person.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT COLUMN: Person profile (2/5) */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Identity card */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {isActive && <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-blue-400" />}
              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                    {person.id}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${sc.pulse ? "animate-pulse" : ""}`} />
                    {person.status}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                    {person.priority}
                  </span>
                  {person.hasPhoto && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                      📷 Fotoğraflı
                    </span>
                  )}
                </div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shrink-0 ${
                    isActive ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {person.initials.split(".")[0]}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-2xl">{person.name}</div>
                    <div className="text-slate-500 font-semibold">{person.gender} · {person.age} yaş</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">İlan Tarihi</div>
                    <div className="text-xs font-bold text-slate-700">
                      {formatDate(person.openedDate)}
                    </div>
                  </div>
                  {person.closedDate && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Kapanış</div>
                      <div className="text-xs font-bold text-slate-700">
                        {formatDate(person.closedDate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Physical description card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Fiziksel Özellikler</h2>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "Boy",   value: person.height },
                  { label: "Yapı",  value: person.build  },
                  { label: "Saç",   value: person.hairColor },
                  { label: "Göz",   value: person.eyeColor  },
                ].map((attr) => (
                  <div key={attr.label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">{attr.label}</div>
                    <div className="text-xs font-bold text-slate-700">{attr.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 mb-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Son Görüldüğü Kıyafet</div>
                <div className="text-xs font-semibold text-slate-700">{person.lastSeenClothing}</div>
              </div>
              {person.distinguishingFeatures && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <span className="text-amber-500 text-sm mt-0.5 shrink-0">⚠</span>
                  <div>
                    <div className="text-xs font-black text-amber-700 uppercase tracking-wide mb-0.5">Ayırt Edici Özellik</div>
                    <div className="text-xs font-semibold text-amber-800">{person.distinguishingFeatures}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Last seen card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">Son Görülme Bilgileri</h2>
              <div className="flex items-start gap-2 mb-3">
                <span className="text-slate-400 mt-0.5">📍</span>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Konum</div>
                  <div className="text-sm font-bold text-slate-800">{person.lastSeenLocation}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-5">
                <span className="text-slate-400 text-sm">📅</span>
                <span className="text-sm font-bold text-slate-800">
                  {formatShortDate(person.lastSeenDate)} · {person.lastSeenTime}
                </span>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-2">Olay Açıklaması</div>
                <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-indigo-100 pl-3">
                  {person.circumstances}
                </p>
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-4">İletişim</h2>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-black text-sm">👤</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Bildiren Kişi</div>
                  <div className="text-sm font-bold text-slate-800">{person.reportedBy}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-black text-sm">📞</span>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Telefon</div>
                  <div className="text-sm font-black text-slate-800 font-mono">{person.contactPhone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Matched reports (3/5) */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">İhbar Eşleşmeleri</h2>
                <p className="text-sm text-slate-500 font-medium mt-0.5">
                  YZ tarafından bu ilana potansiyel olarak eşleştirilmiş ihbarlar
                </p>
              </div>
              {person.matchedReports.length > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">{person.matchedReports.length}</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Eşleşme</div>
                </div>
              )}
            </div>

            {/* Match summary strip */}
            {person.matchedReports.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "En Yüksek",
                    value: `%${Math.max(...person.matchedReports.map(r => r.matchScore))}`,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                  },
                  {
                    label: "Toplam Etiket",
                    value: person.matchedReports.reduce((s, r) => s + r.matchedTags.length, 0).toString(),
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                    border: "border-indigo-100",
                  },
                  {
                    label: "İhbar Sayısı",
                    value: person.matchedReports.length.toString(),
                    color: "text-slate-700",
                    bg: "bg-slate-50",
                    border: "border-slate-200",
                  },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 text-center`}>
                    <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* No matches state */}
            {person.matchedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
                <div className="text-5xl mb-4 opacity-30">📭</div>
                <p className="font-bold text-slate-400 text-lg">Henüz eşleşen ihbar yok</p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs">
                  Bu ilana henüz YZ tarafından eşleştirilmiş bir ihbar bulunmuyor. Yeni ihbarlar geldikçe otomatik olarak analiz edilecek.
                </p>
                <Link
                  href="/ihbar"
                  className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  İhbar Bildir →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {sortedReports.map((report, i) => (
                  <MatchCard key={report.reportId} report={report} index={i} />
                ))}
              </div>
            )}

            {/* Timeline */}
            {sortedReports.length > 1 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5">Kronolojik Görünüm</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
                  <div className="flex flex-col gap-4">
                    {[...person.matchedReports]
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((report, i) => (
                        <div key={report.reportId} className="flex items-start gap-4 pl-10 relative">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-white ring-2 ${
                            report.matchScore >= 90 ? "bg-emerald-500 ring-emerald-200"
                            : report.matchScore >= 75 ? "bg-indigo-500 ring-indigo-200"
                            : "bg-amber-400 ring-amber-200"
                          }`} style={{ top: "2px" }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-black text-slate-500">{report.reportId}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                report.matchScore >= 90 ? "bg-emerald-100 text-emerald-700"
                                : report.matchScore >= 75 ? "bg-indigo-100 text-indigo-700"
                                : "bg-amber-100 text-amber-700"
                              }`}>%{report.matchScore}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">{formatDate(report.timestamp)}</div>
                            <div className="text-xs text-slate-400 mt-0.5">📍 {report.location}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
