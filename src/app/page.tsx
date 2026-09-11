import Link from 'next/link';
import { Calendar, ArrowRight, ShieldCheck, Scale, Award, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import InsightsSection from '@/components/InsightsSection';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. About Overview */}
      <AboutSection showMoreLink={true} />

      {/* 3. Services Overview */}
      <ServicesSection />

      {/* 4. Trust & Stats Banner */}
      <section className="py-16 bg-navy-deep border-y border-gold-accent/30 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-navy-royal/60 border border-gold-accent/20 rounded">
              <Scale className="w-8 h-8 text-gold-accent mx-auto mb-3" />
              <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white">34+</p>
              <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Perkara Hukum Litigasi</p>
            </div>
            <div className="p-6 bg-navy-royal/60 border border-gold-accent/20 rounded">
              <ShieldCheck className="w-8 h-8 text-gold-accent mx-auto mb-3" />
              <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white">411+</p>
              <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Perizinan Usaha OSS</p>
            </div>
            <div className="p-6 bg-navy-royal/60 border border-gold-accent/20 rounded">
              <Users className="w-8 h-8 text-gold-accent mx-auto mb-3" />
              <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white">100%</p>
              <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Standar Kerahasiaan</p>
            </div>
            <div className="p-6 bg-navy-royal/60 border border-gold-accent/20 rounded">
              <Award className="w-8 h-8 text-gold-accent mx-auto mb-3" />
              <p className="font-serif-title text-3xl sm:text-4xl font-bold text-white">Nasional</p>
              <p className="text-xs text-white/70 uppercase tracking-widest mt-1">Jangkauan Wilayah RI</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Editorial Insights */}
      <InsightsSection />

      {/* 6. Call to Action Banner to Contact Page */}
      <section className="py-20 bg-navy-dark border-t border-gold-accent/30 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-4 h-4 text-gold-accent" /> KONSULTASI AWAL
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Ambil Langkah Hukum yang Tepat untuk Bisnis Anda
          </h2>
          <div className="w-16 h-[2px] bg-gold-accent mx-auto mb-6" />
          <p className="text-white/70 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Tim konsultan SELECO siap memberikan arahan dan kepastian hukum mengenai perkara, perizinan, atau retainer korporasi Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontak"
              className="px-8 py-4 bg-gold-accent text-navy-dark font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Hubungi Kami &amp; Jadwalkan Konsultasi
            </Link>
            <Link
              href="/tentang"
              className="px-8 py-4 bg-navy-royal border border-gold-accent/40 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-gold-accent hover:text-gold-accent transition-all flex items-center justify-center gap-2"
            >
              Pelajari Profil Firma <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
