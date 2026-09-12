'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useContent } from '@/context/ContentContext';
import { EditableText, EditableImage } from './EditableElement';

export default function InsightsSection() {
  const { content } = useContent();
  const insights = content?.insights;
  const articles = insights?.articles || [];

  return (
    <section id="insights" className="py-20 lg:py-28 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-widest mb-4">
            <EditableText
              fieldPath="insights.badge"
              fallback="PUBLIKASI EDITORIAL"
              label="Badge Insight"
            />
          </div>
          <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
            <EditableText
              fieldPath="insights.title"
              fallback="Legal Insights"
              label="Judul Insight"
            />
          </h2>
          <div className="w-16 h-[3px] bg-gold-accent mx-auto my-4 rounded-full" />
          <p className="text-base text-slate-600 font-normal">
            <EditableText
              fieldPath="insights.subtitle"
              fallback="Perspektif hukum praktis dari tim konsultan SELECO untuk pengambilan keputusan bisnis yang lebih terukur."
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
              className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-gold-accent transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden border-b border-gray-100">
                <EditableImage
                  fieldPath={`insights.articles.${idx}.image`}
                  fallback={article.image || article.img}
                  alt={article.title}
                  label={`Foto Artikel #${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border border-amber-200/60">
                    <EditableText
                      fieldPath={`insights.articles.${idx}.tag`}
                      fallback={article.tag || article.category || 'Hukum'}
                      label={`Tag Artikel #${idx + 1}`}
                    />
                  </span>
                  <span>{article.readTime || article.date}</span>
                </div>
                <h3 className="font-serif-title text-xl font-bold text-slate-900 leading-snug mb-3 group-hover:text-gold-accent transition-colors">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.title`}
                    fallback={article.title}
                    label={`Judul Artikel #${idx + 1}`}
                  />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-5 flex-grow">
                  <EditableText
                    fieldPath={`insights.articles.${idx}.excerpt`}
                    fallback={article.excerpt}
                    label={`Ringkasan Artikel #${idx + 1}`}
                    multiline={true}
                  />
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
