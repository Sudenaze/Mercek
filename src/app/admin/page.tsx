"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import { getStoredIhbars, StoredIhbar } from "@/lib/ihbar-store";
import { mockPersons } from "@/lib/mock-persons";

// Leaflet SSR Hatasını engellemek için dinamik import
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-bold">
      Harita Yükleniyor...
    </div>
  ),
});

// SVG placeholder fotoğraf oluşturucu (base64 data URL)
function svgPhoto(icon: string, title: string, detail: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="480" height="320" fill="${bg}"/><rect x="0" y="0" width="480" height="4" fill="${bg === "#1a2744" ? "#3b82f6" : bg === "#1a2e1a" ? "#22c55e" : bg === "#2a1a1a" ? "#ef4444" : "#a855f7"}"/><text x="240" y="118" text-anchor="middle" font-size="64" font-family="serif">${icon}</text><text x="240" y="168" text-anchor="middle" fill="white" font-weight="bold" font-size="15" font-family="sans-serif">${title}</text><text x="240" y="192" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="sans-serif">${detail}</text><text x="240" y="220" text-anchor="middle" fill="#475569" font-size="10" font-family="sans-serif">Vatandas tarafindan yuklendi · Yuz tanima uygulanmamaktadir</text></svg>`;
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

// Sabit mock ihbarlar — ID'ler mock-persons.ts matchedReports ile eşleşiyor
const mockReports = [
  {
    id: "REP-001",
    timestamp: "2026-03-27T15:55:00Z",
    location: "İstanbul, Kadıköy, Moda Sahili",
    coordinates: [40.9874, 29.0251] as [number, number],
    description:
      "Moda sahil yolunda kırmızı montlu, kısa siyah saçlı küçük bir erkek çocuğu tek başına yürüyordu. Etrafına bakmadan hızlıca ilerliyordu, kimseyle iletişim kurmuyordu. 7-8 yaşlarında görünüyordu.",
    tags: ["#kırmızı_mont", "#kadıköy_moda", "#çocuk", "#siyah_saçlı", "#8-9_yaş", "#yalnız"],
    routePredictions: [
      "Çocuğun sahil şeridini takip ederek Fenerbahçe yönüne ilerlemiş olma ihtimali yüksek.",
      "Moda Parkı ve deniz kenarı güvenlik kameraları ile sahil görevlileri acilen uyarılmalı.",
    ],
    status: "Yeni",
    hasPhoto: true,
    photoDataUrl: svgPhoto("🧒", "Kadıköy · Moda Sahil Yolu", "Kirmizi montlu ~8 yas erkek cocuk, yalniz yuruyor", "#1a2744"),
    photoName: "moda_sahili_cocuk_REP001.jpg",
  },
  {
    id: "REP-002",
    timestamp: "2026-03-27T16:10:00Z",
    location: "İstanbul, Kadıköy, Moda Çıkmazı",
    coordinates: [40.9861, 29.0238] as [number, number],
    description:
      "Kırmızı montlu küçük bir çocuk bir apartmanın girişinde bekliyordu. Kapıyı açmaya çalışıyordu, kimse yanında yoktu. Yaklaşık 8 yaşlarında, gri kapüşonlu sweatshirt giyiyordu.",
    tags: ["#kırmızı_mont", "#çocuk", "#kadıköy", "#apartman_girişi", "#gri_sweatshirt"],
    routePredictions: [
      "Çocuğun tanıdık bir adrese yönelmeye çalıştığı değerlendiriliyor; çevre sakinleri uyarılmalı.",
      "Moda Çıkmazı ve çevre sokakların güvenlik kameraları incelenmeli.",
    ],
    status: "Yeni",
    hasPhoto: true,
    photoDataUrl: svgPhoto("🏠", "Kadıköy · Moda Cıkmazı", "Apartman girisinde bekleyen kirmizi montlu cocuk", "#1a2744"),
    photoName: "moda_cikmazi_REP002.jpg",
  },
  {
    id: "REP-003",
    timestamp: "2026-01-14T08:10:00Z",
    location: "İstanbul, Üsküdar, Doğancılar",
    coordinates: [41.0231, 29.0128] as [number, number],
    description:
      "Doğancılar Parkı girişinde beyaz saçlı, bordo hırkalı yaşlı bir kadın duruyordu. Sol bileğinde sarı plastik bir bileklik vardı. Nereye gittiğini bilmediğini söyledi, çok şaşkın ve yorgun görünüyordu.",
    tags: ["#üsküdar", "#beyaz_saçlı", "#yaşlı_kadın", "#bordo_hırka", "#sarı_bilezik", "#kayıp_görünümlü"],
    routePredictions: [
      "Kişinin parktan çıkıp ana caddeye yönelmiş olabileceği değerlendiriliyor.",
      "Üsküdar iskele ve çevre eczanelerin bilgilendirilmesi önerilir.",
    ],
    status: "İnceleniyor",
    hasPhoto: true,
    photoDataUrl: svgPhoto("👵", "Üsküdar · Dogancılar Parkı", "Bordo hırkali, sari bilezikli yasli kadin", "#1a2e1a"),
    photoName: "dogancilar_yasli_kadin_REP003.jpg",
  },
  {
    id: "REP-004",
    timestamp: "2026-02-20T22:30:00Z",
    location: "İstanbul, Beyoğlu, İstiklal Caddesi",
    coordinates: [41.0335, 28.9773] as [number, number],
    description:
      "İstiklal Caddesi'nde siyah montlu, uzun açık kahverengi saçlı genç bir kadın gördüm. Telefona bakıyordu, biraz endişeli görünüyordu. İnce çerçeveli gözlük takıyordu.",
    tags: ["#siyah_mont", "#uzun_saç", "#beyoğlu", "#genç_kadın", "#gözlüklü", "#telefonda"],
    routePredictions: [
      "Kişinin İstiklal'den Tünel ya da Galata yönüne ilerlemiş olabileceği değerlendiriliyor.",
      "Çevre kafe ve mağazaların güvenlik kayıtları incelenmeli.",
    ],
    status: "İnceleniyor",
    hasPhoto: false,
    photoDataUrl: undefined as string | undefined,
    photoName: undefined as string | undefined,
  },
  {
    id: "REP-005",
    timestamp: "2026-03-28T14:25:00Z",
    location: "İstanbul, Pendik, AVM Çevresi",
    coordinates: [40.8768, 29.258] as [number, number],
    description:
      "Pendik AVM önünde kırmızı spor ceket giymiş, sarı ayakkabılı bir genç erkek yaşlı bir çiftle samimi biçimde konuşuyordu. Üzerinde turuncu bir sırt çantası vardı. Ardından birlikte yürüyerek AVM çıkışından gözden kayboldu.",
    tags: ["#kırmızı_spor_ceket", "#pendik", "#genç_erkek", "#sarı_ayakkabı", "#turuncu_çanta"],
    routePredictions: [
      "Kişinin çiftle birlikte toplu taşıma güzergahına yönelmiş olabileceği değerlendiriliyor.",
      "Pendik metro ve Marmaray istasyonları güvenlik görüntüleri incelenmeli.",
    ],
    status: "Yeni",
    hasPhoto: true,
    photoDataUrl: svgPhoto("🧑", "Pendik · AVM Çevresi", "Kirmizi spor ceket, sari ayakkabi, turuncu canta", "#2a1a1a"),
    photoName: "pendik_avm_genc_erkek_REP005.jpg",
  },
  {
    id: "REP-006",
    timestamp: "2026-03-25T11:40:00Z",
    location: "İstanbul, Beşiktaş, Çarşı Meydanı",
    coordinates: [41.0425, 29.0042] as [number, number],
    description:
      "Beşiktaş Çarşı'da lacivert kaban giyen, hafif topallayarak yürüyen yaşlı bir erkek dikkatimi çekti. Etrafına şaşkın bakıyordu, bir esnafa adres sorduğunu duydum ama anlatamadı.",
    tags: ["#beşiktaş", "#lacivert_kaban", "#yaşlı_erkek", "#topallıyor", "#şaşkın", "#adres_soruyor"],
    routePredictions: [
      "Kişinin Beşiktaş çarşısından sahil yönüne ilerlemiş olabileceği değerlendiriliyor.",
      "Çarşı esnafı ve çevre muhtarlıklar bilgilendirilmeli.",
    ],
    status: "Yeni",
    hasPhoto: true,
    photoDataUrl: svgPhoto("👴", "Besiktaş · Çarşı Meydanı", "Lacivert kabanlı, hafif topallayan yasli erkek", "#1e1a2e"),
    photoName: "besiktas_yasli_erkek_REP006.jpg",
  },
];

type ViewMode = "map" | "list" | "grouped" | "media";
type TagZone = "HEAD" | "TORSO" | "LEGS" | "OTHER";

function findMatchedVaka(reportId: string) {
  for (const person of mockPersons) {
    const match = person.matchedReports.find((r) => r.reportId === reportId);
    if (match) return { person, matchedReport: match };
  }
  return null;
}

function getTagZone(tag: string): TagZone {
  const t = tag.toLowerCase();
  if (/saç|göz|kep|şap|bere|yüz|gözlük|baş/.test(t)) return "HEAD";
  if (/mont|ceket|hırka|gömlek|bluz|sweat|tişört|yelek|kaban|üst/.test(t)) return "TORSO";
  if (/pantolon|şort|etek|ayakkabı|çizme|bot|bilezik|saat|çanta|eşofman/.test(t)) return "LEGS";
  return "OTHER";
}

interface MediaReport {
  id: string;
  timestamp: string;
  location: string;
  tags: string[];
  routePredictions: string[];
  photoDataUrl?: string;
  photoName?: string;
}

function MediaDetailModal({ report, onClose }: { report: MediaReport; onClose: () => void }) {
  const vakaMatch = findMatchedVaka(report.id);
  const tagsByZone: Record<TagZone, string[]> = { HEAD: [], TORSO: [], LEGS: [], OTHER: [] };
  report.tags.forEach((tag) => tagsByZone[getTagZone(tag)].push(tag));
  const activeZones = (["HEAD", "TORSO", "LEGS"] as const).filter((z) => tagsByZone[z].length > 0);

  const imgRef = useRef<HTMLImageElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [predictions, setPredictions] = useState<cocoSsd.DetectedObject[] | null>(null);

  const runDetection = async () => {
    if (!imgRef.current) return;
    setIsDetecting(true);
    try {
      await tf.ready();
      const model = await cocoSsd.load();
      const preds = await model.detect(imgRef.current);
      setPredictions(preds);
    } catch (e) {
      console.error("COCO-SSD Detection failed", e);
    } finally {
      setIsDetecting(false);
    }
  };

  const person = predictions?.find((p) => p.class === "person");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
              {report.id}
            </span>
            <span className="text-sm font-bold text-slate-600">Yapay Zeka Görsel Analizi</span>
            {vakaMatch && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                ⬡ {vakaMatch.person.id} · %{vakaMatch.matchedReport.matchScore} Eşleşme
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold text-lg flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row overflow-auto flex-1">
          {/* Image + WebGL annotations */}
          <div className="bg-slate-900 md:w-1/2 flex-shrink-0 flex flex-col justify-center items-center relative overflow-hidden p-4">
            <div className="relative flex items-center justify-center w-full h-full max-h-full max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={report.photoDataUrl!}
                alt={`İhbar ${report.id}`}
                className="block max-w-full max-h-[60vh] md:max-h-[75vh] w-auto h-auto rounded-lg shadow-xl"
                crossOrigin="anonymous"
                onLoad={runDetection}
              />

              {isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                  <div className="text-white font-bold bg-indigo-600 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-pulse">
                    <span className="animate-spin text-xl">⚙️</span> Nesne Tespiti (COCO-SSD)...
                  </div>
                </div>
              )}

              {predictions && !person && !isDetecting && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-xl backdrop-blur-sm whitespace-nowrap">
                  ⚠️ Fotoğrafta kişi tespit edilemedi.
                </div>
              )}

              {person && !isDetecting && imgRef.current && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox={`0 0 ${imgRef.current.naturalWidth} ${imgRef.current.naturalHeight}`}
                >
                  {activeZones.map((zoneName) => {
                    if (tagsByZone[zoneName].length === 0) return null;
                    const MathMax = Math.max;
                    const wScale = imgRef.current!.naturalWidth;
                    const hScale = imgRef.current!.naturalHeight;

                    const [px, py, pw, ph] = person.bbox;
                    let zx = px, zy = py, zw = pw, zh = ph;
                    let color = "#fff", label = "";

                    if (zoneName === "HEAD") { zy = py; zh = ph * 0.2; color = "#4f46e5"; label = "Baş/Yüz"; }
                    if (zoneName === "TORSO") { zy = py + ph * 0.2; zh = ph * 0.45; color = "#9333ea"; label = "Üst Vücut"; }
                    if (zoneName === "LEGS") { zy = py + ph * 0.65; zh = ph * 0.35; color = "#d97706"; label = "Alt Vücut"; }

                    const strokeW = MathMax(2, wScale * 0.005);
                    const boxW = MathMax(80, wScale * 0.15);
                    const boxH = MathMax(20, hScale * 0.05);
                    const textSize = MathMax(12, wScale * 0.03);
                    const tagCount = tagsByZone[zoneName].length;

                    return (
                      <g key={zoneName}>
                        <rect x={zx} y={zy} width={zw} height={zh} fill="none" stroke={color} strokeWidth={strokeW} strokeDasharray="6,4" rx="4" opacity="0.9" />
                        <rect x={zx} y={zy} width={boxW} height={boxH} fill={color} opacity="0.85" rx="4" />
                        <text x={zx + 4} y={zy + boxH * 0.7} fontSize={textSize} fill="white" fontWeight="bold">{label} • {tagCount} tag</text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
            <div className="mt-4 p-3 bg-slate-800 rounded-xl text-center w-full max-w-sm">
              <p className="text-xs text-slate-400 font-medium">TensorFlow.js & COCO-SSD İle Gerçek Zamanlı Tespit</p>
            </div>
          </div>

          {/* Analysis panel */}
          <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col gap-5">
            {/* Vaka match */}
            {vakaMatch ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                <h4 className="text-indigo-800 font-extrabold text-sm mb-3 flex items-center gap-2">🎯 Eşleşen Vaka</h4>
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0e7ff" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4f46e5" strokeWidth="3"
                        strokeDasharray={`${vakaMatch.matchedReport.matchScore} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-indigo-700">
                      %{vakaMatch.matchedReport.matchScore}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">{vakaMatch.person.id}</span>
                      <span className="text-sm font-bold text-indigo-900">{vakaMatch.person.name}</span>
                    </div>
                    <div className="text-xs text-indigo-500 font-medium mb-2">{vakaMatch.person.lastSeenLocation}</div>
                    <div className="flex flex-wrap gap-1">
                      {vakaMatch.matchedReport.matchedTags.map((t) => (
                        <span key={t} className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold">{t}</span>
                      ))}
                      {vakaMatch.matchedReport.unmatchedTags.map((t) => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded line-through">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <p className="text-slate-400 text-sm font-bold">Kayıtlı vaka eşleşmesi bulunamadı</p>
              </div>
            )}

            {/* Tags by zone */}
            <div>
              <h4 className="text-slate-700 font-extrabold text-sm mb-3">🏷️ Bölgesel Etiket Analizi</h4>
              {(["HEAD", "TORSO", "LEGS", "OTHER"] as TagZone[]).map((zone) => {
                if (tagsByZone[zone].length === 0) return null;
                const styles: Record<TagZone, { label: string; chip: string; title: string }> = {
                  HEAD: { label: "Baş / Yüz", chip: "bg-indigo-50 text-indigo-700 border border-indigo-200", title: "text-indigo-600" },
                  TORSO: { label: "Üst Vücut", chip: "bg-purple-50 text-purple-700 border border-purple-200", title: "text-purple-600" },
                  LEGS: { label: "Alt Vücut / Ayak", chip: "bg-amber-50 text-amber-700 border border-amber-200", title: "text-amber-600" },
                  OTHER: { label: "Genel", chip: "bg-slate-100 text-slate-600 border border-slate-200", title: "text-slate-500" },
                };
                const s = styles[zone];
                return (
                  <div key={zone} className="mb-3">
                    <div className={`text-xs font-black uppercase tracking-widest mb-1.5 ${s.title}`}>{s.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {tagsByZone[zone].map((tag) => (
                        <span key={tag} className={`text-xs font-bold px-2.5 py-1 rounded-md ${s.chip}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Route predictions */}
            {report.routePredictions && report.routePredictions.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/30 border border-indigo-100 rounded-xl p-4">
                <h4 className="flex items-center gap-2 text-indigo-800 font-extrabold text-sm mb-3">
                  <span className="animate-pulse">🤖</span> Güzergah Analizi
                </h4>
                <ul className="space-y-2">
                  {report.routePredictions.map((pred, i) => (
                    <li key={i} className="text-indigo-700 text-sm font-semibold flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5 flex-shrink-0">↳</span>
                      <span>{pred}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta */}
            <div className="flex gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Konum</div>
                <div className="font-bold text-slate-700 text-xs">{report.location}</div>
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Zaman</div>
                <div className="font-bold text-slate-700 text-xs">
                  {new Date(report.timestamp).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PhotoModalProps {
  dataUrl: string;
  name: string;
  reportId: string;
  onClose: () => void;
}

function PhotoModal({ dataUrl, name, reportId, onClose }: PhotoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <div className="font-black text-slate-800 text-base">İhbar Fotoğrafı</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {reportId}
              </span>
              <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors text-lg"
          >
            ✕
          </button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt={`İhbar fotoğrafı - ${reportId}`}
          className="w-full max-h-[60vh] object-contain bg-slate-50"
        />
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium text-center">
            Bu fotoğraf vatandaş tarafından ihbarla birlikte sisteme yüklendi. Yüz tanıma uygulanmamaktadır.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [showNotification, setShowNotification] = useState(false);
  const [storedIhbars, setStoredIhbars] = useState<StoredIhbar[]>([]);
  const [photoModal, setPhotoModal] = useState<{ dataUrl: string; name: string; reportId: string } | null>(null);
  const [mediaDetailModal, setMediaDetailModal] = useState<MediaReport | null>(null);

  useEffect(() => {
    setStoredIhbars(getStoredIhbars());
    const timer = setTimeout(() => setShowNotification(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  // localStorage'daki ihbarların güncel yüklenmesi (sayfa odaklandığında)
  useEffect(() => {
    const onFocus = () => setStoredIhbars(getStoredIhbars());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Tüm ihbarlar = mock + localStorage'dakiler
  const allReports = [
    ...storedIhbars.map((s) => ({
      ...s,
      coordinates: s.coordinates || ([41.015, 28.979] as [number, number]),
    })),
    ...mockReports,
  ];

  const totalReports = allReports.length;
  const newReports = allReports.filter((r) => r.status === "Yeni").length;
  const reviewingReports = allReports.filter((r) => r.status === "İnceleniyor").length;
  const photoReports = allReports.filter((r) => r.hasPhoto && r.photoDataUrl);

  const getGroupedReports = () => {
    const allTags = new Set<string>();
    allReports.forEach((r) => r.tags.forEach((t) => allTags.add(t)));

    return Array.from(allTags)
      .map((tag) => ({ tag, reports: allReports.filter((r) => r.tags.includes(tag)) }))
      .filter((g) => g.reports.length > 1)
      .sort((a, b) => b.reports.length - a.reports.length);
  };

  const groupedReports = getGroupedReports();

  // Vaka bazlı tahmini rotalar: son görülme → ihbarlar (kronolojik)
  const STATUS_COLORS: Record<string, string> = {
    "Aktif": "#ef4444",
    "Bulundu": "#10b981",
    "Kapatıldı": "#94a3b8",
  };

  const vakaRoutes = mockPersons
    .filter((p) => p.matchedReports.length >= 1)
    .map((person) => {
      const sortedMatches = [...person.matchedReports].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const waypoints: [number, number][] = [person.coordinates];
      const linkedReportIds: string[] = [];

      for (const match of sortedMatches) {
        const rep = allReports.find((r) => r.id === match.reportId);
        if (rep?.coordinates) {
          waypoints.push(rep.coordinates as [number, number]);
          linkedReportIds.push(match.reportId);
        }
      }

      return {
        vakaId: person.id,
        personName: person.name,
        status: person.status,
        color: STATUS_COLORS[person.status] ?? "#6366f1",
        startCoord: person.coordinates,
        positions: waypoints,
        linkedReportIds,
        matchCount: person.matchedReports.length,
      };
    })
    .filter((r) => r.positions.length > 1);

  const renderReportCard = (report: (typeof allReports)[0]) => (
    <div
      key={report.id}
      className="bg-white border border-slate-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition-all drop-shadow-sm"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
            {report.id}
          </span>
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-bold shadow-sm ${report.status === "Yeni"
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
              }`}
          >
            {report.status}
          </span>
          {report.hasPhoto && (
            <button
              onClick={() =>
                report.photoDataUrl
                  ? setPhotoModal({ dataUrl: report.photoDataUrl!, name: report.photoName || report.id, reportId: report.id })
                  : undefined
              }
              className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm border transition-colors ${report.photoDataUrl
                  ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer"
                  : "bg-slate-50 text-slate-400 border-slate-200 cursor-default"
                }`}
            >
              📷 Fotoğraflı
              {report.photoDataUrl && (
                <span className="text-purple-400 text-xs">→ Görüntüle</span>
              )}
            </button>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded mb-1">
            📍 {report.location || "Konum Belirsiz"}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {new Date(report.timestamp).toLocaleString("tr-TR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <p className="text-slate-700 text-base leading-relaxed mb-5 font-medium border-l-4 border-slate-200 pl-4">
        "{report.description}"
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {report.tags.map((tag: string) => (
          <span key={tag} className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md">
            {tag}
          </span>
        ))}
      </div>

      {report.routePredictions && report.routePredictions.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-indigo-50/50 to-blue-50/30 border border-indigo-100 rounded-xl">
          <h4 className="flex items-center gap-2 text-indigo-800 font-extrabold text-sm mb-3">
            <span className="text-lg animate-pulse">🤖</span> Yapay Zeka Güzergah Analizi
          </h4>
          <ul className="list-none space-y-2">
            {report.routePredictions.map((pred: string, i: number) => (
              <li key={i} className="text-indigo-700 text-sm font-semibold flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">↳</span>
                <span>{pred}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen p-8 max-w-7xl mx-auto bg-slate-50 relative overflow-hidden">
      {/* Photo modal */}
      {photoModal && (
        <PhotoModal
          dataUrl={photoModal.dataUrl}
          name={photoModal.name}
          reportId={photoModal.reportId}
          onClose={() => setPhotoModal(null)}
        />
      )}
      {/* Media detail modal */}
      {mediaDetailModal && (
        <MediaDetailModal report={mediaDetailModal} onClose={() => setMediaDetailModal(null)} />
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-8 right-8 z-40 bg-white border border-emerald-200 shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] rounded-2xl p-5 w-80 animate-fade-in group hover:shadow-[0_15px_50px_-10px_rgba(16,185,129,0.4)] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-sm tracking-wide">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              SİSTEM UYARISI
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-bold p-1"
            >
              ✕
            </button>
          </div>
          <h4 className="font-extrabold text-slate-800 mb-1.5 text-base">Eşleşen Yeni İhbar Saptandı!</h4>
          <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
            <span className="font-bold text-slate-700">Moda Sahili</span> bölgesinden{" "}
            <span className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded">#kırmızı_mont</span> etiketiyle
            güçlü bir eşleşme tespit edildi.
          </p>
          <button
            onClick={() => setViewMode("map")}
            className="w-full bg-emerald-50 text-emerald-700 font-bold py-2.5 rounded-xl text-sm hover:bg-emerald-100 transition-colors border border-emerald-100"
          >
            Haritada Analizi Gör →
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-slate-200 pb-6 gap-4">
        <div>
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors w-fit flex items-center gap-2 mb-4 bg-indigo-50 px-4 py-1.5 rounded-full shadow-sm border border-indigo-100 text-sm"
          >
            ← Ana Sayfaya Dön
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Komuta Merkezi</h1>
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 font-black text-xs">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Yetkili Paneli
            </span>
          </div>
          <p className="text-slate-400 font-semibold text-base">Anlık Saha Akışı & Yapay Zeka Rota Çıkarımları</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vakalar"
            className="text-sm px-4 py-2.5 bg-white rounded-xl text-indigo-600 font-bold border border-indigo-100 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            📋 Kayıp İlanları
          </Link>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-black text-sm shadow-sm hover:shadow-md transition-shadow">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Anlık Analiz Aktif
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Sidebar stats */}
        <aside className="col-span-1 border border-slate-200 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 h-fit animate-fade-in">
          <h2 className="font-black text-lg border-b border-slate-100 pb-4 mb-6 text-slate-800">Saha Durumu</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-indigo-600 mb-2">{totalReports}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Toplam İhbar</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-amber-600 mb-2">{newReports}</div>
              <div className="text-xs text-amber-700 uppercase tracking-widest font-bold">Yeni </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl font-black text-emerald-600 mb-2">{reviewingReports}</div>
              <div className="text-xs text-emerald-700 uppercase tracking-widest font-bold">Sahaya İletildi</div>
            </div>
            {photoReports.length > 0 && (
              <button
                onClick={() => setViewMode("media")}
                className="bg-purple-50 border border-purple-200 p-5 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:bg-purple-100"
              >
                <div className="text-5xl font-black text-purple-600 mb-2">{photoReports.length}</div>
                <div className="text-xs text-purple-700 uppercase tracking-widest font-bold">Fotoğraflı</div>
              </button>
            )}
          </div>
        </aside>

        {/* Main section */}
        <section className="col-span-1 lg:col-span-3 border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 animate-fade-in delay-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
            <h2 className="font-black text-2xl text-slate-800">İhbarlar & YZ Tahminleri</h2>
            <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto shadow-inner">
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${viewMode === "map" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-500 hover:text-slate-800 hover:bg-white"
                  }`}
              >
                🌍 Harita
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-500 hover:text-slate-800 hover:bg-white"
                  }`}
              >
                Akış
              </button>
              <button
                onClick={() => setViewMode("grouped")}
                className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${viewMode === "grouped" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-slate-500 hover:text-slate-800 hover:bg-white"
                  }`}
              >
                Örüntü 🎯
              </button>
              <button
                onClick={() => setViewMode("media")}
                className={`flex-1 sm:flex-none px-4 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${viewMode === "media" ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "text-slate-500 hover:text-slate-800 hover:bg-white"
                  }`}
              >
                📷 Medya
                {photoReports.length > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-black ${viewMode === "media" ? "bg-purple-500/50 text-white" : "bg-purple-100 text-purple-600"
                    }`}>
                    {photoReports.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* MAP */}
            {viewMode === "map" && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
                  <span className="text-3xl mt-1 opacity-90 drop-shadow-sm">🗺️</span>
                  <div>
                    <h3 className="text-indigo-800 font-extrabold text-base mb-1">Yapay Zeka Destekli Saha Haritası</h3>
                    <p className="text-indigo-600 font-medium text-xs leading-relaxed max-w-2xl">
                      Sistemdeki vakaların coğrafi dağılımı ve yapay zeka tarafından hesaplanan olası hareket
                      algoritmaları (
                      <span className="font-bold text-emerald-600">yeşil kesik çizgili rota</span>). Tıklayarak
                      detayları görebilirsiniz.
                    </p>
                  </div>
                </div>
                <div className="border-4 border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden bg-slate-100 w-full min-h-[500px] sm:min-h-[600px] relative z-0">
                  <MapComponent reports={allReports} groups={groupedReports} vakaRoutes={vakaRoutes} />
                </div>
              </div>
            )}

            {/* LIST */}
            {viewMode === "list" && allReports.map(renderReportCard)}

            {/* GROUPED */}
            {viewMode === "grouped" && (
              <div className="flex flex-col gap-6">
                {groupedReports.length > 0 ? (
                  groupedReports.map((group) => (
                    <div key={group.tag} className="border-2 border-emerald-200 bg-emerald-50/50 rounded-3xl p-6 shadow-sm">
                      <h3 className="text-emerald-800 font-extrabold text-xl mb-5 flex md:items-center flex-col md:flex-row gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl drop-shadow-sm">🔗</span>
                          Örtüşen Vaka Serisi:
                        </div>
                        <span className="bg-emerald-200 px-4 py-1.5 rounded-lg text-emerald-900 border border-emerald-300 shadow-sm">
                          {group.tag}
                        </span>
                        <span className="text-sm font-bold text-emerald-600 md:ml-2 bg-white px-3 py-1 rounded-full border border-emerald-100">
                          {group.reports.length} İhbar Bağlantılı
                        </span>
                      </h3>
                      <div className="flex flex-col gap-5 pl-4 md:pl-8 border-l-4 border-emerald-300/50">
                        {group.reports.map(renderReportCard)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl font-bold bg-slate-50 flex flex-col items-center gap-3">
                    <span className="text-4xl opacity-50">🔍</span>
                    Şu an için ortak örüntü veya bağlantılı güzergah tespit edilemedi.
                  </div>
                )}
              </div>
            )}

            {/* MEDIA GALLERY */}
            {viewMode === "media" && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
                  <span className="text-2xl">📷</span>
                  <div>
                    <h3 className="font-extrabold text-purple-800 text-sm mb-0.5">İhbar Medya Arşivi</h3>
                    <p className="text-purple-600 text-xs font-medium leading-relaxed">
                      Vatandaşlar tarafından ihbarlarla birlikte yüklenen fotoğraflar. Yüz tanıma uygulanmamaktadır.
                    </p>
                  </div>
                </div>

                {photoReports.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                    <div className="text-5xl mb-4 opacity-30">🖼️</div>
                    <p className="font-bold text-slate-400 text-lg">Henüz fotoğraflı ihbar yok</p>
                    <p className="text-slate-400 text-sm mt-1 max-w-xs">
                      Vatandaşlar ihbar oluştururken fotoğraf yüklediğinde burada görünecek.
                    </p>
                    <Link
                      href="/ihbar"
                      className="mt-6 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      İhbar Oluştur →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {photoReports.map((report) => {
                      const vakaMatch = findMatchedVaka(report.id);
                      return (
                        <div key={report.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all">
                          <div className="flex">
                            {/* Thumbnail */}
                            <div className="relative w-36 sm:w-48 flex-shrink-0 bg-slate-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={report.photoDataUrl!}
                                alt={`İhbar ${report.id}`}
                                className="w-full h-full object-cover min-h-[140px]"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="font-mono text-xs font-black bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
                                  {report.id}
                                </span>
                              </div>
                            </div>
                            {/* Info */}
                            <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
                              <div className="flex items-start justify-between gap-2 flex-wrap">
                                <div className="flex flex-wrap items-center gap-2">
                                  {vakaMatch ? (
                                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 flex items-center gap-1">
                                      🎯 {vakaMatch.person.id} · %{vakaMatch.matchedReport.matchScore} Eşleşme
                                    </span>
                                  ) : (
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                                      Vaka eşleşmesi yok
                                    </span>
                                  )}
                                  {vakaMatch && (
                                    <span className="text-xs font-bold text-slate-600">{vakaMatch.person.name}</span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                  {new Date(report.timestamp).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <div className="text-xs text-slate-500 font-medium">📍 {report.location}</div>
                              {/* Tags preview */}
                              <div className="flex flex-wrap gap-1">
                                {report.tags.slice(0, 5).map((tag) => (
                                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md font-bold">{tag}</span>
                                ))}
                                {report.tags.length > 5 && (
                                  <span className="text-xs text-slate-400 font-bold px-1">+{report.tags.length - 5}</span>
                                )}
                              </div>
                              {/* Route prediction preview */}
                              {report.routePredictions?.[0] && (
                                <p className="text-xs text-indigo-600 font-medium leading-relaxed">
                                  <span className="text-indigo-400">↳</span> {report.routePredictions[0]}
                                </p>
                              )}
                              <button
                                onClick={() => setMediaDetailModal(report as MediaReport)}
                                className="mt-auto self-start px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors"
                              >
                                Detaylı Görüntüle →
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
