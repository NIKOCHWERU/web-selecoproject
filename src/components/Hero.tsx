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
    <EditableSection id="hero" name="Hero Banner Section" className="relative min-h-[700px] lg:min-h-[780px] flex items-center justify-center overflow-hidden py-16 lg:py-24 bg-[#0a1420] text-white">
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
        {/* Spacious Wide Layout (Without Right Card) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl lg:max-w-5xl space-y-7"
        >
          {/* Top Pill Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm text-xs font-semibold tracking-wider text-[#dfa82e]">
            <span className="w-2 h-2 rounded-full bg-[#dfa82e] animate-pulse" />
            <EditableText
              fieldPath="hero.topBadge"
              fallback="5 Pilar Konsultan Bisnis Terpadu"
              label="Label Atas Hero"
            />
          </div>

          {/* Main Punchy Headline */}
          <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold tracking-tight leading-[1.1] text-white">
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

          {/* Divider Line */}
          <div className="w-16 h-[3px] bg-gradient-to-r from-[#dfa82e] to-[#b88917] rounded-full" />

          {/* Subheadline description */}
          <p className="text-base sm:text-lg text-slate-200/90 font-normal leading-relaxed max-w-3xl">
            <EditableText
              fieldPath="hero.subheadline"
              fallback="SELECO menyediakan 5 pilar konsultan korporasi profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara transparan, akurat, dan terpercaya."
              label="Subjudul Hero"
              multiline={true}
            />
          </p>

          {/* Dual Pill CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={hero?.ctaButton1Link || '/layanan'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="px-8 py-4 bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#dfa82e]/25 transition-all flex items-center gap-2 group"
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
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 font-bold text-xs uppercase tracking-wider rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
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
