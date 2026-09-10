'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Lightbulb, Lock } from 'lucide-react';

export default function AboutSection() {
  const values = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-accent" />,
      title: 'Integritas',
      desc: 'Kerahasiaan penuh dan etika profesi hukum yang tinggi dalam setiap mandatoria klien.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-gold-accent" />,
      title: 'Strategis',
      desc: 'Analisis hukum yang diselaraskan langsung dengan kepentingan bisnis dan risiko komersial.',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-gold-accent" />,
      title: 'Praktis',
      desc: 'Masalah hukum yang kompleks diterjemahkan menjadi rekomendasi langkah kerja yang jelas.',
    },
    {
      icon: <Lock className="w-5 h-5 text-gold-accent" />,
      title: 'Kerahasiaan',
      desc: 'Seluruh data dan informasi klien ditangani menggunakan standar kerahasiaan profesi yang ketat.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-navy-royal border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Photo Collage */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2 h-56 rounded overflow-hidden border border-gold-accent">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80"
                alt="Lady Justice & Law Books"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-40 rounded overflow-hidden border border-corporate">
              <img
                src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80"
                alt="Contract Document Review"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-40 rounded overflow-hidden border border-corporate">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500&q=80"
                alt="Corporate Boardroom"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest">
              TENTANG SELECO
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
              Hukum yang Dipahami dalam Konteks Bisnis.
            </h2>

            <div className="w-12 h-[2px] bg-gold-accent" />

            <p className="text-sm text-white/80 leading-relaxed">
              Persoalan hukum memengaruhi setiap keputusan bisnis, hubungan kerja, dan operasional perusahaan Anda. <strong>SELECO — Sedana Legal Consultant</strong> hadir sebagai mitra yang menghubungkan analisis hukum mendalam dengan kebutuhan praktis secara terstruktur, terukur, dan transparan.
            </p>

            <p className="text-sm text-white/70 leading-relaxed">
              Kami mencakup 34 perkara hukum litigasi & non-litigasi, serta mengelola pengurusan lebih dari 411 jenis perizinan usaha dan legalitas OSS RBA di seluruh wilayah Indonesia.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="p-4 bg-offwhite border-l-2 border-gold-accent border border-corporate rounded"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {v.icon}
                    <span className="font-serif-title text-base font-bold text-white">{v.title}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
