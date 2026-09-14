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
  Lightbulb
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
            text: 'Tuliskan pengantar artikel Anda di sini. Jelaskan latar belakang topik dan mengapa hal ini penting bagi operasional dan legalitas bisnis.',
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
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title if title changes and slug is default
  const handleTitleChange = (newTitle: string) => {
    const slugified = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setArticle(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug.startsWith('artikel-baru') || prev.slug === '' ? slugified : prev.slug,
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
      updatedAt: new Date().toISOString(),
    };
    onSave(finalArticle);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Top Header Bar */}
      <header className="h-16 px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Artikel</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Workspace Gutenberg</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              article.status === 'published' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {article.status === 'published' ? 'Terbit' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSaving}
            className="px-4 py-1.5 bg-gradient-to-r from-gold-accent to-gold-bright hover:brightness-110 text-slate-950 text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition-all"
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{article.status === 'published' ? 'Perbarui Artikel' : 'Publikasikan'}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Gutenberg Canvas & Right Document Settings */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Gutenberg Visual Canvas */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 lg:px-20 py-10 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Cover Image Box */}
            <div className="relative group/cover rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 h-56 sm:h-72 shadow-xl">
              <img
                src={article.coverImage}
                alt="Cover Artikel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-5">
                <div className="flex items-center gap-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 backdrop-blur-md flex items-center gap-1.5 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingCover ? 'Mengupload...' : 'Ganti Foto Cover'}</span>
                  </button>
                  <input
                    type="text"
                    value={article.coverImage}
                    onChange={(e) => setArticle(prev => ({ ...prev, coverImage: e.target.value }))}
                    placeholder="Atau tempel URL gambar di sini..."
                    className="px-3 py-1.5 bg-slate-900/80 border border-slate-700 rounded-lg text-xs text-slate-300 w-64 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                  />
                </div>
              </div>
            </div>

            {/* Gutenberg H1 Title Input */}
            <div className="border-b border-slate-800 pb-4">
              <textarea
                value={article.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tambahkan Judul Artikel..."
                rows={2}
                className="w-full bg-transparent font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white placeholder:text-slate-600 focus:outline-none resize-none leading-tight"
              />
            </div>

            {/* Excerpt Summary */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Ringkasan / Excerpt Artikel:</span>
              </label>
              <textarea
                value={article.excerpt}
                onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Tuliskan 1-2 kalimat ringkasan singkat artikel untuk preview di halaman utama dan SEO..."
                rows={2}
                className="w-full bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* GUTENBERG BLOCKS CONTAINER */}
            <div className="space-y-4 pt-4">
              {article.blocks.map((block, idx) => (
                <React.Fragment key={block.id}>
                  {/* Plus button to insert block above */}
                  <div className="relative flex justify-center -my-2 opacity-0 hover:opacity-100 transition-opacity z-10">
                    <button
                      type="button"
                      onClick={() => setShowBlockPickerIndex(idx)}
                      className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
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
                        ? 'border-amber-400 bg-slate-950 shadow-xl ring-1 ring-amber-400/30' 
                        : 'border-slate-800/70 bg-slate-950/40 hover:border-slate-700'
                    }`}
                  >
                    {/* Block Controls Toolbar (Header) */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 flex items-center gap-1">
                          {getBlockIcon(block.type)}
                          <span>{getBlockLabel(block.type)}</span>
                        </span>

                        {/* Block Type Options */}
                        {block.type === 'heading' && (
                          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                            {([2, 3, 4] as const).map(lvl => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => updateBlockContent(block.id, { level: lvl })}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  (block.content.level || 2) === lvl
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'text-slate-400 hover:text-white'
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
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                          >
                            <option value="info">Info</option>
                            <option value="tip">Tips</option>
                            <option value="warning">Peringatan</option>
                            <option value="success">Sukses</option>
                          </select>
                        )}

                        {block.type === 'list' && (
                          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                            <button
                              type="button"
                              onClick={() => updateBlockContent(block.id, { listType: 'bullet' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                (block.content.listType || 'bullet') === 'bullet'
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Bullet (•)
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBlockContent(block.id, { listType: 'ordered' })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                block.content.listType === 'ordered'
                                  ? 'bg-amber-400 text-slate-950'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Angka (1.)
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Action Icons (Move, Duplicate, Delete) */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                          title="Geser ke Atas"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(idx, 'down')}
                          disabled={idx === article.blocks.length - 1}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-30"
                          title="Geser ke Bawah"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateBlock(block, idx)}
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                          title="Duplikat Blok"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded"
                          title="Hapus Blok"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block Input Content */}
                    <div>
                      {block.type === 'heading' && (
                        <input
                          type="text"
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder={`Ketik subjudul H${block.content.level || 2}...`}
                          className={`w-full bg-transparent font-serif-title font-bold text-white placeholder:text-slate-600 focus:outline-none ${
                            (block.content.level || 2) === 2 ? 'text-xl sm:text-2xl' : (block.content.level === 3 ? 'text-lg sm:text-xl' : 'text-base')
                          }`}
                        />
                      )}

                      {block.type === 'paragraph' && (
                        <textarea
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder="Tuliskan teks paragraf artikel di sini..."
                          rows={3}
                          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none resize-y leading-relaxed"
                        />
                      )}

                      {block.type === 'image' && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={block.content.url || ''}
                              onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                              placeholder="URL Foto atau Upload gambar..."
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                            />
                            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 cursor-pointer flex items-center gap-1">
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
                            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-64 bg-black flex items-center justify-center">
                              <img src={block.content.url} alt={block.content.caption || 'Gambar'} className="max-h-64 object-contain" />
                            </div>
                          )}
                          <input
                            type="text"
                            value={block.content.caption || ''}
                            onChange={(e) => updateBlockContent(block.id, { caption: e.target.value })}
                            placeholder="Tuliskan keterangan caption gambar (opsional)..."
                            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1 text-[11px] text-slate-400 italic focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'quote' && (
                        <div className="border-l-4 border-amber-400 pl-4 py-1 space-y-2 bg-amber-400/5 rounded-r-xl pr-3">
                          <textarea
                            value={block.content.text || ''}
                            onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                            placeholder="Tuliskan kutipan atau pernyataan penting di sini..."
                            rows={2}
                            className="w-full bg-transparent font-serif-title italic text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed"
                          />
                          <input
                            type="text"
                            value={block.content.author || ''}
                            onChange={(e) => updateBlockContent(block.id, { author: e.target.value })}
                            placeholder="— Sumber / Penulis Kutipan (opsional)"
                            className="w-full bg-transparent text-xs text-amber-300 font-semibold focus:outline-none"
                          />
                        </div>
                      )}

                      {block.type === 'list' && (
                        <div className="space-y-2">
                          {(block.content.items || ['Item 1']).map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <span className="text-amber-400 font-mono text-xs w-4">
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
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = (block.content.items || []).filter((_, i) => i !== itemIdx);
                                  updateBlockContent(block.id, { items: newItems });
                                }}
                                className="p-1 text-slate-500 hover:text-rose-400"
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
                            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 pt-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Poin List</span>
                          </button>
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className={`p-3.5 rounded-xl border space-y-2 ${
                          block.content.calloutType === 'warning'
                            ? 'bg-rose-500/10 border-rose-500/30'
                            : block.content.calloutType === 'tip'
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : block.content.calloutType === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}>
                          <input
                            type="text"
                            value={block.content.title || ''}
                            onChange={(e) => updateBlockContent(block.id, { title: e.target.value })}
                            placeholder="Judul Box Peringatan / Info (opsional)..."
                            className="w-full bg-transparent font-bold text-xs text-white placeholder:text-slate-500 focus:outline-none"
                          />
                          <textarea
                            value={block.content.text || ''}
                            onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                            placeholder="Isi pesan penting / highlight di sini..."
                            rows={2}
                            className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                      )}

                      {block.type === 'divider' && (
                        <div className="py-2">
                          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Bottom Add Block Trigger */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowBlockPickerIndex(article.blocks.length)}
                  className="px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-dashed border-amber-400/40 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Blok Konten Baru</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar: Document Settings */}
        <aside className="w-80 bg-slate-950/70 border-l border-slate-800 p-5 overflow-y-auto custom-scrollbar shrink-0 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Pengaturan Artikel</span>
            </span>
          </div>

          {/* Status & Visibility */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Publikasi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setArticle(prev => ({ ...prev, status: 'draft' }))}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  article.status === 'draft'
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setArticle(prev => ({ ...prev, status: 'published' }))}
                className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                  article.status === 'published'
                    ? 'bg-emerald-400 text-slate-950 border-emerald-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Terbitkan
              </button>
            </div>
          </div>

          {/* Permalink / Slug */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-300" />
              <span>URL Slug / Permalink</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5">
              <span className="text-[10px] text-slate-500 font-mono">/insight/</span>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') }))}
                className="w-full bg-transparent text-xs text-amber-300 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori</label>
            <select
              value={article.category}
              onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Perizinan OSS">Perizinan OSS</option>
              <option value="Kontrak Bisnis">Kontrak Bisnis</option>
              <option value="Korporasi & M&A">Korporasi & M&A</option>
              <option value="Ketenagakerjaan">Ketenagakerjaan</option>
              <option value="HAKI & Merek">HAKI & Merek</option>
              <option value="Perpajakan">Perpajakan</option>
              <option value="Regulasi Bisnis">Regulasi Bisnis</option>
            </select>
          </div>

          {/* Author */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <User className="w-3 h-3 text-amber-300" />
              <span>Penulis (Author)</span>
            </label>
            <input
              type="text"
              value={article.author}
              onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Nama Penulis..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Read Time & Date */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>Waktu Baca</span>
              </label>
              <input
                type="text"
                value={article.readTime}
                onChange={(e) => setArticle(prev => ({ ...prev, readTime: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-300" />
                <span>Tanggal</span>
              </label>
              <input
                type="date"
                value={article.publishedAt}
                onChange={(e) => setArticle(prev => ({ ...prev, publishedAt: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Tag className="w-3 h-3 text-amber-300" />
              <span>Tags / Label</span>
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Tambah tag..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {article.tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] text-slate-300"
                >
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-500 hover:text-rose-400">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

        </aside>
      </div>

      {/* BLOCK PICKER POPUP MODAL */}
      {showBlockPickerIndex !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-amber-400/50 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  Pilih Tipe Blok Gutenberg
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowBlockPickerIndex(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'paragraph' as BlockType, label: 'Paragraf', icon: Type, desc: 'Teks artikel dan paragraf umum' },
                { type: 'heading' as BlockType, label: 'Judul (Heading)', icon: HeadingIcon, desc: 'Subjudul bagian artikel H2/H3' },
                { type: 'image' as BlockType, label: 'Gambar / Foto', icon: ImageIcon, desc: 'Sisipkan foto dengan caption' },
                { type: 'quote' as BlockType, label: 'Kutipan (Quote)', icon: QuoteIcon, desc: 'Highlight kutipan dengan garis aksen' },
                { type: 'list' as BlockType, label: 'Daftar Poin', icon: ListIcon, desc: 'Daftar bullet atau angka' },
                { type: 'callout' as BlockType, label: 'Kotak Info / Alert', icon: AlertCircle, desc: 'Peringatan atau tips khusus' },
                { type: 'divider' as BlockType, label: 'Garis Pembatas', icon: Minus, desc: 'Garis pemisah antar topik' },
              ].map(item => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addBlock(item.type, showBlockPickerIndex)}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/70 rounded-xl text-left transition-all flex flex-col gap-1.5 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-white">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIVE ARTICLE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white text-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="h-14 px-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Live Preview Artikel Reader View
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                &times;
              </button>
            </div>

            {/* Rendered Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar">
              <article className="max-w-2xl mx-auto space-y-6">
                <div className="inline-block px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase rounded-full tracking-wider">
                  {article.category}
                </div>

                <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  {article.title || 'Judul Artikel Anda'}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-500 pb-4 border-b border-gray-200">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-lg max-h-96">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>

                {article.excerpt && (
                  <p className="text-base text-slate-600 font-medium italic border-l-4 border-gold-accent pl-4 py-1 leading-relaxed">
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
                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                          {b.content.text}
                        </p>
                      )}

                      {b.type === 'image' && b.content.url && (
                        <figure className="my-6">
                          <img src={b.content.url} alt={b.content.caption || ''} className="rounded-xl w-full object-cover shadow-md" />
                          {b.content.caption && (
                            <figcaption className="text-center text-xs text-slate-500 italic mt-2">
                              {b.content.caption}
                            </figcaption>
                          )}
                        </figure>
                      )}

                      {b.type === 'quote' && (
                        <blockquote className="my-6 p-5 bg-amber-50/60 border-l-4 border-gold-accent rounded-r-xl">
                          <p className="font-serif-title italic text-base sm:text-lg text-slate-800 leading-snug">
                            “{b.content.text}”
                          </p>
                          {b.content.author && (
                            <cite className="block text-xs font-bold uppercase tracking-wider text-amber-800 mt-2 not-italic">
                              — {b.content.author}
                            </cite>
                          )}
                        </blockquote>
                      )}

                      {b.type === 'list' && (
                        <ul className="my-4 space-y-2 text-sm sm:text-base text-slate-700">
                          {(b.content.items || []).map((it, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-gold-accent font-bold mt-0.5">•</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {b.type === 'callout' && (
                        <div className={`my-6 p-4 rounded-xl border flex items-start gap-3.5 ${
                          b.content.calloutType === 'warning'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : b.content.calloutType === 'tip'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : b.content.calloutType === 'success'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}>
                          <div className="shrink-0 mt-0.5">
                            {b.content.calloutType === 'warning' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                            {b.content.calloutType === 'tip' && <Lightbulb className="w-5 h-5 text-amber-600" />}
                            {b.content.calloutType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                            {(!b.content.calloutType || b.content.calloutType === 'info') && <Info className="w-5 h-5 text-blue-600" />}
                          </div>
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
    case 'divider': return <Minus className="w-3 h-3" />;
  }
}

function getBlockLabel(type: BlockType) {
  switch (type) {
    case 'heading': return 'Judul / Heading';
    case 'paragraph': return 'Paragraf';
    case 'image': return 'Gambar & Foto';
    case 'quote': return 'Kutipan / Quote';
    case 'list': return 'Daftar Poin';
    case 'callout': return 'Kotak Alert / Info';
    case 'divider': return 'Garis Pembatas';
  }
}
