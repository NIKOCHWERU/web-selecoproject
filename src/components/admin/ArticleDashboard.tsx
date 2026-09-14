'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  ExternalLink,
  BookOpen,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Article } from '@/types/article';
import GutenbergEditor from './GutenbergEditor';

export default function ArticleDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  
  // Editor mode state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/articles', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.articles) {
          setArticles(data.articles);
        }
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const triggerToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateNew = () => {
    setCurrentArticle(null);
    setIsEditing(true);
  };

  const handleEditArticle = (article: Article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        triggerToast('Artikel berhasil dihapus!');
      } else {
        triggerToast(data.error || 'Gagal menghapus artikel', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan jaringan', 'error');
    }
  };

  const handleSaveArticle = async (savedArticle: Article) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: savedArticle }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('Artikel berhasil disimpan ke sistem Gutenberg!');
        setIsEditing(false);
        fetchArticles();
      } else {
        triggerToast(data.error || 'Gagal menyimpan artikel', 'error');
      }
    } catch (err) {
      triggerToast('Terjadi kesalahan saat menyimpan artikel', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // If in Gutenberg editor mode
  if (isEditing) {
    return (
      <GutenbergEditor
        initialArticle={currentArticle}
        onSave={handleSaveArticle}
        onCancel={() => setIsEditing(false)}
        isSaving={isSaving}
      />
    );
  }

  const filteredArticles = articles.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPublished = articles.filter((a) => a.status === 'published').length;
  const totalDraft = articles.filter((a) => a.status === 'draft').length;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-900 text-slate-100 p-6 md:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' 
            : 'bg-red-950/90 border-red-500/50 text-red-300'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Gutenberg Workspace
            </div>
            <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              Manajemen Artikel &amp; Publikasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Tulis, kelola, dan terbitkan artikel regulasi dan perizinan bisnis dengan editor blok Gutenberg.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNew}
              className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-gold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Artikel</span>
              <div className="text-2xl font-bold text-white mt-1">{articles.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Dipublikasikan</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{totalPublished}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Draft</span>
              <div className="text-2xl font-bold text-amber-400 mt-1">{totalDraft}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, kategori, tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Terbit ({totalPublished})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Draft ({totalDraft})
            </button>
          </div>
        </div>

        {/* Articles List / Grid */}
        {loading ? (
          <div className="text-center py-20 bg-slate-950 border border-slate-800 rounded-3xl">
            <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-xs text-slate-400">Memuat artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-slate-950 border border-slate-800 rounded-3xl p-6">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-serif-title text-lg font-bold text-slate-300">
              {searchQuery ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'Coba ubah kata kunci pencarian Anda' : 'Klik tombol di bawah untuk membuat artikel pertama dengan editor Gutenberg'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateNew}
                className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold hover:brightness-110"
              >
                + Mulai Tulis Artikel
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
                        article.status === 'published'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                      }`}>
                        {article.status === 'published' ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded">
                      {article.blocks?.length || 0} Blok Gutenberg
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="font-serif-title text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-900 flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {article.status === 'published' && (
                      <Link
                        href={`/insight/${article.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleEditArticle(article)}
                    className="px-3.5 py-1.5 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Gutenberg</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
