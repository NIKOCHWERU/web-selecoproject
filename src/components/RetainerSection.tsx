'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Handshake } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection, EditableIcon } from './EditableElement';

export default function RetainerSection() {
  const { content } = useContent();
  const [isEditMode, setIsEditMode] = useState(false);
  const retainer = content?.retainer;

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

  const retainerServices = [
    "Konsultasi hukum dan perizinan rutin via telepon, WhatsApp, atau tatap muka",
    "Pemeriksaan dan penyusunan draf perjanjian kerja sama komersial",
    "Penyusunan serta pembaruan Peraturan Perusahaan dan kontrak kerja karyawan",
    "Pemantauan masa berlaku NIB, izin operasional, dan pelaporan LKPM OSS RBA",
    "Pendampingan kepatuhan pajak bulanan, dokumen TKA, dan perizinan pertanahan",
    "Audit kepatuhan berkala untuk mencegah sanksi administratif instansi",
  ];

  return (
    <EditableSection id="retainer" name="Corporate Retainer Section" className="section-y bg-[#0a1420] text-white border-y border-[#dfa82e]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Top Editorial Split (Full-Bleed Band, No Card Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="eyebrow-legal-dark">
              <EditableText
                fieldPath="retainer.badge"
                fallback="Program Retainer Bulanan"
                label="Badge Retainer"
              />
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-white leading-[1.16] tracking-[-0.015em]">
              <EditableText
                fieldPath="retainer.title"
                fallback="Pendampingan Hukum Berkelanjutan Tanpa Membentuk Divisi Internal."
                label="Judul Retainer"
              />
            </h2>

            <div className="w-20 h-[1.5px] bg-[#dfa82e]" />

            <p className="text-sm sm:text-base text-slate-200 leading-[1.75] font-normal max-w-2xl">
              <EditableText
                fieldPath="retainer.subtitle"
                fallback="Perusahaan Anda mendapatkan akses langsung ke konsultan perizinan, pajak, imigrasi, pertanahan, dan ketenagakerjaan dalam satu perjanjian bulanan yang pasti."
                label="Subjudul Retainer"
                multiline={true}
              />
            </p>
          </div>

          <div className="lg:col-span-5">
            <figure className="space-y-3">
              <div className="relative overflow-hidden border border-[#dfa82e]/25 h-64 sm:h-72 lg:h-80">
                <EditableImage
                  fieldPath="retainer.image"
                  fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
                  alt="Perpustakaan hukum dengan rak buku dan patung"
                  label="Foto Ruang Retainer"
                  className="w-full h-full object-cover filter brightness-[0.82]"
                />
              </div>
              <figcaption className="flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-2.5">
                <span className="font-serif-title text-sm font-semibold text-white">
                  SELECO Corporate Retainer
                </span>
                <span className="text-[#dfa82e]">
                  Pendampingan Hukum &amp; Kepatuhan Bulanan
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Middle Ruled Engagement Ledger (No Cards) */}
        <div className="border-y border-[#dfa82e]/25">
          <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x divide-white/10">
            <div className="divide-y divide-white/10">
              {retainerServices.slice(0, 3).map((service, idx) => (
                <div key={idx} className="flex items-baseline gap-4 py-4 md:pr-8">
                  <span className="font-serif-title text-lg font-semibold text-[#dfa82e] shrink-0 tabular-nums">
                    0{idx + 1}
                  </span>
                  <span className="text-sm text-slate-100 leading-relaxed">
                    <EditableText
                      fieldPath={`retainer.serviceItems.${idx}`}
                      fallback={service}
                      label={`Item Retainer #${idx + 1}`}
                    />
                  </span>
                </div>
              ))}
            </div>
            <div className="divide-y divide-white/10 border-t border-white/10 md:border-t-0">
              {retainerServices.slice(3, 6).map((service, idx) => {
                const realIdx = idx + 3;
                return (
                  <div key={realIdx} className="flex items-baseline gap-4 py-4 md:pl-8">
                    <span className="font-serif-title text-lg font-semibold text-[#dfa82e] shrink-0 tabular-nums">
                      0{realIdx + 1}
                    </span>
                    <span className="text-sm text-slate-100 leading-relaxed">
                      <EditableText
                        fieldPath={`retainer.serviceItems.${realIdx}`}
                        fallback={service}
                        label={`Item Retainer #${realIdx + 1}`}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif-title text-2xl font-semibold text-white">
              <EditableText
                fieldPath="retainer.ctaTitle"
                fallback="Butuh Skema Retainer Sesuai Skala Perusahaan?"
                label="Judul CTA Retainer"
              />
            </h3>
            <p className="text-sm text-slate-300">
              <EditableText
                fieldPath="retainer.ctaSubtitle"
                fallback="Sampaikan kebutuhan bulanan tim Anda untuk mendapatkan proposal ruang lingkup kerja tertulis."
                label="Subjudul CTA Retainer"
              />
            </p>
          </div>
          <Link
            href="/kontak"
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="btn btn-primary shrink-0"
          >
            <EditableIcon
              iconKey="retainer.ctaIcon"
              fallbackIcon="Handshake"
              className="w-4 h-4"
              label="Ikon Tombol Retainer"
            />
            <span>
              <EditableText
                fieldPath="retainer.ctaButtonText"
                fallback="Minta Proposal Retainer"
                label="Tombol Retainer"
              />
            </span>
          </Link>
        </div>

      </div>
    </EditableSection>
  );
}
