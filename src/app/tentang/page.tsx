import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Building2, ArrowRight } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import RetainerSection from '@/components/RetainerSection';

export const metadata: Metadata = {
  title: 'Tentang Kami | SELECO | SEDANA LEGAL CONSULTANT',
  description: 'Profil SELECO, visi, nilai-nilai integritas, tim konsultan profesional 5 pilar (Perizinan, Imigrasi, Pajak, Pertanahan, SDM) di Indonesia.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Page Hero Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-[#b88917] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#b88917] font-semibold">Tentang Kami</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/15 border border-[#dfa82e]/35 rounded-full text-[#b88917] text-[10px] font-bold uppercase tracking-widest mb-2.5">
              <Building2 className="w-3.5 h-3.5" /> PROFIL KONSULTAN SELECO
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-[#0a1420] leading-tight">
              Dedikasi pada Integritas &amp; Keunggulan Strategis
            </h1>
            <div className="w-12 h-0.5 bg-[#dfa82e] mt-2.5 mb-3 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              Mengenal lebih dekat visi, standar profesional, dan tim konsultan di balik SELECO (SEDANA LEGAL CONSULTANT) yang siap mendampingi pertumbuhan bisnis Anda di Indonesia melalui 5 pilar layanan konsultan terpadu.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <AboutSection />
      <RetainerSection />

      {/* CTA Footer Banner */}
      <div className="py-12 sm:py-14 bg-[#0a1420] border-t border-[#dfa82e]/30 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-white mb-2.5">
            Siap Berdiskusi Mengenai Kebutuhan Bisnis &amp; Korporasi Anda?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 font-normal">
            Jadwalkan konsultasi awal dengan tim konsultan kami secara tatap muka ataupun virtual.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dfa82e] hover:bg-white text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <span>Hubungi Tim Kami Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
