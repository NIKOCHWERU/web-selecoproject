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
  Calendar, 
  Clock, 
  User, 
  Tag, 
  FileText,
  Undo2,
  Redo2,
  History,
  CheckCircle2,
  Table as TableIcon,
  MessageCircle,
  Download,
  Star,
  Search,
  X,
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

interface ArticleHistorySnapshot {
  id: string;
  time: string;
  action: string;
  article: Article;
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
            text: 'Tuliskan pengantar artikel Anda di sini. Jelaskan latar belakang regulasi, kewajiban kepatuhan usaha, dan implikasi strategis bagi operasional bisnis Anda.',
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
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [ribbonTab, setRibbonTab] = useState<'insert' | 'structure' | 'history' | 'settings'>('insert');
  
  // Undo / Redo & Save States
  const [undoStack, setUndoStack] = useState<Article[]>([]);
  const [redoStack, setRedoStack] = useState<Article[]>([]);
  const [historySnapshots, setHistorySnapshots] = useState<ArticleHistorySnapshot[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const coverInputRef = useRef<HTMLInputElement>(null);

  // Initialize first snapshot
  useEffect(() => {
    addSnapshot('Buka Dokumen Naskah', article);
  }, []);

  const addSnapshot = (action: string, articleState: Article) => {
    const snap: ArticleHistorySnapshot = {
      id: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      article: JSON.parse(JSON.stringify(articleState)),
    };
    setHistorySnapshots(prev => [snap, ...prev.slice(0, 29)]);
  };

  const pushStateChange = (actionName: string, updatedArticle: Article) => {
    setUndoStack(prev => [...prev.slice(-25), article]);
    setRedoStack([]);
    setArticle(updatedArticle);
    setHasUnsavedChanges(true);
    addSnapshot(actionName, updatedArticle);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, article]);
    setArticle(previous);
    setHasUnsavedChanges(true);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, article]);
    setArticle(next);
    setHasUnsavedChanges(true);
  };

  const handleRestoreSnapshot = (snap: ArticleHistorySnapshot) => {
    if (!confirm(`Kembalikan artikel ke versi: "${snap.action}" (${snap.time})?`)) return;
    pushStateChange(`Restore versi: ${snap.action}`, snap.article);
    setShowHistoryModal(false);
  };

  // Keyboard shortcut listener (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, article]);

  // Auto-calculate word count & reading time
  const calculateStats = () => {
    let text = (article.title || '') + ' ' + (article.excerpt || '');
    article.blocks.forEach((b) => {
      if (b.content.text) text += ' ' + b.content.text;
      if (b.content.items) text += ' ' + b.content.items.join(' ');
      if (b.content.headers) text += ' ' + b.content.headers.join(' ');
      if (b.content.rows) text += ' ' + b.content.rows.flat().join(' ');
    });
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const estMinutes = Math.max(1, Math.ceil(words / 180));
    return { words, estMinutes };
  };

  const { words: totalWords, estMinutes: calculatedMinutes } = calculateStats();

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
    setHasUnsavedChanges(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      const updated = { ...article, coverImage: dataUrl };
      pushStateChange('Ganti Foto Sampul', updated);
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
    const updated = { ...article, blocks: newBlocks };
    pushStateChange(`Tambah Blok ${getBlockLabel(type)}`, updated);
    setActiveBlockId(newBlock.id);
    setShowBlockPickerIndex(null);
  };

  const updateBlockContent = (id: string, updates: Partial<GutenbergBlock['content']>) => {
    setArticle(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...updates } } : b),
    }));
    setHasUnsavedChanges(true);
  };

  const removeBlock = (id: string) => {
    const targetBlock = article.blocks.find(b => b.id === id);
    const label = targetBlock ? getBlockLabel(targetBlock.type) : 'Blok';
    const updatedBlocks = article.blocks.filter(b => b.id !== id);
    const updated = { ...article, blocks: updatedBlocks };
    pushStateChange(`Hapus ${label}`, updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= article.blocks.length) return;

    const newBlocks = [...article.blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    const updated = { ...article, blocks: newBlocks };
    pushStateChange('Ubah Urutan Blok', updated);
  };

  const duplicateBlock = (block: GutenbergBlock, index: number) => {
    const cloned: GutenbergBlock = {
      ...block,
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      content: JSON.parse(JSON.stringify(block.content)),
    };
    const newBlocks = [...article.blocks];
    newBlocks.splice(index + 1, 0, cloned);
    const updated = { ...article, blocks: newBlocks };
    pushStateChange(`Duplikat ${getBlockLabel(block.type)}`, updated);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setHasUnsavedChanges(true);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticle(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    setHasUnsavedChanges(true);
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
      readTime: `${calculatedMinutes} menit baca`,
      updatedAt: new Date().toISOString(),
    };
    onSave(finalArticle);
  };

  return (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-100 select-none">
      
      {/* ── 1. TOP TITLE BAR (MS WORD / CANVA HEADER) ─────────────────────────── */}
      <header className="h-13 bg-[#1e293b] border-b border-slate-700/80 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Back & Doc Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <div className="h-4 w-px bg-slate-700" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#dfa82e]" />
              <span>{article.title ? (article.title.length > 25 ? article.title.slice(0, 25) + '...' : article.title) : 'Dokumen Naskah Baru'}</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              article.status === 'published'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {article.status === 'published' ? 'Online' : 'Draft'}
            </span>
          </div>
        </div>

        {/* Center: Undo / Redo & Save States */}
        <div className="flex items-center gap-2">
          {/* Undo Button */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-all ${
              undoStack.length > 0
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 cursor-pointer'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Kembalikan (Undo) - Ctrl+Z"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Undo</span>
          </button>

          {/* Redo Button */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-all ${
              redoStack.length > 0
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700 cursor-pointer'
                : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Ulangi (Redo) - Ctrl+Y"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Redo</span>
          </button>

          {/* Save State / Riwayat Button */}
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 px-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka Riwayat Perubahan & Save States"
          >
            <History className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="text-[11px] font-semibold">Riwayat</span>
            <span className="bg-[#dfa82e]/20 text-[#dfa82e] text-[10px] px-1.5 rounded-full font-bold">
              {historySnapshots.length}
            </span>
          </button>

          <span className="text-[10px] hidden md:inline-flex items-center gap-1 text-slate-400 ml-2">
            <span>{totalWords} kata</span>
            <span>•</span>
            <span>{calculatedMinutes} mnt baca</span>
          </span>
        </div>

        {/* Right: Preview & Save CTAs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="hidden sm:inline">Pratinjau</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSaving}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {isSaving ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>{article.status === 'published' ? 'Perbarui' : 'Terbitkan (Online)'}</span>
          </button>
        </div>
      </header>

      {/* ── 2. WORD RIBBON BAR (ALAT TAMBAH BLOK & SETTING) ────────────────────── */}
      <div className="bg-[#1e293b]/95 border-b border-slate-700/80 px-4 py-2 flex flex-col gap-2 shrink-0 z-20 shadow-md">
        {/* Ribbon Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-700/50 pb-1 text-xs">
          <button
            type="button"
            onClick={() => setRibbonTab('insert')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'insert'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ➕ Sisipkan Komponen / Blok
          </button>
          <button
            type="button"
            onClick={() => setRibbonTab('structure')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'structure'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Susunan Paragraf &amp; Blok ({article.blocks.length})
          </button>
          <button
            type="button"
            onClick={() => setRibbonTab('history')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'history'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🕒 Riwayat &amp; Save State
          </button>
          <button
            type="button"
            onClick={() => setRibbonTab('settings')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'settings'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Kategori &amp; Pengaturan Artikel
          </button>
        </div>

        {/* Tab 1: Insert Block Tools */}
        {ribbonTab === 'insert' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Sisipkan:
            </span>
            <button
              type="button"
              onClick={() => addBlock('paragraph', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Paragraf</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('heading', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <HeadingIcon className="w-3.5 h-3.5 text-[#dfa82e]" />
              <span>+ Heading Subjudul</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('image', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Gambar / Foto</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('quote', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <QuoteIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Kutipan / Quote</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('callout', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Kotak Sorotan / Alert</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('list', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <ListIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ Daftar Poin (List)</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('divider', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-slate-400" />
              <span>+ Garis Pembatas</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('table', article.blocks.length)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Tabel Regulasi</span>
            </button>
          </div>
        )}

        {/* Tab 2: Structure Tools */}
        {ribbonTab === 'structure' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Urutan Blok:
            </span>
            {article.blocks.map((b, i) => (
              <div
                key={b.id}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs whitespace-nowrap"
              >
                <span className="font-mono text-[10px] text-slate-400">#{i + 1}</span>
                <span className="font-semibold text-slate-200">{getBlockLabel(b.type)}</span>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 'up')}
                  disabled={i === 0}
                  className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Geser Naik"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 'down')}
                  disabled={i === article.blocks.length - 1}
                  className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Geser Turun"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(b.id)}
                  className="p-0.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Hapus Blok"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: History & Save States */}
        {ribbonTab === 'history' && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Snapshot Terakhir:
            </span>
            {historySnapshots.slice(0, 4).map((snap) => (
              <button
                key={snap.id}
                type="button"
                onClick={() => handleRestoreSnapshot(snap)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                title={`Klik untuk restore ke ${snap.time}`}
              >
                <History className="w-3 h-3 text-[#dfa82e]" />
                <span className="font-semibold">{snap.action}</span>
                <span className="text-[10px] text-slate-400">({snap.time})</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowHistoryModal(true)}
              className="text-[#dfa82e] hover:underline text-[11px] font-bold whitespace-nowrap cursor-pointer"
            >
              Lihat Semua ({historySnapshots.length}) →
            </button>
          </div>
        )}

        {/* Tab 4: Settings & Metadata */}
        {ribbonTab === 'settings' && (
          <div className="flex flex-wrap items-center gap-3 py-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Kategori:</span>
              <select
                value={article.category}
                onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              >
                <option value="Perizinan OSS">Perizinan OSS</option>
                <option value="Hukum Imigrasi">Hukum Imigrasi</option>
                <option value="Perpajakan Bisnis">Perpajakan Bisnis</option>
                <option value="Pertanahan & Properti">Pertanahan &amp; Properti</option>
                <option value="Ketenagakerjaan SDM">Ketenagakerjaan SDM</option>
                <option value="Regulasi Bisnis">Regulasi Bisnis</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Penulis:</span>
              <input
                type="text"
                value={article.author}
                onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white w-36"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Tanggal:</span>
              <input
                type="date"
                value={article.publishedAt}
                onChange={(e) => setArticle(prev => ({ ...prev, publishedAt: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={article.featured}
                  onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-slate-700"
                />
                <span className="font-semibold text-[#dfa82e]">Pilihan Redaksi (Featured)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. WORKSPACE LEMBAR DOKUMEN (MS WORD / CANVA PAGE VIEW) ────────────── */}
      <main className="flex-1 bg-[#090d16] p-4 sm:p-8 overflow-y-auto flex flex-col items-center justify-start">
        
        {/* Document Sheet Page Container */}
        <div className="w-full max-w-4xl bg-white text-slate-900 rounded-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-300 p-8 sm:p-14 min-h-[1050px] space-y-6 my-2">
          
          {/* Document Header Page Tab */}
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>📄</span> Lembar Dokumen Artikel • SELECO Newsroom
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {article.category} • {article.publishedAt}
            </span>
          </div>

          {/* Cover Image Upload Card */}
          <div className="relative group/cover rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-56 sm:h-72 shadow-md">
            <img
              src={article.coverImage}
              alt={article.title || 'Sampul Artikel'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#dfa82e]" />
                <span>{isUploadingCover ? 'Mengunggah...' : 'Ganti Foto Sampul Dokumen'}</span>
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

          {/* Article Title Input (Word Document Headline Style) */}
          <div className="space-y-1">
            <input
              type="text"
              value={article.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ketik Judul Artikel Regulasi / Bisnis di Sini..."
              className="w-full bg-transparent font-serif text-2xl sm:text-4xl font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none leading-tight border-b border-transparent focus:border-[#dfa82e] pb-2 transition-colors"
            />
          </div>

          {/* Excerpt / Lead Paragraph */}
          <div className="space-y-1">
            <textarea
              value={article.excerpt}
              onChange={(e) => {
                setArticle(prev => ({ ...prev, excerpt: e.target.value }));
                setHasUnsavedChanges(true);
              }}
              placeholder="Tuliskan pengantar singkat atau ringkasan lead paragraph artikel ini..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#dfa82e] resize-none leading-relaxed italic"
            />
          </div>

          {/* Metadata Bar inside document */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 py-2 border-y border-slate-200">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-700">{article.author}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.publishedAt}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{calculatedMinutes} menit baca</span>
            </div>
          </div>

          {/* ── GUTENBERG BLOCKS STREAM (WORD PARAGRAPH BLOCKS) ─────────────── */}
          <div className="space-y-4 pt-2">
            {article.blocks.map((block, idx) => (
              <React.Fragment key={block.id}>
                {/* Insert block button in-between */}
                <div className="relative flex justify-center -my-2 opacity-0 hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={() => setShowBlockPickerIndex(idx)}
                    className="w-6 h-6 rounded-full bg-[#dfa82e] text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    title="Sisipkan Blok di Sini"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                {/* Block Item Card */}
                <div
                  onClick={() => setActiveBlockId(block.id)}
                  className={`relative group/block rounded-xl border p-4 transition-all duration-200 ${
                    activeBlockId === block.id
                      ? 'border-[#dfa82e] bg-amber-50/20 shadow-md ring-1 ring-[#dfa82e]/30'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] uppercase text-[#dfa82e] px-2 py-0.5 rounded bg-amber-50 border border-amber-200 flex items-center gap-1">
                        {getBlockIcon(block.type)}
                        <span>{getBlockLabel(block.type)}</span>
                      </span>

                      {/* Heading level options */}
                      {block.type === 'heading' && (
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-slate-200">
                          {([2, 3, 4] as const).map(lvl => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateBlockContent(block.id, { level: lvl })}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                (block.content.level || 2) === lvl
                                  ? 'bg-[#dfa82e] text-slate-950'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              H{lvl}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Block Action Controls: Move, Duplicate, Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'up')}
                        disabled={idx === 0}
                        className={`p-1 hover:bg-slate-200 rounded ${idx === 0 ? 'opacity-30' : 'text-slate-600 hover:text-slate-900'}`}
                        title="Geser Naik"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(idx, 'down')}
                        disabled={idx === article.blocks.length - 1}
                        className={`p-1 hover:bg-slate-200 rounded ${idx === article.blocks.length - 1 ? 'opacity-30' : 'text-slate-600 hover:text-slate-900'}`}
                        title="Geser Turun"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(block, idx)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900"
                        title="Duplikasi Blok"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="p-1 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded transition-colors"
                        title="Hapus Blok"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content Input */}
                  <div className="space-y-2">
                    {block.type === 'heading' && (
                      <input
                        type="text"
                        value={block.content.text || ''}
                        onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        placeholder={`Subjudul Heading H${block.content.level || 2}...`}
                        className="w-full bg-transparent font-serif font-bold text-lg sm:text-xl text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    )}

                    {block.type === 'paragraph' && (
                      <textarea
                        value={block.content.text || ''}
                        onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        placeholder="Tuliskan isi paragraf regulasi atau analisa di sini..."
                        rows={3}
                        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed whitespace-pre-line"
                      />
                    )}

                    {block.type === 'image' && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={block.content.url || ''}
                            onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                            placeholder="URL Foto atau Upload gambar..."
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                          />
                          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 cursor-pointer flex items-center gap-1">
                            <Upload className="w-3 h-3 text-[#dfa82e]" />
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
                          <div className="rounded-lg overflow-hidden border border-slate-200 max-h-64 bg-slate-100 flex items-center justify-center">
                            <img src={block.content.url} alt={block.content.caption || 'Gambar'} className="max-h-64 object-contain" />
                          </div>
                        )}
                        <input
                          type="text"
                          value={block.content.caption || ''}
                          onChange={(e) => updateBlockContent(block.id, { caption: e.target.value })}
                          placeholder="Keterangan caption foto (opsional)..."
                          className="w-full bg-transparent text-[11px] text-slate-500 italic focus:outline-none"
                        />
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <div className="border-l-4 border-[#dfa82e] pl-4 py-1 space-y-2 bg-amber-50/50 rounded-r-lg pr-3">
                        <textarea
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder="Tuliskan kutipan atau pernyataan penting di sini..."
                          rows={2}
                          className="w-full bg-transparent font-serif italic text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                        />
                        <input
                          type="text"
                          value={block.content.author || ''}
                          onChange={(e) => updateBlockContent(block.id, { author: e.target.value })}
                          placeholder="- Sumber / Penulis Kutipan (opsional)"
                          className="w-full bg-transparent text-xs text-[#dfa82e] font-semibold focus:outline-none"
                        />
                      </div>
                    )}

                    {block.type === 'callout' && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-1">
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => updateBlockContent(block.id, { title: e.target.value })}
                          placeholder="Judul Info / Sorotan..."
                          className="w-full bg-transparent text-xs font-bold text-amber-900 focus:outline-none"
                        />
                        <textarea
                          value={block.content.text || ''}
                          onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                          placeholder="Tuliskan poin penting regulasi atau tips di sini..."
                          rows={2}
                          className="w-full bg-transparent text-xs text-amber-800 placeholder:text-amber-500 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>
                    )}

                    {block.type === 'list' && (
                      <div className="space-y-1.5 pl-2">
                        {(block.content.items || []).map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">•</span>
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(block.content.items || [])];
                                newItems[itemIdx] = e.target.value;
                                updateBlockContent(block.id, { items: newItems });
                              }}
                              className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none border-b border-transparent focus:border-slate-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (block.content.items || []).filter((_, i) => i !== itemIdx);
                                updateBlockContent(block.id, { items: newItems });
                              }}
                              className="text-slate-400 hover:text-rose-500 p-0.5 text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...(block.content.items || []), 'Poin baru'];
                            updateBlockContent(block.id, { items: newItems });
                          }}
                          className="text-[11px] text-[#dfa82e] font-semibold hover:underline pt-1 cursor-pointer"
                        >
                          + Tambah Baris Poin
                        </button>
                      </div>
                    )}

                    {block.type === 'divider' && (
                      <hr className="my-2 border-slate-300" />
                    )}

                    {block.type === 'table' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.content.title || ''}
                          onChange={(e) => updateBlockContent(block.id, { title: e.target.value })}
                          placeholder="Judul Tabel..."
                          className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                        />
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 border-b border-slate-200">
                              <tr>
                                {(block.content.headers || []).map((h, hIdx) => (
                                  <th key={hIdx} className="p-2 font-semibold text-slate-700">
                                    <input
                                      type="text"
                                      value={h}
                                      onChange={(e) => {
                                        const newHeaders = [...(block.content.headers || [])];
                                        newHeaders[hIdx] = e.target.value;
                                        updateBlockContent(block.id, { headers: newHeaders });
                                      }}
                                      className="w-full bg-transparent focus:outline-none font-bold"
                                    />
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {(block.content.rows || []).map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-slate-100">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2">
                                      <input
                                        type="text"
                                        value={cell}
                                        onChange={(e) => {
                                          const newRows = [...(block.content.rows || [])];
                                          newRows[rIdx][cIdx] = e.target.value;
                                          updateBlockContent(block.id, { rows: newRows });
                                        }}
                                        className="w-full bg-transparent focus:outline-none"
                                      />
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
                onClick={() => addBlock('paragraph', article.blocks.length)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#dfa82e]" />
                <span>+ Tambah Paragraf di Bawah</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── 4. BLOCK PICKER POPUP (KETIKA KLIK PLUS DI ANTARA BLOK) ─────────────── */}
      {showBlockPickerIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#dfa82e]" />
                <span>Pilih Komponen Blok untuk Disisipkan</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowBlockPickerIndex(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => addBlock('paragraph', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <Type className="w-4 h-4 text-blue-400" />
                <span>Paragraf Teks</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('heading', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <HeadingIcon className="w-4 h-4 text-[#dfa82e]" />
                <span>Heading Subjudul</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('image', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Gambar &amp; Foto</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('quote', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <QuoteIcon className="w-4 h-4 text-purple-400" />
                <span>Kutipan / Quote</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('callout', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Kotak Sorotan</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('list', showBlockPickerIndex)}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#dfa82e] text-left flex items-center gap-2 text-white transition-colors"
              >
                <ListIcon className="w-4 h-4 text-cyan-400" />
                <span>Daftar Poin (List)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. MODAL RIWAYAT PERUBAHAN & SAVE STATE (ARTICLE RESTORE) ─────────── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-[#dfa82e]" />
                  Riwayat Perubahan Artikel
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jika ada paragraf atau blok yang tidak sengaja terhapus, pilih versi sebelumnya untuk mengembalikannya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
              {historySnapshots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada riwayat terekam pada sesi ini.
                </div>
              ) : (
                historySnapshots.map((snap, i) => (
                  <div
                    key={snap.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{snap.action}</span>
                        {i === 0 && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            Terkini
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Terekam pukul {snap.time} • ({snap.article.blocks?.length || 0} blok)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="px-3 py-1.5 rounded-lg bg-[#dfa82e]/10 hover:bg-[#dfa82e] text-[#dfa82e] hover:text-slate-950 font-bold text-xs border border-[#dfa82e]/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-700 text-right">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. MODAL PRATINJAU ARTIKEL ─────────────────────────────────────────── */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-12 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-4">
              <span className="px-3 py-1 bg-amber-50 text-[#b88917] rounded-full text-xs font-bold">
                {article.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                {article.title || 'Judul Artikel'}
              </h1>
              <p className="text-sm text-slate-600 italic">{article.excerpt}</p>
              {article.coverImage && (
                <div className="rounded-xl overflow-hidden my-4 max-h-80">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="prose max-w-none pt-4 space-y-4 text-sm text-slate-800">
                {article.blocks.map(b => (
                  <div key={b.id}>
                    {b.type === 'heading' && <h2 className="text-xl font-bold font-serif">{b.content.text}</h2>}
                    {b.type === 'paragraph' && <p className="leading-relaxed">{b.content.text}</p>}
                    {b.type === 'quote' && (
                      <blockquote className="border-l-4 border-[#b88917] pl-4 italic my-2">
                        {b.content.text}
                      </blockquote>
                    )}
                    {b.type === 'image' && b.content.url && (
                      <img src={b.content.url} alt={b.content.caption || ''} className="rounded-lg my-2 max-h-72 object-contain" />
                    )}
                  </div>
                ))}
              </div>
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
        headers: ['Parameter / Syarat', 'Ketentuan Regulasi', 'Biaya / Waktu'],
        rows: [
          ['Contoh Syarat 1', 'Wajib melampirkan NIB & NPWP', '1-2 Hari Kerja'],
          ['Contoh Syarat 2', 'Sertifikat Standar OSS Terverifikasi', '3-5 Hari Kerja'],
        ],
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
    case 'callout': return 'Kotak Sorotan';
    case 'table': return 'Tabel Regulasi';
    case 'divider': return 'Garis Pembatas';
    default: return 'Blok Konten';
  }
}
