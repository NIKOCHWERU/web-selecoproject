'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Building2, Receipt, Stethoscope, Globe, Landmark, Zap, FileCheck, Ship, ArrowRight, Search } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/layananData';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableSection } from './EditableElement';

export default function ServicesSection() {
  const { content } = useContent();
  const services = content?.services;
  const global = content?.global;
  const totalServices = global?.totalServices || content?.hero?.stat2Number || '445+';
  const litigationCount = global?.litigationCount || '34';
  const ossLicenseCount = global?.ossLicenseCount || '411+';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale': return <Scale className="w-6 h-6 text-gold-accent" />;
      case 'Building2': return <Building2 className="w-6 h-6 text-gold-accent" />;
      case 'Receipt': return <Receipt className="w-6 h-6 text-gold-accent" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-gold-accent" />;
      case 'Globe': return <Globe className="w-6 h-6 text-gold-accent" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-gold-accent" />;
      case 'Zap': return <Zap className="w-6 h-6 text-gold-accent" />;
      case 'FileCheck': return <FileCheck className="w-6 h-6 text-gold-accent" />;
      case 'Ship': return <Ship className="w-6 h-6 text-gold-accent" />;
      default: return <Scale className="w-6 h-6 text-gold-accent" />;
    }
  };

  const categories = SERVICE_CATEGORIES.filter(c => c.id !== 'all');

  return (
    <EditableSection id="services" name="Layanan & Spesialisasi Section" className="py-20 lg:py-28 bg-slate-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            <EditableText
              fieldPath="services.badge"
              fallback="CAKUPAN KEAHLIAN HUKUM & PERIZINAN"
              label="Badge Layanan"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            <EditableText
              fieldPath="services.title"
              fallback={`${totalServices} Pelayanan Hukum & Perizinan Usaha`}
              label="Judul Layanan"
            />
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            <EditableText
              fieldPath="services.subtitle"
              fallback={`Direktori komprehensif mencakup ${litigationCount} Perkara Hukum (Litigasi & Non-Litigasi) serta ${ossLicenseCount} jenis Perizinan & Legalitas OSS RBA di Indonesia.`}
              label="Subjudul Layanan"
              multiline={true}
            />
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="bg-white border border-gray-200/80 rounded-2xl p-7 flex flex-col justify-between hover:border-gold-accent hover:shadow-xl transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-100 transition-all">
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/70 px-3 py-1 rounded-full">
                    {cat.count} Items
                  </span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-slate-900 mb-2.5 group-hover:text-gold-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                  {cat.description}
                </p>
              </div>

              <Link
                href={`/layanan?cat=${cat.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 group-hover:text-gold-accent border-t border-gray-100 pt-4 transition-colors"
              >
                <span>Lihat Seluruh {cat.count} Layanan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Directory Banner Link */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-gold-accent/40 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest block">DIREKTORI LENGKAP</span>
            <h3 className="font-serif-title text-2xl lg:text-3xl font-bold text-white">
              <EditableText
                fieldPath="services.ctaBannerTitle"
                fallback="Membutuhkan Perizinan Khusus atau Perkara Hukum Tertentu?"
                label="Judul Banner Layanan"
              />
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              <EditableText
                fieldPath="services.ctaBannerSubtitle"
                fallback={`Gunakan pencarian interaktif kami untuk menemukan ${ossLicenseCount} jenis perizinan dan ${litigationCount} perkara hukum secara spesifik.`}
                label="Subjudul Banner Layanan"
                multiline={true}
              />
            </p>
          </div>
          <Link
            href="/layanan"
            className="px-7 py-4 bg-gradient-to-r from-gold-accent to-gold-bright text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all whitespace-nowrap flex items-center gap-2.5 shadow-lg shrink-0 z-10"
          >
            <Search className="w-4 h-4 text-slate-950" />
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
