import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import HomeDynamicSections from '@/components/HomeDynamicSections';

export default function HomePage() {
  return (
    <>
      {/* Dynamic Sections from User Customization & Canva Editor */}
      <HomeDynamicSections />

      {/* Call to Action Banner to Contact Page */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200 text-slate-900 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/15 border border-[#dfa82e]/35 rounded-full text-[#b88917] text-[10px] font-bold uppercase tracking-widest mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#b88917]" /> KONSULTASI AWAL
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold mb-3 leading-tight text-[#0a1420]">
            Ambil Langkah Legalitas yang Tepat untuk Bisnis Anda
          </h2>
          <div className="w-12 h-0.5 bg-[#dfa82e] mx-auto mb-4 rounded-full" />
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto mb-6 leading-relaxed font-normal">
            Tim konsultan SELECO siap memberikan arahan dan kepastian mengenai legalitas usaha, perizinan OSS RBA, atau retainer korporasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/kontak"
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-[#0a1420] hover:bg-[#b88917] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" /> Hubungi Kami &amp; Jadwalkan Konsultasi
            </Link>
            <Link
              href="/tentang"
              className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-slate-300 text-[#0a1420] hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Pelajari Profil Kami <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
