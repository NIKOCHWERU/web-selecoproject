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
  const [videoModalOpen, setVideoModalOpen] = useState(false);
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
    <EditableSection id="hero" name="Hero Banner Section" className="relative min-h-[720px] lg:min-h-[820px] flex items-center justify-center overflow-hidden py-16 lg:py-24 bg-[#0a1420] text-white">
      {/* Background with soft subtle radial glow and deep navy gradient */}
      <EditableBackground
        fieldPath="hero.bgImage"
        fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20 scale-105 transform transition-all duration-700"
        label="Foto Latar Belakang Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1420]/95 via-[#0f2034]/90 to-[#0a1420] z-10 pointer-events-none" />
      {/* Subtle radial ambient highlight behind right column */}
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

            {/* Eventure-style Floating Video / Company Profile Card (Bottom Left) */}
            <div className="pt-4">
              <div
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-4 p-2.5 pr-5 rounded-2xl bg-[#0f2034]/90 border border-white/10 hover:border-[#dfa82e]/40 backdrop-blur-md shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setVideoModalOpen(true);
                  }
                }}
                aria-label="Tonton profil video SELECO"
              >
                <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80"
                    alt="Konsultasi Bisnis SELECO"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="w-7 h-7 rounded-full bg-[#dfa82e] text-[#0a1420] flex items-center justify-center text-xs font-black shadow-md pl-0.5 group-hover:scale-110 transition-transform">
                      ▶
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-[#dfa82e] transition-colors">
                    Profil Perusahaan &amp; Layanan
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Pelajari cara kerja &amp; komitmen penanganan kami
                  </p>
                </div>
              </div>
            </div>

            {/* 5 Service Pillars Mini Checkmarks */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-x-4 gap-y-2">
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

          {/* Right Column: Executive Portrait & Floating Metric Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-0 max-w-sm mx-auto bg-gradient-to-tr from-[#dfa82e]/20 via-[#0f2034]/40 to-transparent rounded-3xl blur-2xl -z-10" />

            {/* Consultant Portrait Card */}
            <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 to-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] relative bg-[#0a1624]">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80"
                  alt="Konsultan Senior Korporasi SELECO"
                  className="w-full h-full object-cover object-top"
                />
                {/* Subtle gradient shadow at bottom of photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1624] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Metric Chip 1: Top Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute -top-4 -right-2 sm:-right-4 bg-[#0a1624]/90 border border-white/20 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center text-[#dfa82e]">
                  <EditableIcon
                    iconKey="hero.stat2Icon"
                    fallbackIcon="CheckCircle2"
                    className="w-5 h-5"
                    label="Ikon Metrik Layanan"
                  />
                </div>
                <div>
                  <div className="font-serif-title text-xl sm:text-2xl font-bold text-white leading-none">
                    <EditableText
                      fieldPath="hero.stat2Number"
                      fallback={totalServices}
                      label="Angka Layanan"
                    />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-1">
                    <EditableText
                      fieldPath="hero.stat2Label"
                      fallback="Cakupan Layanan"
                      label="Label Layanan"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Floating Metric Chip 2: Bottom Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-4 -left-2 sm:-left-4 bg-[#0a1624]/90 border border-white/20 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center text-[#dfa82e]">
                  <EditableIcon
                    iconKey="hero.stat1Icon"
                    fallbackIcon="ShieldCheck"
                    className="w-5 h-5"
                    label="Ikon Metrik Pengalaman"
                  />
                </div>
                <div>
                  <div className="font-serif-title text-xl sm:text-2xl font-bold text-white leading-none">
                    <EditableText
                      fieldPath="hero.stat1Number"
                      fallback="10+"
                      label="Angka Pengalaman"
                    />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-1">
                    <EditableText
                      fieldPath="hero.stat1Label"
                      fallback="Tahun Pengalaman"
                      label="Label Pengalaman"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Video Modal with Keyboard Accessibility (R-26, R-32) */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="bg-[#0f2034] border border-white/20 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-serif-title text-lg font-bold text-white">
                Profil Perusahaan SELECO
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dfa82e]"
                aria-label="Tutup video"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Konsultasi Tim SELECO"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-center">
                <span className="w-14 h-14 rounded-full bg-[#dfa82e] text-[#0a1420] flex items-center justify-center text-xl font-bold shadow-xl pl-1 mb-3">
                  ▶
                </span>
                <p className="text-sm font-semibold text-white">
                  Video Company Profile &amp; Konsultasi Terpadu SELECO
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Hubungi tim kami untuk jadwal presentasi langsung atau diskusi korporasi
                </p>
                <Link
                  href="/kontak"
                  onClick={() => setVideoModalOpen(false)}
                  className="mt-4 px-5 py-2 rounded-full bg-[#dfa82e] text-[#0a1420] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  Jadwalkan Konsultasi Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </EditableSection>
  );
}
