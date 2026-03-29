"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const iconDefault = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function createStartIcon(color: string) {
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;
      background:${color};
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 3px ${color}55, 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function createReportIcon(color: string) {
  return L.divIcon({
    html: `<div style="
      width:12px;height:12px;
      background:white;
      border:2.5px solid ${color};
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.3);
    "></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

interface VakaRoute {
  vakaId: string;
  personName: string;
  status: string;
  color: string;
  startCoord: [number, number];
  positions: [number, number][];
  linkedReportIds: string[];
  matchCount: number;
}

export default function MapComponent({
  reports,
  groups,
  vakaRoutes = [],
}: {
  reports: any[];
  groups: any[];
  vakaRoutes?: VakaRoute[];
}) {
  useEffect(() => {
    L.Marker.prototype.options.icon = iconDefault;
  }, []);

  // Hangi report hangi vakaya bağlı?
  const reportToVaka: Record<string, VakaRoute> = {};
  vakaRoutes.forEach((vr) => {
    vr.linkedReportIds.forEach((rid) => {
      reportToVaka[rid] = vr;
    });
  });

  return (
    <MapContainer
      center={[41.0082, 29.015]}
      zoom={12}
      className="w-full h-full min-h-[500px] z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Vaka tahmini rotaları */}
      {vakaRoutes.map((vr) => (
        <Polyline
          key={`vaka-route-${vr.vakaId}`}
          positions={vr.positions}
          pathOptions={{
            color: vr.color,
            weight: 4,
            dashArray: "10, 8",
            opacity: 0.85,
          }}
        />
      ))}

      {/* Vakaya ait son görülme (başlangıç) marker'ları */}
      {vakaRoutes.map((vr) => (
        <Marker
          key={`start-${vr.vakaId}`}
          position={vr.startCoord}
          icon={createStartIcon(vr.color)}
        >
          <Popup>
            <div className="font-sans min-w-[200px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: vr.color }}
                />
                <strong className="text-sm" style={{ color: vr.color }}>
                  {vr.vakaId}
                </strong>
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                  {vr.status}
                </span>
              </div>
              <p className="font-bold text-slate-800 mb-1">{vr.personName}</p>
              <p className="text-xs text-slate-500 mb-2">⭐ Son görülme noktası</p>
              <p className="text-xs text-slate-600">
                {vr.matchCount} ihbar bağlı · rota {vr.positions.length - 1} nokta
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* İhbar marker'ları */}
      {reports.map((report) => {
        if (!report.coordinates) return null;
        const linked = reportToVaka[report.id];
        return linked ? (
          <Marker
            key={report.id}
            position={report.coordinates}
            icon={createReportIcon(linked.color)}
          >
            <Popup>
              <div className="font-sans min-w-[200px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <strong className="text-indigo-600 text-base">{report.id}</strong>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {report.status}
                  </span>
                </div>
                <div
                  className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1"
                  style={{ background: linked.color + "22", color: linked.color }}
                >
                  ↔ {linked.vakaId} · {linked.personName}
                </div>
                <p className="text-xs font-bold text-slate-700 mb-1 border-b border-slate-200 pb-1">
                  📍 {report.location}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &quot;{report.description}&quot;
                </p>
                {report.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.tags.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ) : (
          <Marker key={report.id} position={report.coordinates} icon={iconDefault}>
            <Popup>
              <div className="font-sans min-w-[200px]">
                <strong className="text-indigo-600 block mb-1 text-base">
                  {report.id}{" "}
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-1">
                    {report.status}
                  </span>
                </strong>
                <p className="text-xs font-bold text-slate-700 mb-2 border-b border-slate-200 pb-1">
                  📍 {report.location}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &quot;{report.description}&quot;
                </p>
                {report.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {report.tags.map((t: string) => (
                      <span
                        key={t}
                        className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Etiket tabanlı grup çizgileri (arka plan, daha soluk) */}
      {groups.map((group, index) => {
        const coords = group.reports
          .filter((r: any) => r.coordinates)
          .map((r: any) => r.coordinates);
        if (coords.length > 1) {
          return (
            <Polyline
              key={`group-${index}`}
              positions={coords}
              pathOptions={{
                color: "#94a3b8",
                weight: 2,
                dashArray: "4, 8",
                opacity: 0.4,
              }}
            />
          );
        }
        return null;
      })}

      {/* Lejant */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 12,
          zIndex: 1000,
          background: "white",
          borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          fontSize: 11,
          fontWeight: 700,
          maxWidth: 200,
        }}
      >
        <div style={{ marginBottom: 6, color: "#475569", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 10 }}>
          Rota Lejandı
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <div style={{ width: 22, height: 3, background: "#ef4444", borderRadius: 2 }} />
          <span style={{ color: "#374151" }}>Aktif vaka rotası</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <div style={{ width: 22, height: 3, background: "#10b981", borderRadius: 2 }} />
          <span style={{ color: "#374151" }}>Bulundu rotası</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <div style={{ width: 22, height: 3, background: "#94a3b8", borderRadius: 2 }} />
          <span style={{ color: "#374151" }}>Kapatıldı / Grup</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#ef4444", borderRadius: "50%", border: "2px solid white", flexShrink: 0 }} />
          <span style={{ color: "#374151" }}>Son görülme noktası</span>
        </div>
      </div>
    </MapContainer>
  );
}
