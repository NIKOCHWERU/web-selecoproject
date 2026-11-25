import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, PhoneCall } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: 'Kontak & Konsultasi | SELECO | PT SELECO SWAKARYA NUSANTARA',
  description: 'Bahas perizinan, imigrasi, pajak, pertanahan, atau SDM perusahaan Anda bersama konsultan SELECO. Satu tim, satu alur, solusi yang pasti.',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-[#0a1420]">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-[#142740] to-[#0a1420] text-white border-b border-[#dfa82e]/25 pt-28 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <Link href="/" className="hover:text-[#dfa82e] transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Kontak</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/20 border border-[#dfa82e]/40 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <PhoneCall className="w-3.5 h-3.5" /> KONSULTASI
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight uppercase">
              Konsultasi Perizinan &amp; Layanan Korporasi
            </h1>
            <div className="w-16 h-1 bg-[#dfa82e] mt-4 mb-4" />
            <p className="text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed font-light">
              Bahas perizinan, imigrasi, pajak, pertanahan, atau SDM perusahaan Anda bersama konsultan SELECO. Satu tim, satu alur, solusi yang pasti.
            </p>
          </div>
        </div>
      </div>

      {/* Main Contact Form & Info */}
      <ContactSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
