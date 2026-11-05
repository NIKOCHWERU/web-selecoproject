import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, PhoneCall } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: 'Kontak & Konsultasi | SELECO | SEDANA LEGAL CONSULTANT',
  description: 'Hubungi konsultan SELECO Jakarta. Konsultasi perizinan usaha OSS RBA, keimigrasian/TKA, perpajakan badan, pertanahan BPN, dan manajemen SDM via formulir atau WhatsApp.',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Page Hero Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-[#b88917] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#b88917] font-semibold">Kontak</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/15 border border-[#dfa82e]/35 rounded-full text-[#b88917] text-[10px] font-bold uppercase tracking-widest mb-2.5">
              <PhoneCall className="w-3.5 h-3.5" /> PUSAT KOMUNIKASI &amp; KONSULTASI
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-[#0a1420] leading-tight">
              Konsultasi Perizinan &amp; Layanan Korporasi
            </h1>
            <div className="w-12 h-0.5 bg-[#dfa82e] mt-2.5 mb-3 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed font-normal">
              Diskusikan perizinan usaha, keimigrasian, perpajakan, pertanahan, atau manajemen SDM perusahaan Anda bersama konsultan profesional Seleco.
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
