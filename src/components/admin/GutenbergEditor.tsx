'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Image as ImageIcon, 
  Type, 
  Heading as HeadingIcon, 
  Quote as QuoteIcon, 
  List as ListIcon, 
  AlertCircle, 
  Minus, 
  Upload, 
  Check, 
  Sparkles, 
  Globe, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  FileText,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Table as TableIcon,
  MessageCircle,
  Download,
  Star,
  Search,
  Share2,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { Article, GutenbergBlock, BlockType } from '@/types/article';
import { compressImageToDataUrl } from '@/lib/imageUtils';

interface GutenbergEditorProps {
  initialArticle?: Article | null;
  onSave: (article: Article) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function GutenbergEditor({
  initialArticle,
  onSave,
  onCancel,
  isSaving = false,
}: GutenbergEditorProps) {
  const [article, setArticle] = useState<Article>(() => {
    if (initialArticle) return initialArticle;
    return {
      id: `art-${Date.now()}`,
      slug: `artikel-baru-${Date.now().toString().slice(-4)}`,
      title: '',
      excerpt: '',
      coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      category: 'Perizinan OSS',
      tags: ['Perizinan', 'Legalitas'],
      author: 'Tim Redaksi SELECO',
      authorRole: 'Regulatory Consultant',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '5 menit baca',
      status: 'draft',
      featured: false,
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      blocks: [
        {
          id: 'b-init-1',
          type: 'heading',
          content: { level: 2, text: 'Pendahuluan', align: 'left' }
        },
        {
          id: 'b-init-2',
          type: 'paragraph',
          content: { 
            text: 'Tuliskan pengantar artikel Anda di sini. Jelaskan latar belakang regulasi, kewajiban hukum, dan implikasi strategis bagi operasional bisnis Anda.',
            align: 'justify'
          }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [showBlockPickerIndex, setShowBlockPickerIndex] = useState<number | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [sidebarTab, setSidebarTab] = useState<'document' | 'seo'>('document');
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculate word count & reading time
  const calculateStats = () => {
    let text = (article.title || '') + ' ' + (article.excerpt || '');
    article.blocks.forEach((b) => {
      if (b.content.text) text += ' ' + b.content.text;
      if (b.content.items) text += ' ' + b.content.items.join(' ');
      if (b.content.code) text += ' ' + b.content.code;
      if (b.content.headers) text += ' ' + b.content.headers.join(' ');
      if (b.content.rows) text += ' ' + b.content.rows.flat().join(' ');
      if (b.content.ctaTitle) text += ' ' + b.content.ctaTitle;
      if (b.content.ctaDescription) text += ' ' + b.content.ctaDescription;
    });
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const estMinutes = Math.max(1, Math.ceil(words / 180));
    return { words, estMinutes };
  };

  const { words: totalWords, estMinutes: calculatedMinutes } = calculateStats();

  const applyAutoReadingTime = () => {
    setArticle((prev) => ({
      ...prev,
      readTime: `${calculatedMinutes} menit baca`,
    }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    const slugified = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setArticle(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug.startsWith('artikel-baru') || prev.slug === '' ? slugified : prev.slug,
      metaTitle: prev.metaTitle || newTitle,
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      setArticle(prev => ({ ...prev, coverImage: dataUrl }));
    } catch (err) {
      console.error('Error uploading cover:', err);
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Block management
  const addBlock = (type: BlockType, atIndex: number) => {
    const newBlock: GutenbergBlock = {
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: getDefaultContentForType(type),
    };

    const newBlocks = [...article.blocks];
    newBlocks.splice(atIndex, 0, newBlock);
    setArticle(prev => ({ ...prev, blocks: newBlocks }));
    setActiveBlockId(newBlock.id);
    setShowBlockPickerIndex(null);
  };

  const updateBlockContent = (id: string, updates: Partial<GutenbergBlock['content']>) => {
    setArticle(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...updates } } : b),
    }));
  };

  const removeBlock = (id: string) => {
    setArticle(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id),
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= article.blocks.length) return;

    const newBlocks = [...article.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    setArticle(prev => ({ ...prev, blocks: newBlocks }));
  };

  const duplicateBlock = (block: GutenbergBlock, index: number) => {
    const cloned: GutenbergBlock = {
      ...block,
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      content: JSON.parse(JSON.stringify(block.content)),
    };
    const newBlocks = [...article.blocks];
    newBlocks.splice(index + 1, 0, cloned);
    setArticle(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = (statusToSave: 'published' | 'draft') => {
    if (!article.title.trim()) {
      alert('Judul artikel wajib diisi!');
      return;
    }
    const finalArticle: Article = {
      ...article,
      status: statusToSave,
      slug: article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      metaTitle: article.metaTitle || article.title,
      metaDescription: article.metaDescription || article.excerpt,
      updatedAt: new Date().toISOString(),
    };
    onSave(finalArticle);
  };

  return (
    <div className="flex flex-col h-full bg-[#0c131d] text-slate-100 select-none">
      
      {/* Top Header Bar */}
      <header className="h-16 px-6 bg-[#0f2034] border-b border-white/10 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-xl text-white/70 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Artikel</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#b88917] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace Artikel</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              article.status === 'published' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {article.status === 'published' ? 'Terbit' : 'Draft'}
            </span>
            {article.featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#b88917]/20 text-[#b88917] border border-[#b88917]/40 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                <span>Pilihan Redaksi</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Word Count & Read Time Live Stats */}
        <div className="hidden md:flex items-center gap-3 text-xs text-white/60 bg-[#070b12] px-3.5 py-1.5 rounded-full border border-white/10 font-mono">
          <span>{totalWords} kata</span>
          <span>•</span>
          <span>{article.readTime || `${calculatedMinutes} menit baca`}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#b88917]" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 text-xs font-bold rounded-xl border border-white/15 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSaving}
            className="px-4 py-1.5 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-[#0f2034] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{article.status === 'published' ? 'Perbarui Publikasi' : 'Terbitkan Artikel'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Gutenberg Canvas & Right Document Settings */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Gutenberg Visual Canvas */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 py-10 custom-scrollbar bg-[#090e16]">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Cover Image Box */}
            <div className="relative group/cover rounded-2xl overflow-hidden border border-white/10 bg-[#0f2034] h-56 sm:h-72 shadow-xl">
              <img
                src={article.coverImage}
                alt={article.title || 'Sampul Artikel'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isUploadingCover}
                    className="px-3.5 py-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#b88917]" />
                    <span>{isUploadingCover ? 'Mengunggah...' : 'Ganti Foto Sampul'}</span>
                  </button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Article Title Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={article.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ketik Judul Artikel Regulasi / Bisnis..."
                className="w-full bg-transparent font-serif-title text-2xl sm:text-4xl font-bold text-white placeholder:text-white/30 focus:outline-none leading-tight border-b border-transparent focus:border-[#b88917]/50 pb-2 transition-colors"
              />
            </div>

            {/* Article Excerpt Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">
                Ringkasan Singkat / Lead Paragraph (Excerpt)
              </label>
              <textarea
                value={article.excerpt}
                onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value, metaDescription: prev.metaDescription || e.target.value }))}
                placeholder="Tuliskan ringkasan singkat artikel ini dalam 1-2 kalimat pengantar..."
                rows={2}
                className="w-full bg-[#111827] border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white/80 placeholder:text-white/30 focus:outline-none focus:border-[#b88917] resize-none leading-relaxed"
              />
            </div>

            {/* Gutenberg Blocks Stream */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              {article.blocks.map((block, idx) => (
                <React.Fragment key={block.id}>
                  {/* Plus button to insert block above */}
                  <div className="relative flex justify-center -my-2 opacity-0 hover:opacity-100 transition-opacity z-10">
                    <button
                      type="button"
                      onClick={() => setShowBlockPickerIndex(idx)}
                      className="w-6 h-6 rounded-full bg-[#b88917] text-[#0f2034] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title="Sisipkan Blok di Sini"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                  {/* The Block Editor Card */}
                  <div 
                    onClick={() => setActiveBlockId(block.id)}
                    className={`relative group/block rounded-xl border p-4 transition-all duration-200 ${
                      activeBlockId === block.id 
                        ? 'border-[#b88917] bg-[#111827] shadow-xl ring-1 ring-[#b88917]/30' 
                        : 'border-white/10 bg-[#111827]/60 hover:border-white/20'
                    }`}
                  >
                    {/* Block Controls Toolbar (Header) */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider text-[#b88917] px-2 py-0.5 rounded bg-[#b88917]/10 border border-[#b88917]/20 flex items-center gap-1">
                          {getBlockIcon(block.type)}
                          <span>{getBlockLabel(block.type)}</span>
                        </span>

                        {/* Block Type Options */}
                        {block.type === 'heading' && (
                          <div className="flex items-center gap-1 bg-[#0c131d] p-0.5 rounded-lg border border-white/10">
                            {([2, 3, 4] as const).map(lvl => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => updateBlockContent(block.id, { level: lvl })}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  (block.content.level || 2) === lvl
                                    ? 'bg-[#b88917] text-[#0f2034]'
                                    : 'text-white/50 hover:text-white'
                                }`}
                              >
                                H{lvl}
                              </button>
                            ))}
                          </div>
                        )}

                        {block.type === 'callout' && (
                          <select
                            value={block.content.calloutType || 'info'}
                            onChange={(e) => updateBlockContent(block.id, { calloutType: e.target.value as any })}
                            className="bg-[#0c131d] border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white/80 focus:outline-none"
                          >
                            <option value="info">Info</option>
                            <option value="tip">Tips</option>
                            <option value="warning">Peringatan</option>
                            <option value="success">Sukses</option>
                          </select>
                        )}

                        {block.type === 'list' && (
                          <div className="flex items-center gap-1 bg-[#0c131d] p-0.5 rounded-lg border border-white/10">
                            <button
                              type="button"
                              onClick={() => updateBlockContent(block.id, { listType: 'bullet' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (block.content.listType || 'bullet') === 'bullet'
                                  ? 'bg-[#b88917] text-[#0f2034]'
                                  : 'text-white/50 hover:text-white'
                              }`}
                            >
                              Bullet (•)
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBlockContent(block.id, { listType: 'ordered' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                block.content.listType === 'ordered'
                                  ? 'bg-[#b88917] text-[#0f2034]'
                                  : 'text-white/50 hover:text-white'
                              }`}
                            >
                              Angka (1.)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Block Controls (Move, Duplicate, Delete) */}
                      <div className="flex items-center gap-1 opacity-80 group-hover/block:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'up')}
                          disabled={idx === 0}
                          className={`p-1 hover:bg-white/10 rounded ${idx === 0 ? 'opacity-30' : 'text-white/60 hover:text-white'}`}
                          title="Geser Naik"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'down')}
                          disabled={idx === article.blocks.length - 1}
                          className={`p-1 hover:bg-white/10 rounded ${idx === article.blocks.length - 1 ? 'opacity-30' : 'text-white/60 hover:text-white'}`}
                          title="Geser Turun"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateBlock(block, idx)}
                          className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                          title="Duplikasi Blok"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="p-1 hover:bg-rose-500/20 text-white/50 hover:text-rose-400 rounded"
                          title="Hapus Blok"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Input Content */}
                    <div className="space-y-2">
                      {block.type === 'heading' && (
                        <input
                          type="text"
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder={`Subjudul Heading H${block.content.level || 2}...`}
                          className="w-full bg-transparent font-serif-title font-bold text-lg sm:text-xl text-white placeholder:text-white/30 focus:outline-none"
                        />
                      )}

                      {block.type === 'paragraph' && (
                        <textarea
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder="Tuliskan isi paragraf regulasi atau analisa di sini..."
                          rows={3}
                          className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/30 focus:outline-none resize-none leading-relaxed whitespace-pre-line"
                        />
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-2.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={block.content.url || ''}
                              onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                              placeholder="URL Foto atau Upload gambar..."
                              className="flex-1 bg-[#0c131d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#b88917] text-xs font-bold rounded-lg border border-[#b88917]/40 cursor-pointer flex items-center gap-1">
                              <Upload className="w-3 h-3" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    const d = await compressImageToDataUrl(f);
                                    updateBlockContent(block.id, { url: d });
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {block.content.url && (
                            <div className="rounded-xl overflow-hidden border border-white/10 max-h-64 bg-black flex items-center justify-center">
                              <img src={block.content.url} alt={block.content.caption || 'Gambar'} className="max-h-64 object-contain" />
                            </div>
                          )}
                          <input
                            type="text"
                            value={block.content.caption || ''}
                            onChange={(e) => updateBlockContent(block.id, { caption: e.target.value })}
                            placeholder="Keterangan caption gambar (opsional)..."
                            className="w-full bg-[#0c131d]/60 border border-white/10 rounded-lg px-3 py-1 text-[11px] text-white/50 italic focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'quote' && (
                        <div className="border-l-4 border-[#b88917] pl-4 py-1 space-y-2 bg-[#b88917]/5 rounded-r-xl pr-3">
                          <textarea
                            value={block.content.text || ''}
                            onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                            placeholder="Tuliskan kutipan atau pernyataan penting di sini..."
                            rows={2}
                            className="w-full bg-transparent font-serif-title italic text-sm text-white placeholder:text-white/30 focus:outline-none resize-none leading-relaxed"
                          />
                          <input
                            type="text"
                            value={block.content.author || ''}
                            onChange={(e) => updateBlockContent(block.id, { author: e.target.value })}
                            placeholder="— Sumber / Penulis Kutipan (opsional)"
                            className="w-full bg-transparent text-xs text-[#b88917] font-semibold focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <div className="space-y-2">
                          {(block.content.items || ['Item 1']).map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <span className="text-[#b88917] font-mono text-xs w-4">
                                {block.content.listType === 'ordered' ? `${itemIdx + 1}.` : '•'}
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...(block.content.items || [])];
                                  newItems[itemIdx] = e.target.value;
                                  updateBlockContent(block.id, { items: newItems });
                                }}
                                placeholder={`Poin list #${itemIdx + 1}...`}
                                className="flex-1 bg-[#0c131d] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = (block.content.items || []).filter((_, i) => i !== itemIdx);
                                  updateBlockContent(block.id, { items: newItems });
                                }}
                                className="p-1 text-white/40 hover:text-rose-400"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...(block.content.items || []), ''];
                              updateBlockContent(block.id, { items: newItems });
                            }}
                            className="text-[11px] font-bold text-[#b88917] hover:underline flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Poin List</span>
                          </button>
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.content.title || ''}
                            onChange={(e) => updateBlockContent(block.id, { title: e.target.value })}
                            placeholder="Judul Kotak Info / Perhatian..."
                            className="w-full bg-[#0c131d] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                          />
                          <textarea
                            value={block.content.text || ''}
                            onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                            placeholder="Tuliskan keterangan detail di dalam kotak informasi ini..."
                            rows={2}
                            className="w-full bg-[#0c131d] border border-white/10 rounded-lg p-2.5 text-xs text-white/80 focus:outline-none resize-none"
                          />
                        </div>
                      )}

                      {/* NEW BLOCK: TABLE (TABEL REGULASI / TARIF) */}
                      {block.type === 'table' && (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={block.content.title || ''}
                            onChange={(e) => updateBlockContent(block.id, { title: e.target.value })}
                            placeholder="Judul Tabel (misal: Matriks Syarat Perizinan PT PMA)..."
                            className="w-full bg-[#0c131d] border border-white/10 rounded px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                          />

                          {/* Table Headers */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-white/15">
                                  {(block.content.headers || ['Kolom 1', 'Kolom 2', 'Kolom 3']).map((h, hIdx) => (
                                    <th key={hIdx} className="p-1 pr-2">
                                      <input
                                        type="text"
                                        value={h}
                                        onChange={(e) => {
                                          const newH = [...(block.content.headers || [])];
                                          newH[hIdx] = e.target.value;
                                          updateBlockContent(block.id, { headers: newH });
                                        }}
                                        className="w-full bg-[#0c131d] border border-white/10 rounded px-2 py-1 text-xs font-bold text-[#b88917]"
                                      />
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {(block.content.rows || [['Baris 1 A', 'Baris 1 B', 'Baris 1 C']]).map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-white/5">
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="p-1 pr-2">
                                        <input
                                          type="text"
                                          value={cell}
                                          onChange={(e) => {
                                            const newRows = (block.content.rows || []).map((r, ri) =>
                                              ri === rIdx ? r.map((c, ci) => ci === cIdx ? e.target.value : c) : r
                                            );
                                            updateBlockContent(block.id, { rows: newRows });
                                          }}
                                          className="w-full bg-[#0c131d]/60 border border-white/5 rounded px-2 py-1 text-xs text-white"
                                        />
                                      </td>
                                    ))}
                                    <td className="w-8 p-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newRows = (block.content.rows || []).filter((_, i) => i !== rIdx);
                                          updateBlockContent(block.id, { rows: newRows });
                                        }}
                                        className="text-white/30 hover:text-rose-400 p-1"
                                        title="Hapus Baris"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCols = (block.content.headers || []).length || 3;
                                const newRow = new Array(currentCols).fill('');
                                updateBlockContent(block.id, { rows: [...(block.content.rows || []), newRow] });
                              }}
                              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-[#b88917] rounded border border-white/10 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Tambah Baris</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* NEW BLOCK: CTA KONSULTASI */}
                      {block.type === 'cta' && (
                        <div className="p-3 bg-[#0c131d] rounded-xl border border-white/10 space-y-2">
                          <input
                            type="text"
                            value={block.content.ctaTitle || ''}
                            onChange={(e) => updateBlockContent(block.id, { ctaTitle: e.target.value })}
                            placeholder="Judul Box CTA (misal: Butuh Bantuan Terkait Regulasi Ini?)..."
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs font-bold text-white"
                          />
                          <textarea
                            rows={2}
                            value={block.content.ctaDescription || ''}
                            onChange={(e) => updateBlockContent(block.id, { ctaDescription: e.target.value })}
                            placeholder="Deskripsi ajakan konsultasi singkat..."
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white/80 resize-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={block.content.ctaButtonText || ''}
                              onChange={(e) => updateBlockContent(block.id, { ctaButtonText: e.target.value })}
                              placeholder="Teks Tombol (Konsultasi Sekarang)"
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-[#b88917]"
                            />
                            <input
                              type="text"
                              value={block.content.ctaButtonUrl || ''}
                              onChange={(e) => updateBlockContent(block.id, { ctaButtonUrl: e.target.value })}
                              placeholder="URL Tombol (/kontak)"
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {/* NEW BLOCK: FILE DOWNLOAD LAMPIRAN */}
                      {block.type === 'fileDownload' && (
                        <div className="p-3 bg-[#0c131d] rounded-xl border border-white/10 space-y-2">
                          <input
                            type="text"
                            value={block.content.fileName || ''}
                            onChange={(e) => updateBlockContent(block.id, { fileName: e.target.value })}
                            placeholder="Nama Dokumen (misal: PP No. 5 Tahun 2021 tentang OSS RBA.pdf)..."
                            className="w-full bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs font-bold text-white"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={block.content.fileSize || ''}
                              onChange={(e) => updateBlockContent(block.id, { fileSize: e.target.value })}
                              placeholder="Ukuran (2.4 MB)"
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={block.content.fileType || ''}
                              onChange={(e) => updateBlockContent(block.id, { fileType: e.target.value })}
                              placeholder="Jenis (Peraturan Pemerintah)"
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white"
                            />
                            <input
                              type="text"
                              value={block.content.downloadUrl || ''}
                              onChange={(e) => updateBlockContent(block.id, { downloadUrl: e.target.value })}
                              placeholder="URL Unduh (/files/...)"
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-[#b88917] font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'divider' && (
                        <div className="flex items-center gap-2 py-2">
                          <div className="h-px bg-white/15 flex-grow" />
                          <span className="text-[10px] text-white/40 uppercase font-mono tracking-widest">Garis Pembatas Topik</span>
                          <div className="h-px bg-white/15 flex-grow" />
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Bottom Add Block Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowBlockPickerIndex(article.blocks.length)}
                  className="px-5 py-2.5 bg-[#0f2034] hover:bg-[#1a2e47] text-[#b88917] border border-dashed border-[#b88917]/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Blok Konten Baru</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Document Settings & SEO Tabs */}
        <aside className="w-80 bg-[#111827] border-l border-white/10 flex flex-col shrink-0">
          
          {/* Sidebar Top Switcher: Dokumen vs SEO */}
          <div className="h-12 border-b border-white/10 flex items-center bg-[#0f2034] px-2">
            <button
              onClick={() => setSidebarTab('document')}
              className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                sidebarTab === 'document' ? 'border-[#b88917] text-[#b88917]' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dokumen</span>
            </button>
            <button
              onClick={() => setSidebarTab('seo')}
              className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                sidebarTab === 'seo' ? 'border-[#b88917] text-[#b88917]' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>SEO &amp; Share</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
            
            {/* TAB: DOCUMENT SETTINGS */}
            {sidebarTab === 'document' && (
              <>
                {/* Featured Toggle */}
                <div className="p-3 bg-[#0c131d] rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className={`w-4 h-4 ${article.featured ? 'text-[#b88917] fill-current' : 'text-white/40'}`} />
                    <div>
                      <p className="text-xs font-bold text-white">Pilihan Redaksi</p>
                      <p className="text-[10px] text-white/40">Sorot di halaman depan</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={article.featured || false}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#b88917] cursor-pointer"
                  />
                </div>

                {/* Status & Visibility */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Status Artikel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setArticle(prev => ({ ...prev, status: 'draft' }))}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        article.status === 'draft'
                          ? 'bg-[#b88917] text-[#0f2034] border-[#b88917]'
                          : 'bg-[#0c131d] text-white/50 border-white/10 hover:text-white'
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticle(prev => ({ ...prev, status: 'published' }))}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        article.status === 'published'
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-[#0c131d] text-white/50 border-white/10 hover:text-white'
                      }`}
                    >
                      Terbit Publik
                    </button>
                  </div>
                </div>

                {/* Permalink / Slug */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block flex items-center gap-1">
                    <Globe className="w-3 h-3 text-[#b88917]" />
                    <span>Slug URL</span>
                  </label>
                  <div className="flex items-center gap-1 bg-[#0c131d] border border-white/10 rounded-lg px-2 py-1.5">
                    <span className="text-[10px] text-white/40 font-mono">/insight/</span>
                    <input
                      type="text"
                      value={article.slug}
                      onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                      className="w-full bg-transparent text-xs text-[#b88917] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Kategori Layanan</label>
                  <select
                    value={article.category}
                    onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#0c131d] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#b88917]"
                  >
                    <option value="Perizinan OSS">Perizinan OSS</option>
                    <option value="Imigrasi & TKA">Imigrasi &amp; TKA</option>
                    <option value="Perpajakan">Perpajakan</option>
                    <option value="Pertanahan BPN">Pertanahan BPN</option>
                    <option value="Ketenagakerjaan SDM">Ketenagakerjaan SDM</option>
                    <option value="Kontrak Bisnis">Kontrak Bisnis</option>
                    <option value="Korporasi & M&A">Korporasi &amp; M&amp;A</option>
                    <option value="HAKI & Merek">HAKI &amp; Merek</option>
                    <option value="Regulasi Bisnis">Regulasi Bisnis</option>
                  </select>
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block flex items-center gap-1">
                    <User className="w-3 h-3 text-[#b88917]" />
                    <span>Penulis</span>
                  </label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Nama Penulis..."
                    className="w-full bg-[#0c131d] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                  />
                </div>

                {/* Read Time & Date */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Waktu Baca</label>
                      <input
                        type="text"
                        value={article.readTime}
                        onChange={(e) => setArticle(prev => ({ ...prev, readTime: e.target.value }))}
                        className="w-full bg-[#0c131d] border border-white/10 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Tanggal</label>
                      <input
                        type="date"
                        value={article.publishedAt}
                        onChange={(e) => setArticle(prev => ({ ...prev, publishedAt: e.target.value }))}
                        className="w-full bg-[#0c131d] border border-white/10 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={applyAutoReadingTime}
                    className="w-full py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] font-semibold text-[#b88917] border border-white/10"
                  >
                    Hitung Otomatis ({calculatedMinutes} mnt dari {totalWords} kata)
                  </button>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#b88917]" />
                    <span>Tags Artikel</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      placeholder="Tambah tag..."
                      className="flex-1 bg-[#0c131d] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 py-1 bg-[#b88917] text-[#0f2034] rounded text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {article.tags.map(t => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0c131d] border border-white/10 rounded text-[10px] text-white/80"
                      >
                        #{t}
                        <button type="button" onClick={() => handleRemoveTag(t)} className="text-white/40 hover:text-rose-400">
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* TAB: SEO & SOCIAL SHARING */}
            {sidebarTab === 'seo' && (
              <div className="space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#b88917] pb-1 border-b border-white/10">
                  Optimasi Mesin Pencari (Google SEO)
                </div>

                {/* Focus Keyword */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block">Kata Kunci Utama (Focus Keyword)</label>
                  <input
                    type="text"
                    value={article.focusKeyword || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="misal: perizinan oss rba 2026"
                    className="w-full bg-[#0c131d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                  />
                </div>

                {/* Meta Title */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white/60 uppercase tracking-wider">Judul Meta SEO</span>
                    <span className={`${(article.metaTitle || '').length > 60 ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
                      {(article.metaTitle || '').length} / 60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={article.metaTitle || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder={article.title || 'Judul yang tampil di hasil pencarian Google...'}
                    className="w-full bg-[#0c131d] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                  />
                </div>

                {/* Meta Description */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white/60 uppercase tracking-wider">Deskripsi Meta SEO</span>
                    <span className={`${(article.metaDescription || '').length > 160 ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
                      {(article.metaDescription || '').length} / 160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={article.metaDescription || ''}
                    onChange={(e) => setArticle(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder={article.excerpt || 'Deskripsi ringkas yang tampil di bawah judul di Google...'}
                    className="w-full bg-[#0c131d] border border-white/10 rounded p-2.5 text-xs text-white/80 focus:outline-none focus:border-[#b88917] resize-none"
                  />
                </div>

                {/* Google SERP Snippet Preview */}
                <div className="p-3 bg-white rounded-xl shadow border border-gray-200 space-y-1 text-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#202124]">
                    <span className="w-4 h-4 rounded-full bg-[#0f2034] text-[#b88917] text-[8px] flex items-center justify-center font-bold">S</span>
                    <span className="font-semibold text-xs">SELECO Project</span>
                    <span className="text-gray-400">• https://selecoproject.com/insight/{article.slug}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#1a0dab] line-clamp-1 hover:underline cursor-pointer">
                    {article.metaTitle || article.title || 'Judul Artikel di Google'} | SELECO Insight
                  </h4>
                  <p className="text-[11px] text-[#4d5156] line-clamp-2 leading-relaxed">
                    {article.metaDescription || article.excerpt || 'Deskripsi cuplikan artikel yang akan dibaca pengguna saat mencari topik ini di mesin pencari Google...'}
                  </p>
                </div>

                {/* WhatsApp / Social Card Preview */}
                <div className="space-y-1.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider block flex items-center gap-1">
                    <Share2 className="w-3 h-3 text-[#b88917]" />
                    <span>Pratinjau Bagikan ke WhatsApp / LinkedIn</span>
                  </span>
                  <div className="rounded-xl overflow-hidden border border-white/15 bg-[#0c131d] text-white">
                    <div className="h-28 bg-black/40 overflow-hidden">
                      <img src={article.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <span className="text-[9px] font-mono text-white/40 uppercase">selecoproject.com</span>
                      <p className="text-xs font-bold text-white line-clamp-1">{article.title || 'Judul Artikel'}</p>
                      <p className="text-[10px] text-white/50 line-clamp-2 leading-tight">
                        {article.excerpt || 'Ringkasan artikel saat tautan dibagikan ke klien atau media sosial.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </aside>
      </div>

      {/* BLOCK PICKER MODAL */}
      {showBlockPickerIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-white/15 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#b88917]" />
                <span className="font-bold text-sm text-white">Pilih Blok Konten</span>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockPickerIndex(null)}
                className="text-white/50 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {[
                { type: 'paragraph' as BlockType, label: 'Paragraf', icon: Type, desc: 'Teks artikel dan analisa regulasi' },
                { type: 'heading' as BlockType, label: 'Judul (Heading)', icon: HeadingIcon, desc: 'Subjudul bagian artikel H2/H3/H4' },
                { type: 'table' as BlockType, label: 'Tabel Regulasi & Biaya', icon: TableIcon, desc: 'Matriks syarat, tarif, dan komparasi' },
                { type: 'cta' as BlockType, label: 'Banner Konsultasi', icon: MessageCircle, desc: 'Kotak ajakan hubungi konsultan SELECO' },
                { type: 'fileDownload' as BlockType, label: 'Lampiran / Download PDF', icon: Download, desc: 'Dokumen peraturan atau file resmi' },
                { type: 'image' as BlockType, label: 'Gambar / Foto', icon: ImageIcon, desc: 'Foto ilustrasi dengan caption' },
                { type: 'quote' as BlockType, label: 'Kutipan (Quote)', icon: QuoteIcon, desc: 'Highlight kutipan pasal atau pimpinan' },
                { type: 'list' as BlockType, label: 'Daftar Poin', icon: ListIcon, desc: 'Daftar bullet atau angka berurutan' },
                { type: 'callout' as BlockType, label: 'Kotak Info / Alert', icon: AlertCircle, desc: 'Peringatan atau tips khusus' },
                { type: 'divider' as BlockType, label: 'Garis Pembatas', icon: Minus, desc: 'Garis pemisah antar topik bahasan' },
              ].map(item => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addBlock(item.type, showBlockPickerIndex)}
                    className="p-3 bg-[#0c131d] hover:bg-[#1a2e47] border border-white/10 hover:border-[#b88917]/70 rounded-xl text-left transition-all flex flex-col gap-1.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#b88917]/10 flex items-center justify-center text-[#b88917] group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-white">{item.label}</span>
                    <span className="text-[10px] text-white/50 leading-tight">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIVE ARTICLE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="h-14 px-6 bg-[#0f2034] text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#b88917]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#b88917]">
                  Pratinjau Artikel (Reader View)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/10"
              >
                &times;
              </button>
            </div>

            {/* Rendered Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-slate-50">
              <article className="max-w-2xl mx-auto space-y-6 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-200">
                <div className="inline-block px-3 py-1 bg-[#0f2034]/10 border border-[#0f2034]/20 text-[#0f2034] text-xs font-bold uppercase rounded-full tracking-wider">
                  {article.category}
                </div>

                <h1 className="font-serif-title text-2xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  {article.title || 'Judul Artikel Anda'}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-gray-200">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <div className="rounded-xl overflow-hidden shadow max-h-96">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>

                {article.excerpt && (
                  <p className="text-base text-slate-600 font-medium italic border-l-4 border-[#b88917] pl-4 py-1 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}

                {/* Render Gutenberg Blocks */}
                <div className="space-y-5 pt-4">
                  {article.blocks.map(b => (
                    <div key={b.id}>
                      {b.type === 'heading' && (
                        <h2 className={`font-serif-title font-bold text-slate-900 leading-tight mt-6 mb-2 ${
                          b.content.level === 3 ? 'text-xl sm:text-2xl' : (b.content.level === 4 ? 'text-lg' : 'text-2xl sm:text-3xl')
                        }`}>
                          {b.content.text}
                        </h2>
                      )}

                      {b.type === 'paragraph' && (
                        <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {b.content.text}
                        </p>
                      )}

                      {b.type === 'image' && b.content.url && (
                        <figure className="my-6">
                          <img src={b.content.url} alt="Preview" className="rounded-xl max-h-96 w-full object-cover shadow" />
                          {b.content.caption && (
                            <figcaption className="text-center text-xs text-slate-500 mt-2 italic">{b.content.caption}</figcaption>
                          )}
                        </figure>
                      )}

                      {b.type === 'quote' && (
                        <blockquote className="my-6 p-5 bg-amber-50/60 border-l-4 border-[#b88917] rounded-r-xl italic font-serif-title text-slate-900">
                          &ldquo;{b.content.text}&rdquo;
                          {b.content.author && <span className="block mt-2 text-xs font-sans font-bold text-[#b88917] not-italic">— {b.content.author}</span>}
                        </blockquote>
                      )}

                      {b.type === 'list' && (
                        <ul className="list-disc pl-6 space-y-1 text-slate-700 text-sm my-4 marker:text-[#b88917]">
                          {(b.content.items || []).map((it, idx) => (
                            <li key={idx}>{it}</li>
                          ))}
                        </ul>
                      )}

                      {b.type === 'table' && (
                        <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-[#0f2034] text-white">
                              <tr>
                                {(b.content.headers || []).map((h, i) => (
                                  <th key={i} className="px-3 py-2">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {(b.content.rows || []).map((r, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50">
                                  {r.map((c, cIdx) => (
                                    <td key={cIdx} className="px-3 py-2 text-slate-700">{c}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {b.type === 'cta' && (
                        <div className="my-6 p-6 bg-[#0f2034] text-white rounded-xl border-l-4 border-[#b88917]">
                          <h4 className="font-serif-title text-lg font-bold">{b.content.ctaTitle}</h4>
                          <p className="text-xs text-white/70 mt-1">{b.content.ctaDescription}</p>
                          <a href={b.content.ctaButtonUrl || '/kontak'} className="mt-3 inline-block px-4 py-2 bg-[#b88917] text-[#0f2034] font-bold text-xs uppercase rounded">
                            {b.content.ctaButtonText || 'Konsultasi'}
                          </a>
                        </div>
                      )}

                      {b.type === 'fileDownload' && (
                        <div className="my-4 p-3 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#b88917]" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{b.content.fileName}</p>
                              <p className="text-[10px] text-slate-500">{b.content.fileType} • {b.content.fileSize}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#b88917]">Unduh</span>
                        </div>
                      )}

                      {b.type === 'callout' && (
                        <div className="my-4 p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-950 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-[#b88917] shrink-0 mt-0.5" />
                          <div>
                            {b.content.title && <h4 className="font-bold text-sm mb-1">{b.content.title}</h4>}
                            <p className="text-xs leading-relaxed">{b.content.text}</p>
                          </div>
                        </div>
                      )}

                      {b.type === 'divider' && (
                        <hr className="my-8 border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-wrap gap-2">
                  {article.tags.map(t => (
                    <span key={t} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getDefaultContentForType(type: BlockType): GutenbergBlock['content'] {
  switch (type) {
    case 'heading':
      return { level: 2, text: '', align: 'left' };
    case 'paragraph':
      return { text: '', align: 'justify' };
    case 'image':
      return { url: '', caption: '' };
    case 'quote':
      return { text: '', author: '' };
    case 'list':
      return { listType: 'bullet', items: ['Poin pertama', 'Poin kedua'] };
    case 'callout':
      return { calloutType: 'info', title: 'Informasi Penting', text: '' };
    case 'table':
      return {
        title: 'Tabel Regulasi & Biaya',
        headers: ['Parameter / Syarat', 'Ketentuan Hukum', 'Biaya / Waktu'],
        rows: [
          ['Contoh Syarat 1', 'Wajib melampirkan NIB & NPWP', '1-2 Hari Kerja'],
          ['Contoh Syarat 2', 'Sertifikat Standar OSS Terverifikasi', '3-5 Hari Kerja'],
        ],
      };
    case 'cta':
      return {
        ctaTitle: 'Butuh Pendampingan Regulasi Ini?',
        ctaDescription: 'Tim konsultan SELECO siap membantu proses izin, kepatuhan, dan operasional bisnis Anda.',
        ctaButtonText: 'Konsultasi via WhatsApp',
        ctaButtonUrl: '/kontak',
      };
    case 'fileDownload':
      return {
        fileName: 'Salinan Peraturan Regulasi Terkait.pdf',
        fileSize: '1.8 MB',
        fileType: 'PDF Resmi',
        downloadUrl: '/kontak',
      };
    case 'divider':
      return {};
    default:
      return { text: '' };
  }
}

function getBlockIcon(type: BlockType) {
  switch (type) {
    case 'heading': return <HeadingIcon className="w-3 h-3" />;
    case 'paragraph': return <Type className="w-3 h-3" />;
    case 'image': return <ImageIcon className="w-3 h-3" />;
    case 'quote': return <QuoteIcon className="w-3 h-3" />;
    case 'list': return <ListIcon className="w-3 h-3" />;
    case 'callout': return <AlertCircle className="w-3 h-3" />;
    case 'table': return <TableIcon className="w-3 h-3" />;
    case 'cta': return <MessageCircle className="w-3 h-3" />;
    case 'fileDownload': return <Download className="w-3 h-3" />;
    case 'divider': return <Minus className="w-3 h-3" />;
    default: return <FileText className="w-3 h-3" />;
  }
}

function getBlockLabel(type: BlockType) {
  switch (type) {
    case 'heading': return 'Judul / Heading';
    case 'paragraph': return 'Paragraf';
    case 'image': return 'Gambar & Foto';
    case 'quote': return 'Kutipan / Quote';
    case 'list': return 'Daftar Poin';
    case 'callout': return 'Kotak Info / Alert';
    case 'table': return 'Tabel Regulasi & Biaya';
    case 'cta': return 'Banner Konsultasi';
    case 'fileDownload': return 'Lampiran / Unduh PDF';
    case 'divider': return 'Garis Pembatas';
    default: return 'Blok Konten';
  }
}
