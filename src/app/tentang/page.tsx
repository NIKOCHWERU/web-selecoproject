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
    <div className="min-h-screen bg-[#0a1420] text-slate-100">
      {/* Page Hero Banner */}
      <div className="bg-[#0f2034] border-b border-white/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Tentang Kami</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <Building2 className="w-3.5 h-3.5" /> PROFIL KONSULTAN SELECO
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Dedikasi pada Integritas &amp; Keunggulan Strategis
            </h1>
            <div className="w-16 h-[3px] bg-[#dfa82e] mt-3 mb-4 rounded-full" />
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
              Mengenal lebih dekat visi, standar profesional, dan tim konsultan di balik SELECO (SEDANA LEGAL CONSULTANT) yang siap mendampingi pertumbuhan bisnis Anda di Indonesia melalui 5 pilar layanan konsultan terpadu.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <AboutSection />
      <RetainerSection />

      {/* CTA Footer Banner */}
      <div className="py-20 bg-[#0f2034] border-t border-white/10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Siap Berdiskusi Mengenai Kebutuhan Bisnis &amp; Korporasi Anda?
          </h2>
          <p className="text-base text-slate-300 mb-8 font-normal">
            Jadwalkan konsultasi awal dengan tim konsultan kami secara tatap muka ataupun virtual.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-md"
          >
            <span>Hubungi Tim Kami Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
