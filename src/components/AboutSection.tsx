'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Lightbulb, Lock, ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function AboutSection({ showMoreLink = false }: { showMoreLink?: boolean }) {
  const { content } = useContent();
  const about = content?.about;
  const global = content?.global;
  const totalServices = global?.totalServices || '445+';

  const valueIcons = [
    <ShieldCheck key="1" className="w-5 h-5 text-[#b88917]" />,
    <TrendingUp key="2" className="w-5 h-5 text-[#b88917]" />,
    <Lightbulb key="3" className="w-5 h-5 text-[#b88917]" />,
    <Lock key="4" className="w-5 h-5 text-[#b88917]" />,
  ];

  const values = about?.values || [
    {
      title: 'Integritas & Kepatuhan',
      description: 'Kerahasiaan penuh dan etika profesional legalitas korporasi yang tinggi dalam setiap layanan klien.',
    },
    {
      title: 'Solusi Strategis Terpadu',
      description: 'Kepatuhan regulasi perizinan yang diselaraskan langsung dengan efisiensi operasional dan pertumbuhan bisnis.',
    },
    {
      title: 'Eksekusi Praktis & Tuntas',
      description: 'Regulasi OSS RBA, perizinan teknis, dan perpajakan yang kompleks diterjemahkan menjadi alur kerja pasti.',
    },
    {
      title: 'Manajemen Risiko & SDM',
      description: 'Perlindungan menyeluruh tata kelola tenaga kerja, ketenagakerjaan, aset pertanahan, dan kepatuhan legalitas usaha.',
    },
  ];

  return (
    <EditableSection id="about" name="Tentang Kami Section" className="py-12 sm:py-16 bg-white border-b border-slate-200 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Corporate Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-2 gap-3.5 relative">
              {/* Primary Large Image: Corporate Legal Consultation */}
              <div className="col-span-2 rounded-xl overflow-hidden border border-slate-200 shadow-md relative aspect-[16/10] bg-slate-100">
                <EditableImage
                  fieldPath="about.image1"
                  fallback="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80"
                  alt="Penandatanganan Perizinan Dokumen dan Legalitas Korporasi"
                  label="Foto Utama Tentang (Legalitas & Dokumen)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-white/95 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                    Pemeriksaan &amp; Kepatuhan Legalitas Korporasi
                  </span>
                </div>
              </div>

              {/* Sub Image 1: HRM & People Consultation */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative aspect-[4/3] bg-slate-100">
                <EditableImage
                  fieldPath="about.image2"
                  fallback="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                  alt="Konsultasi Manajemen SDM dan Ketenagakerjaan"
                  label="Foto Kolase 2 (SDM & HRM)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 text-[9px] font-medium text-white/90">
                  Manajemen SDM &amp; TKA
                </span>
              </div>

              {/* Sub Image 2: Corporate Boardroom & Advisory */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative aspect-[4/3] bg-slate-100">
                <EditableImage
                  fieldPath="about.image3"
                  fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Ruang Kerja Konsultan Ahli SELECO"
                  label="Foto Kolase 3 (Boardroom & Kantor)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2.5 text-[9px] font-medium text-white/90">
                  Konsultasi Bisnis Terpadu
                </span>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Content & Elevated Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1420] border border-[#0a1420] text-[10px] font-bold uppercase tracking-widest text-[#dfa82e] mb-2.5 shadow-xs">
                <EditableText
                  fieldPath="about.badge"
                  fallback="Tentang SELECO"
                  label="Badge Tentang"
                />
              </div>

              <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-[#0a1420] leading-tight">
                <EditableText
                  fieldPath="about.title"
                  fallback="Solusi Konsultan Terstruktur untuk"
                  label="Judul Tentang"
                />{' '}
                <span className="text-[#b88917] italic">
                  <EditableText
                    fieldPath="about.titleAccent"
                    fallback="Pertumbuhan Bisnis."
                    label="Aksen Judul"
                  />
                </span>
              </h2>

              <div className="w-12 h-0.5 bg-[#dfa82e] rounded-full my-3" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="SELECO hadir sebagai mitra konsultan korporasi terpercaya yang menyediakan solusi terpadu 5 pilar: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara terukur, akurat, dan berintegritas tinggi."
                label="Paragraf 1"
                multiline={true}
                as="span"
              />
            </p>

            {/* Elevated Feature Cards in 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {values.map((v: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl p-4 bg-slate-50 border border-slate-200 border-l-2 border-l-[#0a1420] hover:bg-white hover:border-[#dfa82e]/60 transition-colors relative group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-[#b88917] tracking-widest uppercase">
                      0{i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#0a1420] text-[#dfa82e] flex items-center justify-center shadow-xs group-hover:bg-[#dfa82e] group-hover:text-[#0a1420] transition-colors">
                      {valueIcons[i % valueIcons.length]}
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#0a1420] mb-1 group-hover:text-[#b88917] transition-colors">
                    <EditableText
                      fieldPath={`about.values.${i}.title`}
                      fallback={v.title}
                      label={`Nilai #${i + 1} Judul`}
                    />
                  </h3>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    <EditableText
                      fieldPath={`about.values.${i}.description`}
                      fallback={v.description || v.desc}
                      label={`Nilai #${i + 1} Deskripsi`}
                      multiline={true}
                    />
                  </p>
                </div>
              ))}
            </div>

            {showMoreLink && (
              <div className="pt-2">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0a1420] hover:bg-[#b88917] text-white text-[11px] font-bold uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
                >
                  <span>Pelajari Profil &amp; Tim Konsultan Kami</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
