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
    <ShieldCheck key="1" className="w-5 h-5 text-[#dfa82e]" />,
    <TrendingUp key="2" className="w-5 h-5 text-[#dfa82e]" />,
    <Lightbulb key="3" className="w-5 h-5 text-[#dfa82e]" />,
    <Lock key="4" className="w-5 h-5 text-[#dfa82e]" />,
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
    <EditableSection id="about" name="Tentang Kami Section" className="py-20 lg:py-28 bg-[#0a1420] border-b border-white/10 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* Left Column: Eventure Modern Image Collage with Legal & HRM Themes */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Primary Large Image: Corporate Legal Consultation */}
              <div className="col-span-2 rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative aspect-[16/10] bg-[#0f2034]">
                <EditableImage
                  fieldPath="about.image1"
                  fallback="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80"
                  alt="Penandatanganan Perizinan Dokumen dan Legalitas Korporasi"
                  label="Foto Utama Tentang (Legalitas & Dokumen)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    Pemeriksaan &amp; Kepatuhan Legalitas Korporasi
                  </span>
                </div>
              </div>

              {/* Sub Image 1: HRM & People Consultation */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl relative aspect-[4/3] bg-[#0f2034]">
                <EditableImage
                  fieldPath="about.image2"
                  fallback="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                  alt="Konsultasi Manajemen SDM dan Ketenagakerjaan"
                  label="Foto Kolase 2 (SDM & HRM)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-medium text-white/80">
                  Manajemen SDM &amp; TKA
                </span>
              </div>

              {/* Sub Image 2: Corporate Boardroom & Advisory */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl relative aspect-[4/3] bg-[#0f2034]">
                <EditableImage
                  fieldPath="about.image3"
                  fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Ruang Kerja Konsultan Ahli SELECO"
                  label="Foto Kolase 3 (Boardroom & Kantor)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-3 text-[10px] font-medium text-white/80">
                  Konsultasi Bisnis Terpadu
                </span>
              </div>
            </div>

            {/* Eventure Floating Overlapping Stat Chip */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-[#0f2034] border border-[#dfa82e]/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center gap-4 max-w-xs z-20">
              <div className="w-12 h-12 rounded-xl bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center text-[#dfa82e] shrink-0 font-bold text-xl">
                10+
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">
                  Tahun Rekam Jejak
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mendampingi legalitas &amp; operasional korporasi di Indonesia
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Content & Elevated Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#dfa82e] mb-3">
                <EditableText
                  fieldPath="about.badge"
                  fallback="Tentang SELECO"
                  label="Badge Tentang"
                />
              </div>

              <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-4xl font-bold text-white leading-tight">
                <EditableText
                  fieldPath="about.title"
                  fallback="Solusi Konsultan Terstruktur untuk"
                  label="Judul Tentang"
                />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fad980] via-[#dfa82e] to-[#b88917] italic">
                  <EditableText
                    fieldPath="about.titleAccent"
                    fallback="Pertumbuhan Bisnis."
                    label="Aksen Judul"
                  />
                </span>
              </h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="SELECO hadir sebagai mitra konsultan korporasi terpercaya yang menyediakan solusi terpadu 5 pilar: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara terukur, akurat, dan berintegritas tinggi."
                label="Paragraf 1"
                multiline={true}
                as="span"
              />
            </p>

            {/* Elevated Feature Cards in 2x2 Grid (Eventure Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 bg-[#0f2034]/70 border border-white/10 hover:border-[#dfa82e]/40 transition-all duration-300 hover:-translate-y-1 relative group shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-[#dfa82e] tracking-widest uppercase">
                      0{i + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#dfa82e]/10 group-hover:border-[#dfa82e]/30 transition-colors">
                      {valueIcons[i % valueIcons.length]}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-[#dfa82e] transition-colors">
                    <EditableText
                      fieldPath={`about.values.${i}.title`}
                      fallback={v.title}
                      label={`Nilai #${i + 1} Judul`}
                    />
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
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
              <div className="pt-3">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#dfa82e]/50 text-xs font-bold uppercase tracking-wider text-[#dfa82e] hover:text-white transition-all group"
                >
                  <span>Pelajari Profil &amp; Tim Konsultan Kami</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
