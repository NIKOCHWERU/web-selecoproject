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
    <div className="min-h-screen bg-[#0a1420] text-slate-100">
      {/* Page Hero Banner */}
      <div className="bg-[#0f2034] border-b border-white/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Kontak</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <PhoneCall className="w-3.5 h-3.5" /> PUSAT KOMUNIKASI &amp; KONSULTASI
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Konsultasi Perizinan &amp; Layanan Korporasi
            </h1>
            <div className="w-16 h-[3px] bg-[#dfa82e] mt-3 mb-4 rounded-full" />
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed font-normal">
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
