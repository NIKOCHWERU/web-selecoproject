'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableBackground, EditableSection, EditableIcon } from './EditableElement';

export default function Hero() {
  const { content } = useContent();
  const [isEditMode, setIsEditMode] = useState(false);
  const hero = content?.hero;
  const global = content?.global;
  const totalServices = global?.totalServices || hero?.stat2Number || '445+';

  useEffect(() => {
    const checkMode = () => {
      const mode = sessionStorage.getItem('seleco_editor_mode');
      setIsEditMode(mode === 'click_to_edit');
    };
    checkMode();

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'SET_EDITOR_MODE') {
        setIsEditMode(e.data.mode === 'click_to_edit');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <EditableSection id="hero" name="Hero Banner Section" className="relative lg:h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center overflow-hidden py-12 lg:py-0 bg-[#0f2034] text-white">
      {/* Background Image with deep navy overlay */}
      <EditableBackground
        fieldPath="hero.bgImage"
        fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transform transition-all duration-700"
        label="Foto Latar Belakang Hero"
      />
      {/* Navy-dominant overlay: left heavy, fades right */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f2034]/97 via-[#0f2034]/88 to-[#0a1624]/70 z-10 pointer-events-none" />
      {/* Bottom fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f2034]/60 to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-5"
          >
            {/* Subdomain label — functional, not decorative */}
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b88917]">
              <EditableText
                fieldPath="hero.topBadge"
                fallback="5 Pilar Konsultan Bisnis Terpadu"
                label="Label Atas Hero"
              />
            </p>

            {/* Main Headline */}
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-bold tracking-tight leading-[1.12] text-white">
              <EditableText
                fieldPath="hero.headlinePart1"
                fallback="Konsultan Terpadu untuk Akselerasi &"
                label="Judul Bagian 1"
              />{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fad980] via-[#d4a024] to-[#b88917] italic">
                <EditableText
                  fieldPath="hero.headlineItalic"
                  fallback="Pertumbuhan Bisnis."
                  label="Judul Miring Accent"
                />
              </span>
            </h1>

            {/* Divider line — hierarchy function */}
            <div className="w-12 h-[2px] bg-[#b88917]" />

            {/* Subheadline */}
            <p className="text-sm lg:text-[15px] text-white/70 font-normal leading-relaxed max-w-xl pl-4 border-l border-[#b88917]/50">
              <EditableText
                fieldPath="hero.subheadline"
                fallback="SELECO menyediakan 5 pilar konsultan korporasi profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara transparan, akurat, dan terpercaya."
                label="Subjudul Hero"
                multiline={true}
              />
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={hero?.ctaButton1Link || '/layanan'}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="px-6 py-3 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] font-bold text-[11px] uppercase tracking-wider rounded transition-all flex items-center gap-2 group"
              >
                <EditableText
                  fieldPath="hero.ctaButton1Text"
                  fallback={`Cari ${totalServices} Layanan Konsultan`}
                  label="Tombol 1 (Teks & Link)"
                  linkPath="hero.ctaButton1Link"
                  fallbackLink="/layanan"
                />
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href={hero?.ctaButton2Link || '/kontak'}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="px-6 py-3 bg-transparent text-white border border-white/30 hover:border-white font-bold text-[11px] uppercase tracking-wider rounded transition-all flex items-center gap-2"
              >
                <EditableText
                  fieldPath="hero.ctaButton2Text"
                  fallback="Jadwalkan Konsultasi"
                  label="Tombol 2 (Teks & Link)"
                  linkPath="hero.ctaButton2Link"
                  fallbackLink="/kontak"
                />
              </Link>
            </div>

            {/* Service pillars list */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
              {(hero?.featurePills || ['Konsultan Perizinan', 'Konsultan Imigrasi', 'Konsultan Pajak', 'Konsultan Pertanahan', 'Konsultan SDM']).map((pill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                  <CheckCircle2 className="w-3 h-3 text-[#b88917] shrink-0" />
                  <EditableText
                    fieldPath={`hero.featurePills.${idx}`}
                    fallback={pill}
                    label={`Fitur Pill #${idx + 1}`}
                  />
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: Credential Card — solid navy surface, not glass */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#0a1624] border border-white/10 rounded-lg p-7 shadow-2xl">
              {/* Icon + quote */}
              <div className="w-10 h-10 rounded border border-[#b88917]/30 bg-[#b88917]/10 flex items-center justify-center text-[#b88917] mb-5">
                <EditableIcon
                  iconKey="hero.sealIcon"
                  fallbackIcon="Building2"
                  className="w-5 h-5"
                  label="Ikon Komitmen"
                />
              </div>

              <blockquote className="font-serif-title text-xl lg:text-2xl italic text-white leading-snug mb-3">
                <EditableText
                  fieldPath="hero.sealQuote"
                  fallback='"Integrity. Strategy. Corporate Excellence."'
                  label="Kutipan Komitmen"
                />
              </blockquote>

              <p className="text-xs text-white/50 leading-relaxed border-t border-white/10 pt-4 mb-6 font-light">
                <EditableText
                  fieldPath="hero.sealDescription"
                  fallback="Mitra konsultan korporasi terpercaya di Indonesia yang berfokus pada perizinan berusaha, keimigrasian & TKA, perpajakan, legalitas pertanahan BPN, serta manajemen SDM."
                  label="Deskripsi Komitmen"
                  multiline={true}
                />
              </p>

              {/* Stats — two columns, no card style, clean numbers */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <div className="font-serif-title text-3xl font-bold text-[#b88917]">
                    <EditableText
                      fieldPath="hero.stat1Number"
                      fallback="10+"
                      label="Angka Pengalaman"
                    />
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">
                    <EditableText
                      fieldPath="hero.stat1Label"
                      fallback="Tahun Pengalaman"
                      label="Label Pengalaman"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-serif-title text-3xl font-bold text-[#b88917]">
                    <EditableText
                      fieldPath="hero.stat2Number"
                      fallback={totalServices}
                      label="Angka Layanan"
                    />
                  </div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mt-1">
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
