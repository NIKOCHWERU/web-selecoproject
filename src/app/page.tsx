import Link from 'next/link';
import { Calendar, ArrowRight, ShieldCheck, Scale, Award, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import InsightsSection from '@/components/InsightsSection';
import TrustStatsBanner from '@/components/TrustStatsBanner';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section with Video Background */}
      <Hero />

      {/* 2. About Overview (White Theme) */}
      <AboutSection showMoreLink={true} />

      {/* 3. Services Overview (Clean Astra Light Theme) */}
      <ServicesSection />

      {/* 4. Trust & Stats Banner (Clean White Theme - Dynamic) */}
      <TrustStatsBanner />

      {/* 5. Editorial Insights (Light Theme) */}
      <InsightsSection />

      {/* 6. Call to Action Banner to Contact Page (Full Navy Theme) */}
      <section className="py-24 bg-[#0a1420] border-t border-white/10 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-4 h-4 text-[#dfa82e]" /> KONSULTASI AWAL
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">
            Ambil Langkah Legalitas yang Tepat untuk Bisnis Anda
          </h2>
          <div className="w-16 h-[3px] bg-[#dfa82e] mx-auto mb-6 rounded-full" />
          <p className="text-slate-300 text-base max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Tim konsultan SELECO siap memberikan arahan dan kepastian mengenai legalitas usaha, perizinan OSS RBA, atau retainer korporasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/kontak"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Hubungi Kami &amp; Jadwalkan Konsultasi
            </Link>
            <Link
              href="/tentang"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 text-white hover:border-[#dfa82e] hover:text-[#dfa82e] font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
            >
              Pelajari Profil Kami <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
