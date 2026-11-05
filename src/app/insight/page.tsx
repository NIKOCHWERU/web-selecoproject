import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { getArticles } from '@/lib/articleService';

export const metadata: Metadata = {
  title: 'Insight & Updates | SELECO',
  description: 'Baca insight, analisis korporasi bisnis, dan update regulasi perizinan terbaru dari SELECO.',
};

export const dynamic = 'force-dynamic';

export default function InsightPage() {
  const publishedArticles = getArticles('published');

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-b from-[#142740] to-[#0f2034] text-white border-b border-[#dfa82e]/25 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
            <Link href="/" className="hover:text-[#dfa82e] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Insight</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfa82e]/20 border border-[#dfa82e]/40 rounded-full text-[#dfa82e] text-[10px] font-bold uppercase tracking-widest mb-2.5">
              <BookOpen className="w-3.5 h-3.5" /> PUBLIKASI EDITORIAL &amp; REGULASI
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-white leading-tight">
              Insight &amp; Analisis Regulasi Bisnis
            </h1>
            <div className="w-12 h-0.5 bg-[#dfa82e] mt-2.5 mb-3 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed font-normal">
              Perspektif strategis dan regulasi dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur dan aman dari risiko operasional.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {publishedArticles.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-xs">
            <BookOpen className="w-10 h-10 text-[#b88917] mx-auto mb-2.5 opacity-80" />
            <h3 className="font-serif-title text-lg font-bold text-[#0a1420]">Belum Ada Artikel yang Dipublikasikan</h3>
            <p className="text-xs text-slate-500 mt-1">Silakan tambahkan dan terbitkan artikel melalui Dashboard Admin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/insight/${item.slug}`}
                className="group rounded-xl overflow-hidden bg-slate-50/70 border border-slate-200 hover:border-[#dfa82e]/60 hover:bg-white shadow-xs transition-colors flex flex-col justify-between"
              >
                <div>
                  {/* Full Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-slate-100 border-b border-slate-200">
                    <img
                      src={item.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#dfa82e]/15 backdrop-blur-md text-[#b88917] border border-[#dfa82e]/35 font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider shadow-xs">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-white text-[10px] bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-white/20">
                        <Clock className="w-3 h-3 text-[#dfa82e]" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#0a1420] leading-snug mb-2 group-hover:text-[#b88917] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed font-normal line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#b88917] uppercase tracking-wider group-hover:text-[#0a1420] transition-colors border-t border-slate-200 pt-3 w-full">
                    <span>Baca Insight Lengkap</span>
                    <ArrowRight className="w-3 h-3" />
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
