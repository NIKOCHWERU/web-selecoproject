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
  Phone
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
    title: `${article.title} | SELECO Insight`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt,
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
          <h2 className={`font-serif-title text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-4 leading-tight ${alignClass}`}>
            {text}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 className={`font-serif-title text-xl sm:text-2xl font-bold text-slate-800 mt-6 mb-3 leading-snug ${alignClass}`}>
            {text}
          </h3>
        );
      }
      return (
        <h4 className={`font-serif-title text-lg font-bold text-slate-800 mt-4 mb-2 ${alignClass}`}>
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
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-slate-50">
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
        <blockquote className="my-8 p-6 sm:p-8 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-2xl shadow-sm">
          <Quote className="w-8 h-8 text-amber-500/40 mb-2" />
          <p className="font-serif-title text-lg sm:text-xl italic text-slate-900 leading-relaxed">
            &ldquo;{block.content.text}&rdquo;
          </p>
          {(block.content.author || block.content.cite) && (
            <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-700">
              — {block.content.author} {block.content.cite && <span className="text-slate-500 font-normal">({block.content.cite})</span>}
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
        <ul className="list-disc list-outside space-y-2.5 my-6 pl-6 text-slate-700 text-base leading-relaxed marker:text-amber-500">
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
          bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
          icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
        },
        warning: {
          bg: 'bg-amber-50/80 border-amber-300 text-amber-950',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
        },
        success: {
          bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
        },
        tip: {
          bg: 'bg-indigo-50/80 border-indigo-200 text-indigo-950',
          icon: <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />,
        },
      }[type];

      return (
        <div className={`my-7 p-5 sm:p-6 rounded-2xl border ${styles.bg} flex items-start gap-4 shadow-sm`}>
          {styles.icon}
          <div>
            {block.content.title && (
              <h5 className="font-bold text-sm sm:text-base mb-1">
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

    case 'divider': {
      return (
        <div className="my-10 flex items-center justify-center gap-2">
          <div className="h-[1px] bg-gray-200 flex-grow" />
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <div className="h-[1px] bg-gray-200 flex-grow" />
        </div>
      );
    }

    case 'code': {
      return (
        <div className="my-6 rounded-xl bg-slate-950 p-4 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto border border-slate-800">
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
    <div className="min-h-screen bg-slate-50">
      {/* Article Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 overflow-hidden">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/insight" className="hover:text-amber-600 transition-colors">Insight</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-amber-700 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {article.category}
            </span>
          </div>

          <Link
            href="/insight"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Insight</span>
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="bg-white border-b border-gray-200/80 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
            {article.category}
          </div>

          <h1 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
              {article.excerpt}
            </p>
          )}

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-100 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{article.author}</div>
                <div className="text-slate-500 text-xs">{article.authorRole || 'Tim Redaksi SELECO'}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.publishedAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-10">
          <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-lg bg-slate-900 max-h-[480px]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover max-h-[480px]"
            />
          </div>
        </div>
      )}

      {/* Article Body: Gutenberg Blocks Canvas */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <article className="prose-container bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/90 shadow-sm">
          {article.blocks && article.blocks.length > 0 ? (
            article.blocks.map((block) => (
              <RenderGutenbergBlock key={block.id} block={block} />
            ))
          ) : (
            <p className="text-slate-500 italic">Konten artikel belum ditambahkan.</p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mr-1">Tags:</span>
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Consultation Call To Action Banner */}
        <section className="my-12 rounded-3xl p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-[#1e1b18] border border-amber-400/30 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Konsultasi Legalitas Bisnis
            </div>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold mb-3">
              Butuh Pendampingan Izin Usaha &amp; Kepatuhan Regulasi?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
              Tim konsultan SELECO siap membantu verifikasi risiko KBLI, pengurusan OSS RBA, dan audit kepatuhan korporasi Anda secara tepat dan profesional.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/6281119280628?text=Halo%20SELECO,%20saya%20ingin%20berkonsultasi%20mengenai%20layanan%20hukum%20dan%20perizinan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Konsultasi Sekarang</span>
              </a>
              <Link
                href="/tentang"
                className="px-5 py-3 border border-slate-700 hover:border-amber-400/50 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Tentang SELECO
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="my-12">
            <h3 className="font-serif-title text-2xl font-bold text-slate-900 mb-6">
              Insight Terkait Lainnya
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/insight/${item.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-amber-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 overflow-hidden bg-slate-100">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h4 className="font-serif-title text-sm font-bold text-slate-900 mt-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-0 text-xs font-semibold text-slate-500 flex items-center justify-between border-t border-gray-100 pt-3">
                    <span>{item.readTime}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-600" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
