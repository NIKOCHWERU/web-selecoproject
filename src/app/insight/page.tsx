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
    <div className="min-h-screen bg-[#0a1420] text-slate-100">
      {/* Page Hero Banner */}
      <div className="bg-[#0f2034] border-b border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
            <Link href="/" className="hover:text-gold-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#dfa82e] font-semibold">Insight</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#dfa82e]/10 border border-[#dfa82e]/30 rounded-full text-[#dfa82e] text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" /> PUBLIKASI EDITORIAL &amp; REGULASI
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Insight &amp; Analisis Regulasi Bisnis
            </h1>
            <div className="w-16 h-[3px] bg-[#dfa82e] mt-3 mb-4 rounded-full" />
            <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
              Perspektif strategis dan regulasi dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur dan aman dari risiko operasional.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {publishedArticles.length === 0 ? (
          <div className="text-center py-16 bg-[#0f2034] rounded-3xl border border-white/10 p-8 shadow-xl">
            <BookOpen className="w-12 h-12 text-[#dfa82e] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif-title text-xl font-bold text-white">Belum Ada Artikel yang Dipublikasikan</h3>
            <p className="text-sm text-slate-400 mt-1">Silakan tambahkan dan terbitkan artikel melalui Dashboard Admin.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedArticles.map((item) => (
              <Link
                key={item.id}
                href={`/insight/${item.slug}`}
                className="group rounded-2xl overflow-hidden bg-[#0f2034] border border-white/10 hover:border-[#dfa82e]/50 hover:bg-[#13263c] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Full Thumbnail */}
                  <div className="relative h-56 overflow-hidden bg-slate-900 border-b border-white/10">
                    <img
                      src={item.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#dfa82e]/10 backdrop-blur-md text-[#dfa82e] border border-[#dfa82e]/30 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <span className="text-white text-xs bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded-md font-medium flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-[#dfa82e]" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-white/40 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{item.publishedAt}</span>
                    </div>
                    <h3 className="font-serif-title text-xl font-bold text-white leading-snug mb-3 group-hover:text-[#dfa82e] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed font-normal line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#dfa82e] uppercase tracking-wider group-hover:text-white transition-colors border-t border-white/10 pt-4 w-full">
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
