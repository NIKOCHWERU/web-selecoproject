import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Scale } from 'lucide-react';
import AboutSection from '@/components/AboutSection';
import TeamSection from '@/components/TeamSection';
import RetainerSection from '@/components/RetainerSection';

export const metadata: Metadata = {
  title: 'Tentang Kami | SELECO — Sedana Legal Consultant',
  description: 'Profil firma hukum SELECO, visi, nilai-nilai integritas, tim advokat profesional, dan metodologi kerja strategis di Indonesia.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-navy-dark">
      {/* Page Hero Banner */}
      <div className="bg-navy-deep border-b border-gold-accent/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold-accent">Tentang Kami</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
              <Scale className="w-3.5 h-3.5" /> PROFIL KONSULTAN HUKUM SELECO
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Dedikasi pada Integritas &amp; Keunggulan Strategis
            </h1>
            <div className="w-14 h-[2px] bg-gold-accent mt-3 mb-3" />
            <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
              Mengenal lebih dekat visi, standar profesional, dan tim penasihat hukum di balik SELECO (Sedana Legal Consultant) yang siap melindungi pertumbuhan bisnis Anda di Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <AboutSection />
      <TeamSection />
      <RetainerSection />

      {/* CTA Footer Banner */}
      <div className="py-16 bg-navy-deep border-t border-gold-accent/30 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white mb-3">
            Siap Berdiskusi Mengenai Kebutuhan Hukum Anda?
          </h2>
          <p className="text-sm text-white/70 mb-6">
            Jadwalkan konsultasi awal dengan tim advokat kami secara tatap muka ataupun virtual.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gold-accent text-navy-dark font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all shadow-lg"
          >
            Hubungi Tim Kami Sekarang →
          </Link>
        </div>
      </div>
    </div>
  );
}
