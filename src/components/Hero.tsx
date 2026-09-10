'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Award, Briefcase, Users } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[88vh] bg-navy-deep flex items-center overflow-hidden py-16 lg:py-24 text-white">
      {/* Background Image: Dewi Keadilan / Statue of Justice */}
      <div 
        className="absolute inset-0 bg-cover bg-center brightness-[0.25] contrast-[1.15] z-0 scale-105 transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-deep/90 to-navy-dark/80 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest">
              <Scale className="w-4 h-4 text-gold-accent" />
              ADVOKAT & KONSULTAN HUKUM KORPORASI
            </div>

            <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
              Pendampingan Hukum Strategis untuk <span className="text-gold-accent italic">Keputusan Penting.</span>
            </h1>

            <div className="w-16 h-[2px] bg-gold-accent" />

            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
              SELECO memberikan layanan konsultasi 34 Perkara Hukum Litigasi & Non-Litigasi serta pengurusan 411+ Perizinan & Legalitas Usaha OSS RBA secara profesional, transparan, dan terukur.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/layanan"
                className="px-6 py-3.5 bg-gold-accent text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all shadow-lg flex items-center gap-2"
              >
                <Scale className="w-4 h-4" />
                Cari 445+ Layanan & Perizinan
              </Link>
              <Link
                href="/#contact"
                className="px-6 py-3.5 bg-navy-royal/80 border border-gold-accent/40 text-white font-bold text-xs uppercase tracking-wider rounded hover:border-gold-accent hover:text-gold-accent transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Jadwalkan Konsultasi
              </Link>
            </div>

            {/* Hero Feature Pills */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-navy-royal/90 border border-gold-accent/30 px-3 py-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-accent" /> 34 Perkara Hukum
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-navy-royal/90 border border-gold-accent/30 px-3 py-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-accent" /> 411 Perizinan OSS RBA
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-navy-royal/90 border border-gold-accent/30 px-3 py-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-accent" /> Retainer Corporate
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/90 bg-navy-royal/90 border border-gold-accent/30 px-3 py-1.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-accent" /> Tax & BPN Advisory
              </span>
            </div>
          </motion.div>

          {/* Right Floating Seal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-navy-royal/90 backdrop-blur-md border border-gold-accent/40 rounded p-8 shadow-2xl relative">
              <div className="w-12 h-12 rounded border border-gold-accent bg-gold-soft flex items-center justify-center text-gold-accent mb-6">
                <Scale className="w-6 h-6" />
              </div>

              <blockquote className="font-serif-title text-2xl italic text-white leading-snug mb-4">
                “Integrity. Strategy. Legal Excellence.”
              </blockquote>

              <p className="text-xs text-white/70 leading-relaxed border-t border-white/10 pt-4 mb-6">
                Mitra konsultan hukum tepercaya di Indonesia yang berfokus pada kepastian hukum, perlindungan aset, serta kepatuhan regulasi operasional bisnis.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 border-t border-gold-accent/20 pt-4 text-center">
                <div className="p-2 bg-navy-dark/60 rounded border border-white/5">
                  <div className="font-serif-title text-2xl font-bold text-gold-accent">10+</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Tahun Pengalaman</div>
                </div>
                <div className="p-2 bg-navy-dark/60 rounded border border-white/5">
                  <div className="font-serif-title text-2xl font-bold text-gold-accent">445+</div>
                  <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Cakupan Layanan</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
