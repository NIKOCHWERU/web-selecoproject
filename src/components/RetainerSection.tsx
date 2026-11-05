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
    "Konsultasi Korporasi & Bisnis Rutin",
    "Review & Draf Perjanjian Kerjasama Bisnis",
    "Penyusunan Peraturan Perusahaan & SOP HR",
    "Pemantauan Izin Usaha & Kepatuhan OSS RBA",
    "Pendampingan Pajak, Pertanahan & Imigrasi",
    "Mitigasi & Evaluasi Risiko Operasional Perusahaan",
  ];

  return (
    <EditableSection id="retainer" name="Corporate Retainer Section" className="py-12 sm:py-16 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 lg:p-10 shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#dfa82e]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 pl-1 sm:pl-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/35 text-[10px] font-bold uppercase tracking-widest text-[#b88917]">
                <EditableText
                  fieldPath="retainer.badge"
                  fallback="Retainer Korporasi"
                  label="Badge Retainer"
                />
              </div>

              <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-[#0a1420] leading-tight">
                <EditableText
                  fieldPath="retainer.title"
                  fallback="Divisi Konsultan Korporasi Eksternal Bisnis Anda."
                  label="Judul Retainer"
                />
              </h2>

              <div className="w-12 h-0.5 bg-[#dfa82e] rounded-full" />

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                <EditableText
                  fieldPath="retainer.subtitle"
                  fallback="Akses pendampingan konsultan korporasi terpadu sesuai kebutuhan operasional perusahaan, mulai dari perizinan usaha, keimigrasian/TKA, kepatuhan pajak, pertanahan BPN, hingga manajemen SDM tanpa biaya penggajian staf internal."
                  label="Subjudul Retainer"
                  multiline={true}
                />
              </p>

              {/* Grid 6 Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {retainerServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 border-b border-slate-100 py-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#b88917] shrink-0" />
                    <span className="text-xs text-slate-700">
                      <EditableText
                        fieldPath={`retainer.serviceItems.${idx}`}
                        fallback={service}
                        label={`Item Retainer #${idx + 1}`}
                      />
                    </span>
                  </div>
                ))}
              </div>

              {/* Retainer CTA */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-title text-base font-bold text-[#0a1420]">
                    <EditableText
                      fieldPath="retainer.ctaTitle"
                      fallback="Perkuat Tata Kelola & Operasional Perusahaan"
                      label="Judul CTA Retainer"
                    />
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <EditableText
                      fieldPath="retainer.ctaSubtitle"
                      fallback="Konsultan profesional siap mendampingi operasional dan perizinan bisnis Anda."
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
                  className="px-5 py-2.5 bg-[#0a1420] hover:bg-[#b88917] text-white font-bold text-[11px] uppercase tracking-wider rounded-lg transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <EditableIcon
                    iconKey="retainer.ctaIcon"
                    fallbackIcon="Handshake"
                    className="w-3.5 h-3.5"
                    label="Ikon Tombol Retainer"
                  />
                  <span>
                    <EditableText
                      fieldPath="retainer.ctaButtonText"
                      fallback="Diskusikan Layanan Retainer"
                      label="Tombol Retainer"
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm h-64 lg:h-[350px]">
                <EditableImage
                  fieldPath="retainer.image"
                  fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
                  alt="Ruang Konsultasi Korporasi SELECO"
                  label="Foto Ruang Retainer"
                  className="w-full h-full object-cover filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 border-t border-white/20 pt-3 text-center pointer-events-none">
                  <span className="font-serif-title text-sm font-bold text-white block">
                    SELECO External Corporate Team
                  </span>
                  <span className="text-[9px] text-[#dfa82e] font-semibold uppercase tracking-widest mt-0.5 block">
                    Efisiensi Operasional &amp; Total Compliance
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </EditableSection>
  );
}
