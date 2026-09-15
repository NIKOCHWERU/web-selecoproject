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
  AlertCircle,
  Tag,
  LayoutGrid,
  List
} from 'lucide-react';
import { Article } from '@/types/article';
import GutenbergEditor from './GutenbergEditor';

export default function ArticleDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
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

  // If in Gutenberg editor mode, take full height
  if (isEditing) {
    return (
      <div className="h-full flex flex-col bg-[#1A222C]">
        <GutenbergEditor
          initialArticle={currentArticle}
          onSave={handleSaveArticle}
          onCancel={() => setIsEditing(false)}
          isSaving={isSaving}
        />
      </div>
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
  const uniqueCategories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300' 
            : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner - TailAdmin Style */}
      <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Gutenberg Workspace
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            Manajemen Artikel &amp; Berita
          </h1>
          <p className="text-xs sm:text-sm text-[#8A99AD] mt-1">
            Tulis, kelola, dan terbitkan artikel regulasi dan layanan bisnis dengan Gutenberg Block Editor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-[#1C2434] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </button>
        </div>
      </div>

      {/* TAILADMIN METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Articles */}
        <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-[#3C50E0]/15 flex items-center justify-center text-[#3C50E0]">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A99AD]">Total</span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold text-white">{articles.length}</h4>
            <span className="text-xs text-[#8A99AD]">Seluruh Artikel Terdaftar</span>
          </div>
        </div>

        {/* Card 2: Published */}
        <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Live</span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold text-emerald-400">{totalPublished}</h4>
            <span className="text-xs text-[#8A99AD]">Tayang di Publik &amp; Google</span>
          </div>
        </div>

        {/* Card 3: Draft */}
        <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Draft</span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold text-amber-400">{totalDraft}</h4>
            <span className="text-xs text-[#8A99AD]">Draft Menunggu Rilis</span>
          </div>
        </div>

        {/* Card 4: Categories */}
        <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-purple-400">
              <Tag className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Kategori</span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold text-white">{uniqueCategories.length}</h4>
            <span className="text-xs text-[#8A99AD]">Kategori Layanan</span>
          </div>
        </div>
      </div>

      {/* FILTER, SEARCH & VIEW SWITCHER - TailAdmin Bar */}
      <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8A99AD] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul, kategori, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1C2434] border border-[#2E3A47] rounded-xl text-xs text-white placeholder-[#8A99AD] focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#1C2434] p-1 rounded-xl border border-[#2E3A47]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-[#333A48] text-white shadow-sm font-bold'
                  : 'text-[#8A99AD] hover:text-white'
              }`}
            >
              Semua ({articles.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'published'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-[#8A99AD] hover:text-white'
              }`}
            >
              Terbit ({totalPublished})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'draft'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-[#8A99AD] hover:text-white'
              }`}
            >
              Draft ({totalDraft})
            </button>
          </div>

          {/* Table / Grid Mode Toggle */}
          <div className="flex items-center bg-[#1C2434] p-1 rounded-xl border border-[#2E3A47]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-[#333A48] text-[#D4AF37]' : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#333A48] text-[#D4AF37]' : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ARTICLES CONTENT (TABLE OR GRID) */}
      {loading ? (
        <div className="text-center py-20 bg-[#24303F] border border-[#2E3A47] rounded-2xl">
          <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs text-[#8A99AD]">Memuat artikel Gutenberg...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-[#24303F] border border-[#2E3A47] rounded-2xl p-6">
          <FileText className="w-12 h-12 text-[#8A99AD]/40 mx-auto mb-3" />
          <h3 className="font-serif-title text-lg font-bold text-white">
            {searchQuery ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel'}
          </h3>
          <p className="text-xs text-[#8A99AD] mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Coba ubah kata kunci pencarian Anda' : 'Klik tombol di bawah untuk membuat artikel pertama dengan editor Gutenberg'}
          </p>
          {!searchQuery && (
            <button
              onClick={handleCreateNew}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-[#1C2434] rounded-xl text-xs font-bold hover:brightness-110 shadow-md shadow-[#D4AF37]/20"
            >
              + Mulai Tulis Artikel
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* TAILADMIN DATA TABLE */
        <div className="bg-[#24303F] border border-[#2E3A47] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1C2434] border-b border-[#2E3A47] text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider">
                  <th className="py-4 px-5">Artikel</th>
                  <th className="py-4 px-5">Kategori</th>
                  <th className="py-4 px-5">Blok</th>
                  <th className="py-4 px-5">Tanggal &amp; Waktu</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3A47] text-xs">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#1C2434]/50 transition-colors">
                    {/* Article Cover & Title */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-12 rounded-lg bg-[#1C2434] overflow-hidden shrink-0 border border-[#2E3A47]">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-md">
                          <h4 className="font-bold text-white line-clamp-1 hover:text-[#D4AF37] transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-[11px] text-[#8A99AD] line-clamp-1 mt-0.5">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1C2434] border border-[#2E3A47] text-[#D4AF37]">
                        {article.category}
                      </span>
                    </td>

                    {/* Gutenberg Blocks Count */}
                    <td className="py-4 px-5 whitespace-nowrap text-[#8A99AD]">
                      <span className="px-2 py-0.5 bg-[#1C2434] rounded text-[11px] font-mono border border-[#2E3A47]">
                        {article.blocks?.length || 0} blok
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-5 whitespace-nowrap text-[#8A99AD]">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-white font-medium">{article.publishedAt}</span>
                        <span className="text-[10px] text-[#8A99AD]">{article.readTime}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        article.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          article.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`} />
                        <span>{article.status === 'published' ? 'Terbit' : 'Draft'}</span>
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {article.status === 'published' && (
                          <Link
                            href={`/insight/${article.slug}`}
                            target="_blank"
                            className="p-2 text-[#8A99AD] hover:text-white hover:bg-[#1C2434] rounded-lg transition-colors"
                            title="Pratinjau Publik"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1C2434] border border-[#D4AF37]/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                          title="Buka Gutenberg Editor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.title)}
                          className="p-2 text-[#8A99AD] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAILADMIN GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-[#24303F] border border-[#2E3A47] hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 bg-[#1C2434] overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1C2434]/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
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
                  <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
                    {article.blocks?.length || 0} Blok
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#8A99AD]">
                    <Calendar className="w-3 h-3" />
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif-title text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#8A99AD] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-[#2E3A47]/60 flex items-center justify-between gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {article.status === 'published' && (
                    <Link
                      href={`/insight/${article.slug}`}
                      target="_blank"
                      className="p-2 text-[#8A99AD] hover:text-white hover:bg-[#1C2434] rounded-lg transition-colors"
                      title="Buka Halaman Publik"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={() => handleDeleteArticle(article.id, article.title)}
                    className="p-2 text-[#8A99AD] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleEditArticle(article)}
                  className="px-3.5 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1C2434] border border-[#D4AF37]/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Gutenberg</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
