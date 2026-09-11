import React from 'react';
import { Metadata } from 'next';

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
    <div className="min-h-screen bg-navy-dark">
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-soft border border-gold-accent/30 rounded text-gold-accent text-xs font-bold uppercase tracking-widest mb-4">
            PUBLIKASI EDITORIAL
          </div>
          <h1 className="font-serif-title text-4xl sm:text-5xl font-bold text-white mb-4">
            Insight & Updates
          </h1>
          <div className="w-16 h-[2px] bg-gold-accent mb-6"></div>
          <p className="text-white/70 max-w-2xl text-lg leading-relaxed">
            Perspektif hukum praktis dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((item) => (
            <article
              key={item.id}
              className="group rounded-lg overflow-hidden border border-white/10 hover:border-gold-accent/40 transition-all duration-300"
            >
              {/* Full Thumbnail */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-gold-accent text-navy-dark font-bold px-2.5 py-1 rounded text-[10px] uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-white/80 text-xs bg-navy-dark/70 px-2 py-1 rounded">
                    {item.readTime} read
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 bg-navy-royal">
                <h3 className="font-serif-title text-lg font-bold text-white leading-snug mb-2 group-hover:text-gold-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {item.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-accent uppercase tracking-wider group-hover:underline">
                  Baca Insight <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
