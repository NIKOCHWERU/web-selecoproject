'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const articles = [
  {
    id: 1,
    category: 'Corporate Law',
    readTime: '5 min',
    title: 'Memahami Pentingnya Legal Due Diligence Sebelum Transaksi Bisnis',
    excerpt: 'Pemeriksaan hukum komprehensif untuk mengidentifikasi risiko tersembunyi sebelum akuisisi, investasi, atau joint venture.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    category: 'Employment Law',
    readTime: '6 min',
    title: 'Hal yang Perlu Diperhatikan Sebelum Melakukan PHK Karyawan',
    excerpt: 'Aspek legalitas SP, tata cara perundingan Bipartit, dan prosedur PHK yang patuh regulasi ketenagakerjaan Indonesia.',
    img: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    category: 'Contracts',
    readTime: '4 min',
    title: '7 Klausul Penting yang Wajib Ada dalam Perjanjian Bisnis',
    excerpt: 'Kontrak sebagai instrumen perlindungan hak dan pembatasan kewajiban—sebelum penandatanganan resmi dilakukan.',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    category: 'Governance',
    readTime: '5 min',
    title: 'Mengapa Corporate Governance Penting bagi Perusahaan Bertumbuh?',
    excerpt: 'Penerapan GCG untuk meningkatkan akuntabilitas, transparansi, dan kepercayaan investor secara berkelanjutan.',
    img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    category: 'Legal Risk',
    readTime: '5 min',
    title: 'Legal Risk Management: Mencegah Masalah Hukum Sebelum Menjadi Sengketa',
    excerpt: 'Mitigasi risiko hukum secara preventif melalui audit kontrak periodik dan penyusunan SOP legal internal.',
    img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    category: 'Business',
    readTime: '4 min',
    title: 'Kapan Perusahaan Membutuhkan Corporate Legal Retainer Eksternal?',
    excerpt: 'Perbandingan efisiensi tim legal internal vs. retainer eksternal untuk perusahaan yang sedang bertumbuh.',
    img: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=600&q=80',
  },
];

export default function InsightsSection() {
  return (
    <section id="insights" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            PUBLIKASI EDITORIAL
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            Legal Insights
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 font-normal">
            Perspektif hukum praktis dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-gold-accent transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden border-b border-gray-100">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border border-amber-200/60">
                    {article.category}
                  </span>
                  <span>{article.readTime} read</span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-gold-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-5 flex-grow">
                  {article.excerpt}
                </p>
                <Link href="/insight" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 border-t border-gray-100 pt-4 hover:text-gold-accent transition-colors group-hover:text-gold-accent uppercase tracking-wider">
                  Baca Insight <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-slate-900 rounded-lg text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Lihat Semua Publikasi Insight →
          </Link>
        </div>

      </div>
    </section>
  );
}
