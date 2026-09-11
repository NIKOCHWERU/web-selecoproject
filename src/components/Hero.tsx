'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Award, Briefcase, Users, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden py-20 lg:py-28 bg-slate-950 text-white">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          className="w-full h-full object-cover scale-105"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
        >
          <source
            src="https://res.cloudinary.com/dysw7tjks/video/upload/v1756377208/Desain_tanpa_judul_oeaojq.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark Luxury Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/75" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/30 to-slate-950/80" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <span>Advokat &amp; Konsultan Hukum Korporasi</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.16] text-white">
              Pendampingan Hukum Strategis untuk{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E19C] via-[#D4AF37] to-[#C9A227] italic">
                Keputusan Penting.
              </span>
            </h1>

            {/* Gold Accent Line */}
            <div className="w-20 h-[3px] bg-gradient-to-r from-gold-accent to-gold-bright rounded-full" />

            {/* Subheadline Paragraph */}
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl border-l-2 border-gold-accent/80 pl-4">
              SELECO memberikan layanan konsultasi <strong>34 Perkara Hukum</strong> Litigasi &amp; Non-Litigasi serta pengurusan <strong>411+ Perizinan &amp; Legalitas Usaha OSS RBA</strong> secara profesional, transparan, dan terukur.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/layanan"
                className="px-7 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-lg hover:shadow-gold flex items-center gap-2.5 group"
              >
                <Scale className="w-4 h-4 text-slate-950" />
                <span>Cari 445+ Layanan &amp; Perizinan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/kontak"
                className="px-7 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/30 hover:border-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all backdrop-blur-sm flex items-center gap-2.5 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Konsultasi</span>
              </Link>
            </div>

            {/* Hero Feature Pills */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> 34 Perkara Hukum
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> 411 Perizinan OSS RBA
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Retainer Corporate
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" /> Tax &amp; BPN Advisory
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
            <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-gold-accent/15 rounded-full blur-3xl pointer-events-none" />

              <div className="w-14 h-14 rounded-xl border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-300 mb-6 shadow-inner">
                <Scale className="w-7 h-7 text-amber-300" />
              </div>

              <blockquote className="font-serif-title text-2xl lg:text-3xl italic text-white leading-snug mb-4">
                “Integrity. Strategy. Legal Excellence.”
              </blockquote>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-4 mb-8 font-light">
                Mitra konsultan hukum tepercaya di Indonesia yang berfokus pada kepastian hukum, perlindungan aset, serta kepatuhan regulasi operasional bisnis.
              </p>

              {/* Stats Cards Inside Seal */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-center">
                <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="font-serif-title text-3xl font-bold text-amber-300">10+</div>
                  <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-1">Tahun Pengalaman</div>
                </div>
                <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="font-serif-title text-3xl font-bold text-amber-300">445+</div>
                  <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold mt-1">Cakupan Layanan</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
