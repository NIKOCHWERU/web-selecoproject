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
    <EditableSection id="hero" name="Hero Banner Section" className="relative flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20 bg-white text-slate-900 border-b border-slate-200/90">
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
          className="w-full h-full object-cover scale-105 opacity-30 lg:opacity-40 transition-opacity duration-700"
        >
          <source src={hero?.bgVideo || '/bg_hero.mp4'} type="video/mp4" />
          <source src="/bg_hero.mp4" type="video/mp4" />
        </video>
        {/* Crisp White Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/88 to-white/92 z-10" />
        <div className="absolute inset-0 bg-white/40 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Spacious Wide Layout - Vertically Centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl lg:max-w-5xl space-y-5 sm:space-y-6"
        >
          {/* Top Pill Eyebrow Badge (Formal) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/35 text-[#b88917] text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b88917]" />
            <EditableText
              fieldPath="hero.topBadge"
              fallback="5 Pilar Konsultan Bisnis Terpadu"
              label="Label Atas Hero"
            />
          </div>

          {/* Main Punchy Headline */}
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#0a1420]">
            <EditableText
              fieldPath="hero.headlinePart1"
              fallback="Konsultan Terpadu untuk Akselerasi &"
              label="Judul Bagian 1"
            />{' '}
            <span className="text-[#b88917] italic">
              <EditableText
                fieldPath="hero.headlineItalic"
                fallback="Pertumbuhan Bisnis."
                label="Judul Miring Accent"
              />
            </span>
          </h1>

          {/* Divider Line */}
          <div className="w-12 h-0.5 bg-[#dfa82e] rounded-full" />

          {/* Subheadline description */}
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-2xl border-l-2 border-[#dfa82e] pl-3.5">
            <EditableText
              fieldPath="hero.subheadline"
              fallback="SELECO menyediakan 5 pilar konsultan korporasi profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara transparan, akurat, dan terpercaya."
              label="Subjudul Hero"
              multiline={true}
            />
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={hero?.ctaButton1Link || '/layanan'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#0a1420] text-white hover:bg-[#b88917] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <EditableText
                fieldPath="hero.ctaButton1Text"
                fallback={`Cari ${totalServices} Layanan Konsultan`}
                label="Tombol 1 (Teks & Link)"
                linkPath="hero.ctaButton1Link"
                fallbackLink="/layanan"
              />
              <ArrowRight className="w-3.5 h-3.5 text-[#dfa82e]" />
            </Link>

            <Link
              href={hero?.ctaButton2Link || '/kontak'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white hover:bg-slate-50 text-[#0a1420] border border-slate-300 hover:border-slate-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-x-5 gap-y-2">
            {(hero?.featurePills || ['Konsultan Perizinan', 'Konsultan Imigrasi', 'Konsultan Pajak', 'Konsultan Pertanahan', 'Konsultan SDM']).map((pill, idx) => (
              <span key={idx} className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#b88917] shrink-0" />
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
