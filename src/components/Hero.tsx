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
    <EditableSection id="hero" name="Hero Banner Section" className="relative min-h-[calc(100vh-80px)] lg:min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16 sm:py-12 lg:py-16 bg-[#0a1420] text-white">
      {/* Looping Corporate Background Video */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          key={hero?.bgVideo || '/bg_hero.mp4'}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover scale-105 opacity-40 lg:opacity-50 transition-opacity duration-700"
        >
          <source src={hero?.bgVideo || '/bg_hero.mp4'} type="video/mp4" />
          <source src="/bg_hero.mp4" type="video/mp4" />
        </video>
        {/* Darkened Deep Navy Gradient Overlay: keeps background video visible while ensuring maximum contrast and legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1420]/95 via-[#0a1420]/85 to-[#0a1420]/92 z-10" />
        <div className="absolute inset-0 bg-[#0a1420]/40 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/60 to-transparent z-10" />
      </div>

      {/* Ambient Gold Radial Glow */}
      <div className="absolute right-1/4 top-1/4 w-[500px] h-[500px] bg-[#dfa82e]/5 rounded-full blur-3xl pointer-events-none z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Spacious Wide Layout - Vertically Centered */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl lg:max-w-5xl space-y-6 sm:space-y-7 -mt-6 sm:-mt-10 lg:-mt-14"
        >
          {/* Top Pill Eyebrow Badge (Web NH Style) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#dfa82e] text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#dfa82e] animate-pulse" />
            <EditableText
              fieldPath="hero.topBadge"
              fallback="5 Pilar Konsultan Bisnis Terpadu"
              label="Label Atas Hero"
            />
          </div>

          {/* Main Punchy Headline */}
          <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.15] text-white">
            <EditableText
              fieldPath="hero.headlinePart1"
              fallback="Konsultan Terpadu untuk Akselerasi &"
              label="Judul Bagian 1"
            />{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fad980] via-[#dfa82e] to-[#b88917] italic">
              <EditableText
                fieldPath="hero.headlineItalic"
                fallback="Pertumbuhan Bisnis."
                label="Judul Miring Accent"
              />
            </span>
          </h1>

          {/* Divider Line (Web NH Style) */}
          <div className="w-16 h-1 bg-[#dfa82e] rounded-full" />

          {/* Subheadline description (Web NH Signature Left Accent) */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-3xl border-l-4 border-[#dfa82e] pl-4">
            <EditableText
              fieldPath="hero.subheadline"
              fallback="SELECO menyediakan 5 pilar konsultan korporasi profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara transparan, akurat, dan terpercaya."
              label="Subjudul Hero"
              multiline={true}
            />
          </p>

          {/* Dual Action Buttons (Web NH Style) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href={hero?.ctaButton1Link || '/layanan'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-6 py-3.5 sm:px-8 sm:py-4 bg-[#dfa82e] text-[#0a1420] hover:bg-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <EditableText
                fieldPath="hero.ctaButton1Text"
                fallback={`Cari ${totalServices} Layanan Konsultan`}
                label="Tombol 1 (Teks & Link)"
                linkPath="hero.ctaButton1Link"
                fallbackLink="/layanan"
              />
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href={hero?.ctaButton2Link || '/kontak'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-6 py-3.5 sm:px-8 sm:py-4 bg-transparent hover:bg-white hover:text-[#0a1420] text-white border border-white/25 hover:border-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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

          {/* 5 Service Pillars Mini Checkmarks */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-3">
            {(hero?.featurePills || ['Konsultan Perizinan', 'Konsultan Imigrasi', 'Konsultan Pajak', 'Konsultan Pertanahan', 'Konsultan SDM']).map((pill, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#dfa82e] shrink-0" />
                <EditableText
                  fieldPath={`hero.featurePills.${idx}`}
                  fallback={pill}
                  label={`Fitur Pill #${idx + 1}`}
                />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </EditableSection>
  );
}
