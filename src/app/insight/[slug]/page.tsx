import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ChevronRight, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  Quote, 
  ArrowRight,
  ShieldCheck,
  Phone,
  Download,
  FileText,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/articleService';
import { GutenbergBlock } from '@/types/article';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan | SELECO',
    };
  }

  return {
    title: article.metaTitle || `${article.title} | SELECO Insight`,
    description: article.metaDescription || article.excerpt || article.title,
    keywords: article.focusKeyword ? [article.focusKeyword, ...(article.tags || [])] : article.tags,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  };
}

function RenderGutenbergBlock({ block }: { block: GutenbergBlock }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[block.content.align || 'left'];

  switch (block.type) {
    case 'heading': {
      const level = block.content.level || 2;
      const text = block.content.text || '';
      if (level === 2) {
        return (
          <h2 className={`font-serif-title text-2xl sm:text-3xl font-bold text-[#0a1420] mt-8 mb-4 leading-tight ${alignClass}`}>
            {text}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 className={`font-serif-title text-xl sm:text-2xl font-bold text-[#0a1420] mt-6 mb-3 leading-snug ${alignClass}`}>
            {text}
          </h3>
        );
      }
      return (
        <h4 className={`font-serif-title text-lg font-bold text-[#0a1420] mt-4 mb-2 ${alignClass}`}>
          {text}
        </h4>
      );
    }

    case 'paragraph': {
      return (
        <p className={`text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal ${alignClass} whitespace-pre-line`}>
          {block.content.text}
        </p>
      );
    }

    case 'image': {
      return (
        <figure className="my-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-md bg-slate-100">
            <img
              src={block.content.url}
              alt={block.content.alt || 'Ilustrasi Artikel SELECO'}
              className="w-full h-auto max-h-[520px] object-cover"
            />
          </div>
          {block.content.caption && (
            <figcaption className="text-center text-xs text-slate-500 mt-2.5 italic">
              {block.content.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'quote': {
      return (
        <blockquote className="my-8 p-6 sm:p-8 bg-slate-50 border-l-4 border-[#dfa82e] rounded-r-2xl border border-slate-200 shadow-sm">
          <Quote className="w-8 h-8 text-[#dfa82e]/60 mb-2" />
          <p className="font-serif-title text-lg sm:text-xl italic text-[#0a1420] leading-relaxed">
            &ldquo;{block.content.text}&rdquo;
          </p>
          {(block.content.author || block.content.cite) && (
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#b88917]">
              - {block.content.author} {block.content.cite && <span className="text-slate-500 font-normal">({block.content.cite})</span>}
            </div>
          )}
        </blockquote>
      );
    }

    case 'list': {
      const items: string[] = block.content.items || [];
      if (block.content.listType === 'ordered') {
        return (
          <ol className="list-decimal list-outside space-y-2.5 my-6 pl-6 text-slate-700 text-base leading-relaxed">
            {items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className="list-disc list-outside space-y-2.5 my-6 pl-6 text-slate-700 text-base leading-relaxed marker:text-[#dfa82e]">
          {items.map((item, idx) => (
            <li key={idx} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    case 'callout': {
      const type = block.content.calloutType || 'info';
      const styles = {
        info: {
          bg: 'bg-blue-50/70 border-blue-200 text-blue-950',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
        },
        warning: {
          bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
        },
        success: {
          bg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
        },
        tip: {
          bg: 'bg-[#dfa82e]/10 border-[#dfa82e]/30 text-amber-950',
          icon: <Lightbulb className="w-5 h-5 text-[#b88917] shrink-0 mt-0.5" />,
        },
      }[type];

      return (
        <div className={`my-7 p-5 sm:p-6 rounded-2xl border ${styles.bg} flex items-start gap-4 shadow-xs`}>
          {styles.icon}
          <div>
            {block.content.title && (
              <h5 className="font-bold text-sm sm:text-base mb-1 text-[#0a1420]">
                {block.content.title}
              </h5>
            )}
            <p className="text-sm sm:text-base leading-relaxed opacity-90">
              {block.content.text}
            </p>
          </div>
        </div>
      );
    }

    case 'table': {
      const headers: string[] = block.content.headers || ['Parameter Regulasi', 'Ketentuan / Syarat', 'Keterangan'];
      const rows: string[][] = block.content.rows || [];
      return (
        <div className="my-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
          {block.content.title && (
            <div className="px-5 py-3 bg-slate-50 text-[#b88917] text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              {block.content.title}
            </div>
          )}
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#0a1420] font-bold uppercase text-[11px] tracking-wider">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3 border-r border-slate-200 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 border-r border-slate-100 last:border-r-0 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'cta': {
      return (
        <div className="my-10 bg-slate-50 text-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#dfa82e]" />
          <div className="pl-3 sm:pl-4 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#b88917]">
              Konsultasi Profesional SELECO
            </span>
            <h4 className="font-serif-title text-xl sm:text-2xl font-bold text-[#0a1420] leading-tight">
              {block.content.ctaTitle || 'Butuh Pendampingan Terkait Topik Regulasi Ini?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {block.content.ctaDescription || 'Diskusikan kebutuhan perizinan usaha, kepatuhan imigrasi TKA, pajak, atau pertanahan Anda bersama tim konsultan kami.'}
            </p>
            <div className="pt-2">
              <a
                href={block.content.ctaButtonUrl || '/kontak'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a1420] hover:bg-[#b88917] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{block.content.ctaButtonText || 'Jadwalkan Konsultasi'}</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    case 'fileDownload': {
      return (
        <div className="my-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-gray-200 flex items-center justify-between gap-4 hover:border-[#b88917]/50 transition-colors">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#0f2034] text-[#b88917] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                {block.content.fileName || 'Dokumen Regulasi Terkait.pdf'}
              </p>
              <p className="text-[11px] text-slate-500">
                {block.content.fileType || 'Dokumen Resmi'} • {block.content.fileSize || 'PDF'}
              </p>
            </div>
          </div>
          {block.content.downloadUrl && (
            <a
              href={block.content.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-4 py-2 bg-white border border-gray-300 hover:border-[#b88917] hover:text-[#b88917] text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </a>
          )}
        </div>
      );
    }

    case 'divider': {
      return (
        <div className="my-10 flex items-center justify-center gap-2">
          <div className="h-[1px] bg-gray-200 flex-grow" />
          <div className="w-2 h-2 rounded-full bg-[#b88917]" />
          <div className="h-[1px] bg-gray-200 flex-grow" />
        </div>
      );
    }

    case 'code': {
      return (
        <div className="my-6 rounded-xl bg-slate-950 p-4 font-mono text-xs sm:text-sm text-[#b88917] overflow-x-auto border border-slate-800">
          <pre>{block.content.code}</pre>
        </div>
      );
    }

    default:
      return null;
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getArticles('published');
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="pt-10 sm:pt-14 pb-20 bg-white min-h-screen font-sans text-slate-900">
      <div className="container mx-auto px-4 max-w-[92%] md:max-w-5xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/insight"
            className="inline-flex items-center text-[#0a1420] hover:text-[#dfa82e] transition-colors font-bold uppercase tracking-widest text-xs gap-2"
          >
            <ArrowLeft size={16} /> Kembali ke Insight
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#dfa82e] text-[#0a1420] text-[10px] font-bold px-3 py-1 uppercase tracking-[0.2em] rounded-full">
              {article.category || 'Insight'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#0a1420] mb-6 font-sans leading-tight">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 font-normal">
              {article.excerpt}
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs sm:text-sm border-b border-slate-200 pb-6 mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#dfa82e]" />
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#dfa82e]" />
              <span className="font-medium text-slate-800">{article.author}</span>
              {article.authorRole && <span className="text-slate-400">({article.authorRole})</span>}
            </div>
            {article.readTime && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#dfa82e]" />
                <span>{article.readTime}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Cover Image */}
        {article.coverImage && (
          <div className="mb-10 sm:mb-12 rounded-2xl overflow-hidden shadow-xl aspect-video max-h-[520px] bg-slate-100 border border-slate-200">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-lg md:prose-xl max-w-none text-slate-800 leading-relaxed font-normal mb-16 prose-p:mb-6 prose-p:text-justify prose-headings:font-sans prose-headings:text-[#0a1420] prose-a:text-[#dfa82e] prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-slate-800">
          {article.blocks && article.blocks.length > 0 ? (
            article.blocks.map((block) => (
              <RenderGutenbergBlock key={block.id} block={block} />
            ))
          ) : (
            <p className="text-slate-500 italic">Konten artikel belum ditambahkan.</p>
          )}
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12 pt-6 border-t border-slate-200 flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-[#dfa82e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0a1420]">Tags:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg hover:border-[#dfa82e]/50 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-8 mb-16 pt-12 border-t border-slate-200">
            <div className="text-center md:text-left mb-8">
              <h4 className="text-[#dfa82e] font-black tracking-[0.2em] uppercase text-xs mb-2">
                Sentral Edukasi &amp; Regulasi
              </h4>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0a1420] uppercase font-sans tracking-wide">
                Insight &amp; Analisis Terkait
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArt) => (
                <Link
                  href={`/insight/${relArt.slug}`}
                  key={relArt.id}
                  className="flex flex-col group h-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#dfa82e]/50 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="w-full h-40 bg-slate-100 mb-4 overflow-hidden rounded-lg relative">
                    <img
                      src={relArt.coverImage}
                      alt={relArt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[#dfa82e] text-[10px] font-black tracking-widest uppercase mb-2">
                    {relArt.category || 'Insight'}
                  </div>
                  <h4 className="text-sm font-bold text-[#0a1420] mb-3 line-clamp-2 uppercase font-sans group-hover:text-[#dfa82e] transition-colors leading-snug">
                    {relArt.title}
                  </h4>
                  <div className="mt-auto pt-3 flex justify-between items-center border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#dfa82e]" />
                      <span>{relArt.publishedAt}</span>
                    </div>
                    <span>{relArt.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Consultation CTA Banner */}
        <div className="mt-12 mb-12 relative overflow-hidden rounded-2xl max-w-4xl mx-auto shadow-xl bg-[#0a1420] text-white border border-[#dfa82e]/30">
          <div className="relative z-10 p-6 md:p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#dfa82e]/20 rounded-xl mb-4 border border-[#dfa82e]/30">
              <MessageCircle className="text-[#dfa82e] w-6 h-6" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-3 uppercase tracking-widest font-sans">
              Butuh Konsultasi Korporasi &amp; Legalitas?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto mb-6 leading-relaxed">
              Jangan biarkan perizinan, keimigrasian, perpajakan, atau masalah SDM menghambat bisnis Anda. Tim konsultan SELECO siap memberikan arahan dan kepastian regulasi.
            </p>
            <a
              href="https://wa.me/6282211020022?text=Halo%20SELECO,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20korporasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#dfa82e] hover:bg-white text-[#0a1420] font-bold py-3 px-6 text-sm rounded-lg transition-all shadow-md group"
            >
              Konsultasi Sekarang
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Tersedia untuk Konsultasi Online &amp; Tatap Muka
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
