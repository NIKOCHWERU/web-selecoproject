'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Lightbulb, Lock, ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

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
      description: 'Kerahasiaan penuh dan etika profesi hukum yang tinggi dalam setiap mandatoria klien.',
    },
    {
      title: 'Strategis',
      description: 'Analisis hukum yang diselaraskan langsung dengan kepentingan bisnis dan risiko komersial.',
    },
    {
      title: 'Praktis',
      description: 'Masalah hukum yang kompleks diterjemahkan menjadi rekomendasi langkah kerja yang jelas.',
    },
    {
      title: 'Kerahasiaan',
      description: 'Seluruh data dan informasi klien ditangani menggunakan standar kerahasiaan profesi yang ketat.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
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
              <img
                src={about?.image1 || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80"}
                alt="Patung Dewi Keadilan - Lady Justice"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-44 sm:h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={about?.image2 || "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=600&q=80"}
                alt="Palu Sidang Hukum & Buku Undang-Undang"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="h-44 sm:h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                alt="Penandatanganan Kontrak & Dokumen Legal"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
              {about?.badge || 'TENTANG SELECO'}
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              {about?.title || 'Hukum yang Dipahami dalam Konteks Bisnis.'}{' '}
              {about?.titleAccent && <span className="text-amber-800">{about.titleAccent}</span>}
            </h2>

            <div className="w-16 h-[3px] bg-gold-accent rounded-full" />

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              {about?.paragraph1 || 'Persoalan hukum memengaruhi setiap keputusan bisnis, hubungan kerja, dan operasional perusahaan Anda. SELECO hadir sebagai mitra yang menghubungkan analisis hukum mendalam dengan kebutuhan praktis secara terstruktur, terukur, dan transparan.'}
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {about?.paragraph2 || 'Kami mencakup 34 perkara hukum litigasi & non-litigasi, serta mengelola pengurusan lebih dari 411 jenis perizinan usaha dan legalitas OSS RBA di seluruh wilayah Indonesia.'}
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
                    <span className="font-serif-title text-base font-bold text-slate-900">{v.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.description || v.desc}</p>
                </div>
              ))}
            </div>

            {showMoreLink && (
              <div className="pt-3">
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 hover:text-gold-accent transition-colors group"
                >
                  <span>Pelajari Profil Firma &amp; Tim Kami</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
