'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Lightbulb, Lock, ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function AboutSection({ showMoreLink = false }: { showMoreLink?: boolean }) {
  const { content } = useContent();
  const about = content?.about;

  const valueIcons = [
    <ShieldCheck key="1" className="w-4 h-4 text-[#b88917]" />,
    <TrendingUp key="2" className="w-4 h-4 text-[#b88917]" />,
    <Lightbulb key="3" className="w-4 h-4 text-[#b88917]" />,
    <Lock key="4" className="w-4 h-4 text-[#b88917]" />,
  ];

  const values = about?.values || [
    {
      title: 'Integritas',
      description: 'Kerahasiaan penuh dan etika profesional yang tinggi dalam setiap layanan klien.',
    },
    {
      title: 'Strategis',
      description: 'Kepatuhan regulasi yang diselaraskan langsung dengan kepentingan bisnis dan efisiensi operasional.',
    },
    {
      title: 'Praktis',
      description: 'Regulasi perizinan yang kompleks diterjemahkan menjadi rekomendasi langkah kerja yang jelas.',
    },
    {
      title: 'Kerahasiaan',
      description: 'Seluruh data dan informasi perusahaan klien ditangani menggunakan standar kerahasiaan tinggi.',
    },
  ];

  return (
    <EditableSection id="about" name="Tentang Kami Section" className="bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left: Navy background column with photo collage */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0f2034] p-8 lg:p-12 flex flex-col justify-between min-h-[460px] lg:min-h-[580px]"
          >
            {/* Label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88917] mb-8">
              <EditableText
                fieldPath="about.badge"
                fallback="Tentang SELECO"
                label="Badge Tentang"
              />
            </p>

            {/* Photo collage — primary large, two smaller */}
            <div className="flex-1 grid grid-rows-[2fr_1fr] gap-3">
              <div className="rounded-md overflow-hidden">
                <EditableImage
                  fieldPath="about.image1"
                  fallback="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80"
                  alt="Ruang Kerja Konsultan Korporasi SELECO"
                  label="Foto Utama Tentang Kami"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md overflow-hidden">
                  <EditableImage
                    fieldPath="about.image2"
                    fallback="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                    alt="Gedung Perkantoran dan Korporasi"
                    label="Foto Kolase 2"
                  />
                </div>
                <div className="rounded-md overflow-hidden">
                  <EditableImage
                    fieldPath="about.image3"
                    fallback="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                    alt="Penandatanganan Perizinan & Kerja Sama Korporasi"
                    label="Foto Kolase 3"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: White content column */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-12 px-8 lg:px-12 flex flex-col justify-center space-y-6"
          >
            <div>
              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#0f2034] leading-tight">
                <EditableText
                  fieldPath="about.title"
                  fallback="Solusi Konsultan Terstruktur untuk"
                  label="Judul Tentang"
                />{' '}
                {about?.titleAccent && (
                  <span className="text-[#b88917]">
                    <EditableText
                      fieldPath="about.titleAccent"
                      fallback={about.titleAccent}
                      label="Aksen Judul"
                    />
                  </span>
                )}
              </h2>
              <div className="w-10 h-[2px] bg-[#b88917] mt-5" />
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="SELECO hadir sebagai konsultan korporasi terpercaya yang menyediakan solusi terpadu 5 pilar: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM secara terstruktur, terukur, dan transparan."
                label="Paragraf 1"
                multiline={true}
                as="span"
              />
            </p>

            <p className="text-xs text-slate-500 leading-relaxed">
              <EditableText
                fieldPath="about.paragraph2"
                fallback="Kami mencakup 5 pilar spesialisasi konsultan bisnis, serta mengelola pengurusan lebih dari 411 jenis perizinan usaha OSS RBA dan kepatuhan instansi teknis di seluruh wilayah Indonesia."
                label="Paragraf 2"
                multiline={true}
                as="span"
              />
            </p>

            {/* Values: 2-col list, not cards — avoids identical card shape (R-14) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2">
              {values.map((v: any, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {valueIcons[i % valueIcons.length]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0f2034] mb-0.5">
                      <EditableText
                        fieldPath={`about.values.${i}.title`}
                        fallback={v.title}
                        label={`Nilai #${i + 1} Judul`}
                      />
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      <EditableText
                        fieldPath={`about.values.${i}.description`}
                        fallback={v.description || v.desc}
                        label={`Nilai #${i + 1} Deskripsi`}
                        multiline={true}
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {showMoreLink && (
              <div className="pt-2">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#b88917] hover:text-[#0f2034] transition-colors group"
                >
                  <span>Pelajari Profil &amp; Tim Konsultan Kami</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
