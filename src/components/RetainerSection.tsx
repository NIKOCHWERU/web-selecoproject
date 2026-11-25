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
    <EditableSection id="retainer" name="Corporate Retainer Section" className="section-y bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#0a1420] text-white rounded-md p-6 sm:p-10 lg:p-12 border border-[#dfa82e]/25 border-t-2 border-t-[#dfa82e] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="eyebrow-legal-dark">
                <EditableText
                  fieldPath="retainer.badge"
                  fallback="Retainer Korporasi"
                  label="Badge Retainer"
                />
              </div>

              <h2 className="font-serif-title heading-section text-white">
                <EditableText
                  fieldPath="retainer.title"
                  fallback="Divisi Konsultan Korporasi Eksternal Bisnis Anda."
                  label="Judul Retainer"
                />
              </h2>

              <div className="w-16 h-[1.5px] bg-[#dfa82e]" />

              <p className="text-sm text-slate-200 leading-[1.75] font-normal">
                <EditableText
                  fieldPath="retainer.subtitle"
                  fallback="Akses pendampingan konsultan korporasi terpadu sesuai kebutuhan operasional perusahaan, mulai dari perizinan usaha, keimigrasian/TKA, kepatuhan pajak, pertanahan BPN, hingga manajemen SDM tanpa biaya penggajian staf internal."
                  label="Subjudul Retainer"
                  multiline={true}
                />
              </p>

              {/* Grid 6 Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-1">
                {retainerServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 border-b border-white/10 py-2.5"
                  >
                    <span className="font-serif-title text-xs font-semibold text-[#dfa82e] mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs sm:text-[0.8125rem] text-slate-200 leading-snug">
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
              <div className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-title text-lg font-bold text-white">
                    <EditableText
                      fieldPath="retainer.ctaTitle"
                      fallback="Perkuat Tata Kelola & Operasional Perusahaan"
                      label="Judul CTA Retainer"
                    />
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
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
                      fallback="Diskusikan Layanan Retainer"
                      label="Tombol Retainer"
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-md overflow-hidden border border-[#dfa82e]/30 h-72 lg:h-[400px]">
                <EditableImage
                  fieldPath="retainer.image"
                  fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
                  alt="Perpustakaan hukum dengan rak buku dan patung"
                  label="Foto Ruang Retainer"
                  className="w-full h-full object-cover filter brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/95 via-[#0a1420]/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 border-t border-[#dfa82e]/40 pt-3.5 text-center pointer-events-none">
                  <span className="font-serif-title text-base font-bold text-white block">
                    SELECO External Corporate Team
                  </span>
                  <span className="text-xs text-[#dfa82e] font-medium tracking-wide mt-1 block">
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
