'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Building2, Receipt, Globe, Landmark, FileCheck, Search, Users, ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection, EditableIcon } from './EditableElement';

export default function ServicesSection() {
  const { content } = useContent();
  const [isEditMode, setIsEditMode] = useState(false);
  const services = content?.services;
  const global = content?.global;
  const totalServices = global?.totalServices || content?.hero?.stat2Number || '445+';

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

  const defaultPillars = [
    {
      id: 'perizinan',
      name: 'Konsultan Perizinan',
      count: '242 Items',
      description: 'Pendirian Badan Usaha (PT/CV/PMA), Izin Usaha Berbasis Risiko OSS RBA, NIB, Sertifikat Standar, PB UMKU, Izin Operasional Sektoral, BPOM, Halal & SNI.',
      linkText: 'Lihat Seluruh 242 Layanan',
      linkUrl: '/layanan?cat=perizinan',
      iconName: 'FileCheck',
    },
    {
      id: 'imigrasi',
      name: 'Konsultan Imigrasi',
      count: '36 Items',
      description: 'Pengurusan VISA Bisnis/Investor, KITAS/ITAS Kerja, ITAP Izin Tinggal Tetap, RPTKA Tenaga Kerja Asing, Paspor, dan Layanan Keimigrasian WNA/WNI.',
      linkText: 'Lihat Seluruh 36 Layanan',
      linkUrl: '/layanan?cat=imigrasi',
      iconName: 'Globe',
    },
    {
      id: 'pajak',
      name: 'Konsultan Pajak',
      count: '86 Items',
      description: 'Tax Advisory & Planning, Kepatuhan Pajak Badan & Pribadi, Pelaporan SPT Masa & Tahunan, Restitusi Pajak, dan Pendampingan Pemeriksaan Pajak.',
      linkText: 'Lihat Seluruh 86 Layanan',
      linkUrl: '/layanan?cat=pajak',
      iconName: 'Receipt',
    },
    {
      id: 'pertanahan',
      name: 'Konsultan Pertanahan',
      count: '45 Items',
      description: 'Pengurusan Sertifikat Tanah BPN (SHM, HGB, HGU), Pengecekan Keabsahan Sertifikat, Balik Nama, Roya Hak Tanggungan, KKPR Tata Ruang, serta PBG & SLF.',
      linkText: 'Lihat Seluruh 45 Layanan',
      linkUrl: '/layanan?cat=pertanahan',
      iconName: 'Landmark',
    },
    {
      id: 'sdm',
      name: 'Konsultan SDM',
      count: '36 Items',
      description: 'Penyusunan Peraturan Perusahaan (PP), Perjanjian Kerja Bersama (PKB), Struktur & Skala Upah, Kontrak Kerja Karyawan PKWT/PKWTT, BPJS, dan Audit SDM.',
      linkText: 'Lihat Seluruh 36 Layanan',
      linkUrl: '/layanan?cat=sdm',
      iconName: 'Users',
    },
  ];

  const pillars: any[] = (services?.pillars && services.pillars.length > 0) ? services.pillars : defaultPillars;

  return (
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="py-20 lg:py-28 bg-[#0a1420] border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#dfa82e] mb-4">
              <EditableText
                fieldPath="services.badge"
                fallback="5 Pilar Layanan Konsultan Terpadu"
                label="Badge Layanan"
              />
            </div>
            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              <EditableText
                fieldPath="services.title"
                fallback={`${totalServices} Layanan Konsultan Terpadu`}
                label="Judul Layanan"
              />
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mt-4">
              <EditableText
                fieldPath="services.subtitle"
                fallback="Solusi konsultan komprehensif mencakup Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM untuk akselerasi dan kepatuhan operasional bisnis Anda."
                label="Subjudul Layanan"
                multiline={true}
              />
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#dfa82e]/50 text-xs font-bold uppercase tracking-wider text-white hover:text-[#dfa82e] transition-all"
            >
              <span>Jelajahi Seluruh Layanan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Eventure-style 5 Modern Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((cat, idx) => {
            const fallbackLink = cat.linkUrl || `/layanan?cat=${cat.id}`;
            const currentLink = services?.pillars?.[idx]?.linkUrl || fallbackLink;

            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-3xl bg-[#0f2034]/80 border border-white/10 hover:border-[#dfa82e]/50 p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 shadow-xl group backdrop-blur-sm relative overflow-hidden"
              >
                {/* Subtle top ambient glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#dfa82e]/5 rounded-full blur-2xl group-hover:bg-[#dfa82e]/10 transition-all pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#dfa82e]/15 group-hover:border-[#dfa82e]/30 transition-all">
                      <EditableIcon
                        iconKey={`services.pillars.${idx}.icon`}
                        fallbackIcon={cat.iconName || 'FileCheck'}
                        className="w-6 h-6 text-[#dfa82e] group-hover:scale-110 transition-transform"
                        label={`Ikon Pilar ${idx + 1}`}
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-[#dfa82e] group-hover:border-[#dfa82e]/30 transition-colors">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.count`}
                        fallback={cat.count || '242 Items'}
                        label={`Jumlah ${cat.name}`}
                      />
                    </span>
                  </div>

                  <h3 className="font-serif-title text-xl font-bold text-white group-hover:text-[#dfa82e] mb-3 transition-colors">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.name`}
                      fallback={cat.name}
                      label={`Nama Pilar ${idx + 1}`}
                      as="span"
                    />
                  </h3>

                  <div className="text-xs sm:text-sm text-slate-300 group-hover:text-white/90 leading-relaxed mb-6 font-normal transition-colors">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.description`}
                      fallback={cat.description}
                      label={`Deskripsi Pilar ${idx + 1}`}
                      multiline={true}
                      as="p"
                    />
                  </div>
                </div>

                <Link
                  href={currentLink}
                  onClick={(e) => {
                    if (isEditMode) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs font-bold uppercase tracking-wider text-[#dfa82e] group-hover:text-white transition-colors"
                >
                  <EditableText
                    fieldPath={`services.pillars.${idx}.linkText`}
                    fallback={cat.linkText || `Lihat Seluruh ${cat.count}`}
                    label={`Teks Link Pilar ${idx + 1}`}
                    linkPath={`services.pillars.${idx}.linkUrl`}
                    fallbackLink={fallbackLink}
                  />
                  <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#dfa82e] group-hover:text-[#0a1420] flex items-center justify-center transition-all">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Directory Banner — Modern Eventure Rounded Strip */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f2034] via-[#142940] to-[#0f2034] text-white p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-[#dfa82e]">
              Direktori Lengkap &amp; Pencarian Terpadu
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              <EditableText
                fieldPath="services.ctaBannerTitle"
                fallback="Membutuhkan Solusi Konsultan Spesifik untuk Bisnis Anda?"
                label="Judul Banner Layanan"
              />
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <EditableText
                fieldPath="services.ctaBannerSubtitle"
                fallback={`Gunakan pencarian interaktif kami untuk menemukan ${totalServices} solusi layanan Konsultan Perizinan, Imigrasi, Pajak, Pertanahan, dan SDM.`}
                label="Subjudul Banner Layanan"
                multiline={true}
              />
            </p>
          </div>
          <Link
            href="/layanan"
            onClick={(e) => {
              if (isEditMode) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-[#0a1420] font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#dfa82e]/20 transition-all whitespace-nowrap flex items-center gap-2.5 shrink-0 z-10"
          >
            <EditableIcon
              iconKey="services.ctaBannerIcon"
              fallbackIcon="Search"
              className="w-4 h-4"
              label="Ikon Tombol Banner"
            />
            <EditableText
              fieldPath="services.ctaBannerButtonText"
              fallback={`Buka Direktori ${totalServices} Layanan`}
              label="Tombol Banner Layanan"
            />
          </Link>
        </div>

      </div>
    </EditableSection>
  );
}
