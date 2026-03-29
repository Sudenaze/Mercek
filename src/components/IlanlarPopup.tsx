"use client";

import { useState, useEffect } from "react";
import { mockPersons } from "@/lib/mock-persons";
import { getStoredIlanlar } from "@/lib/ilan-store";

export default function IlanlarPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [kritikCount, setKritikCount] = useState(0);

  useEffect(() => {
    const stored = getStoredIlanlar();
    const storedCount = stored.length; // tüm stored ilanlar Aktif
    const mockActive = mockPersons.filter((p) => p.status === "Aktif");
    const mockKritik = mockActive.filter((p) => p.priority === "Kritik").length;

    setActiveCount(storedCount + mockActive.length);
    setKritikCount(mockKritik); // stored ilanlar Normal priority başlıyor

    const timer = setTimeout(() => setShow(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = () => {
    const el = document.getElementById("kayip-ilanlari");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setDismissed(true);
  };

  if (dismissed || activeCount === 0) return null;

  return (
    <div
      className={`fixed right-4 sm:right-6 bottom-20 z-50 transition-all duration-500 ease-out ${
        show ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200 w-52 overflow-hidden">
        {/* Red urgency header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-400 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse block" />
            <span className="font-black text-white text-xs tracking-wide">ACİL · KAYIP İLANLARI</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-black transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Count */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900">{activeCount}</span>
            <span className="text-sm font-bold text-slate-500">aktif ilan</span>
          </div>
          {kritikCount > 0 && (
            <div className="text-xs text-red-600 font-bold mt-0.5">
              {kritikCount} kritik vaka — acil ihbar bekleniyor
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="p-3">
          <button
            onClick={scrollToSection}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            📋 Kayıp İlanlarını Gör ↓
          </button>
        </div>
      </div>

      {/* Arrow pointing right (toward edge) */}
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45" />
    </div>
  );
}
