import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Building2, ArrowRight } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import RetainerSection from '@/components/RetainerSection';

export const metadata: Metadata = {
  title: 'Tentang Kami | SELECO | PT SELECO SWAKARYA NUSANTARA',
  description: 'Kenali visi, standar kerja, dan tim di balik PT SELECO SWAKARYA NUSANTARA (SELECO), mitra terintegrasi yang mendampingi pertumbuhan bisnis Anda di seluruh Indonesia.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1420]">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-[#142740] to-[#0a1420] text-white border-b border-[#dfa82e]/25 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <Link href="/" className="hover:text-[#dfa82e] transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Tentang Kami</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/20 border border-[#dfa82e]/40 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <Building2 className="w-3.5 h-3.5" /> PROFIL SELECO
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight uppercase">
              Integritas dalam Setiap Langkah, Kepastian dalam Setiap Hasil
            </h1>
            <div className="w-16 h-1 bg-[#dfa82e] mt-4 mb-4" />
            <p className="text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed font-light">
              Kenali visi, standar kerja, dan tim di balik PT SELECO SWAKARYA NUSANTARA (SELECO), mitra terintegrasi yang mendampingi pertumbuhan bisnis Anda di seluruh Indonesia lewat lima bidang layanan terpadu.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <AboutSection />
      <RetainerSection />

      {/* CTA Footer Banner */}
      <div className="py-14 bg-[#0f2034] border-t border-[#dfa82e]/30 text-center text-white">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 uppercase tracking-wide">
            Siap Membahas Kebutuhan Bisnis Anda?
          </h2>
          <p className="text-sm md:text-base text-slate-300 mb-7 font-light">
            Jadwalkan konsultasi awal, tatap muka maupun virtual. #YouBetterWithUs
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#dfa82e] hover:bg-white text-[#0a1420] font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
          >
            <span>Hubungi Tim Kami</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
