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
  ChevronRight, 
  ArrowLeft, 
  Upload, 
  Download, 
  RefreshCw, 
  Layers,
  FileText,
  AlertCircle,
  Target,
  Settings,
  Sliders,
  Eye,
  Undo2,
  Search,
  Image as ImageIcon,
  Type,
  Link2,
  Compass,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { defaultSiteContent, SiteContent } from '@/data/defaultSiteContent';
import { compressImageToDataUrl } from '@/lib/imageUtils';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

interface SectionItem {
  id: string;
  name: string;
  category: 'Header' | 'Hero & Intro' | 'Konten Utama' | 'Kredibilitas' | 'Footer';
  icon: string;
  page: PreviewPageOption;
  description: string;
}

export default function ElementorEditorClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Elementor Sidebar Tabs: 'elements' | 'navigator' | 'settings' | 'inspector'
  const [activeTab, setActiveTab] = useState<'elements' | 'navigator' | 'settings' | 'inspector'>('elements');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [history, setHistory] = useState<SiteContent[]>([]);
  const [pageDropdownOpen, setPageDropdownOpen] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);
  const activeImageFieldRef = useRef<string | null>(null);

  const sections: SectionItem[] = [
    { id: 'navbar', name: 'Header & Navigasi', category: 'Header', icon: '📌', page: 'home', description: 'Logo brand, menu links, dan tombol konsultasi' },
    { id: 'hero', name: 'Hero Banner Utama', category: 'Hero & Intro', icon: '🚀', page: 'home', description: 'Headline, subheadline, 2 tombol CTA, dan floating seal' },
    { id: 'trust-stats', name: 'Statistik Kepercayaan', category: 'Kredibilitas', icon: '📊', page: 'home', description: 'Angka legalitas, izin OSS, standar kerahasiaan, jangkauan' },
    { id: 'about', name: 'Profil Tentang SELECO', category: 'Konten Utama', icon: '🏢', page: 'home', description: 'Deskripsi firma, kolase foto, dan nilai-nilai korporasi' },
    { id: 'services', name: '5 Pilar Layanan', category: 'Konten Utama', icon: '💼', page: 'home', description: 'Kategori spesialisasi perizinan, imigrasi, pajak, pertanahan, SDM' },
    { id: 'retainer', name: 'Program Retainer', category: 'Konten Utama', icon: '🛡️', page: 'home', description: 'Paket external corporate team dan cakupan layanan rutin' },
    { id: 'attorneys', name: 'Tim Konsultan', category: 'Kredibilitas', icon: '👥', page: 'home', description: 'Profil tim konsultan profesional dan keahlian spesifik' },
    { id: 'insights', name: 'Legal Insights', category: 'Konten Utama', icon: '📰', page: 'home', description: 'Artikel publikasi editorial dan analisa regulasi terbaru' },
    { id: 'faq', name: 'Tanya Jawab (FAQ)', category: 'Konten Utama', icon: '❓', page: 'home', description: 'Jawaban atas pertanyaan umum seputar konsultasi bisnis' },
    { id: 'contact', name: 'Kontak & Formulir', category: 'Konten Utama', icon: '📞', page: 'home', description: 'Alamat kantor, nomor WhatsApp, email, dan formulir konsultasi' },
    { id: 'footer', name: 'Footer Website', category: 'Footer', icon: '📑', page: 'home', description: 'Informasi copyright, navigasi bawah, dan kontak resmi' },
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
        setHistory([parsed]);
      }
    } catch (e) {}

    fetchCurrentContent();
  }, []);

  const fetchCurrentContent = async () => {
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          setHistory((prev) => (prev.length === 0 ? [data.content] : prev));
        }
      }
    } catch (err) {
      console.error('Error loading content:', err);
    }
  };

  // 2. Broadcast to Preview Iframe
  const sendContentToIframe = (contentToSend: SiteContent) => {
    try {
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(contentToSend));
      sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_SITE_CONTENT',
          content: contentToSend,
        }, '*');
        iframeRef.current.contentWindow.postMessage({
          type: 'SET_EDITOR_MODE',
          mode: 'click_to_edit',
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

  const sendScrollToSection = (sectionId: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SCROLL_TO_SECTION',
        sectionId,
      }, '*');
    }
  };

  // 3. Listen to iframe messages
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        sendContentToIframe(content);
        sendPageToIframe(activePage);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        updateContentWithHistory(e.data.content);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [content, activePage]);

  // Update content helper with history tracking
  const updateContentWithHistory = (newContent: SiteContent) => {
    setHistory((prev) => [...prev.slice(-15), content]);
    setContent(newContent);
    setHasUnsavedChanges(true);
    sendContentToIframe(newContent);
  };

  // Handle Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setContent(previous);
    sendContentToIframe(previous);
  };

  // Handle Page Select
  const handleSelectPage = (page: PreviewPageOption) => {
    setActivePage(page);
    setPageDropdownOpen(false);
    sendPageToIframe(page);
  };

  // Handle Section Click in Elementor Navigator
  const handleSelectSection = (sec: SectionItem) => {
    setSelectedSectionId(sec.id);
    setActiveTab('inspector');
    if (activePage !== sec.page) {
      handleSelectPage(sec.page);
      setTimeout(() => sendScrollToSection(sec.id), 400);
    } else {
      sendScrollToSection(sec.id);
    }
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
        setSaveSuccessMessage('Semua perubahan berhasil diperbarui secara permanen!');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        alert('Gagal menyimpan perubahan ke server. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `seleco_content_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          updateContentWithHistory(parsed);
          setSaveSuccessMessage('File JSON berhasil diimpor! Klik "Perbarui" untuk menyimpan.');
          setTimeout(() => setSaveSuccessMessage(null), 5000);
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Image Upload Handler
  const triggerImageUpload = (fieldPath: string) => {
    activeImageFieldRef.current = fieldPath;
    imageUploadRef.current?.click();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeImageFieldRef.current) return;

    try {
      const dataUrl = await compressImageToDataUrl(file);
      const fieldPath = activeImageFieldRef.current;
      
      const newContent = JSON.parse(JSON.stringify(content));
      const parts = fieldPath.split('.');
      let cur: any = newContent;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = dataUrl;

      updateContentWithHistory(newContent);
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      e.target.value = '';
      activeImageFieldRef.current = null;
    }
  };

  // Helper to update deeply nested content
  const updateField = (fieldPath: string, value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    const parts = fieldPath.split('.');
    let cur: any = newContent;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
    updateContentWithHistory(newContent);
  };

  const pageNames: Record<PreviewPageOption, string> = {
    home: 'Beranda Utama',
    about: 'Tentang Kami',
    services: 'Layanan & Spesialisasi',
    insight: 'Artikel & Insight',
    contact: 'Kontak & Kantor',
  };

  const filteredSections = sections.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex bg-[#0c131d] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Hidden file inputs */}
      <input type="file" ref={importInputRef} onChange={handleImportJson} accept=".json,application/json" className="hidden" />
      <input type="file" ref={imageUploadRef} onChange={handleImageFileChange} accept="image/*" className="hidden" />

      {/* ========================================================================= */}
      {/* ELEMENTOR LEFT PANEL (DOCK)                                              */}
      {/* ========================================================================= */}
      <aside 
        className={`h-full bg-[#111827] border-r border-[#1f2937] flex flex-col transition-all duration-300 z-30 shrink-0 ${
          sidebarCollapsed ? 'w-0 overflow-hidden border-r-0' : 'w-[380px] max-w-[90vw]'
        }`}
      >
        {/* Top Header of Elementor Panel */}
        <div className="h-14 bg-[#0f2034] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Link 
              href="/admin" 
              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title="Kembali ke Dashboard Utama Admin"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <span className="font-serif-title font-bold text-sm tracking-wider text-white flex items-center gap-1.5">
                <span>SELECO</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#b88917] bg-[#b88917]/15 px-1.5 py-0.2 rounded border border-[#b88917]/30">
                  Builder
                </span>
              </span>
              <span className="text-[9px] text-white/40 tracking-wider">Visual Web Editor</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
                history.length === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
              title="Undo Perubahan Terakhir"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Tutup Panel Editor"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Elements | Navigator | Site Settings) */}
        <div className="bg-[#0c1421] border-b border-white/10 px-2 flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'elements' || (activeTab === 'inspector' && !selectedSectionId)
                ? 'border-[#b88917] text-[#b88917]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Elemen</span>
          </button>
          <button
            onClick={() => setActiveTab('navigator')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'navigator'
                ? 'border-[#b88917] text-[#b88917]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Navigator</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-[#b88917] text-[#b88917]'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Situs</span>
          </button>
        </div>

        {/* ===================================================================== */}
        {/* PANEL CONTENT BODY                                                    */}
        {/* ===================================================================== */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          
          {/* TAB 1: ELEMENTS CATALOG */}
          {activeTab === 'elements' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari section atau widget..."
                  className="w-full bg-[#1e293b]/70 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#b88917]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-white/40 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Page Section Indicator */}
              <div className="flex items-center justify-between text-[11px] text-white/50 px-1">
                <span>Daftar Section ({filteredSections.length})</span>
                <span className="text-[#b88917]">Halaman: {pageNames[activePage]}</span>
              </div>

              {/* Sections List Cards */}
              <div className="space-y-2">
                {filteredSections.map((sec) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-white/5 hover:border-[#b88917]/40 rounded-xl transition-all cursor-pointer group"
                    onClick={() => handleSelectSection(sec)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base group-hover:scale-110 transition-transform">{sec.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-[#b88917] transition-colors">
                            {sec.name}
                          </h4>
                          <p className="text-[10px] text-white/40 leading-snug line-clamp-1 mt-0.5">
                            {sec.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-white/30 group-hover:text-[#b88917] shrink-0 mt-0.5">
                        #{sec.id}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-white/40">{sec.category}</span>
                      <span className="text-[#b88917] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Edit Konten</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NAVIGATOR (TREE VIEW ALA ELEMENTOR) */}
          {activeTab === 'navigator' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/40 px-1">
                Struktur Dokumen (DOM Sections)
              </div>
              <p className="text-[11px] text-white/50 px-1 leading-relaxed">
                Klik section untuk auto-scroll dan memfokuskan elemen di canvas preview.
              </p>

              <div className="space-y-1 mt-3">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec)}
                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                      selectedSectionId === sec.id
                        ? 'bg-[#b88917] text-[#0f2034] font-bold'
                        : 'bg-[#1e293b]/40 hover:bg-[#1e293b] text-white/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs opacity-50 font-mono">{idx + 1}.</span>
                      <span>{sec.icon}</span>
                      <span className="truncate">{sec.name}</span>
                    </div>
                    <Target className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SITE SETTINGS (GLOBAL BRANDING & INFO) */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#b88917] pb-1 border-b border-white/10">
                Identitas Brand &amp; Kontak Resmi
              </div>

              {/* Brand Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/60">Nama Brand Firma</label>
                <input
                  type="text"
                  value={content?.global?.brandName || ''}
                  onChange={(e) => updateField('global.brandName', e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                />
              </div>

              {/* Brand Tagline */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/60">Tagline Resmi</label>
                <input
                  type="text"
                  value={content?.global?.brandTagline || ''}
                  onChange={(e) => updateField('global.brandTagline', e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                />
              </div>

              {/* Logo URL + Upload */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-white/60">Logo Brand</label>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded bg-white p-1 border border-white/20 shrink-0">
                    <img src={content?.global?.logo || '/logo-seleco.png'} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <input
                    type="text"
                    value={content?.global?.logo || ''}
                    onChange={(e) => updateField('global.logo', e.target.value)}
                    className="flex-1 bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#b88917]"
                  />
                  <button
                    onClick={() => triggerImageUpload('global.logo')}
                    className="p-2 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] rounded text-xs"
                    title="Upload Foto Logo Baru"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/60 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#b88917]" />
                  <span>WhatsApp Konsultasi</span>
                </label>
                <input
                  type="text"
                  value={content?.global?.whatsappNumber || ''}
                  onChange={(e) => updateField('global.whatsappNumber', e.target.value)}
                  placeholder="6282211020022"
                  className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/60 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-[#b88917]" />
                  <span>Email Resmi</span>
                </label>
                <input
                  type="email"
                  value={content?.global?.email || ''}
                  onChange={(e) => updateField('global.email', e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                />
              </div>

              {/* Alamat */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-white/60 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#b88917]" />
                  <span>Alamat Kantor Pusat</span>
                </label>
                <textarea
                  rows={2}
                  value={content?.global?.address || ''}
                  onChange={(e) => updateField('global.address', e.target.value)}
                  className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917] resize-none"
                />
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/50">Total Layanan</label>
                  <input
                    type="text"
                    value={content?.global?.totalServices || ''}
                    onChange={(e) => updateField('global.totalServices', e.target.value)}
                    placeholder="445+"
                    className="w-full bg-[#1e293b] border border-white/10 rounded px-2 py-1 text-xs text-white text-center font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-white/50">Izin OSS RBA</label>
                  <input
                    type="text"
                    value={content?.global?.ossLicenseCount || ''}
                    onChange={(e) => updateField('global.ossLicenseCount', e.target.value)}
                    placeholder="411+"
                    className="w-full bg-[#1e293b] border border-white/10 rounded px-2 py-1 text-xs text-white text-center font-bold"
                  />
                </div>
              </div>

              {/* Backup & Restore */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="flex-1 py-2 bg-[#1e293b] hover:bg-[#334155] text-white/80 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <Download className="w-3.5 h-3.5 text-[#b88917]" />
                  <span>Backup JSON</span>
                </button>
                <button
                  onClick={() => importInputRef.current?.click()}
                  className="flex-1 py-2 bg-[#1e293b] hover:bg-[#334155] text-white/80 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <Upload className="w-3.5 h-3.5 text-[#b88917]" />
                  <span>Restore JSON</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECTION INSPECTOR (ALA ELEMENTOR WIDGET EDITOR) */}
          {activeTab === 'inspector' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setSelectedSectionId(null);
                  setActiveTab('elements');
                }}
                className="text-xs text-[#b88917] hover:underline flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Katalog Elemen</span>
              </button>

              <div className="pb-2 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white capitalize">
                    {sections.find((s) => s.id === selectedSectionId)?.name || 'Editor Section'}
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono">#{selectedSectionId}</p>
                </div>
                <button
                  onClick={() => selectedSectionId && sendScrollToSection(selectedSectionId)}
                  className="px-2 py-1 bg-[#1e293b] hover:bg-[#334155] text-[10px] font-bold text-[#b88917] rounded border border-white/10 flex items-center gap-1"
                  title="Fokus ke Section di Canvas"
                >
                  <Target className="w-3 h-3" />
                  <span>Fokus</span>
                </button>
              </div>

              {/* INSPECTOR FIELDS: HERO */}
              {selectedSectionId === 'hero' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Badge / Label Atas</label>
                    <input
                      type="text"
                      value={content?.hero?.topBadge || ''}
                      onChange={(e) => updateField('hero.topBadge', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Utama (Baris 1)</label>
                    <input
                      type="text"
                      value={content?.hero?.headlinePart1 || ''}
                      onChange={(e) => updateField('hero.headlinePart1', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Aksen Judul (Italic Gold)</label>
                    <input
                      type="text"
                      value={content?.hero?.headlineItalic || ''}
                      onChange={(e) => updateField('hero.headlineItalic', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-[#b88917] font-semibold focus:outline-none focus:border-[#b88917]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Subjudul Paragraf</label>
                    <textarea
                      rows={3}
                      value={content?.hero?.subheadline || ''}
                      onChange={(e) => updateField('hero.subheadline', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#b88917] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/50">Tombol 1 (Cari Layanan)</label>
                      <input
                        type="text"
                        value={content?.hero?.ctaButton1Text || ''}
                        onChange={(e) => updateField('hero.ctaButton1Text', e.target.value)}
                        className="w-full bg-[#1e293b] border border-white/10 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/50">Tombol 2 (Konsultasi)</label>
                      <input
                        type="text"
                        value={content?.hero?.ctaButton2Text || ''}
                        onChange={(e) => updateField('hero.ctaButton2Text', e.target.value)}
                        className="w-full bg-[#1e293b] border border-white/10 rounded px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-white/60">Foto Poster Background Hero</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={content?.hero?.bgImage || ''}
                        onChange={(e) => updateField('hero.bgImage', e.target.value)}
                        className="flex-1 bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#b88917]"
                      />
                      <button
                        onClick={() => triggerImageUpload('hero.bgImage')}
                        className="p-2 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] rounded text-xs"
                        title="Upload Foto Latar"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Video Latar Belakang Ruang Kantor */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <label className="text-[11px] font-semibold text-white/80 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-[#dfa82e]">▶</span> Video Latar Belakang Kantor (MP4)
                      </span>
                      <span className="text-[10px] text-[#dfa82e] font-mono">Looping Otomatis</span>
                    </label>
                    <input
                      type="text"
                      value={content?.hero?.bgVideo || ''}
                      onChange={(e) => updateField('hero.bgVideo', e.target.value)}
                      placeholder="https://.../video.mp4"
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#dfa82e]"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => updateField('hero.bgVideo', 'https://assets.mixkit.co/videos/42884/42884-720.mp4')}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-[#dfa82e]/20 text-[10px] text-slate-300 hover:text-[#dfa82e] border border-white/10 transition-colors"
                      >
                        Pilihan 1: Rapat Kantor
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('hero.bgVideo', 'https://assets.mixkit.co/videos/42587/42587-720.mp4')}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-[#dfa82e]/20 text-[10px] text-slate-300 hover:text-[#dfa82e] border border-white/10 transition-colors"
                      >
                        Pilihan 2: Meja Kerja
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('hero.bgVideo', 'https://assets.mixkit.co/videos/42588/42588-720.mp4')}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-[#dfa82e]/20 text-[10px] text-slate-300 hover:text-[#dfa82e] border border-white/10 transition-colors"
                      >
                        Pilihan 3: Gedung Kaca
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* INSPECTOR FIELDS: ABOUT */}
              {selectedSectionId === 'about' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Bagian</label>
                    <input
                      type="text"
                      value={content?.about?.title || ''}
                      onChange={(e) => updateField('about.title', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Paragraf 1</label>
                    <textarea
                      rows={3}
                      value={content?.about?.paragraph1 || ''}
                      onChange={(e) => updateField('about.paragraph1', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Paragraf 2</label>
                    <textarea
                      rows={3}
                      value={content?.about?.paragraph2 || ''}
                      onChange={(e) => updateField('about.paragraph2', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* INSPECTOR FIELDS: SERVICES */}
              {selectedSectionId === 'services' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Layanan</label>
                    <input
                      type="text"
                      value={content?.services?.title || ''}
                      onChange={(e) => updateField('services.title', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Deskripsi Subjudul</label>
                    <textarea
                      rows={3}
                      value={content?.services?.subtitle || ''}
                      onChange={(e) => updateField('services.subtitle', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Banner Bawah</label>
                    <input
                      type="text"
                      value={content?.services?.ctaBannerTitle || ''}
                      onChange={(e) => updateField('services.ctaBannerTitle', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* INSPECTOR FIELDS: CONTACT */}
              {selectedSectionId === 'contact' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Kontak</label>
                    <input
                      type="text"
                      value={content?.contact?.title || ''}
                      onChange={(e) => updateField('contact.title', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Subjudul Kontak</label>
                    <textarea
                      rows={3}
                      value={content?.contact?.subtitle || ''}
                      onChange={(e) => updateField('contact.subtitle', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* INSPECTOR FIELDS: RETAINER */}
              {selectedSectionId === 'retainer' && (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Judul Retainer</label>
                    <input
                      type="text"
                      value={content?.retainer?.title || ''}
                      onChange={(e) => updateField('retainer.title', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-white/60">Subjudul Retainer</label>
                    <textarea
                      rows={3}
                      value={content?.retainer?.subtitle || ''}
                      onChange={(e) => updateField('retainer.subtitle', e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {/* DEFAULT FALLBACK FOR OTHER SECTIONS */}
              {!['hero', 'about', 'services', 'contact', 'retainer'].includes(selectedSectionId || '') && (
                <div className="p-4 bg-[#1e293b]/40 border border-white/10 rounded-xl space-y-2 text-center">
                  <p className="text-xs text-white/80 font-semibold">Mode Edit Langsung Aktif</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Anda dapat langsung mengklik teks atau elemen pada section ini di canvas preview sebelah kanan untuk mengeditnya secara instan!
                  </p>
                  <button
                    onClick={() => selectedSectionId && sendScrollToSection(selectedSectionId)}
                    className="px-3 py-1.5 bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] text-xs font-bold rounded mt-2"
                  >
                    Sorot Section Ini
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* ELEMENTOR BOTTOM TOOLBAR                                              */}
        {/* ===================================================================== */}
        <div className="h-14 bg-[#0a1017] border-t border-white/10 px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors ${
                activeTab === 'settings' ? 'text-[#b88917] bg-white/5' : ''
              }`}
              title="Pengaturan Situs & Halaman"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('navigator')}
              className={`p-2 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors ${
                activeTab === 'navigator' ? 'text-[#b88917] bg-white/5' : ''
              }`}
              title="Navigator Dokumen"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`p-2 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors ${
                history.length === 0 ? 'opacity-30' : ''
              }`}
              title="Undo Perubahan"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <Link
              href="/?preview=true"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Lihat Pratinjau Website Publik"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Update / Publish Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
              isSaving
                ? 'bg-[#b88917]/50 text-[#0f2034] cursor-not-allowed'
                : hasUnsavedChanges
                ? 'bg-[#b88917] hover:bg-[#d4a024] text-[#0f2034] ring-2 ring-[#b88917]/50 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Simpan Perubahan Permanen ke Server"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{hasUnsavedChanges ? 'PERBARUI' : 'TERSIMPAN'}</span>
              </>
            )}
          </button>
        </div>

      </aside>

      {/* Re-open Sidebar Button when collapsed */}
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarCollapsed(false)}
          className="fixed left-3 top-3 z-40 p-2.5 bg-[#0f2034] hover:bg-[#1a2e47] text-[#b88917] rounded-xl border border-white/15 shadow-2xl transition-all"
          title="Buka Panel Editor Elementor"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      {/* ========================================================================= */}
      {/* RIGHT CANVAS & DEVICE VIEWPORT                                           */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col bg-[#070b12] overflow-hidden relative">
        
        {/* Canvas Top Bar */}
        <header className="h-12 bg-[#0c1421] border-b border-white/10 px-4 flex items-center justify-between shrink-0">
          
          {/* Left: Page Switcher */}
          <div className="relative">
            <button
              onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/90 transition-colors"
            >
              <span className="text-[#b88917] font-bold">Halaman:</span>
              <span>{pageNames[activePage]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/50 transition-transform ${pageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {pageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#111827] border border-white/15 rounded-xl shadow-2xl py-1 z-50">
                {(['home', 'about', 'services', 'insight', 'contact'] as PreviewPageOption[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectPage(p)}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      activePage === p ? 'bg-[#b88917] text-[#0f2034] font-bold' : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>{pageNames[p]}</span>
                    {activePage === p && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center: Device Mode Switcher (Elementor Style) */}
          <div className="flex items-center bg-[#070b12] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deviceMode === 'desktop' ? 'bg-[#b88917] text-[#0f2034]' : 'text-white/50 hover:text-white'
              }`}
              title="Pratinjau Desktop (100% Layar)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deviceMode === 'tablet' ? 'bg-[#b88917] text-[#0f2034]' : 'text-white/50 hover:text-white'
              }`}
              title="Pratinjau Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                deviceMode === 'mobile' ? 'bg-[#b88917] text-[#0f2034]' : 'text-white/50 hover:text-white'
              }`}
              title="Pratinjau Smartphone (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Right: Dimension & Status */}
          <div className="flex items-center gap-2.5 text-xs text-white/50">
            <span className="font-mono text-[11px] hidden sm:inline">
              {deviceMode === 'desktop' ? '100% Responsive' : deviceMode === 'tablet' ? '768 x 1024' : '375 x 812'}
            </span>
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = iframeRef.current.src;
                }
              }}
              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white"
              title="Muat Ulang Canvas"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Notification Toasts */}
        {saveSuccessMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* Main Canvas Viewport Area */}
        <main className="flex-1 overflow-hidden flex items-center justify-center p-0 md:p-3 relative bg-[#070b12]">
          <div
            className={`h-full transition-all duration-300 flex flex-col bg-white overflow-hidden ${
              deviceMode === 'desktop'
                ? 'w-full max-w-full rounded-none md:rounded-lg shadow-2xl border-0 md:border border-white/10'
                : deviceMode === 'tablet'
                ? 'w-[768px] max-w-full rounded-2xl shadow-2xl border-2 border-slate-700 my-auto h-[95%]'
                : 'w-[375px] max-w-full rounded-2xl shadow-2xl border-2 border-slate-700 my-auto h-[95%]'
            }`}
          >
            {deviceMode !== 'desktop' && (
              <div className="h-6 bg-[#0f2034] text-white/60 text-[10px] flex items-center justify-center border-b border-white/10">
                Mode Preview: {deviceMode.toUpperCase()} ({deviceMode === 'tablet' ? '768px' : '375px'})
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
              className="w-full flex-1 border-0 bg-white"
              title="SELECO Live Preview Canvas"
            />
          </div>
        </main>

      </div>

    </div>
  );
}
