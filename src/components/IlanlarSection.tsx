"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { mockPersons, MissingPerson } from "@/lib/mock-persons";
import { getStoredIlanlar, StoredIlan } from "@/lib/ilan-store";

function storedIlanToMissingPerson(ilan: StoredIlan): MissingPerson {
  const words = ilan.name.trim().split(/\s+/);
  const initials = words.map((w) => w[0]?.toUpperCase() ?? "").join(".") + ".";
  return {
    id: ilan.id, name: ilan.name, initials, age: ilan.age, gender: ilan.gender,
    hasPhoto: ilan.hasPhoto, height: ilan.height || "—", build: ilan.build || "—",
    hairColor: ilan.hairColor || "—", eyeColor: ilan.eyeColor || "—",
    distinguishingFeatures: ilan.distinguishingFeatures || "",
    lastSeenClothing: ilan.lastSeenClothing || "—",
    lastSeenDate: ilan.lastSeenDate, lastSeenTime: ilan.lastSeenTime || "—",
    lastSeenLocation: ilan.lastSeenLocation, coordinates: [41.0082, 28.9784],
    circumstances: ilan.circumstances, reportedBy: ilan.reportedBy,
    contactPhone: ilan.contactPhone, status: "Aktif", priority: "Normal",
    openedDate: ilan.timestamp, matchedReports: [],
  };
}

function formatShortDate(dateStr: string) {
  if (!dateStr || !dateStr.includes("-")) return dateStr;
  const [y, m, d] = dateStr.split("-");
  const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

const priorityConfig = {
  Kritik: { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-100",    dot: "bg-red-500",    pulse: true  },
  Yüksek: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", dot: "bg-orange-500", pulse: false },
  Normal: { bg: "bg-slate-50",  text: "text-slate-500",  border: "border-slate-200",  dot: "bg-slate-400",  pulse: false },
};

const statusConfig = {
  Aktif:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",  dot: "bg-amber-500"   },
  Bulundu:   { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  Kapatıldı: { bg: "bg-slate-100",  text: "text-slate-500",   border: "border-slate-200",  dot: "bg-slate-400"   },
};

// ─── Detail Modal ────────────────────────────────────────────────────────────

function IlanModal({
  person,
  photoDataUrl,
  onClose,
}: {
  person: MissingPerson;
  photoDataUrl?: string;
  onClose: () => void;
}) {
  const sc = statusConfig[person.status];
  const pc = priorityConfig[person.priority];

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* ── LEFT: Details (3/5) ── */}
          <div className="md:col-span-3 flex flex-col">
            {/* Header area */}
            <div className="bg-slate-50 rounded-tl-3xl rounded-tr-3xl md:rounded-tr-none p-6 border-b border-slate-200">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                  {person.id}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {person.status}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                  {person.priority}
                </span>
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 border-2 border-indigo-200 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0">
                  {person.initials.split(".")[0]}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-2xl leading-tight">{person.name}</div>
                  <div className="text-sm text-slate-500 font-semibold mt-0.5">{person.gender} · {person.age} yaş</div>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    Bildiren: {person.reportedBy} · {person.contactPhone}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              {/* Physical description */}
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Fiziksel Özellikler</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Boy",  value: person.height   },
                    { label: "Yapı", value: person.build    },
                    { label: "Saç",  value: person.hairColor },
                    { label: "Göz",  value: person.eyeColor  },
                  ].map((a) => (
                    <div key={a.label} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">{a.label}</div>
                      <div className="text-xs font-bold text-slate-700">{a.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distinguishing features */}
              {person.distinguishingFeatures && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-3">
                  <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                  <div>
                    <div className="text-xs font-black text-amber-700 uppercase tracking-wide mb-0.5">Ayırt Edici Özellik</div>
                    <div className="text-xs font-semibold text-amber-800">{person.distinguishingFeatures}</div>
                  </div>
                </div>
              )}

              {/* Last seen clothing */}
              {person.lastSeenClothing && person.lastSeenClothing !== "—" && (
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Son Görülen Kıyafet</div>
                  <div className="text-sm text-slate-700 font-medium bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    {person.lastSeenClothing}
                  </div>
                </div>
              )}

              {/* Last seen */}
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Son Görülme</div>
                <div className="flex items-start gap-1.5 text-sm font-bold text-slate-700 mb-1">
                  <span className="text-slate-400">📍</span>
                  {person.lastSeenLocation}
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  {formatShortDate(person.lastSeenDate)}
                  {person.lastSeenTime && person.lastSeenTime !== "—" ? ` · ${person.lastSeenTime}` : ""}
                </div>
              </div>

              {/* Circumstances */}
              <div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">Koşullar</div>
                <p className="text-sm text-slate-600 leading-relaxed border-l-4 border-indigo-100 pl-3">
                  {person.circumstances}
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Photo + CTAs (2/5) ── */}
          <div className="md:col-span-2 flex flex-col bg-slate-50 rounded-bl-3xl rounded-br-3xl md:rounded-bl-none md:rounded-tr-3xl md:rounded-br-3xl border-t md:border-t-0 md:border-l border-slate-200 overflow-hidden">
            {/* Photo */}
            <div className="flex-1 relative min-h-48">
              {photoDataUrl ? (
                <img
                  src={photoDataUrl}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  style={{ minHeight: "240px" }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-48 gap-3 p-6">
                  <div className="w-24 h-24 bg-indigo-100 text-indigo-500 border-2 border-indigo-200 rounded-3xl flex items-center justify-center font-black text-4xl">
                    {person.initials.split(".")[0]}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {person.hasPhoto ? "Fotoğraf Mevcut" : "Fotoğraf Yok"}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {person.hasPhoto
                        ? "Yetkili panelinden görüntülenebilir"
                        : "Aile fotoğraf eklememiş"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="p-5 flex flex-col gap-3 border-t border-slate-200">
              <Link
                href="/ihbar"
                className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-indigo-500/20"
              >
                📡 Bu Kişiyle İlgili İhbar Bildir
              </Link>
              <Link
                href="/vakalar"
                className="flex items-center justify-center gap-1.5 py-2.5 text-slate-400 hover:text-slate-600 text-xs font-semibold transition-colors"
              >
                Tüm İlanları Gör
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function IlanlarSection() {
  const [persons, setPersons] = useState<MissingPerson[]>([]);
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<MissingPerson | null>(null);

  useEffect(() => {
    const stored = getStoredIlanlar();
    const map: Record<string, string> = {};
    stored.forEach((s) => { if (s.photoDataUrl) map[s.id] = s.photoDataUrl; });
    setPhotoMap(map);

    const all = [...stored.map(storedIlanToMissingPerson), ...mockPersons];
    const active = all.filter((p) => p.status === "Aktif");
    const order = { Kritik: 0, Yüksek: 1, Normal: 2 };
    active.sort((a, b) => order[a.priority] - order[b.priority]);
    setPersons(active.slice(0, 3));
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  if (persons.length === 0) return null;

  const kritikCount = persons.filter((p) => p.priority === "Kritik").length;

  return (
    <>
      <section id="kayip-ilanlari" className="relative z-10 px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-bold mb-3 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {kritikCount > 0 ? `${kritikCount} Kritik Vaka` : "Aktif Vakalar"}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-1">
                Güncel Kayıp İlanları
              </h2>
              <p className="text-slate-500 text-sm font-medium max-w-lg">
                Aşağıdaki kişiler için tanık ihbarı bekleniyor. Bir ipucunuz varsa lütfen bildirin.
              </p>
            </div>
            <Link
              href="/vakalar"
              className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Tüm İlanlar →
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {persons.map((p) => {
              const pc = priorityConfig[p.priority];
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group flex flex-col"
                >
                  {p.priority === "Kritik" && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-400" />
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${pc.bg} ${pc.text} ${pc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pc.dot} ${pc.pulse ? "animate-pulse" : ""}`} />
                      {p.priority}
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">{p.id}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl flex items-center justify-center font-black text-base shrink-0">
                      {p.initials.split(".")[0]}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm leading-tight">{p.name}</div>
                      <div className="text-xs text-slate-500 font-semibold mt-0.5">{p.age} yaş · {p.gender}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-600 font-semibold mb-1">
                    <span className="text-slate-400 shrink-0">📍</span>
                    <span className="line-clamp-1">{p.lastSeenLocation}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium mb-3">
                    {formatShortDate(p.lastSeenDate)}
                    {p.lastSeenTime && p.lastSeenTime !== "—" ? ` · ${p.lastSeenTime}` : ""}
                  </div>

                  {p.distinguishingFeatures && (
                    <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2 font-medium mb-4 line-clamp-2">
                      ⚠ {p.distinguishingFeatures}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => setSelected(p)}
                      className="flex-1 flex items-center justify-center py-2 bg-slate-800 group-hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Detaylı Gör →
                    </button>
                    <Link
                      href="/ihbar"
                      className="flex items-center justify-center px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition-colors border border-indigo-100"
                    >
                      İhbar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400 font-medium">
            Bir şey gördünüz mü?{" "}
            <Link href="/ihbar" className="text-indigo-600 font-bold hover:underline">
              Hemen ihbar bildirin →
            </Link>
          </p>
        </div>
      </section>

      {/* Modal */}
      {selected && (
        <IlanModal
          person={selected}
          photoDataUrl={photoMap[selected.id]}
          onClose={closeModal}
        />
      )}
    </>
  );
}
