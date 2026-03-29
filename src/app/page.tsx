import Link from "next/link";
import IlanlarSection from "@/components/IlanlarSection";
import IlanlarPopup from "@/components/IlanlarPopup";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="fixed top-0 left-0 w-[70vw] h-[70vw] bg-indigo-300/20 blur-[160px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="fixed bottom-0 right-0 w-[70vw] h-[70vw] bg-blue-300/20 blur-[160px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3" />
      <div className="fixed top-1/2 left-1/2 w-[40vw] h-[40vw] bg-cyan-200/10 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-black text-lg">M</span>
          </div>
          <span className="font-black text-slate-800 text-xl tracking-tight">Mercek</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#nasil-calisir" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
            Nasıl Çalışır?
          </a>
          <Link href="/vakalar" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
            Kayıp İlanları
          </Link>
          <Link href="/ihbar" className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors">
            İhbar Bildir
          </Link>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 font-bold text-sm shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Sistem Aktif
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 md:px-10 pt-16 pb-28 max-w-5xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50/80 text-indigo-600 text-sm font-semibold mb-10 animate-fade-in shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Yapay Zeka Destekli Erken Müdahale Platformu
        </div>

        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-800 via-blue-600 to-cyan-500 animate-fade-in delay-100 pb-3 leading-none">
          Mercek
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-600 tracking-tight mt-4 animate-fade-in delay-100">
          Dijital Komuta Merkezi
        </h2>

        <p className="text-lg md:text-xl text-slate-500 mt-6 mb-12 max-w-2xl leading-relaxed animate-fade-in delay-200 font-medium">
          Kayıp vakalarında{" "}
          <span className="text-indigo-600 font-bold">ilk 72 saatteki</span> bilgi
          kirliliğini önlemek için geliştirilmiş, sivil ihbarları yapay zeka ile
          eş zamanlı analiz eden modern yönetim platformu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl animate-fade-in delay-200">
          {/* İhbar */}
          <Link
            href="/ihbar"
            className="group flex flex-col items-start text-left p-6 bg-gradient-to-br from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_18px_40px_-10px_rgba(79,70,229,0.65)] hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="text-3xl mb-3 relative z-10">📡</span>
            <div className="font-black text-white text-base mb-1 relative z-10">İhbar Bildir</div>
            <div className="text-indigo-100 text-xs leading-relaxed font-medium relative z-10">
              Kayıp biriyle ilgili bir şey gördünüz mü? Hemen bildirin.
            </div>
          </Link>

          {/* İlan Ver */}
          <Link
            href="/ilan-ver"
            className="flex flex-col items-start text-left p-6 bg-gradient-to-br from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-white rounded-2xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(245,158,11,0.4)] hover:shadow-[0_18px_40px_-10px_rgba(245,158,11,0.55)] hover:-translate-y-1"
          >
            <span className="text-3xl mb-3">📋</span>
            <div className="font-black text-white text-base mb-1">Kayıp İlanı Ver</div>
            <div className="text-amber-100 text-xs leading-relaxed font-medium">
              Sevdiğiniz biri kayıp mı? Detaylı ilan oluşturun.
            </div>
          </Link>

          {/* Yetkili */}
          <Link
            href="/admin"
            className="flex flex-col items-start text-left p-6 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl transition-all duration-300 border border-slate-200 hover:border-indigo-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            <span className="text-3xl mb-3">🎯</span>
            <div className="font-black text-slate-800 text-base mb-1">Yetkili Paneli</div>
            <div className="text-slate-500 text-xs leading-relaxed font-medium">
              Arama ekipleri için koordinasyon ve analiz merkezi.
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm border-y border-slate-200 py-8 px-6 animate-fade-in delay-300">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 md:gap-16">
          {[
            { value: "72 Saat", label: "Kritik Müdahale Penceresi" },
            { value: "Anlık", label: "Yapay Zeka Analizi" },
            { value: "Sıfır", label: "Yüz Tanıma Kullanımı" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-4xl font-black text-indigo-700">{s.value}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="nasil-calisir" className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-3">Süreç</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-lg mx-auto">
              Üç adımda hızlı, güvenilir ve yapay zeka destekli kayıp yönetimi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                icon: "📡",
                title: "Sivil İhbar",
                desc: "Vatandaşlar gözlemledikleri kişi veya olayı detaylı biçimde sisteme bildirir.",
                badge: "Vatandaş",
                badgeColor: "bg-indigo-50 text-indigo-600 border-indigo-100",
              },
              {
                step: "02",
                icon: "🤖",
                title: "YZ Analizi",
                desc: "Gemini AI ihbar metninden fiziksel özellik etiketleri çıkarır ve olası güzergahları hesaplar.",
                badge: "Otomatik",
                badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
              },
              {
                step: "03",
                icon: "🎯",
                title: "Örüntü Tespiti",
                desc: "Yetkili paneli eşleşen ihbarları gruplar ve harita üzerinde hareket algoritmalarını görselleştirir.",
                badge: "Yetkili",
                badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
            ].map((f) => (
              <div
                key={f.step}
                className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500" />
                <div className="flex items-start justify-between mb-6 relative">
                  <div className="text-4xl">{f.icon}</div>
                  <span className="font-black text-5xl text-slate-100 group-hover:text-indigo-50 transition-colors tracking-tighter leading-none">
                    {f.step}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${f.badgeColor} mb-3 inline-block`}>
                  {f.badge}
                </span>
                <h3 className="text-xl font-black text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 md:px-10 pb-28">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-indigo-500/25 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
              Acil bir durum mu var?
            </h2>
            <p className="text-indigo-100 font-medium text-lg mb-4 max-w-lg mx-auto leading-relaxed">
              Kayıp vakasına tanıklık ettiyseniz hemen ihbar bildirin. Her detay
              hayat kurtarabilir.
            </p>
            <p className="text-indigo-200 text-sm font-medium mb-8">
              Ayrıca aşağıda güncel kayıp ilanlarını inceleyebilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ihbar"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 transition-all duration-200 text-lg shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
              >
                Şimdi İhbar Bildir →
              </Link>
              <Link
                href="/ilan-ver"
                className="inline-flex items-center gap-2 px-10 py-5 bg-indigo-700/40 hover:bg-indigo-700/60 text-white font-black rounded-2xl transition-all duration-200 text-lg border border-white/20 hover:-translate-y-0.5"
              >
                Kayıp İlanı Ver →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Missing Persons Showcase */}
      <IlanlarSection />

      {/* Floating urgency popup */}
      <IlanlarPopup />

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 py-8 px-6 md:px-10 mt-auto bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs">K</span>
            </div>
            <span className="font-bold text-slate-600 text-sm">Mercek — Dijital Komuta Merkezi</span>
          </div>
          <p className="text-xs text-slate-400 font-medium text-center max-w-sm">
            Bu platform yalnızca yetkili arama-kurtarma operasyonları için
            geliştirilmiştir. Yüz tanıma teknolojisi kullanılmamaktadır.
          </p>
        </div>
      </footer>
    </div>
  );
}
