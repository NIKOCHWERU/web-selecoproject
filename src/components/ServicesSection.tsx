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
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="section-y bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="eyebrow-legal mb-3">
              <EditableText
                fieldPath="services.badge"
                fallback="5 Pilar Layanan Konsultan Terpadu"
                label="Badge Layanan"
              />
            </div>
            <h2 className="font-serif-title heading-section text-[#0a1420]">
              <EditableText
                fieldPath="services.title"
                fallback={`${totalServices} Layanan Konsultan Terpadu`}
                label="Judul Layanan"
              />
            </h2>
            <div className="w-16 h-[1.5px] bg-[#dfa82e] my-4" />
            <p className="text-sm text-slate-600 leading-[1.7] font-normal">
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
              className="btn btn-dark"
            >
              <span>Jelajahi Seluruh Layanan</span>
            </Link>
          </div>
        </div>

        {/* 5 Executive Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 sm:mb-12">
          {pillars.map((cat, idx) => {
            const fallbackLink = cat.linkUrl || `/layanan?cat=${cat.id}`;
            const currentLink = services?.pillars?.[idx]?.linkUrl || fallbackLink;
            const defaultPillarImages = [
              "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
            ];
            const cardImg = cat.image || defaultPillarImages[idx % defaultPillarImages.length];

            return (
              <motion.div
                key={cat.id || idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="relative group overflow-hidden rounded-md border border-[#0f2034]/20 hover:border-[#dfa82e]/80 min-h-[330px] flex flex-col justify-end text-left transition-colors bg-[#0a1420]"
              >
                {/* Background image with deep navy editorial scrim */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cardImg}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-opacity duration-500 opacity-55 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420] via-[#0a1420]/85 to-[#0a1420]/30"></div>
                </div>

                {/* Top Practice Index & Count */}
                <div className="absolute top-4 left-5 right-5 z-10 flex items-center justify-between">
                  <span className="font-serif-title text-sm font-semibold text-[#dfa82e]">
                    0{idx + 1}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#0a1420]/85 border border-[#dfa82e]/35 text-[#dfa82e] text-xs font-semibold">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.count`}
                      fallback={cat.count || '242 Items'}
                      label={`Jumlah ${cat.name}`}
                    />
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 flex flex-col justify-end text-white">
                  <div className="w-9 h-9 rounded bg-[#dfa82e]/15 text-[#dfa82e] flex items-center justify-center mb-3.5 border border-[#dfa82e]/35">
                    <EditableIcon
                      iconKey={`services.pillars.${idx}.icon`}
                      fallbackIcon={cat.iconName || 'FileCheck'}
                      className="w-4 h-4"
                      label={`Ikon Pilar ${idx + 1}`}
                    />
                  </div>

                  <h3 className="font-serif-title text-xl sm:text-[1.35rem] font-bold mb-2 text-white leading-snug group-hover:text-[#dfa82e] transition-colors">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.name`}
                      fallback={cat.name}
                      label={`Nama Pilar ${idx + 1}`}
                      as="span"
                    />
                  </h3>

                  <div className="text-xs sm:text-[0.8125rem] text-slate-200 leading-relaxed line-clamp-2 font-normal mb-3.5">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.description`}
                      fallback={cat.description}
                      label={`Deskripsi Pilar ${idx + 1}`}
                      multiline={true}
                      as="p"
                    />
                  </div>

                  <div className="w-10 h-px bg-[#dfa82e]/70 mb-3.5"></div>

                  <Link
                    href={currentLink}
                    onClick={(e) => {
                      if (isEditMode) {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                    className="inline-flex items-center justify-between w-full pt-2.5 border-t border-white/10 text-xs font-bold tracking-wide text-[#dfa82e] group-hover:text-white transition-colors"
                  >
                    <EditableText
                      fieldPath={`services.pillars.${idx}.linkText`}
                      fallback={cat.linkText || `Lihat Seluruh ${cat.count}`}
                      label={`Teks Link Pilar ${idx + 1}`}
                      linkPath={`services.pillars.${idx}.linkUrl`}
                      fallbackLink={fallbackLink}
                    />
                    <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-[#dfa82e] group-hover:text-[#0a1420] flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Directory Banner */}
        <div className="rounded-2xl bg-[#0a1420] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#dfa82e]/35 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#dfa82e]" />
          <div className="space-y-2.5 z-10 max-w-2xl pl-1 sm:pl-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#dfa82e]/15 border border-[#dfa82e]/35 text-xs font-bold tracking-wide text-[#dfa82e]">
              Direktori Lengkap &amp; Pencarian Terpadu
            </span>
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-white">
              <EditableText
                fieldPath="services.ctaBannerTitle"
                fallback="Membutuhkan Solusi Konsultan Spesifik untuk Bisnis Anda?"
                label="Judul Banner Layanan"
              />
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
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
            className="px-5 py-2.5 bg-[#dfa82e] hover:bg-white text-[#0a1420] font-bold text-xs tracking-wide rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 shrink-0 z-10 cursor-pointer"
          >
            <EditableIcon
              iconKey="services.ctaBannerIcon"
              fallbackIcon="Search"
              className="w-3.5 h-3.5 text-[#0a1420]"
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
