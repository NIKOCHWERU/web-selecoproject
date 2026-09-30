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
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="py-20 lg:py-28 bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header — left-aligned, not centered, to break uniform rhythm */}
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b88917] mb-3">
            <EditableText
              fieldPath="services.badge"
              fallback="5 Pilar Layanan Konsultan Terpadu"
              label="Badge Layanan"
            />
          </p>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f2034] leading-tight">
            <EditableText
              fieldPath="services.title"
              fallback={`${totalServices} Layanan Konsultan Terpadu`}
              label="Judul Layanan"
            />
          </h2>
          <div className="w-10 h-[2px] bg-[#b88917] my-5" />
          <p className="text-sm text-slate-500 leading-relaxed">
            <EditableText
              fieldPath="services.subtitle"
              fallback="Solusi konsultan komprehensif mencakup Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM untuk akselerasi dan kepatuhan operasional bisnis Anda."
              label="Subjudul Layanan"
              multiline={true}
            />
          </p>
        </div>

        {/* Categories: 5 cards in two rows (3 + 2) — natural break since there are 5 pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200/80 border border-gray-200/80 rounded-xl overflow-hidden mb-12">
          {pillars.map((cat, idx) => {
            const fallbackLink = cat.linkUrl || `/layanan?cat=${cat.id}`;
            const currentLink = services?.pillars?.[idx]?.linkUrl || fallbackLink;

            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="bg-white p-7 flex flex-col justify-between hover:bg-[#0f2034] group transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 flex items-center justify-center border border-[#0f2034]/20 rounded group-hover:border-[#b88917]/40 transition-colors">
                      <EditableIcon
                        iconKey={`services.pillars.${idx}.icon`}
                        fallbackIcon={cat.iconName || 'FileCheck'}
                        className="w-5 h-5 text-[#0f2034] group-hover:text-[#b88917] transition-colors"
                        label={`Ikon Pilar ${idx + 1}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white/40 uppercase tracking-widest transition-colors">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.count`}
                        fallback={cat.count || '242 Items'}
                        label={`Jumlah ${cat.name}`}
                      />
                    </span>
                  </div>

                  <h3 className="font-serif-title text-lg font-bold text-[#0f2034] group-hover:text-white mb-2.5 transition-colors">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.name`}
                      fallback={cat.name}
                      label={`Nama Pilar ${idx + 1}`}
                      as="span"
                    />
                  </h3>
                  <div className="text-xs text-slate-500 group-hover:text-white/60 leading-relaxed mb-5 font-normal transition-colors">
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
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#b88917] group-hover:text-[#d4a024] border-t border-gray-100 group-hover:border-white/10 pt-4 transition-colors"
                >
                  <EditableText
                    fieldPath={`services.pillars.${idx}.linkText`}
                    fallback={cat.linkText || `Lihat Seluruh ${cat.count}`}
                    label={`Teks Link Pilar ${idx + 1}`}
                    linkPath={`services.pillars.${idx}.linkUrl`}
                    fallbackLink={fallbackLink}
                  />
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Directory Banner */}
        <div className="bg-[#0f2034] text-white rounded-xl p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10 relative overflow-hidden">
          {/* Left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#b88917]" />
          <div className="space-y-2 pl-4 z-10">
            <p className="text-[10px] text-[#b88917] font-bold uppercase tracking-widest">Direktori Lengkap</p>
            <h3 className="font-serif-title text-xl lg:text-2xl font-bold text-white">
              <EditableText
                fieldPath="services.ctaBannerTitle"
                fallback="Membutuhkan Solusi Konsultan Spesifik untuk Bisnis Anda?"
                label="Judul Banner Layanan"
              />
            </h3>
            <p className="text-xs text-white/50 max-w-xl">
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
            className="px-7 py-3.5 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] font-bold text-[11px] uppercase tracking-wider rounded transition-all whitespace-nowrap flex items-center gap-2 shrink-0 z-10"
          >
            <EditableIcon
              iconKey="services.ctaBannerIcon"
              fallbackIcon="Search"
              className="w-3.5 h-3.5"
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
