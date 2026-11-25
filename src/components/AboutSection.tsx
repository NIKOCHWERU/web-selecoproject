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
    <EditableSection id="about" name="Tentang Kami Section" className="section-y bg-white border-b border-slate-200 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Corporate Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 relative"
          >
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Primary Large Image: Corporate Legal Consultation */}
              <div className="col-span-2 rounded-md overflow-hidden border border-[#0f2034]/15 relative aspect-[16/10] bg-slate-100">
                <EditableImage
                  fieldPath="about.image1"
                  fallback="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80"
                  alt="Penandatanganan Perizinan Dokumen dan Legalitas Korporasi"
                  label="Foto Utama Tentang (Legalitas & Dokumen)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/80 via-[#0a1420]/15 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 border-l-2 border-[#dfa82e] pl-3">
                  <span className="text-xs font-medium text-white tracking-wide">
                    Pemeriksaan &amp; Kepatuhan Legalitas Korporasi
                  </span>
                </div>
              </div>

              {/* Sub Image 1 */}
              <div className="rounded-md overflow-hidden border border-[#0f2034]/15 relative aspect-[4/3] bg-slate-100">
                <EditableImage
                  fieldPath="about.image2"
                  fallback="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=600&q=80"
                  alt="Patung Dewi Keadilan dengan timbangan, simbol keadilan hukum"
                  label="Foto Kolase 2 (SDM & HRM)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/75 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-xs font-medium text-white/95">
                  Manajemen SDM &amp; TKA
                </span>
              </div>

              {/* Sub Image 2 */}
              <div className="rounded-md overflow-hidden border border-[#0f2034]/15 relative aspect-[4/3] bg-slate-100">
                <EditableImage
                  fieldPath="about.image3"
                  fallback="https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=600&q=80"
                  alt="Gedung pengadilan dengan pilar klasik"
                  label="Foto Kolase 3 (Boardroom & Kantor)"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1420]/75 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-xs font-medium text-white/95">
                  Konsultasi Bisnis Terpadu
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Content & Values */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <div className="eyebrow-legal mb-3">
                <EditableText
                  fieldPath="about.badge"
                  fallback="Tentang SELECO"
                  label="Badge Tentang"
                />
              </div>

              <h2 className="font-serif-title heading-section text-[#0a1420]">
                <EditableText
                  fieldPath="about.title"
                  fallback="Solusi Konsultan Terstruktur untuk"
                  label="Judul Tentang"
                />{' '}
                <span className="text-[#b88917] italic font-semibold">
                  <EditableText
                    fieldPath="about.titleAccent"
                    fallback="Pertumbuhan Bisnis."
                    label="Aksen Judul"
                  />
                </span>
              </h2>

              <div className="w-16 h-[1.5px] bg-[#dfa82e] my-4" />
            </div>

            <p className="text-sm sm:text-[0.9375rem] text-slate-600 leading-[1.75] font-normal">
              <EditableText
                fieldPath="about.paragraph1"
                fallback="Seleco Project merupakan mitra profesional dalam bidang konsultasi korporasi yang menyediakan solusi terpadu di bidang perizinan, keimigrasian, perpajakan, pertanahan, serta pengembangan dan pelatihan SDM. Seleco Project berkomitmen untuk mendukung kebutuhan pelaku usaha, korporasi nasional, maupun multinasional melalui layanan yang profesional, akurat, transparan, dan berorientasi pada solusi."
                label="Paragraf 1"
                multiline={true}
                as="span"
              />
            </p>

            {/* Hairline Editorial Value Grid (non-interactive, no fake hover flips) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v: any, i: number) => (
                <div
                  key={i}
                  className="rounded-md p-4 sm:p-5 bg-slate-50/80 border border-[#0f2034]/12 relative"
                >
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#0f2034]/10">
                    <span className="font-serif-title text-sm font-bold text-[#0a1420]">
                      0{i + 1}
                    </span>
                    <div className="w-8 h-8 rounded bg-[#0a1420] text-[#dfa82e] flex items-center justify-center">
                      {valueIcons[i % valueIcons.length]}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[#0a1420] mb-1.5">
                    <EditableText
                      fieldPath={`about.values.${i}.title`}
                      fallback={v.title}
                      label={`Nilai #${i + 1} Judul`}
                    />
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
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
                  className="btn btn-dark"
                >
                  <span>Pelajari Profil &amp; Tim Konsultan Kami</span>
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </EditableSection>
  );
}
