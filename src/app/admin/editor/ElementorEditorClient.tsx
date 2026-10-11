'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft, 
  Upload, 
  Download, 
  RefreshCw, 
  Layers,
  FileText,
  AlertCircle,
  Eye, 
  Undo2, 
  Redo2,
  Search, 
  Image as ImageIcon, 
  Type, 
  Link2, 
  CheckCircle2, 
  X, 
  Plus, 
  Trash2, 
  History,
  Copy,
  Sparkles,
  Heading as HeadingIcon,
  LayoutGrid,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { defaultSiteContent, SiteContent } from '@/data/defaultSiteContent';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

interface HistorySnapshot {
  id: string;
  time: string;
  action: string;
  content: SiteContent;
}

export default function ElementorEditorClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Word Ribbon Tab state: 'insert' | 'manage' | 'history' | 'view'
  const [ribbonTab, setRibbonTab] = useState<'insert' | 'manage' | 'history' | 'view'>('insert');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Undo / Redo & Save States History
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [redoStack, setRedoStack] = useState<SiteContent[]>([]);
  const [historySnapshots, setHistorySnapshots] = useState<HistorySnapshot[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Default Sections List on Home Page
  const homeSections = [
    { id: 'hero', name: 'Hero Banner Utama', icon: '🚀', desc: 'Headline, video latar, tombol CTA' },
    { id: 'trust-stats', name: 'Statistik Kepercayaan', icon: '📊', desc: 'Angka legalitas, izin OSS, standar kepatuhan' },
    { id: 'about', name: 'Tentang SELECO', icon: '🏢', desc: 'Profil firma, nilai korporasi' },
    { id: 'services', name: '5 Pilar Layanan', icon: '💼', desc: 'Perizinan, imigrasi, pajak, tanah, SDM' },
    { id: 'retainer', name: 'Program Retainer', icon: '🛡️', desc: 'Pendampingan hukum bulanan' },
    { id: 'team', name: 'Tim Konsultan', icon: '👥', desc: 'Daftar konsultan hukum & spesialis' },
    { id: 'insights', name: 'Legal Insights', icon: '📰', desc: 'Artikel publikasi & analisa regulasi' },
    { id: 'faq', name: 'Tanya Jawab (FAQ)', icon: '❓', desc: 'Pertanyaan seputar konsultasi' },
    { id: 'contact', name: 'Kontak & Alamat Kantor', icon: '📞', desc: 'Nomor WhatsApp, email, peta kantor' },
  ];

  // 1. Initial Load
  useEffect(() => {
    const auth = sessionStorage.getItem('seleco_admin_auth_editor') || sessionStorage.getItem('seleco_admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
      return;
    }

    sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');

    try {
      const cached = localStorage.getItem('seleco_site_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        setContent(parsed);
        addSnapshot('Buka Dokumen', parsed);
      } else {
        fetchCurrentContent();
      }
    } catch (e) {
      fetchCurrentContent();
    }
  }, []);

  const fetchCurrentContent = async () => {
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          addSnapshot('Versi Tersimpan di Server', data.content);
        }
      }
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  const addSnapshot = (action: string, newContent: SiteContent) => {
    const snapshot: HistorySnapshot = {
      id: `snap-${Date.now()}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      content: JSON.parse(JSON.stringify(newContent)),
    };
    setHistorySnapshots((prev) => [snapshot, ...prev.slice(0, 29)]);
  };

  // Broadcast to Preview Iframe
  const sendContentToIframe = (contentToSend: SiteContent) => {
    try {
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(contentToSend));
      sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_SITE_CONTENT',
          content: contentToSend,
        }, '*');
      }
    } catch (e) {
      console.error('Error broadcasting to iframe:', e);
    }
  };

  const sendPageToIframe = (page: PreviewPageOption) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_PREVIEW_PAGE',
        page: page,
      }, '*');
    }
  };

  // 2. Listen to iframe messages
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        sendContentToIframe(content);
        sendPageToIframe(activePage);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        pushStateChange('Edit Teks / Media Elemen', e.data.content);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [content, activePage]);

  // Push new state change to Undo stack
  const pushStateChange = (actionName: string, newContent: SiteContent) => {
    setUndoStack((prev) => [...prev.slice(-25), content]);
    setRedoStack([]); // reset redo on new action
    setContent(newContent);
    setHasUnsavedChanges(true);
    addSnapshot(actionName, newContent);
    sendContentToIframe(newContent);
  };

  // Handle Undo (Ctrl + Z)
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, content]);
    setContent(previous);
    setHasUnsavedChanges(true);
    sendContentToIframe(previous);
  };

  // Handle Redo (Ctrl + Y)
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, content]);
    setContent(next);
    setHasUnsavedChanges(true);
    sendContentToIframe(next);
  };

  // Restore snapshot from History
  const handleRestoreSnapshot = (snapshot: HistorySnapshot) => {
    if (!confirm(`Kembalikan halaman ke kondisi: "${snapshot.action}" (${snapshot.time})?`)) return;
    pushStateChange(`Restore versi: ${snapshot.action}`, snapshot.content);
    setShowHistoryModal(false);
  };

  // Handle Select Page
  const handleSelectPage = (page: PreviewPageOption) => {
    setActivePage(page);
    sendPageToIframe(page);
  };

  // Save to Server
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    try {
      localStorage.setItem('seleco_site_content', JSON.stringify(content));
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(content));

      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setHasUnsavedChanges(false);
        addSnapshot('Simpan Permanen ke Server', content);
        setSaveSuccessMessage('Semua perubahan berhasil disimpan & online!');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        alert('Gagal menyimpan ke server. Silakan coba kembali.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── TAMBAH KOMPONEN / DIV KUSTOM ──────────────────────────────────────────────
  const handleAddCustomComponent = (type: 'banner' | 'text' | 'columns' | 'cta' | 'faq') => {
    const newId = `custom-div-${Date.now()}`;
    let newSection: any = {
      id: newId,
      page: activePage,
      type,
      title: 'Judul Komponen Baru',
      subtitle: 'Tuliskan deskripsi atau penjelasan komponen di sini.',
      bg: '#ffffff',
      textColor: '#0f172a',
    };

    if (type === 'banner') {
      newSection = {
        ...newSection,
        title: 'Penawaran Khusus Konsultasi Bisnis',
        subtitle: 'Dapatkan pendampingan legalitas dan perizinan OSS terpercaya dari konsultan SELECO.',
        badge: 'INFORMASI KHUSUS',
        bg: '#0f2034',
        textColor: '#ffffff',
        buttonText: 'Konsultasi Sekarang',
        buttonUrl: '#',
      };
    } else if (type === 'text') {
      newSection = {
        ...newSection,
        title: 'Ketentuan & Kebijakan Kepatuhan',
        subtitle: 'Pedoman standar operasional konsultasi hukum terpadu.',
        content: 'Klik langsung untuk mengedit teks paragraf ini sesuai kebutuhan website Anda.',
      };
    } else if (type === 'cta') {
      newSection = {
        ...newSection,
        title: 'Siap Mengembangkan Usaha Anda?',
        subtitle: 'Hubungi tim konsultan hukum kami via WhatsApp untuk respon cepat.',
        buttonText: 'Chat WhatsApp Kami',
        buttonUrl: 'https://wa.me/628123456789',
        bg: '#f8fafc',
      };
    }

    const updatedCustom = [...(content.customSections || []), newSection];
    const newContent = {
      ...content,
      customSections: updatedCustom,
    };

    pushStateChange(`Tambah Komponen: ${newSection.title}`, newContent);
  };

  // ── HAPUS KOMPONEN / DIV ──────────────────────────────────────────────────────
  const handleDeleteSection = (sectionId: string, sectionName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${sectionName}"? Anda dapat membatalkannya kapan saja lewat tombol Undo.`)) {
      return;
    }

    // If it's a custom section
    if (sectionId.startsWith('custom-div-')) {
      const updatedCustom = (content.customSections || []).filter((s: any) => s.id !== sectionId);
      const newContent = {
        ...content,
        customSections: updatedCustom,
      };
      pushStateChange(`Hapus Komponen Kustom: ${sectionName}`, newContent);
      return;
    }

    // If it's a standard section, add to hiddenSections
    const currentHidden = content.hiddenSections || [];
    if (!currentHidden.includes(sectionId)) {
      const newContent = {
        ...content,
        hiddenSections: [...currentHidden, sectionId],
      };
      pushStateChange(`Hapus / Sembunyikan: ${sectionName}`, newContent);
    }
  };

  // ── KEMBALIKAN / RESTORE SECTION YANG DIHAPUS ──────────────────────────────────
  const handleRestoreDefaultSection = (sectionId: string, sectionName: string) => {
    const currentHidden = content.hiddenSections || [];
    const newContent = {
      ...content,
      hiddenSections: currentHidden.filter((id: string) => id !== sectionId),
    };
    pushStateChange(`Tampilkan Kembali: ${sectionName}`, newContent);
  };

  // Keyboard shortcut listener (Ctrl+Z = Undo, Ctrl+Y = Redo, Ctrl+S = Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack, content]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 select-none">
      
      {/* ── 1. TOP TITLE BAR (MS WORD / CANVA STYLE) ─────────────────────────── */}
      <header className="h-13 bg-[#1e293b] border-b border-slate-700/80 px-4 flex items-center justify-between z-30 shrink-0">
        {/* Left: Back & Doc Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Doc Title & Page Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#dfa82e]" />
              SELECO Web:
            </span>
            <select
              value={activePage}
              onChange={(e) => handleSelectPage(e.target.value as PreviewPageOption)}
              className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#dfa82e] cursor-pointer"
            >
              <option value="home">📄 Halaman Beranda (Home)</option>
              <option value="about">📄 Halaman Profil (Tentang Kami)</option>
              <option value="services">📄 Halaman Layanan (5 Pilar)</option>
              <option value="insight">📄 Halaman Legal Insight</option>
              <option value="contact">📄 Halaman Kontak Kantor</option>
            </select>
          </div>
        </div>

        {/* Center: Undo / Redo & Save State Indicator */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
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

          {/* Redo */}
          <button
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
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 px-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka Riwayat Perubahan & Save States"
          >
            <History className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="text-[11px] font-semibold">Riwayat</span>
            <span className="bg-[#dfa82e]/20 text-[#dfa82e] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {historySnapshots.length}
            </span>
          </button>

          {/* Status Label */}
          <span className="text-[10px] hidden md:inline-flex items-center gap-1 text-slate-400 ml-2">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Ada perubahan
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" />
                Tersimpan
              </span>
            )}
          </span>
        </div>

        {/* Right: Device View & Publish Button */}
        <div className="flex items-center gap-2">
          {/* Device View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-900 rounded-md p-0.5 border border-slate-700">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'desktop' ? 'bg-[#dfa82e] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Desktop / Komputer"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'tablet' ? 'bg-[#dfa82e] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tablet / iPad"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'mobile' ? 'bg-[#dfa82e] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Ponsel / HP"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Public Web */}
          <Link
            href="/"
            target="_blank"
            className="p-1.5 px-2.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            title="Lihat Web Asli"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span className="hidden lg:inline text-[11px]">Lihat Web</span>
          </Link>

          {/* Save / Publish Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#dfa82e]/20 cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Simpan</span>
          </button>
        </div>
      </header>

      {/* ── 2. WORD RIBBON TOOLBAR (ALAT EDIT & INSERT DIV) ────────────────────── */}
      <div className="bg-[#1e293b]/95 border-b border-slate-700/80 px-4 py-2 flex flex-col gap-2 shrink-0 z-20 shadow-md">
        {/* Ribbon Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-700/50 pb-1 text-xs">
          <button
            onClick={() => setRibbonTab('insert')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'insert'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ➕ Sisipkan Komponen / Div
          </button>
          <button
            onClick={() => setRibbonTab('manage')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'manage'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Kelola Susunan Div
          </button>
          <button
            onClick={() => setRibbonTab('history')}
            className={`px-3 py-1 rounded-t-md font-semibold transition-colors cursor-pointer ${
              ribbonTab === 'history'
                ? 'bg-slate-800 text-[#dfa82e] border-b-2 border-[#dfa82e]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🕒 Riwayat &amp; Save State
          </button>
        </div>

        {/* Ribbon Tools Content */}
        {ribbonTab === 'insert' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Tambah Elemen:
            </span>
            <button
              onClick={() => handleAddCustomComponent('banner')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#dfa82e]" />
              <span>+ Banner Promo</span>
            </button>
            <button
              onClick={() => handleAddCustomComponent('text')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Teks Paragraf</span>
            </button>
            <button
              onClick={() => handleAddCustomComponent('cta')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Tombol WhatsApp / CTA</span>
            </button>
            <button
              onClick={() => handleAddCustomComponent('columns')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-white flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Div Kosong Kustom</span>
            </button>
          </div>
        )}

        {ribbonTab === 'manage' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">
              Section Halaman Ini:
            </span>
            {homeSections.map((sec) => {
              const isHidden = content.hiddenSections?.includes(sec.id);
              return (
                <div
                  key={sec.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs whitespace-nowrap ${
                    isHidden
                      ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  <span>{sec.icon}</span>
                  <span className={isHidden ? 'line-through text-slate-500' : ''}>{sec.name}</span>
                  {isHidden ? (
                    <button
                      onClick={() => handleRestoreDefaultSection(sec.id, sec.name)}
                      className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold"
                    >
                      Pulihkan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteSection(sec.id, sec.name)}
                      className="ml-1 text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                      title={`Hapus / Sembunyikan ${sec.name}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Custom sections */}
            {(content.customSections || []).map((sec: any) => (
              <div
                key={sec.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-[#dfa82e]/10 border-[#dfa82e]/30 text-[#dfa82e] text-xs whitespace-nowrap"
              >
                <span>⭐</span>
                <span>{sec.title}</span>
                <button
                  onClick={() => handleDeleteSection(sec.id, sec.title)}
                  className="ml-1 text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                  title="Hapus Div Ini"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {ribbonTab === 'history' && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Snapshot Terakhir:
            </span>
            {historySnapshots.slice(0, 4).map((snap, idx) => (
              <button
                key={snap.id}
                onClick={() => handleRestoreSnapshot(snap)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title={`Klik untuk restore ke ${snap.time}`}
              >
                <History className="w-3 h-3 text-[#dfa82e]" />
                <span className="font-semibold">{snap.action}</span>
                <span className="text-[10px] text-slate-400">({snap.time})</span>
              </button>
            ))}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="text-[#dfa82e] hover:underline text-[11px] font-bold whitespace-nowrap cursor-pointer"
            >
              Lihat Semua ({historySnapshots.length}) →
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs py-2 px-4 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* ── 3. WORKSPACE KANVAS (PAGE VIEW ALA MS WORD / CANVA) ────────────────── */}
      <main className="flex-1 bg-[#090d16] p-4 sm:p-8 overflow-auto flex flex-col items-center justify-start">
        {/* Document Page Canvas Container */}
        <div
          style={{
            width:
              deviceMode === 'desktop'
                ? '100%'
                : deviceMode === 'tablet'
                ? '768px'
                : '390px',
            maxWidth: deviceMode === 'desktop' ? '1280px' : undefined,
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : undefined,
            transformOrigin: 'top center',
          }}
          className="bg-white rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] border border-slate-700/80 overflow-hidden transition-all duration-300 flex flex-col min-h-[900px] my-2"
        >
          {/* Document Header Margin Tab */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 select-none">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>📄</span> Lembar Halaman: {activePage.toUpperCase()}
            </span>
            <span>Mode: Klik langsung pada teks di halaman untuk mengedit</span>
          </div>

          {/* Iframe View of Live Website Page */}
          <iframe
            ref={iframeRef}
            src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
            className="w-full flex-1 min-h-[850px] border-0 bg-white"
            title="Visual Elementor Editor"
          />
        </div>
      </main>

      {/* ── 4. MODAL RIWAYAT PERUBAHAN (SAVE STATES RESTORE) ───────────────────── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-[#dfa82e]" />
                  Riwayat Perubahan &amp; Titik Pemulihan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jika komponen tidak sengaja terhapus, pilih versi sebelumnya untuk mengembalikannya secara utuh.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Snapshots List */}
            <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
              {historySnapshots.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Belum ada riwayat perubahan terekam pada sesi ini.
                </div>
              ) : (
                historySnapshots.map((snap, i) => (
                  <div
                    key={snap.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
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
                        Terekam pukul {snap.time}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="px-3 py-1.5 rounded-lg bg-[#dfa82e]/10 hover:bg-[#dfa82e] text-[#dfa82e] hover:text-slate-950 font-bold text-xs border border-[#dfa82e]/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-700 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
