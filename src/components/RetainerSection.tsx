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
    <EditableSection id="retainer" name="Corporate Retainer Section" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-amber-400/30 relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <EditableIcon
                  iconKey="retainer.badgeIcon"
                  fallbackIcon="ShieldCheck"
                  className="w-4 h-4 text-amber-300"
                  label="Ikon Badge Retainer"
                />
                <EditableText
                  fieldPath="retainer.badge"
                  fallback="RETAINER KORPORASI"
                  label="Badge Retainer"
                />
              </div>

              <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                <EditableText
                  fieldPath="retainer.title"
                  fallback="Divisi Konsultan Korporasi Eksternal Bisnis Anda."
                  label="Judul Retainer"
                />
              </h2>

              <div className="w-16 h-[3px] bg-gradient-to-r from-gold-accent to-gold-bright rounded-full" />

              <p className="text-base text-slate-300 leading-relaxed font-normal">
                <EditableText
                  fieldPath="retainer.subtitle"
                  fallback="Akses pendampingan konsultan korporasi terpadu sesuai kebutuhan operasional perusahaan—mulai dari perizinan usaha, keimigrasian/TKA, kepatuhan pajak, pertanahan BPN, hingga manajemen SDM tanpa biaya penggajian staf internal."
                  label="Subjudul Retainer"
                  multiline={true}
                />
              </p>

              {/* Grid 6 Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {retainerServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl hover:border-amber-400/50 hover:bg-white/10 transition-all duration-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs font-semibold text-white/95">
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
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h4 className="font-serif-title text-xl font-bold text-white">
                    <EditableText
                      fieldPath="retainer.ctaTitle"
                      fallback="Perkuat Tata Kelola & Operasional Perusahaan"
                      label="Judul CTA Retainer"
                    />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
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
                  className="px-7 py-3.5 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-md flex items-center gap-2"
                >
                  <EditableIcon
                    iconKey="retainer.ctaIcon"
                    fallbackIcon="Handshake"
                    className="w-4 h-4 text-slate-950"
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
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/40 shadow-2xl h-80 lg:h-[420px]">
                <EditableImage
                  fieldPath="retainer.image"
                  fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
                  alt="Ruang Konsultasi Korporasi SELECO"
                  label="Foto Ruang Retainer"
                  className="w-full h-full object-cover filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 p-5 bg-slate-900/90 backdrop-blur-md border border-amber-400/30 rounded-xl text-center pointer-events-none">
                  <span className="font-serif-title text-lg font-bold text-white block">
                    SELECO External Corporate Team
                  </span>
                  <span className="text-[10px] text-amber-300 font-semibold uppercase tracking-widest mt-1 block">
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
