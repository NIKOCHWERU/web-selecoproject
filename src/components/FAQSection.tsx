'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Apa saja layanan yang disediakan oleh SELECO?',
    a: 'SELECO menyediakan pendampingan 34 Perkara Hukum (Litigasi & Non-Litigasi) meliputi hukum perdata, pidana, korporasi, ketenagakerjaan, dan sengketa bisnis. Selain itu, kami mengurus 411+ jenis perizinan usaha OSS RBA mencakup Pendirian Badan Usaha, Perpajakan, Kesehatan, Keimigrasian, Pertanahan, Energi, AMDAL, serta Impor & Ekspor Industri.',
  },
  {
    q: 'Apakah tersedia layanan Corporate Legal Retainer?',
    a: 'Ya. Layanan Legal Retainer Korporasi kami berfungsi sebagai Departemen Hukum Eksternal yang siap mendampingi operasional harian bisnis Anda: konsultasi hukum, review kontrak, advis HR, penyusunan somasi, pemantauan kepatuhan OSS, dan evaluasi risiko transaksi secara terencana.',
  },
  {
    q: 'Apakah konsultasi dapat dilakukan secara online atau tatap muka?',
    a: 'Ya. Konsultasi awal tersedia dalam dua moda—tatap muka langsung di kantor kami di Jakarta, maupun melalui platform video conference (Zoom/Google Meet). Seluruh komunikasi dan dokumen klien ditangani secara rahasia sesuai standar etika profesi hukum.',
  },
  {
    q: 'Apakah SELECO menangani perizinan di luar Jakarta?',
    a: 'Ya. SELECO mendampingi proses perizinan usaha OSS RBA secara nasional melalui sistem elektronik terintegrasi, mencakup seluruh wilayah Indonesia untuk jenis izin yang diproses secara online melalui sistem OSS, BPN, DJP, dan instansi terkait.',
  },
  {
    q: 'Bagaimana prosedur komunikasi awal dan kerahasiaan data klien?',
    a: 'Setelah formulir kontak dikirim, tim kami akan menghubungi Anda dalam 1×24 jam kerja untuk klarifikasi awal. Seluruh informasi yang disampaikan diperlakukan secara rahasia dan profesional. Hubungan advokat-klien secara formal baru terbentuk setelah penandatanganan perjanjian kerja tertulis.',
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50 border-b border-gray-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            PERTANYAAN UMUM
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
        </div>

        <div className="divide-y divide-gray-200/80 border border-gray-200/90 rounded-2xl bg-white overflow-hidden shadow-sm">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 px-6 sm:px-8 py-5 text-left hover:bg-slate-50/70 transition-colors"
                aria-expanded={openIdx === idx}
              >
                <div className="flex items-start gap-4">
                  <span className="font-serif-title text-xl font-bold text-gold-accent shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="font-serif-title text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                </div>
                <span className="shrink-0 mt-1 text-slate-400">
                  {openIdx === idx ? (
                    <Minus className="w-5 h-5 text-gold-accent" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIdx === idx && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-slate-50/50"
                  >
                    <p className="px-6 sm:px-8 pb-6 text-sm text-slate-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
