import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Insight & Updates | SELECO',
  description: 'Baca insight, analisis hukum, dan update regulasi terbaru dari SELECO Law Firm.',
};

const insights = [
  {
    id: 1,
    title: 'Memahami Pentingnya Legal Due Diligence Sebelum Transaksi Bisnis',
    excerpt: 'Pemeriksaan hukum komprehensif untuk mengidentifikasi risiko tersembunyi sebelum akuisisi, investasi, atau joint venture.',
    category: 'Corporate Law',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Hal yang Perlu Diperhatikan Sebelum Melakukan PHK Karyawan',
    excerpt: 'Aspek legalitas SP, tata cara perundingan Bipartit, dan prosedur PHK yang patuh regulasi ketenagakerjaan Indonesia.',
    category: 'Employment Law',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: '7 Klausul Penting yang Wajib Ada dalam Perjanjian Bisnis',
    excerpt: 'Kontrak sebagai instrumen perlindungan hak dan pembatasan kewajiban—sebelum penandatanganan resmi dilakukan.',
    category: 'Contracts',
    readTime: '4 min',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Mengapa Corporate Governance Penting bagi Perusahaan Bertumbuh?',
    excerpt: 'Penerapan GCG untuk meningkatkan akuntabilitas, transparansi, dan kepercayaan investor secara berkelanjutan.',
    category: 'Governance',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    title: 'Legal Risk Management: Mencegah Masalah Hukum Sebelum Menjadi Sengketa',
    excerpt: 'Mitigasi risiko hukum secara preventif melalui audit kontrak periodik dan penyusunan SOP legal internal.',
    category: 'Legal Risk',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    title: 'Kapan Perusahaan Membutuhkan Corporate Legal Retainer Eksternal?',
    excerpt: 'Perbandingan efisiensi tim legal internal vs. retainer eksternal untuk perusahaan yang sedang bertumbuh.',
    category: 'Business',
    readTime: '4 min',
    img: 'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?auto=format&fit=crop&w=800&q=80',
  },
];

export default function InsightPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Hero Banner */}
      <div className="bg-white border-b border-gray-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold-accent font-semibold">Insight</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" /> PUBLIKASI EDITORIAL
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              Insight &amp; Analisis Hukum Bisnis
            </h1>
            <div className="w-16 h-[3px] bg-gold-accent mt-3 mb-4 rounded-full" />
            <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
              Perspektif hukum praktis dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur dan aman dari risiko regulasi.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-gray-200/90 hover:border-gold-accent shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Full Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-50/95 backdrop-blur-sm text-amber-900 border border-amber-200/80 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="text-white text-xs bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium">
                      {item.readTime} read
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif-title text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-gold-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider group-hover:text-gold-accent transition-colors border-t border-gray-100 pt-4 w-full">
                  <span>Baca Insight Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
