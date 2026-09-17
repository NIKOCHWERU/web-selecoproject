'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Building2, Receipt, Stethoscope, Globe, Landmark, Zap, FileCheck, Ship, ArrowRight, Search, Users } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/layananData';
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-6 h-6 text-gold-accent" />;
      case 'Scale': return <Scale className="w-6 h-6 text-gold-accent" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-gold-accent" />;
      case 'Receipt': return <Receipt className="w-6 h-6 text-gold-accent" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-gold-accent" />;
      case 'Globe': return <Globe className="w-6 h-6 text-gold-accent" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-gold-accent" />;
      case 'Zap': return <Zap className="w-6 h-6 text-gold-accent" />;
      case 'FileCheck': return <FileCheck className="w-6 h-6 text-gold-accent" />;
      case 'Ship': return <Ship className="w-6 h-6 text-gold-accent" />;
      default: return <FileCheck className="w-6 h-6 text-gold-accent" />;
    }
  };

  const defaultPillars = [
    {
      id: "perizinan",
      name: "Konsultan Perizinan",
      count: "242 Items",
      description: "Pendirian Badan Usaha (PT/CV/PMA), Izin Usaha Berbasis Risiko OSS RBA, NIB, Sertifikat Standar, PB UMKU, Izin Operasional Sektoral, BPOM, Halal & SNI.",
      linkText: "Lihat Seluruh 242 Layanan",
      linkUrl: "/layanan?cat=perizinan",
      iconName: "FileCheck"
    },
    {
      id: "imigrasi",
      name: "Konsultan Imigrasi",
      count: "36 Items",
      description: "Pengurusan VISA Bisnis/Investor, KITAS/ITAS Kerja, ITAP Izin Tinggal Tetap, RPTKA Tenaga Kerja Asing, Paspor, dan Layanan Keimigrasian WNA/WNI.",
      linkText: "Lihat Seluruh 36 Layanan",
      linkUrl: "/layanan?cat=imigrasi",
      iconName: "Globe"
    },
    {
      id: "pajak",
      name: "Konsultan Pajak",
      count: "86 Items",
      description: "Tax Advisory & Planning, Kepatuhan Pajak Badan & Pribadi, Pelaporan SPT Masa & Tahunan, Restitusi Pajak, dan Pendampingan Pemeriksaan Pajak.",
      linkText: "Lihat Seluruh 86 Layanan",
      linkUrl: "/layanan?cat=pajak",
      iconName: "Receipt"
    },
    {
      id: "pertanahan",
      name: "Konsultan Pertanahan",
      count: "45 Items",
      description: "Pengurusan Sertifikat Tanah BPN (SHM, HGB, HGU), Pengecekan Keabsahan Sertifikat, Balik Nama, Roya Hak Tanggungan, KKPR Tata Ruang, serta PBG & SLF.",
      linkText: "Lihat Seluruh 45 Layanan",
      linkUrl: "/layanan?cat=pertanahan",
      iconName: "Landmark"
    },
    {
      id: "sdm",
      name: "Konsultan SDM",
      count: "36 Items",
      description: "Penyusunan Peraturan Perusahaan (PP), Perjanjian Kerja Bersama (PKB), Struktur & Skala Upah, Kontrak Kerja Karyawan PKWT/PKWTT, BPJS, dan Audit SDM.",
      linkText: "Lihat Seluruh 36 Layanan",
      linkUrl: "/layanan?cat=sdm",
      iconName: "Users"
    }
  ];

  const pillars = (services?.pillars && services.pillars.length > 0) ? services.pillars : defaultPillars;

  return (
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="py-20 lg:py-28 bg-slate-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            <EditableText
              fieldPath="services.badge"
              fallback="5 PILAR LAYANAN KONSULTAN TERPADU"
              label="Badge Layanan"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            <EditableText
              fieldPath="services.title"
              fallback={`${totalServices} Layanan Konsultan Terpadu`}
              label="Judul Layanan"
            />
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            <EditableText
              fieldPath="services.subtitle"
              fallback="Solusi konsultan komprehensif mencakup Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM untuk akselerasi dan kepatuhan operasional bisnis Anda."
              label="Subjudul Layanan"
              multiline={true}
            />
          </p>
        </div>

        {/* Categories Grid */}
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
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                className="bg-white border border-gray-200/80 rounded-2xl p-7 flex flex-col justify-between hover:border-gold-accent hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-100 transition-all">
                      <EditableIcon
                        iconKey={`services.pillars.${idx}.icon`}
                        fallbackIcon={cat.iconName || 'FileCheck'}
                        className="w-6 h-6 text-gold-accent"
                        label={`Ikon Pilar ${idx + 1}`}
                      />
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-3 py-1 rounded-full">
                      <EditableText
                        fieldPath={`services.pillars.${idx}.count`}
                        fallback={cat.count || '242 Items'}
                        label={`Jumlah ${cat.name}`}
                      />
                    </span>
                  </div>
                  <h3 className="font-serif-title text-xl font-bold text-slate-900 mb-2.5 group-hover:text-gold-accent transition-colors">
                    <EditableText
                      fieldPath={`services.pillars.${idx}.name`}
                      fallback={cat.name}
                      label={`Nama Pilar ${idx + 1}`}
                      as="span"
                    />
                  </h3>
                  <div className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
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
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-gold-accent border-t border-gray-100 pt-4 transition-colors"
                >
                  <EditableText
                    fieldPath={`services.pillars.${idx}.linkText`}
                    fallback={cat.linkText || `Lihat Seluruh ${cat.count}`}
                    label={`Teks Link Pilar ${idx + 1}`}
                    linkPath={`services.pillars.${idx}.linkUrl`}
                    fallbackLink={fallbackLink}
                  />
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Directory Banner Link */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-gold-accent/40 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest block">DIREKTORI LENGKAP</span>
            <h3 className="font-serif-title text-2xl lg:text-3xl font-bold text-white">
              <EditableText
                fieldPath="services.ctaBannerTitle"
                fallback="Membutuhkan Solusi Konsultan Spesifik untuk Bisnis Anda?"
                label="Judul Banner Layanan"
              />
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
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
            className="px-7 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all whitespace-nowrap flex items-center gap-2.5 shadow-lg shrink-0 z-10"
          >
            <EditableIcon
              iconKey="services.ctaBannerIcon"
              fallbackIcon="Search"
              className="w-4 h-4 text-slate-950"
              label="Ikon Tombol Banner"
            />
            <EditableText
              fieldPath="services.ctaBannerButtonText"
              fallback={`Buka Direktori Lengkap ${totalServices} Layanan`}
              label="Tombol Banner Layanan"
            />
          </Link>
        </div>

      </div>
    </EditableSection>
  );
}
