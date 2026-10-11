'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { Article } from '@/types/article';
import GutenbergEditor from './GutenbergEditor';

export default function ArticleDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
        triggerToast('Artikel berhasil disimpan!');
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

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    const updated: Article = { ...article, status: newStatus, updatedAt: new Date().toISOString() };
    await handleSaveArticle(updated);
  };

  const handleToggleFeatured = async (article: Article) => {
    const updated: Article = { ...article, featured: !article.featured, updatedAt: new Date().toISOString() };
    await handleSaveArticle(updated);
  };

  // If in Gutenberg editor mode
  if (isEditing) {
    return (
      <div className="h-full flex flex-col bg-background">
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
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPublished = articles.filter((a) => a.status === 'published').length;
  const totalDraft = articles.filter((a) => a.status === 'draft').length;
  const totalFeatured = articles.filter((a) => a.featured).length;
  const uniqueCategories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));

  return (
    <PageContainer>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-2xl border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Icons.circleCheck className="size-4" />
          ) : (
            <Icons.alertCircle className="size-4" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Heading with New Article Action */}
      <Heading
        title="Dashboard Artikel &amp; Publikasi"
        description="Kelola artikel regulasi, berita perizinan, perpajakan, imigrasi, pertanahan dan SDM dengan editor Gutenberg."
        action={
          <Button onClick={handleCreateNew} size="sm">
            <Icons.add className="size-4 mr-1.5" />
            <span>Tulis Artikel Baru</span>
          </Button>
        }
      />

      {/* METRIC CARDS (Shadcn UI Dashboard format) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total */}
        <Card>
          <CardHeader>
            <CardDescription>Total Seluruh Artikel</CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
              {articles.length}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Icons.post className="size-3 mr-1 text-[#dfa82e]" />
                Articles
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Seluruh naskah terdaftar di database</span>
          </CardFooter>
        </Card>

        {/* Metric 2: Published */}
        <Card>
          <CardHeader>
            <CardDescription>Artikel Terbit (Online)</CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight tabular-nums text-emerald-400">
              {totalPublished}
            </CardTitle>
            <CardAction>
              <Badge variant="success">
                <Icons.circleCheck className="size-3 mr-1" />
                Online
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Dapat dibaca oleh publik &amp; terindeks Google</span>
          </CardFooter>
        </Card>

        {/* Metric 3: Draft */}
        <Card>
          <CardHeader>
            <CardDescription>Naskah Dalam Draft</CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight tabular-nums text-amber-400">
              {totalDraft}
            </CardTitle>
            <CardAction>
              <Badge variant="warning">
                <Icons.clock className="size-3 mr-1" />
                Draft
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Menunggu peninjauan &amp; jadwal rilis redaksi</span>
          </CardFooter>
        </Card>

        {/* Metric 4: Featured */}
        <Card>
          <CardHeader>
            <CardDescription>Pilihan Redaksi (Featured)</CardDescription>
            <CardTitle className="text-2xl font-bold tracking-tight tabular-nums text-[#dfa82e]">
              {totalFeatured}
            </CardTitle>
            <CardAction>
              <Badge variant="default">
                <Icons.exclusive className="size-3 mr-1 fill-current" />
                Featured
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter>
            <span className="text-xs text-muted-foreground">Ditampilkan di highlight beranda web</span>
          </CardFooter>
        </Card>
      </div>

      {/* FILTER & TOOLBAR (Matching next-shadcn-dashboard-starter DataTableToolbar) */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Icons.search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari judul, kategori, atau tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
            {/* Category Select */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-input bg-card/60 px-3 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="all">Semua Kategori ({articles.length})</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Pills */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Semua ({articles.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Terbit ({totalPublished})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'draft'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Draft ({totalDraft})
              </button>
            </div>

            {/* View Mode Toggle (Table vs Grid) */}
            <div className="flex items-center rounded-lg border border-border bg-muted/40 p-1">
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode('table')}
                title="Tampilan Tabel"
              >
                <Icons.post className="size-3.5" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode('grid')}
                title="Tampilan Grid Kartu"
              >
                <Icons.dashboard className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* ARTICLES CONTENT (TABLE OR GRID) */}
      {loading ? (
        <Card className="py-20 text-center">
          <Icons.spinner className="size-8 animate-spin mx-auto text-[#dfa82e] mb-3" />
          <p className="text-xs text-muted-foreground">Memuat data artikel...</p>
        </Card>
      ) : filteredArticles.length === 0 ? (
        <Card className="py-16 text-center">
          <Icons.post className="size-12 text-muted-foreground/40 mx-auto mb-3" />
          <CardTitle className="text-lg">
            {searchQuery ? 'Tidak ada artikel yang cocok' : 'Belum ada artikel'}
          </CardTitle>
          <CardDescription className="max-w-sm mx-auto mt-1">
            {searchQuery
              ? 'Coba sesuaikan kata kunci atau filter status Anda'
              : 'Mulai publikasi insight hukum dengan menekan tombol buat artikel di bawah.'}
          </CardDescription>
          {!searchQuery && (
            <Button onClick={handleCreateNew} size="sm" className="mt-4">
              <Icons.add className="size-4 mr-1.5" />
              <span>Mulai Tulis Artikel</span>
            </Button>
          )}
        </Card>
      ) : viewMode === 'table' ? (
        /* SHADCN DATA TABLE VIEW */
        <Card className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="py-3 px-4 font-semibold text-xs">Artikel</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Kategori</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Featured</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Tanggal &amp; Waktu</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Status</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id} className="hover:bg-muted/30">
                  {/* Article Thumbnail & Title */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg overflow-hidden shrink-0 border border-border bg-muted">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-md">
                        <h4
                          onClick={() => handleEditArticle(article)}
                          className="font-medium text-foreground text-sm line-clamp-1 hover:text-[#dfa82e] transition-colors cursor-pointer"
                        >
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px] text-[#dfa82e] border-[#dfa82e]/30">
                      {article.category}
                    </Badge>
                  </TableCell>

                  {/* Featured */}
                  <TableCell className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(article)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        article.featured
                          ? 'bg-[#dfa82e]/20 border-[#dfa82e]/50 text-[#dfa82e]'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                      title={article.featured ? 'Hapus dari Pilihan Redaksi' : 'Jadikan Pilihan Redaksi'}
                    >
                      <Icons.exclusive className={`size-3.5 ${article.featured ? 'fill-current' : ''}`} />
                    </button>
                  </TableCell>

                  {/* Date & Read Time */}
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{article.publishedAt}</span>
                      <span className="text-[11px] text-muted-foreground">{article.readTime}</span>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3 px-4">
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className="cursor-pointer"
                      title="Klik untuk ubah status tayang"
                    >
                      <Badge variant={article.status === 'published' ? 'success' : 'warning'}>
                        <span
                          className={`size-1.5 rounded-full mr-1 ${
                            article.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        {article.status === 'published' ? 'Terbit' : 'Draft'}
                      </Badge>
                    </button>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditArticle(article)}
                        className="h-8 gap-1 text-xs"
                      >
                        <Icons.edit className="size-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Icons.ellipsis className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/insight/${article.slug}`} target="_blank" className="flex items-center gap-2">
                              <Icons.externalLink className="size-3.5 text-muted-foreground" />
                              <span>Lihat di Publik</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(article)} className="flex items-center gap-2">
                            <Icons.circleCheck className="size-3.5 text-muted-foreground" />
                            <span>{article.status === 'published' ? 'Jadikan Draft' : 'Terbitkan Artikel'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(article)} className="flex items-center gap-2">
                            <Icons.exclusive className="size-3.5 text-muted-foreground" />
                            <span>{article.featured ? 'Batal Featured' : 'Pilihan Redaksi'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            className="text-red-400 focus:text-red-300 focus:bg-destructive/20 flex items-center gap-2"
                          >
                            <Icons.trash className="size-3.5" />
                            <span>Hapus Artikel</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="p-0 overflow-hidden hover:border-[#dfa82e]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 bg-muted overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-[#dfa82e] border-[#dfa82e]/30">
                      {article.category}
                    </Badge>
                    {article.featured && (
                      <Badge variant="default" className="p-1 px-1.5">
                        <Icons.exclusive className="size-3 fill-current" />
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button onClick={() => handleToggleStatus(article)} className="cursor-pointer">
                      <Badge variant={article.status === 'published' ? 'success' : 'warning'} className="backdrop-blur-sm">
                        {article.status === 'published' ? 'Terbit' : 'Draft'}
                      </Badge>
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded font-mono">
                    {article.blocks?.length || 0} Blok
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icons.calendar className="size-3" />
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <Icons.clock className="size-3" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3
                    onClick={() => handleEditArticle(article)}
                    className="font-bold text-foreground group-hover:text-[#dfa82e] transition-colors line-clamp-2 cursor-pointer text-base"
                  >
                    {article.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <CardFooter className="justify-between px-5 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground">
                    <Link href={`/insight/${article.slug}`} target="_blank" title="Pratinjau Publik">
                      <Icons.externalLink className="size-3.5" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFeatured(article)}
                    className={`h-8 w-8 ${article.featured ? 'text-[#dfa82e]' : 'text-muted-foreground'}`}
                    title="Toggle Featured"
                  >
                    <Icons.exclusive className={`size-3.5 ${article.featured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteArticle(article.id, article.title)}
                    className="h-8 w-8 text-muted-foreground hover:text-red-400"
                    title="Hapus"
                  >
                    <Icons.trash className="size-3.5" />
                  </Button>
                </div>

                <Button size="sm" onClick={() => handleEditArticle(article)} className="h-8">
                  <Icons.edit className="size-3.5 mr-1" />
                  <span>Edit</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
