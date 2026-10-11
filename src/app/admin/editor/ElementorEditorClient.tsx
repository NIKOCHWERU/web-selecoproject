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
  ZoomOut,
  GripVertical,
  HelpCircle,
  MessageCircle,
  Palette,
  Sliders,
  Settings
} from 'lucide-react';
import { defaultSiteContent, SiteContent, defaultSectionOrder } from '@/data/defaultSiteContent';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

interface HistorySnapshot {
  id: string;
  time: string;
  action: string;
  content: SiteContent;
}

interface ComponentTemplate {
  type: 'banner' | 'text' | 'columns' | 'cta' | 'faq' | 'image' | 'blank';
  title: string;
  desc: string;
  icon: string;
  badge: string;
  color: string;
}

export default function ElementorEditorClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Canva Left Dock Tab: 'elements' | 'pages' | 'history' | 'styles'
  const [canvaTab, setCanvaTab] = useState<'elements' | 'pages' | 'history' | 'styles'>('elements');
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [searchElementQuery, setSearchElementQuery] = useState<string>('');

  // Modal Insert Component Before Target Section
  const [insertModalTarget, setInsertModalTarget] = useState<string | null>(null);

  // Drag and drop states for sidebar page reordering
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  // Undo / Redo & Save States History
  const [undoStack, setUndoStack] = useState<SiteContent[]>([]);
  const [redoStack, setRedoStack] = useState<SiteContent[]>([]);
  const [historySnapshots, setHistorySnapshots] = useState<HistorySnapshot[]>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Standard Sections Information for Home
  const standardHomeSections: Record<string, { name: string; icon: string; desc: string }> = {
    hero: { name: 'Hero Banner Utama', icon: '🚀', desc: 'Headline, video latar, tombol CTA' },
    'trust-stats': { name: 'Statistik Kepercayaan', icon: '📊', desc: 'Angka legalitas, izin OSS, standar kepatuhan' },
    about: { name: 'Tentang SELECO', icon: '🏢', desc: 'Profil firma, nilai korporasi' },
    services: { name: '5 Pilar Layanan', icon: '💼', desc: 'Perizinan, imigrasi, pajak, tanah, SDM' },
    retainer: { name: 'Program Retainer', icon: '🛡️', desc: 'Pendampingan hukum bulanan' },
    team: { name: 'Tim Konsultan', icon: '👥', desc: 'Daftar konsultan hukum & spesialis' },
    insights: { name: 'Legal Insights', icon: '📰', desc: 'Artikel publikasi & analisa regulasi' },
    faq: { name: 'Tanya Jawab (FAQ)', icon: '❓', desc: 'Pertanyaan seputar konsultasi' },
    contact: { name: 'Kontak & Alamat Kantor', icon: '📞', desc: 'Nomor WhatsApp, email, peta kantor' },
  };

  // Available Draggable Component Templates (Canva Element Library)
  const componentTemplates: ComponentTemplate[] = [
    {
      type: 'banner',
      title: 'Hero Banner / Promo',
      desc: 'Banner headline besar, latar warna elegan, badge, & tombol aksi',
      icon: '🚀',
      badge: 'BANNER',
      color: 'from-amber-500/20 to-amber-900/30 border-amber-500/30'
    },
    {
      type: 'text',
      title: 'Teks & Paragraf Konten',
      desc: 'Judul seksi, subjudul, dan teks paragraf penjelasan bebas',
      icon: '📝',
      badge: 'TEKS',
      color: 'from-blue-500/20 to-blue-900/30 border-blue-500/30'
    },
    {
      type: 'cta',
      title: 'Tombol WhatsApp & CTA',
      desc: 'Banner konversi dengan tombol kontak langsung ke WhatsApp konsultan',
      icon: '💬',
      badge: 'WHATSAPP',
      color: 'from-emerald-500/20 to-emerald-900/30 border-emerald-500/30'
    },
    {
      type: 'columns',
      title: '3 Kolom Fitur / Kartu',
      desc: '3 kartu berdampingan untuk pilar keunggulan layanan',
      icon: '📊',
      badge: '3 KOLOM',
      color: 'from-purple-500/20 to-purple-900/30 border-purple-500/30'
    },
    {
      type: 'faq',
      title: 'Tanya Jawab (FAQ) Tambahan',
      desc: 'Daftar pertanyaan & jawaban konsultasi bisnis baru',
      icon: '❓',
      badge: 'FAQ',
      color: 'from-cyan-500/20 to-cyan-900/30 border-cyan-500/30'
    },
    {
      type: 'image',
      title: 'Galeri Foto & Visual',
      desc: 'Banner gambar dokumentasi legalitas dengan keterangan foto',
      icon: '🖼️',
      badge: 'GAMBAR',
      color: 'from-rose-500/20 to-rose-900/30 border-rose-500/30'
    },
    {
      type: 'blank',
      title: 'Kontainer / Div Kosong',
      desc: 'Div serbaguna untuk tata letak custom bebas',
      icon: '📦',
      badge: 'DIV KOSONG',
      color: 'from-slate-500/20 to-slate-900/30 border-slate-500/30'
    },
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
        addSnapshot('Buka Dokumen Desain', parsed);
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

  // Listen to messages from iframe (e.g. drop events, move up/down, delete)
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        sendContentToIframe(content);
        sendPageToIframe(activePage);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        pushStateChange('Edit Teks / Media Elemen', e.data.content);
      }
      if (e.data?.type === 'INSERT_COMPONENT_BEFORE') {
        insertComponentBefore(e.data.targetSectionId, e.data.componentType || 'banner');
      }
      if (e.data?.type === 'OPEN_INSERT_MODAL_BEFORE') {
        setInsertModalTarget(e.data.targetSectionId);
      }
      if (e.data?.type === 'MOVE_SECTION_UP') {
        moveSectionUp(e.data.sectionId);
      }
      if (e.data?.type === 'MOVE_SECTION_DOWN') {
        moveSectionDown(e.data.sectionId);
      }
      if (e.data?.type === 'DELETE_SECTION') {
        handleDeleteSection(e.data.sectionId);
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
    if (!confirm(`Kembalikan tampilan ke versi: "${snapshot.action}" (${snapshot.time})?`)) return;
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

  // Get active order list for active page
  const getCurrentPageSections = (): string[] => {
    const pageOrder = content.sectionOrder?.[activePage] || defaultSectionOrder[activePage] || [];
    const customPageIds = (content.customSections || [])
      .filter((c: any) => !c.page || c.page === activePage)
      .map((c: any) => c.id);

    const merged = [...pageOrder];
    customPageIds.forEach((id: string) => {
      if (!merged.includes(id)) {
        merged.push(id);
      }
    });
    return merged;
  };

  // ── INSERT COMPONENT BEFORE TARGET SECTION ──────────────────────────────────
  const insertComponentBefore = (targetSectionId: string, type: string) => {
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
        subtitle: 'Dapatkan pendampingan legalitas dan perizinan OSS terpercaya dari konsultan spesialis SELECO.',
        badge: 'INFORMASI KHUSUS',
        bg: '#0a1420',
        textColor: '#ffffff',
        buttonText: 'Konsultasi Sekarang',
        buttonUrl: '#',
      };
    } else if (type === 'text') {
      newSection = {
        ...newSection,
        title: 'Ketentuan & Kebijakan Kepatuhan',
        subtitle: 'Pedoman standar operasional konsultasi hukum terpadu.',
        content: 'Klik langsung untuk mengedit teks paragraf ini sesuai kebutuhan website perusahaan Anda.',
      };
    } else if (type === 'cta') {
      newSection = {
        ...newSection,
        title: 'Siap Mengembangkan Usaha Anda Bersama SELECO?',
        subtitle: 'Hubungi tim konsultan kami via WhatsApp untuk respon cepat dan solusi terukur.',
        buttonText: 'Chat WhatsApp Konsultan',
        buttonUrl: 'https://wa.me/6282211020022',
        bg: '#0f2034',
        textColor: '#ffffff',
      };
    } else if (type === 'columns') {
      newSection = {
        ...newSection,
        title: 'Keunggulan Pendampingan Terpadu',
        subtitle: 'Tiga pilar komitmen kami dalam mengawal kelancaran bisnis Anda.',
        badge: 'KEUNGGULAN UTAMA',
        bg: '#f8fafc',
      };
    } else if (type === 'faq') {
      newSection = {
        ...newSection,
        title: 'Pertanyaan Umum Seputar Konsultasi',
        subtitle: 'Jawaban atas pertanyaan mendasar mengenai proses layanan.',
        badge: 'TANYA JAWAB',
      };
    } else if (type === 'image') {
      newSection = {
        ...newSection,
        title: 'Dokumentasi & Portofolio Legalitas',
        subtitle: 'Standar kerja profesional dan terverifikasi di berbagai kementerian terkait.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      };
    }

    const currentSections = getCurrentPageSections();
    let newOrder: string[] = [];

    if (targetSectionId === '__end__') {
      newOrder = [...currentSections, newId];
    } else {
      const targetIndex = currentSections.indexOf(targetSectionId);
      if (targetIndex !== -1) {
        newOrder = [
          ...currentSections.slice(0, targetIndex),
          newId,
          ...currentSections.slice(targetIndex)
        ];
      } else {
        newOrder = [newId, ...currentSections];
      }
    }

    const updatedCustom = [...(content.customSections || []), newSection];
    const newContent: SiteContent = {
      ...content,
      customSections: updatedCustom,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const targetName = targetSectionId === '__end__' ? 'Paling Bawah' : (standardHomeSections[targetSectionId]?.name || 'Halaman Tujuan');
    pushStateChange(`Sisipkan ${newSection.title} (Sebelum ${targetName})`, newContent);
    setInsertModalTarget(null);
  };

  // ── MOVE SECTION UP / DOWN ──────────────────────────────────────────────────
  const moveSectionUp = (sectionId: string) => {
    const currentSections = getCurrentPageSections();
    const index = currentSections.indexOf(sectionId);
    if (index <= 0) return;

    const newOrder = [...currentSections];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const name = standardHomeSections[sectionId]?.name || 'Komponen';
    pushStateChange(`Naikkan Posisi: ${name}`, newContent);
  };

  const moveSectionDown = (sectionId: string) => {
    const currentSections = getCurrentPageSections();
    const index = currentSections.indexOf(sectionId);
    if (index === -1 || index >= currentSections.length - 1) return;

    const newOrder = [...currentSections];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    const name = standardHomeSections[sectionId]?.name || 'Komponen';
    pushStateChange(`Turunkan Posisi: ${name}`, newContent);
  };

  // ── DRAG & DROP REORDER IN SIDEBAR ───────────────────────────────────────────
  const handleDragStartSidebarItem = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSidebarItem = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropSidebarItem = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSectionIndex === null || draggedSectionIndex === targetIndex) return;

    const currentSections = getCurrentPageSections();
    const newOrder = [...currentSections];
    const [movedItem] = newOrder.splice(draggedSectionIndex, 1);
    newOrder.splice(targetIndex, 0, movedItem);

    const newContent = {
      ...content,
      sectionOrder: {
        ...(content.sectionOrder || {}),
        [activePage]: newOrder,
      },
    };

    pushStateChange(`Tukar Posisi Halaman`, newContent);
    setDraggedSectionIndex(null);
  };

  // ── DELETE / HIDE SECTION ────────────────────────────────────────────────────
  const handleDeleteSection = (sectionId: string) => {
    const isCustom = sectionId.startsWith('custom-div-');
    const secName = standardHomeSections[sectionId]?.name || 'Komponen';

    if (!confirm(`Hapus/Sembunyikan "${secName}"? Anda dapat membatalkannya kapan saja lewat tombol Undo.`)) {
      return;
    }

    if (isCustom) {
      const updatedCustom = (content.customSections || []).filter((s: any) => s.id !== sectionId);
      const currentSections = getCurrentPageSections().filter((id) => id !== sectionId);
      const newContent = {
        ...content,
        customSections: updatedCustom,
        sectionOrder: {
          ...(content.sectionOrder || {}),
          [activePage]: currentSections,
        },
      };
      pushStateChange(`Hapus Komponen Kustom: ${secName}`, newContent);
      return;
    }

    // Standard section: add to hiddenSections
    const currentHidden = content.hiddenSections || [];
    if (!currentHidden.includes(sectionId)) {
      const newContent = {
        ...content,
        hiddenSections: [...currentHidden, sectionId],
      };
      pushStateChange(`Hapus / Sembunyikan: ${secName}`, newContent);
    }
  };

  // Restore Hidden Section
  const handleRestoreDefaultSection = (sectionId: string) => {
    const secName = standardHomeSections[sectionId]?.name || 'Komponen';
    const currentHidden = content.hiddenSections || [];
    const newContent = {
      ...content,
      hiddenSections: currentHidden.filter((id: string) => id !== sectionId),
    };
    pushStateChange(`Tampilkan Kembali: ${secName}`, newContent);
  };

  // Drag start for component card from library
  const handleDragStartComponent = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ componentType: type }));
    e.dataTransfer.setData('text/plain', JSON.stringify({ componentType: type }));
    e.dataTransfer.effectAllowed = 'copy';
    (window as any).__draggedComponentType = type;
  };

  // Keyboard shortcut listener (Ctrl+Z = Undo, Ctrl+Y = Redo, Ctrl+S = Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
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

  const currentSections = getCurrentPageSections();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0b0e17] text-slate-100 select-none overflow-hidden font-sans">
      
      {/* ── 1. CANVA STUDIO TOP HEADER ────────────────────────────────────────── */}
      <header className="h-14 bg-[#111624] border-b border-[#232c42] px-3 sm:px-4 flex items-center justify-between z-30 shrink-0 shadow-md">
        {/* Left: Home & Doc Title & Page Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] text-xs text-slate-200 border border-[#2d3a58] transition-colors"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">Dashboard</span>
          </Link>

          <div className="h-5 w-px bg-slate-700/60 hidden sm:block mx-1" />

          {/* Canva Studio Logo Badge */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              Canva Studio
            </span>
          </div>

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={activePage}
              onChange={(e) => handleSelectPage(e.target.value as PreviewPageOption)}
              className="bg-[#1a2236] border border-[#2d3a58] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer font-medium"
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
        <div className="flex items-center gap-1.5">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              undoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Kembalikan Perubahan (Undo) - Ctrl+Z"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Undo</span>
          </button>

          {/* Redo */}
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className={`p-1.5 px-2 rounded-lg border text-xs flex items-center gap-1 transition-all ${
              redoStack.length > 0
                ? 'bg-[#1a2236] border-[#2d3a58] text-white hover:bg-[#25304a] cursor-pointer'
                : 'bg-[#121827] border-[#1e2638] text-slate-600 cursor-not-allowed'
            }`}
            title="Ulangi Perubahan (Redo) - Ctrl+Y"
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px]">Redo</span>
          </button>

          {/* Riwayat / Save State Button */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 px-2.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Buka Riwayat Perubahan & Titik Pemulihan"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold hidden sm:inline">Riwayat</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {historySnapshots.length}
            </span>
          </button>

          {/* Autosave Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 pl-2">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                Ada perubahan
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Tersimpan di cloud
              </span>
            )}
          </div>
        </div>

        {/* Right: Device Viewport, Zoom & Save Publish Button */}
        <div className="flex items-center gap-2">
          {/* Device Viewport Toggle */}
          <div className="hidden sm:flex items-center bg-[#1a2236] rounded-lg p-0.5 border border-[#2d3a58]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'desktop' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Desktop / Komputer"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'tablet' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Tablet"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                deviceMode === 'mobile' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Ponsel"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="hidden md:flex items-center bg-[#1a2236] rounded-lg p-0.5 border border-[#2d3a58] text-xs">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(50, prev - 15))}
              className="p-1 px-1.5 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-semibold text-slate-300 px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
              className="p-1 px-1.5 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Preview Public Web */}
          <Link
            href="/"
            target="_blank"
            className="p-1.5 px-2.5 rounded-lg bg-[#1a2236] hover:bg-[#25304a] border border-[#2d3a58] text-xs text-slate-300 transition-colors flex items-center gap-1.5"
            title="Lihat Website Asli di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline text-[11px]">Lihat Web</span>
          </Link>

          {/* Save / Publish Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
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

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-300 text-xs py-2 px-4 flex items-center justify-center gap-2 shrink-0 z-30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* ── 2. CANVA WORKSPACE BODY (LEFT DOCK + DRAWER + CANVAS) ──────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── A. CANVA SLIM ICON DOCK (FAR LEFT) ───────────────────────────────── */}
        <aside className="w-16 bg-[#0e121e] border-r border-[#20273a] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          <button
            onClick={() => setCanvaTab('elements')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'elements'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Pustaka Elemen & Komponen"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Elemen</span>
          </button>

          <button
            onClick={() => setCanvaTab('pages')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'pages'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Susunan Halaman & Seksi"
          >
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Halaman</span>
          </button>

          <button
            onClick={() => setCanvaTab('history')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'history'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Riwayat Perubahan & Save States"
          >
            <History className="w-5 h-5 text-amber-400" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={() => setCanvaTab('styles')}
            className={`w-12 py-2.5 rounded-xl flex flex-col items-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
              canvaTab === 'styles'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
            title="Gaya & Tema Warna"
          >
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Gaya</span>
          </button>
        </aside>

        {/* ── B. CANVA EXPANDED DRAWER PANEL (300px) ───────────────────────────── */}
        <aside className="w-80 bg-[#131929] border-r border-[#232c42] flex flex-col shrink-0 z-10 overflow-hidden shadow-xl">
          
          {/* TAB 1: ELEMEN & KOMPONEN (DRAG & DROP LIBRARY) */}
          {canvaTab === 'elements' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Komponen &amp; Div
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tarik (drag) komponen ke kanvas, atau klik &quot;+ Sisipkan&quot; untuk meletakkannya sebelum halaman tertentu.
                </p>
              </div>

              {/* Search Element Bar */}
              <div className="relative mb-3">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari elemen, div, banner..."
                  value={searchElementQuery}
                  onChange={(e) => setSearchElementQuery(e.target.value)}
                  className="w-full bg-[#0e1320] border border-[#252f47] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Interactive Tip Box */}
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-2.5 mb-3 text-[11px] text-purple-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tips Canva:</strong> Tarik komponen dan lepaskan di garis batas antar halaman untuk menyisipkan div secara instan!
                </span>
              </div>

              {/* Component Cards List (Draggable!) */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {componentTemplates
                  .filter((tpl) => 
                    tpl.title.toLowerCase().includes(searchElementQuery.toLowerCase()) ||
                    tpl.desc.toLowerCase().includes(searchElementQuery.toLowerCase())
                  )
                  .map((tpl) => (
                    <div
                      key={tpl.type}
                      draggable={true}
                      onDragStart={(e) => handleDragStartComponent(e, tpl.type)}
                      className={`p-3 rounded-xl border bg-gradient-to-br ${tpl.color} hover:brightness-110 hover:border-purple-400 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-2 group shadow-sm`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tpl.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-purple-200">
                              {tpl.title}
                            </h4>
                            <span className="text-[10px] text-purple-300/80 font-bold tracking-wider">
                              {tpl.badge}
                            </span>
                          </div>
                        </div>
                        <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-purple-300" />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                        {tpl.desc}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                        <span className="text-slate-400">Tarik ke kanvas</span>
                        <button
                          onClick={() => setInsertModalTarget(currentSections[0] || '__end__')}
                          className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
                        >
                          + Sisipkan Cepat
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: SUSUNAN HALAMAN & SEKSI (REORDER DRAG & DROP) */}
          {canvaTab === 'pages' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    Susunan Halaman
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tarik kartu untuk menukar urutan seksi.
                  </p>
                </div>
                <button
                  onClick={() => setInsertModalTarget('__end__')}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Div</span>
                </button>
              </div>

              {/* Sections List in Order with Drag & Drop Reordering */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {currentSections.map((secId, idx) => {
                  const isHidden = content.hiddenSections?.includes(secId);
                  const isCustom = secId.startsWith('custom-div-');
                  const customObj = isCustom ? (content.customSections || []).find((c: any) => c.id === secId) : null;
                  const secTitle = standardHomeSections[secId]?.name || customObj?.title || 'Komponen Kustom';
                  const secIcon = standardHomeSections[secId]?.icon || '⭐';

                  return (
                    <div
                      key={secId}
                      draggable={true}
                      onDragStart={(e) => handleDragStartSidebarItem(e, idx)}
                      onDragOver={handleDragOverSidebarItem}
                      onDrop={(e) => handleDropSidebarItem(e, idx)}
                      className={`p-2.5 rounded-xl border text-xs transition-all flex flex-col gap-2 ${
                        isHidden
                          ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                          : isCustom
                          ? 'bg-purple-950/20 border-purple-500/40 text-purple-200 hover:border-purple-400'
                          : 'bg-[#182136] border-[#293654] text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm">{secIcon}</span>
                          <div>
                            <span className="font-bold text-white block text-[11px]">
                              {idx + 1}. {secTitle}
                            </span>
                            {isHidden ? (
                              <span className="text-[10px] text-rose-400 font-semibold">Tersembunyi</span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-semibold">Aktif</span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSectionUp(secId)}
                            disabled={idx === 0}
                            className="p-1 rounded bg-[#0f1422] hover:bg-[#25304a] disabled:opacity-20 text-slate-300"
                            title="Naikkan Posisi"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => moveSectionDown(secId)}
                            disabled={idx === currentSections.length - 1}
                            className="p-1 rounded bg-[#0f1422] hover:bg-[#25304a] disabled:opacity-20 text-slate-300"
                            title="Turunkan Posisi"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {isHidden ? (
                            <button
                              onClick={() => handleRestoreDefaultSection(secId)}
                              className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold"
                            >
                              Pulihkan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteSection(secId)}
                              className="p-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300"
                              title="Hapus / Sembunyikan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick insert button before this section */}
                      <button
                        onClick={() => setInsertModalTarget(secId)}
                        className="w-full py-1 rounded bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/30 text-[10px] text-slate-300 hover:text-purple-200 font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Sisipkan Div Sebelum Halaman Ini</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT SNAPSHOTS (SAVE STATES) */}
          {canvaTab === 'history' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-400" />
                  Titik Pemulihan
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Kembalikan desain ke titik waktu sebelum perubahan dilakukan.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {historySnapshots.map((snap, i) => (
                  <div
                    key={snap.id}
                    className="p-2.5 rounded-xl bg-[#182136] border border-[#293654] hover:border-amber-400/50 flex flex-col gap-1.5 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px]">{snap.action}</span>
                      {i === 0 && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                          Terkini
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">Pukul {snap.time}</span>
                    <button
                      onClick={() => handleRestoreSnapshot(snap)}
                      className="w-full mt-1 py-1 rounded bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 text-[10px] font-bold border border-amber-400/30 transition-all cursor-pointer"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GAYA & WARNA */}
          {canvaTab === 'styles' && (
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  Palet &amp; Tema SELECO
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Identitas visual resmi firma hukum SELECO.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#182136] border border-[#293654] space-y-2">
                  <h4 className="text-xs font-bold text-white">Warna Primer Firma</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded-lg bg-[#0a1420] text-white border border-white/20">
                      <span>#0a1420</span>
                      <span className="block opacity-70">Navy Gelap</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#dfa82e] text-slate-950 font-bold">
                      <span>#dfa82e</span>
                      <span className="block opacity-80">Gold Utama</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#ffffff] text-slate-950 font-bold">
                      <span>#ffffff</span>
                      <span className="block opacity-70">Putih Bersih</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#182136] border border-[#293654] space-y-2 text-xs">
                  <h4 className="font-bold text-white">Panduan Tipografi</h4>
                  <p className="text-[11px] text-slate-300">
                    - Judul Utama: <strong className="text-[#dfa82e]">Cinzel Decorative Serif</strong> (Klasik &amp; Elegan)<br/>
                    - Konten &amp; Paragraf: <strong className="text-white">Plus Jakarta Sans</strong> (Modern &amp; Terbaca Jelas)
                  </p>
                </div>
              </div>
            </div>
          )}

        </aside>

        {/* ── C. CANVA WORKSPACE KANVAS (CENTER WORKSPACE) ─────────────────────── */}
        <main className="flex-1 bg-[#090d16] p-2 sm:p-6 overflow-auto flex flex-col items-center justify-start relative">
          
          {/* Document Canvas Sheet Wrapper */}
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
            className="bg-white rounded-2xl shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] border border-slate-700/80 overflow-hidden transition-all duration-300 flex flex-col min-h-[900px] my-2"
          >
            {/* Document Header Margin Tab ala Canva */}
            <div className="bg-[#111624] border-b border-[#232c42] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span className="font-semibold text-white flex items-center gap-2">
                <span className="text-purple-400">📄</span>
                <span>Lembar Kerja Canva: <strong className="text-[#dfa82e]">{activePage.toUpperCase()}</strong></span>
              </span>
              <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Drag &amp; Drop Komponen Aktif
              </span>
            </div>

            {/* Iframe View of Live Website Page with Dropzones */}
            <iframe
              ref={iframeRef}
              src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
              className="w-full flex-1 min-h-[850px] border-0 bg-white"
              title="Canva Studio Editor"
            />
          </div>

        </main>
      </div>

      {/* ── 3. MODAL SISIPKAN KOMPONEN SEBELUM HALAMAN TERTENTU ──────────────── */}
      {insertModalTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131929] border border-purple-500/30 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#232c42] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Sisipkan Komponen / Div
                </h3>
                <p className="text-xs text-purple-200 mt-0.5">
                  Pilih komponen yang ingin diletakkan sebelum:{' '}
                  <strong className="text-white">
                    {insertModalTarget === '__end__' ? 'Paling Bawah Halaman' : (standardHomeSections[insertModalTarget]?.name || 'Halaman Tujuan')}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setInsertModalTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Templates Grid */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {componentTemplates.map((tpl) => (
                <button
                  key={tpl.type}
                  onClick={() => insertComponentBefore(insertModalTarget, tpl.type)}
                  className={`p-3.5 rounded-xl border bg-gradient-to-br ${tpl.color} hover:brightness-125 hover:border-purple-400 text-left transition-all flex flex-col gap-1.5 group cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tpl.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-200">
                        {tpl.title}
                      </h4>
                      <span className="text-[10px] text-purple-300 font-bold">
                        {tpl.badge}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {tpl.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#232c42] flex items-center justify-end">
              <button
                onClick={() => setInsertModalTarget(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. MODAL RIWAYAT PERUBAHAN (SAVE STATES RESTORE) ───────────────────── */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131929] border border-amber-500/30 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#232c42] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-amber-400" />
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
                    className="p-3.5 rounded-xl bg-[#0f1422] border border-[#252f47] hover:border-amber-400/40 flex items-center justify-between gap-3 transition-colors"
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
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-400/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Pulihkan Versi Ini
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#232c42] text-right">
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
