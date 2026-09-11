'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Scale, Building2, Receipt, Stethoscope, Globe, Landmark, Zap, FileCheck, Ship, ArrowRight, Search } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/data/layananData';

export default function ServicesSection() {
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
    <section id="practice" className="py-20 bg-navy-dark border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
            CAKUPAN KEAHLIAN HUKUM & PERIZINAN
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            445+ Pelayanan Hukum & Perizinan Usaha
          </h2>
          <div className="w-12 h-[2px] bg-gold-accent mx-auto my-3" />
          <p className="text-sm sm:text-base text-white/70">
            Direktori komprehensif mencakup 34 Perkara Hukum (Litigasi & Non-Litigasi) serta 411 jenis Perizinan & Legalitas OSS RBA di Indonesia.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-navy-royal border border-corporate rounded p-6 flex flex-col justify-between hover:border-gold-accent transition-all hover:shadow-subtle group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded bg-navy-deep/5 border border-navy-deep/10 flex items-center justify-center group-hover:bg-navy-deep group-hover:text-gold-accent transition-all">
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-bold text-white/80 bg-gold-soft border border-gold-accent/40 px-2.5 py-1 rounded">
                    {cat.count} Items
                  </span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-white mb-2 group-hover:text-gold-accent transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed mb-6">
                  {cat.description}
                </p>
              </div>

              <Link
                href={`/layanan?cat=${cat.id}`}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold-accent border-t border-corporate pt-4 transition-all"
              >
                <span>Lihat Seluruh {cat.count} Layanan</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Directory Banner Link */}
        <div className="bg-navy-deep text-white border border-gold-accent/40 rounded p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif-title text-2xl font-bold text-white">
              Membutuhkan Perizinan Khusus atau Perkara Hukum Tertentu?
            </h3>
            <p className="text-xs text-white/70">
              Gunakan pencarian interaktif kami untuk menemukan 411 jenis perizinan dan 34 perkara hukum secara spesifik.
            </p>
          </div>
          <Link
            href="/layanan"
            className="px-6 py-3.5 bg-gold-accent text-navy-dark font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all whitespace-nowrap flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buka Direktori Lengkap 445+ Layanan
          </Link>
        </div>

      </div>
    </section>
  );
}
