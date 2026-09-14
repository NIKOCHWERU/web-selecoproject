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
    <ShieldCheck key="1" className="w-5 h-5 text-gold-accent" />,
    <TrendingUp key="2" className="w-5 h-5 text-gold-accent" />,
    <Lightbulb key="3" className="w-5 h-5 text-gold-accent" />,
    <Lock key="4" className="w-5 h-5 text-gold-accent" />,
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
    <EditableSection id="about" name="Tentang Kami Section" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Photo Collage - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 h-64 sm:h-72 rounded-2xl overflow-hidden border border-gray-200 shadow-md">
              <EditableImage
                fieldPath="about.image1"
                fallback="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80"
                alt="Patung Dewi Keadilan - Lady Justice"
                label="Foto Utama Tentang Kami"
              />
            </div>
            <div className="h-44 sm:h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <EditableImage
                fieldPath="about.image2"
                fallback="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=600&q=80"
                alt="Palu Sidang Hukum & Buku Undang-Undang"
                label="Foto Kolase 2"
              />
            </div>
            <div className="h-44 sm:h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <EditableImage
                fieldPath="about.image3"
                fallback="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                alt="Penandatanganan Kontrak & Dokumen Legal"
                label="Foto Kolase 3"
              />
            </div>
          </motion.div>

          {/* Content - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest">
              <EditableText
                fieldPath="about.badge"
                fallback="TENTANG SELECO"
                label="Badge Tentang"
              />
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              <EditableText
                fieldPath="about.title"
                fallback="Legalitas Usaha yang Terstruktur untuk"
                label="Judul Tentang"
              />{' '}
              {about?.titleAccent && (
                <span className="text-amber-800">
                  <EditableText
                    fieldPath="about.titleAccent"
                    fallback={about.titleAccent}
                    label="Aksen Judul"
                  />
                </span>
              )}
            </h2>

            <div className="w-16 h-[3px] bg-gold-accent rounded-full" />

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="Legalitas dan perizinan memengaruhi setiap langkah bisnis, hubungan kemitraan, dan operasional perusahaan Anda. SELECO hadir sebagai konsultan yang menghubungkan kepatuhan regulasi dengan kebutuhan praktis secara terstruktur, terukur, dan transparan."
                label="Paragraf 1"
                multiline={true}
              />
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              <EditableText
                fieldPath="about.paragraph2"
                fallback="Kami mencakup 34 lingkup legalitas bisnis & kontrak, serta mengelola pengurusan lebih dari 411 jenis perizinan usaha dan legalitas OSS RBA di seluruh wilayah Indonesia."
                label="Paragraf 2"
                multiline={true}
              />
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v: any, i: number) => (
                <div
                  key={i}
                  className="p-5 bg-slate-50 border border-gray-200/80 rounded-xl hover:border-gold-accent/70 hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {valueIcons[i % valueIcons.length]}
                    </div>
                    <span className="font-serif-title text-base font-bold text-slate-900">
                      <EditableText
                        fieldPath={`about.values.${i}.title`}
                        fallback={v.title}
                        label={`Nilai #${i + 1} Judul`}
                      />
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-gold-accent transition-colors group"
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
