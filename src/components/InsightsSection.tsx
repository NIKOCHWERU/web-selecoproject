'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function InsightsSection() {
  const { content } = useContent();
  const insights = content?.insights;
  const articles = insights?.articles || [];

  return (
    <EditableSection id="insights" name="Publikasi Insight Section" className="py-14 md:py-20 bg-white text-[#0a1420]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#dfa82e]/15 border border-[#dfa82e]/30 text-[#b88917] text-xs font-bold uppercase tracking-widest mb-3">
            <EditableText
              fieldPath="insights.badge"
              fallback="Publikasi & Catatan Regulasi"
              label="Badge Insight"
            />
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 uppercase tracking-wide text-[#0a1420]">
            <EditableText
              fieldPath="insights.title"
              fallback="Regulasi Berubah Cepat. Anda Tetap Selangkah di Depan."
              label="Judul Insight"
            />
          </h2>
          <div className="w-16 h-1 bg-[#dfa82e] mx-auto mb-4" />
          <p className="text-sm md:text-base max-w-2xl mx-auto text-gray-600">
            <EditableText
              fieldPath="insights.subtitle"
              fallback="Ringkasan aturan baru dan panduan praktis dari tim konsultan kami untuk membantu manajemen mengambil keputusan yang tepat."
              label="Subjudul Insight"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article: any, idx: number) => (
            <article
              key={article.id || idx}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-[#dfa82e] transition-all flex flex-col group"
            >
              <div className="h-48 overflow-hidden border-b border-gray-200 bg-gray-100">
                <EditableImage
                  fieldPath={`insights.articles.${idx}.image`}
                  fallback={article.image || article.img}
                  alt={article.title}
                  label={`Foto Artikel #${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-[#dfa82e]/15 text-[#b88917] font-bold px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider border border-[#dfa82e]/30">
                    <EditableText
                      fieldPath={`insights.articles.${idx}.tag`}
                      fallback={article.tag || article.category || 'Regulasi'}
                      label={`Tag Artikel #${idx + 1}`}
                    />
                  </span>
                  <span className="text-xs text-gray-500">{article.readTime || article.date}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0a1420] leading-snug mb-2 group-hover:text-[#b88917] transition-colors">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.title`}
                    fallback={article.title}
                    label={`Judul Artikel #${idx + 1}`}
                  />
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-3 mb-5 flex-grow">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.excerpt`}
                    fallback={article.excerpt}
                    label={`Ringkasan Artikel #${idx + 1}`}
                    multiline={true}
                  />
                </p>
                <Link
                  href="/insight"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0a1420] hover:text-[#b88917] border-t border-gray-100 pt-3.5 transition-colors"
                >
                  Baca Selengkapnya <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 bg-[#0a1420] hover:bg-[#dfa82e] text-white hover:text-[#0a1420] px-7 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
          >
            Baca Semua Insight <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </EditableSection>
  );
}
