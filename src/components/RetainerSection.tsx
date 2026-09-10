'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Handshake, Building, Clock, FileText } from 'lucide-react';

export default function RetainerSection() {
  const retainerServices = [
    "Konsultasi Hukum Harian Korporasi",
    "Review & Draf Perjanjian Bisnis Rutin",
    "Advis Hukum Ketenagakerjaan & HR",
    "Penyusunan Somasi & Teguran Legal",
    "Pemantauan Kepatuhan OSS & Regulasi",
    "Mitigasi & Evaluasi Risiko Transaksi",
  ];

  return (
    <section id="retainer" className="py-20 bg-navy-royal border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-navy-deep text-white border border-gold-accent/40 rounded p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/40 rounded text-gold-accent text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gold-accent" /> RETAINER KORPORASI
              </div>

              <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
                Departemen Hukum Eksternal Bisnis Anda.
              </h2>

              <div className="w-12 h-[2px] bg-gold-accent" />

              <p className="text-sm text-white/80 leading-relaxed font-light">
                Akses pendampingan hukum berkelanjutan sesuai kebutuhan operasional perusahaan—mulai dari konsultasi harian, perancangan kontrak, HR, perizinan OSS RBA, hingga mitigasi sengketa bisnis.
              </p>

              {/* Grid 6 Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {retainerServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 bg-navy-royal/90 border border-white/10 p-3 rounded hover:border-gold-accent/50 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-gold-accent shrink-0" />
                    <span className="text-xs font-semibold text-white/90">{service}</span>
                  </div>
                ))}
              </div>

              {/* Retainer CTA */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-title text-lg font-bold text-white">Perkuat Perlindungan Legalitas Perusahaan</h4>
                  <p className="text-xs text-white/60">Konsultan hukum profesional siap mendampingi operasional Anda.</p>
                </div>
                <Link
                  href="/#contact"
                  className="px-6 py-3 bg-gold-accent text-white font-bold text-xs uppercase tracking-wider rounded hover:bg-gold-bright transition-all shadow-md flex items-center gap-2"
                >
                  <Handshake className="w-4 h-4" />
                  Diskusikan Layanan Retainer
                </Link>
              </div>
            </div>

            {/* Right Photo Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded overflow-hidden border border-gold-accent/40 shadow-2xl h-80 lg:h-96">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Corporate Legal Counsel Consultation"
                  className="w-full h-full object-cover filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-navy-dark/90 backdrop-blur-md border border-gold-accent/30 rounded text-center">
                  <span className="font-serif-title text-base font-bold text-white block">
                    SELECO External Legal Team
                  </span>
                  <span className="text-[10px] text-gold-accent font-semibold uppercase tracking-widest">
                    Efisiensi Operational & Total Compliance
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
