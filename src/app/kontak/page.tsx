import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, PhoneCall } from 'lucide-react';
import ContactSection from '@/components/ContactSection';
import FAQSection from '@/components/FAQSection';

export const metadata: Metadata = {
  title: 'Kontak & Konsultasi | SELECO — Sedana Legal Consultant',
  description: 'Hubungi kantor hukum SELECO Jakarta. Konsultasi hukum perkara, perizinan usaha OSS RBA, dan legal retainer melalui formulir atau WhatsApp langsung.',
};

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-navy-dark">
      {/* Page Hero Banner */}
      <div className="bg-navy-deep border-b border-gold-accent/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold-accent">Kontak</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
              <PhoneCall className="w-3.5 h-3.5" /> PUSAT KOMUNIKASI &amp; KONSULTASI
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Konsultasi Hukum &amp; Perizinan Usaha
            </h1>
            <div className="w-14 h-[2px] bg-gold-accent mt-3 mb-3" />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Diskusikan perkara hukum bisnis, penanganan sengketa, atau perizinan OSS usaha Anda bersama penasihat hukum profesional SELECO.
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
