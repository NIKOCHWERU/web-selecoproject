'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableBackground, EditableSection } from './EditableElement';

export default function Hero() {
  const { content } = useContent();
  const hero = content?.hero;
  const global = content?.global;
  const totalServices = global?.totalServices || hero?.stat2Number || '445+';

  return (
    <EditableSection id="hero" name="Hero Banner Section" className="relative lg:h-[calc(100vh-5rem)] min-h-[580px] flex items-center justify-center overflow-hidden py-8 lg:py-0 bg-slate-950 text-white">
      {/* Background Image: Clean, Neat, White Modern Corporate Office */}
      <EditableBackground
        fieldPath="hero.bgImage"
        fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform transition-all duration-700"
        label="Foto Latar Belakang Hero"
      />
      {/* Dark Luxury Contrast Overlay to ensure bright white/gold text stands out crisply */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/75 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/40 z-10 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Main Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-4 lg:space-y-5"
          >
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <EditableText
                fieldPath="hero.topBadge"
                fallback="Advokat & Konsultan Hukum Korporasi"
                label="Badge Atas"
              />
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-bold tracking-tight leading-[1.15] text-white">
              <EditableText
                fieldPath="hero.headlinePart1"
                fallback="Pendampingan Hukum Strategis untuk"
                label="Judul Bagian 1"
              />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7E19C] via-[#D4AF37] to-[#C9A227] italic">
                <EditableText
                  fieldPath="hero.headlineItalic"
                  fallback="Keputusan Penting."
                  label="Judul Miring Gold"
                />
              </span>
            </h1>

            {/* Gold Accent Line */}
            <div className="w-16 h-[2.5px] bg-gradient-to-r from-gold-accent to-gold-bright rounded-full" />

            {/* Subheadline Paragraph */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-slate-200 font-normal leading-relaxed max-w-xl border-l-2 border-gold-accent/80 pl-3.5">
              <EditableText
                fieldPath="hero.subheadline"
                fallback="SELECO memberikan layanan konsultasi 34 Perkara Hukum Litigasi & Non-Litigasi serta pengurusan 411+ Perizinan & Legalitas Usaha OSS RBA secara profesional, transparan, dan terukur."
                label="Subjudul Hero"
                multiline={true}
              />
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={hero?.ctaButton1Link || '/layanan'}
                className="px-5 py-3 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-gold flex items-center gap-2 group"
              >
                <Scale className="w-4 h-4 text-slate-950" />
                <EditableText
                  fieldPath="hero.ctaButton1Text"
                  fallback={`Cari ${totalServices} Layanan & Perizinan`}
                  label="Teks Tombol 1"
                />
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={hero?.ctaButton2Link || '/kontak'}
                className="px-5 py-3 bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/30 hover:border-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all backdrop-blur-sm flex items-center gap-2 shadow-sm"
              >
                <Calendar className="w-4 h-4" />
                <EditableText
                  fieldPath="hero.ctaButton2Text"
                  fallback="Jadwalkan Konsultasi"
                  label="Teks Tombol 2"
                />
              </Link>
            </div>

            {/* Hero Feature Pills */}
            <div className="pt-3 border-t border-white/15 flex flex-wrap gap-2.5">
              {(hero?.featurePills || ['34 Perkara Hukum', '411 Perizinan OSS RBA', 'Retainer Corporate', 'Tax & BPN Advisory']).map((pill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-amber-300" />
                  <EditableText
                    fieldPath={`hero.featurePills.${idx}`}
                    fallback={pill}
                    label={`Fitur Pill #${idx + 1}`}
                  />
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Floating Seal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-slate-900/85 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-6 lg:p-7 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-accent/15 rounded-full blur-3xl pointer-events-none" />

              <div className="w-12 h-12 rounded-xl border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-300 mb-4 shadow-inner">
                <Scale className="w-6 h-6 text-amber-300" />
              </div>

              <blockquote className="font-serif-title text-xl lg:text-2xl italic text-white leading-snug mb-3">
                <EditableText
                  fieldPath="hero.sealQuote"
                  fallback="“Integrity. Strategy. Legal Excellence.”"
                  label="Kutipan Komitmen"
                />
              </blockquote>

              <p className="text-[11px] lg:text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3 mb-5 font-light">
                <EditableText
                  fieldPath="hero.sealDescription"
                  fallback="Mitra konsultan hukum tepercaya di Indonesia yang berfokus pada kepastian hukum, perlindungan aset, serta kepatuhan regulasi operasional bisnis."
                  label="Deskripsi Komitmen"
                  multiline={true}
                />
              </p>

              {/* Stats Cards Inside Seal */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-center">
                <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="font-serif-title text-2xl font-bold text-amber-300">
                    <EditableText
                      fieldPath="hero.stat1Number"
                      fallback="10+"
                      label="Angka Pengalaman"
                    />
                  </div>
                  <div className="text-[9px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                    <EditableText
                      fieldPath="hero.stat1Label"
                      fallback="Tahun Pengalaman"
                      label="Label Pengalaman"
                    />
                  </div>
                </div>
                <div className="p-2.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <div className="font-serif-title text-2xl font-bold text-amber-300">
                    <EditableText
                      fieldPath="hero.stat2Number"
                      fallback={totalServices}
                      label="Angka Layanan"
                    />
                  </div>
                  <div className="text-[9px] text-slate-300 uppercase tracking-wider font-semibold mt-0.5">
                    <EditableText
                      fieldPath="hero.stat2Label"
                      fallback="Cakupan Layanan"
                      label="Label Layanan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
