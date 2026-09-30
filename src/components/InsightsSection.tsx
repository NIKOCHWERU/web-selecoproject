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
    <EditableSection id="insights" name="Publikasi Insight Section" className="py-20 lg:py-28 bg-[#0a1420] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#dfa82e] mb-3">
            <EditableText
              fieldPath="insights.badge"
              fallback="Publikasi Editorial"
              label="Badge Insight"
            />
          </p>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-bold text-white leading-tight">
            <EditableText
              fieldPath="insights.title"
              fallback="Legal Insights"
              label="Judul Insight"
            />
          </h2>
          <div className="w-10 h-[2px] bg-[#dfa82e] my-5" />
          <p className="text-sm text-slate-300 font-normal">
            <EditableText
              fieldPath="insights.subtitle"
              fallback="Perspektif strategis dan regulasi dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur."
              label="Subjudul Insight"
              multiline={true}
            />
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any, idx: number) => (
            <motion.article
              key={article.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-[#0f2034] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:border-[#dfa82e]/50 hover:bg-[#13263c] transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden border-b border-white/10">
                <EditableImage
                  fieldPath={`insights.articles.${idx}.image`}
                  fallback={article.image || article.img}
                  alt={article.title}
                  label={`Foto Artikel #${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-white/40 mb-3">
                  <span className="bg-[#dfa82e]/10 text-[#dfa82e] font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border border-[#dfa82e]/30">
                    <EditableText
                      fieldPath={`insights.articles.${idx}.tag`}
                      fallback={article.tag || article.category || 'Konsultan'}
                      label={`Tag Artikel #${idx + 1}`}
                    />
                  </span>
                  <span>{article.readTime || article.date}</span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-white leading-snug mb-3 group-hover:text-[#dfa82e] transition-colors">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.title`}
                    fallback={article.title}
                    label={`Judul Artikel #${idx + 1}`}
                  />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-5 flex-grow font-normal">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.excerpt`}
                    fallback={article.excerpt}
                    label={`Ringkasan Artikel #${idx + 1}`}
                    multiline={true}
                  />
                </p>
                <Link href="/insight" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dfa82e] border-t border-white/10 pt-4 hover:text-white transition-colors group-hover:text-[#dfa82e] uppercase tracking-wider">
                  Baca Insight <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/insight"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#dfa82e] rounded-lg text-[#dfa82e] hover:bg-[#dfa82e] hover:text-[#0a1420] transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            Lihat Semua Insight Editorial
          </Link>
        </div>

      </div>
    </EditableSection>
  );
}
