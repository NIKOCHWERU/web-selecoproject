'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function Hero() {
  const { content } = useContent();
  const [isEditMode, setIsEditMode] = useState(false);
  const hero = content?.hero;
  const global = content?.global;
  const totalServices = global?.totalServices || '445+';

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
    <EditableSection
      id="hero"
      name="Hero Banner Section"
      className="relative overflow-hidden min-h-screen flex items-center bg-[#0a1420] text-white"
    >
      {/* Keep SELECO Hero Background Video & Legal Poster */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          key={hero?.bgVideo || '/bg_hero.mp4'}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1920&q=80"
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={hero?.bgVideo || '/bg_hero.mp4'} type="video/mp4" />
          <source src="/bg_hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0a1420]/75" />
      </div>

      {/* Exact Web NH Hero Content Structure (Refined Proportions) */}
      <div className="container mx-auto px-4 max-w-5xl relative z-10 pt-24 pb-14">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfa82e]/20 border border-[#dfa82e]/40 text-[#dfa82e] text-[11px] font-bold uppercase tracking-widest mb-4">
          <EditableText
            fieldPath="hero.topBadge"
            fallback="Lima Bidang, Satu Tim Terpadu"
            label="Label Atas Hero"
          />
        </span>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold mb-4 leading-[1.18] tracking-tight uppercase font-sans text-white max-w-4xl">
          <EditableText
            fieldPath="hero.headlinePart1"
            fallback="Satu Mitra Hukum untuk Semua Kebutuhan Legal Usaha Anda,"
            label="Judul Bagian 1"
          />{' '}
          <span className="text-[#dfa82e]">
            <EditableText
              fieldPath="hero.headlineItalic"
              fallback="di Seluruh Indonesia."
              label="Judul Accent"
            />
          </span>
        </h1>

        <p className="text-sm md:text-[15px] mb-7 max-w-2xl leading-relaxed text-slate-200 border-l-4 border-[#dfa82e] pl-4 font-normal">
          {isEditMode ? (
            <EditableText
              fieldPath="hero.subheadline"
              fallback="Layanan komprehensif dan terintegrasi untuk perizinan, imigrasi, pajak, pertanahan, dan ketenagakerjaan. Dapatkan langkah yang lebih efektif dan hasil yang pasti bersama SELECO, sebab #YouBetterWithUs."
              label="Subjudul Hero"
              multiline={true}
            />
          ) : (
            (
              hero?.subheadline ||
              'Layanan komprehensif dan terintegrasi untuk perizinan, imigrasi, pajak, pertanahan, dan ketenagakerjaan. Dapatkan langkah yang lebih efektif dan hasil yang pasti bersama SELECO, sebab #YouBetterWithUs.'
            )
              .split(/(#YouBetterWithUs)/g)
              .map((part: string, i: number) =>
                part === '#YouBetterWithUs' ? (
                  <span key={i} className="text-[#dfa82e] font-bold tracking-wide">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                )
              )
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={hero?.ctaButton1Link || '/layanan'}
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="inline-flex items-center gap-2 bg-[#dfa82e] text-[#0a1420] px-6 py-3.5 rounded font-bold uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl"
          >
            <EditableText
              fieldPath="hero.ctaButton1Text"
              fallback={`Jelajahi ${totalServices} Layanan`}
              label="Tombol 1 (Teks & Link)"
              linkPath="hero.ctaButton1Link"
              fallbackLink="/layanan"
            />
            <ArrowRight size={15} />
          </Link>

          <Link
            href={hero?.ctaButton2Link || '/kontak'}
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="inline-flex items-center gap-2 border border-white/80 text-white px-6 py-3.5 rounded font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-[#0a1420] transition-all"
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

        {/* 5 Pillar Strip */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-200">
          {(
            hero?.featurePills || [
              'Perizinan Usaha & OSS',
              'Keimigrasian & TKA',
              'Perpajakan Korporasi',
              'Pertanahan & BPN',
              'Ketenagakerjaan & SDM',
            ]
          ).map((pill, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 font-medium">
              <span className="text-[#dfa82e] font-bold">0{idx + 1}</span>
              <EditableText
                fieldPath={`hero.featurePills.${idx}`}
                fallback={pill}
                label={`Fitur Pill #${idx + 1}`}
              />
            </span>
          ))}
        </div>
      </div>
    </EditableSection>
  );
}
