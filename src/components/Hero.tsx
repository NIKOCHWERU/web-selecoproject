'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
    <EditableSection id="hero" name="Hero Banner Section" className="relative flex items-center justify-center overflow-hidden min-h-[calc(100vh-4rem)] py-12 sm:py-16 lg:py-20 bg-[#0a1420] text-white border-b border-[#dfa82e]/30">
      {/* Looping Corporate Background Video */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          key={hero?.bgVideo || '/bg_hero.mp4'}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover scale-105 opacity-40 lg:opacity-50 transition-opacity duration-700"
        >
          <source src={hero?.bgVideo || '/bg_hero.mp4'} type="video/mp4" />
          <source src="/bg_hero.mp4" type="video/mp4" />
        </video>
        {/* Darkened Deep Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1420]/95 via-[#0a1420]/85 to-[#0a1420]/92 z-10" />
        <div className="absolute inset-0 bg-[#0a1420]/40 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/60 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Spacious Wide Layout - Vertically Centered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl lg:max-w-5xl space-y-5 sm:space-y-6"
        >
          {/* Main Punchy Headline */}
          <h1 className="font-serif-title text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.22] text-white">
            <EditableText
              fieldPath="hero.headlinePart1"
              fallback="Konsultan Terpadu untuk Akselerasi &"
              label="Judul Bagian 1"
            />{' '}
            <span className="text-[#dfa82e] italic">
              <EditableText
                fieldPath="hero.headlineItalic"
                fallback="Pertumbuhan Bisnis."
                label="Judul Miring Accent"
              />
            </span>
          </h1>

          {/* Divider Line */}
          <div className="w-16 h-0.5 bg-[#dfa82e]" />

          {/* Subheadline description */}
          <p className="text-sm sm:text-base text-slate-200/90 font-normal leading-relaxed max-w-3xl">
            <EditableText
              fieldPath="hero.subheadline"
              fallback="Seleco Project menghadirkan lima pilar layanan konsultasi korporasi yang profesional dan terintegrasi, meliputi perizinan, keimigrasian, perpajakan, pertanahan, serta pengembangan dan pelatihan SDM. Setiap layanan diberikan dengan mengutamakan transparansi, akurasi, dan profesionalisme untuk mendukung kebutuhan serta keberlangsungan bisnis Anda."
              label="Subjudul Hero"
              multiline={true}
            />
          </p>

          {/* Dual Action Buttons (Clear CTAs) */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 pt-2">
            <Link
              href={hero?.ctaButton1Link || '/layanan'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="btn btn-primary"
            >
              <EditableText
                fieldPath="hero.ctaButton1Text"
                fallback={`Cari ${totalServices} Layanan Konsultan`}
                label="Tombol 1 (Teks & Link)"
                linkPath="hero.ctaButton1Link"
                fallbackLink="/layanan"
              />
            </Link>

            <Link
              href={hero?.ctaButton2Link || '/kontak'}
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="btn btn-secondary"
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

          {/* Pillar list: label from the former top badge, then the five service names */}
          <div className="pt-5 border-t border-white/15">
            <p className="text-sm font-semibold text-[#dfa82e] mb-2">
              <EditableText
                fieldPath="hero.topBadge"
                fallback="5 Pilar Konsultan Bisnis Terpadu"
                label="Label Atas Hero"
              />
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
              {(hero?.featurePills || ['Konsultan Perizinan', 'Konsultan Imigrasi', 'Konsultan Pajak', 'Konsultan Pertanahan', 'Konsultan SDM']).map((pill, idx) => (
                <li key={idx} className="text-sm font-medium text-slate-200">
                  <EditableText
                    fieldPath={`hero.featurePills.${idx}`}
                    fallback={pill}
                    label={`Fitur Pill #${idx + 1}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </EditableSection>
  );
}
