'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

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

  const defaultRetainerServices = [
    'Konsultasi hukum dan perizinan rutin via telepon, WhatsApp, atau tatap muka',
    'Review dan penyusunan draf perjanjian kerja sama komersial',
    'Penyusunan dan pembaruan Peraturan Perusahaan serta kontrak kerja',
    'Pemantauan masa berlaku NIB, izin operasional, dan pelaporan LKPM OSS RBA',
    'Pendampingan pajak bulanan, dokumen TKA, dan perizinan pertanahan',
    'Audit kepatuhan berkala agar terhindar dari sanksi administratif',
  ];

  const retainerServices =
    (retainer as any)?.serviceItems && (retainer as any).serviceItems.length > 0
      ? (retainer as any).serviceItems
      : defaultRetainerServices;

  return (
    <EditableSection
      id="retainer"
      name="Corporate Retainer Section"
      className="py-14 md:py-20 bg-[#0a1420] text-white border-y border-white/10"
    >
      {/* Web NH Dark Split Content Layout (Full-bleed, NOT a card) */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Right Image on Desktop */}
          <div className="md:order-2">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-[#dfa82e]/20 aspect-video bg-[#142740]">
              <EditableImage
                fieldPath="retainer.image"
                fallback="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=900&q=80"
                alt="Perpustakaan hukum dengan rak buku dan patung"
                label="Foto Ruang Retainer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 pt-5 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-1">
                <EditableText
                  fieldPath="retainer.ctaTitle"
                  fallback="Skema Retainer yang Pas untuk Skala Perusahaan Anda"
                  label="Judul CTA Retainer"
                />
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                <EditableText
                  fieldPath="retainer.ctaSubtitle"
                  fallback="Sampaikan kebutuhan bulanan tim Anda, kami siapkan proposal ruang lingkup kerja tertulis."
                  label="Subjudul CTA Retainer"
                />
              </p>
            </div>
          </div>

          {/* Left Content */}
          <div className="md:order-1">
            <span className="inline-block px-3 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <EditableText
                fieldPath="retainer.badge"
                fallback="Program Retainer Bulanan"
                label="Badge Retainer"
              />
            </span>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white leading-snug">
              <EditableText
                fieldPath="retainer.title"
                fallback="Tim Legal Siap Pakai, Tanpa Membentuk Divisi Internal."
                label="Judul Retainer"
              />
            </h2>

            <p className="text-sm md:text-base leading-relaxed mb-6 text-slate-300">
              <EditableText
                fieldPath="retainer.subtitle"
                fallback="Satu perjanjian bulanan memberi akses langsung ke konsultan perizinan, pajak, imigrasi, pertanahan, dan ketenagakerjaan dengan biaya yang pasti."
                label="Subjudul Retainer"
                multiline={true}
              />
            </p>

            <ul className="space-y-2.5 mb-7">
              {retainerServices.map((service: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <CheckCircle size={17} className="text-[#dfa82e] shrink-0 mt-0.5" />
                  <span>
                    <EditableText
                      fieldPath={`retainer.serviceItems.${idx}`}
                      fallback={service}
                      label={`Item Retainer #${idx + 1}`}
                    />
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/kontak"
              onClick={(e) => {
                if (isEditMode) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              className="inline-flex items-center gap-2 bg-[#dfa82e] text-[#0a1420] px-6 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition cursor-pointer"
            >
              <EditableText
                fieldPath="retainer.ctaButtonText"
                fallback="Minta Proposal Retainer"
                label="Tombol Retainer"
              />
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </EditableSection>
  );
}
