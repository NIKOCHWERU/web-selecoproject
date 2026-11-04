'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage, EditableSection } from './EditableElement';

export default function InsightsSection() {
  const { content } = useContent();
  const insights = content?.insights;
  const articles = insights?.articles || [];

  return (
    <EditableSection id="insights" name="Publikasi Insight Section" className="py-12 sm:py-16 bg-[#0a1420] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/10 border border-[#dfa82e]/30 text-[10px] font-bold uppercase tracking-widest text-[#dfa82e] mb-2.5">
            <EditableText
              fieldPath="insights.badge"
              fallback="Publikasi Editorial"
              label="Badge Insight"
            />
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-3xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="insights.title"
              fallback="Legal Insights"
              label="Judul Insight"
            />
          </h2>
          <div className="w-12 h-0.5 bg-[#dfa82e] rounded-full my-3" />
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            <EditableText
              fieldPath="insights.subtitle"
              fallback="Perspektif strategis dan regulasi dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur."
              label="Subjudul Insight"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any, idx: number) => (
            <motion.article
              key={article.id || idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="bg-[#0f2034] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-md hover:border-[#dfa82e]/50 hover:bg-[#13263c] transition-colors group"
            >
              <div className="h-40 sm:h-44 overflow-hidden border-b border-white/10">
                <EditableImage
                  fieldPath={`insights.articles.${idx}.image`}
                  fallback={article.image || article.img}
                  alt={article.title}
                  label={`Foto Artikel #${idx + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300 opacity-85 group-hover:opacity-100"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-white/40 mb-2.5">
                  <span className="bg-[#dfa82e]/10 text-[#dfa82e] font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider border border-[#dfa82e]/30">
                    <EditableText
                      fieldPath={`insights.articles.${idx}.tag`}
                      fallback={article.tag || article.category || 'Konsultan'}
                      label={`Tag Artikel #${idx + 1}`}
                    />
                  </span>
                  <span className="text-[11px]">{article.readTime || article.date}</span>
                </div>
                <h3 className="font-serif-title text-base sm:text-lg font-bold text-white leading-snug mb-2 group-hover:text-[#dfa82e] transition-colors">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.title`}
                    fallback={article.title}
                    label={`Judul Artikel #${idx + 1}`}
                  />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4 flex-grow font-normal">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.excerpt`}
                    fallback={article.excerpt}
                    label={`Ringkasan Artikel #${idx + 1}`}
                    multiline={true}
                  />
                </p>
                <Link href="/insight" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#dfa82e] border-t border-white/10 pt-3 hover:text-white transition-colors uppercase tracking-wider">
                  Baca Insight <span>→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#dfa82e] hover:bg-white text-[#0a1420] transition-colors text-[11px] font-bold uppercase tracking-widest rounded-lg shadow-sm cursor-pointer"
          >
            Lihat Semua Insight Editorial
          </Link>
        </div>

      </div>
    </EditableSection>
  );
}
