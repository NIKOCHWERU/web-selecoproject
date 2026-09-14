import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { getArticles } from '@/lib/articleService';

export const metadata: Metadata = {
  title: 'Insight & Updates | SELECO',
  description: 'Baca insight, analisis legalitas bisnis, dan update regulasi perizinan terbaru dari SELECO.',
};

export const dynamic = 'force-dynamic';

export default function InsightPage() {
  const publishedArticles = getArticles('published');

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
              <BookOpen className="w-3.5 h-3.5" /> PUBLIKASI EDITORIAL &amp; REGULASI
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
        {publishedArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif-title text-xl font-bold text-slate-700">Belum Ada Artikel yang Dipublikasikan</h3>
            <p className="text-sm text-slate-500 mt-1">Silakan tambahkan dan terbitkan artikel melalui Dashboard Admin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/insight/${item.slug}`}
                className="group rounded-2xl overflow-hidden bg-white border border-gray-200/90 hover:border-gold-accent shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Full Thumbnail */}
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={item.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-50/95 backdrop-blur-sm text-amber-900 border border-amber-200/80 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white text-xs bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="font-serif-title text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-gold-accent transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-normal line-clamp-3">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
