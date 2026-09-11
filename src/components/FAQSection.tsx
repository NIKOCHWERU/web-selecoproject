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
    <section id="faq" className="py-20 bg-navy-dark border-b border-corporate">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
            PERTANYAAN UMUM
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-[2px] bg-gold-accent mx-auto my-3" />
        </div>

        <div className="divide-y divide-corporate border border-corporate rounded bg-navy-royal overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-navy-surface transition-colors"
                aria-expanded={openIdx === idx}
              >
                <div className="flex items-start gap-3">
                  <span className="font-serif-title text-lg font-bold text-gold-accent shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="font-serif-title text-lg font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                </div>
                <span className="shrink-0 mt-0.5 text-white">
                  {openIdx === idx ? (
                    <Minus className="w-4 h-4 text-gold-accent" />
                  ) : (
                    <Plus className="w-4 h-4" />
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
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-white/80 leading-relaxed border-t border-corporate pt-3">
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
