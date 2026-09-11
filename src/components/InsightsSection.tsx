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
    <section id="insights" className="py-20 bg-navy-royal border-b border-corporate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-3">
            PUBLIKASI EDITORIAL
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white">
            Legal Insights
          </h2>
          <div className="w-12 h-[2px] bg-gold-accent mx-auto my-3" />
          <p className="text-sm text-white/70">
            Perspektif hukum praktis dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="bg-navy-royal border border-corporate rounded overflow-hidden flex flex-col hover:border-navy-deep transition-all group"
            >
              <div className="h-44 overflow-hidden border-b border-corporate">
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                  <span className="bg-navy-deep/8 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider" style={{background:'rgba(7,20,38,0.07)'}}>
                    {article.category}
                  </span>
                  <span>{article.readTime} read</span>
                </div>
                <h3 className="font-serif-title text-lg font-bold text-white leading-snug mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed line-clamp-2 mb-4 flex-grow">
                  {article.excerpt}
                </p>
                <Link href="/insight" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-accent border-t border-corporate pt-3 hover:text-gold-bright transition-colors group-hover:text-gold-bright">
                  Baca Insight <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold-accent/40 rounded text-gold-accent hover:bg-gold-accent hover:text-navy-dark transition-all text-xs font-bold uppercase tracking-wider"
          >
            Lihat Semua Publikasi Insight →
          </Link>
        </div>

      </div>
    </section>
  );
}
