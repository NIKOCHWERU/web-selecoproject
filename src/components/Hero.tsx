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
      {/* Looping Corporate Office Room Background Video */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover scale-105 opacity-55 lg:opacity-65 transition-opacity duration-700"
        >
          <source src="https://assets.mixkit.co/videos/42884/42884-720.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/42587/42587-720.mp4" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/42588/42588-720.mp4" type="video/mp4" />
        </video>
        {/* Balanced Navy Gradient Overlay: keeps office room clearly visible while ensuring text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1420]/88 via-[#0f2034]/70 to-[#0a1420]/82 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1420] to-transparent z-10" />
      </div>

      {/* Ambient Gold Radial Glow */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-[#dfa82e]/5 rounded-full blur-3xl pointer-events-none z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Asymmetrical Copy & Action */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Top Pill Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-sm text-xs font-semibold tracking-wider text-[#dfa82e]">
              <span className="w-2 h-2 rounded-full bg-[#dfa82e] animate-pulse" />
              <EditableText
                fieldPath="hero.topBadge"
                fallback="SELECO - Konsultan Bisnis & Legalitas Terpadu"
                label="Label Atas Hero"
              />
            </div>

            {/* Main Punchy Headline */}
            <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-bold tracking-tight leading-[1.12] text-white">
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
            <div className="w-14 h-[3px] bg-gradient-to-r from-[#dfa82e] to-[#b88917] rounded-full" />

            {/* Subheadline description */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              <EditableText
                fieldPath="hero.subheadline"
                fallback="Solusi terpadu 5 pilar spesialisasi korporasi: Konsultan Perizinan OSS RBA, Konsultan Imigrasi & TKA, Konsultan Pajak, Konsultan Pertanahan BPN, serta Manajemen SDM secara transparan dan terpercaya."
                label="Subjudul Hero"
                multiline={true}
              />
            </p>

            {/* Dual Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={hero?.ctaButton1Link || '/kontak'}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#dfa82e]/20 transition-all flex items-center gap-2 group"
              >
                <EditableText
                  fieldPath="hero.ctaButton1Text"
                  fallback="Jadwalkan Konsultasi"
                  label="Tombol 1 (Teks & Link)"
                  linkPath="hero.ctaButton1Link"
                  fallbackLink="/kontak"
                />
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={hero?.ctaButton2Link || '/layanan'}
                onClick={(e) => {
                  if (isEditMode) {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 font-bold text-xs uppercase tracking-wider rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <EditableText
                  fieldPath="hero.ctaButton2Text"
                  fallback={`Cari ${totalServices} Layanan`}
                  label="Tombol 2 (Teks & Link)"
                  linkPath="hero.ctaButton2Link"
                  fallbackLink="/layanan"
                />
              </Link>
            </div>

            {/* 5 Service Pillars Mini Checkmarks */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-2">
              {(hero?.featurePills || ['Konsultan Perizinan', 'Konsultan Imigrasi', 'Konsultan Pajak', 'Konsultan Pertanahan', 'Konsultan SDM']).map((pill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#dfa82e] shrink-0" />
                  <EditableText
                    fieldPath={`hero.featurePills.${idx}`}
                    fallback={pill}
                    label={`Fitur Pill #${idx + 1}`}
                  />
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Executive Corporate Credential Box & Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl bg-[#0f2034]/85 border border-white/15 p-8 sm:p-9 shadow-2xl backdrop-blur-md relative overflow-hidden">
              {/* Top Accent Icon & Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center text-[#dfa82e]">
                  <EditableIcon
                    iconKey="hero.sealIcon"
                    fallbackIcon="Building2"
                    className="w-6 h-6"
                    label="Ikon Komitmen"
                  />
                </div>
                <span className="px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-[#dfa82e]">
                  Komitmen Korporasi
                </span>
              </div>

              {/* Quote Title */}
              <blockquote className="font-serif-title text-xl sm:text-2xl italic text-white leading-snug mb-4">
                <EditableText
                  fieldPath="hero.sealQuote"
                  fallback='"Integrity. Strategy. Corporate Excellence."'
                  label="Kutipan Komitmen"
                />
              </blockquote>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4 mb-6 font-normal">
                <EditableText
                  fieldPath="hero.sealDescription"
                  fallback="Mitra konsultan korporasi terpercaya di Indonesia yang berfokus pada perizinan berusaha OSS RBA, keimigrasian & TKA, perpajakan, legalitas pertanahan BPN, serta manajemen SDM."
                  label="Deskripsi Komitmen"
                  multiline={true}
                />
              </p>

              {/* Stats Grid inside Credential Box */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#dfa82e]">
                    <EditableText
                      fieldPath="hero.stat1Number"
                      fallback="10+"
                      label="Angka Pengalaman"
                    />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">
                    <EditableText
                      fieldPath="hero.stat1Label"
                      fallback="Tahun Pengalaman"
                      label="Label Pengalaman"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#dfa82e]">
                    <EditableText
                      fieldPath="hero.stat2Number"
                      fallback={totalServices}
                      label="Angka Layanan"
                    />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-wider font-semibold mt-1">
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
