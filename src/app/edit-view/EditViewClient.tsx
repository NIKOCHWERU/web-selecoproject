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
  ArrowLeft, 
  Upload, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Layers,
  FileText,
  AlertCircle,
  Target
} from 'lucide-react';
import { defaultSiteContent, SiteContent } from '@/data/defaultSiteContent';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

export default function EditViewClient() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [pageDropdownOpen, setPageDropdownOpen] = useState<boolean>(false);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const sectionDropdownRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const sectionsList = [
    { id: 'navbar', label: 'Navbar Navigasi Section', icon: '📌', page: 'home' },
    { id: 'hero', label: 'Hero Banner Section', icon: '🚀', page: 'home' },
    { id: 'trust-stats', label: 'Statistik Kepercayaan', icon: '📊', page: 'home' },
    { id: 'about', label: 'Profil Tentang SELECO', icon: '🏢', page: 'home' },
    { id: 'services', label: '5 Pilar Layanan Konsultan', icon: '💼', page: 'home' },
    { id: 'retainer', label: 'Corporate Retainer Program', icon: '🛡️', page: 'home' },
    { id: 'attorneys', label: 'Tim Konsultan Profesional', icon: '👥', page: 'home' },
    { id: 'insights', label: 'Insight & Artikel Hukum', icon: '📰', page: 'home' },
    { id: 'faq', label: 'Tanya Jawab (FAQ)', icon: '❓', page: 'home' },
    { id: 'contact', label: 'Kontak & Formulir Konsultasi', icon: '📞', page: 'home' },
    { id: 'footer', label: 'Footer Website & Navigasi', icon: '📑', page: 'home' },
  ];

  const handleSelectSection = (sec: typeof sectionsList[0]) => {
    setSectionDropdownOpen(false);
    if (activePage !== sec.page) {
      setActivePage(sec.page as PreviewPageOption);
      sendPageToIframe(sec.page as PreviewPageOption);
      setTimeout(() => {
        sendSectionToIframe(sec.id);
      }, 400);
    } else {
      sendSectionToIframe(sec.id);
    }
  };

  const sendSectionToIframe = (sectionId: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SCROLL_TO_SECTION',
        sectionId,
      }, '*');
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) {
        setPageDropdownOpen(false);
      }
      if (sectionDropdownRef.current && !sectionDropdownRef.current.contains(e.target as Node)) {
        setSectionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. Initial Load: Read from cache or fetch from /api/admin/content
  useEffect(() => {
    const auth = sessionStorage.getItem('seleco_admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
      return;
    }

    // Ensure click_to_edit mode is stored
    sessionStorage.setItem('seleco_editor_mode', 'click_to_edit');

    try {
      const cached = localStorage.getItem('seleco_site_content');
      if (cached) {
        setContent(JSON.parse(cached));
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
        }
      }
    } catch (err) {
      console.error('Error loading content in visual editor:', err);
    }
  };

  // 2. Broadcast content changes to iframe
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
      console.error('Error broadcasting to preview iframe:', e);
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

  // Broadcast on content changes
  useEffect(() => {
    sendContentToIframe(content);
  }, [content]);

  // 3. Listen to iframe messages (element updates, ready signal)
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        setIframeLoaded(true);
        sendContentToIframe(content);
        sendPageToIframe(activePage);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        setContent(e.data.content);
        setHasUnsavedChanges(true);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [content, activePage]);

  // Handle Page Selection
  const handleSelectPage = (page: PreviewPageOption) => {
    setActivePage(page);
    setPageDropdownOpen(false);
    sendPageToIframe(page);
  };

  // Handle Permanent Save to Server
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
        setSaveSuccessMessage('Perubahan berhasil disimpan permanen ke server!');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        alert('Gagal menyimpan perubahan ke server. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export JSON
  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `seleco_site_content_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Error exporting JSON:', err);
    }
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
          setContent(parsed);
          setHasUnsavedChanges(true);
          sendContentToIframe(parsed);
          setSaveSuccessMessage('File JSON berhasil diimport! Jangan lupa klik "Simpan Perubahan".');
          setTimeout(() => setSaveSuccessMessage(null), 5000);
        } else {
          alert('Format file JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON. Pastikan format JSON benar.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const pageNames: Record<PreviewPageOption, string> = {
    home: '🏠 Beranda Utama',
    about: '📖 Halaman Tentang Kami',
    services: '💼 Halaman Layanan & Spesialisasi',
    insight: '📰 Halaman Artikel & Insight',
    contact: '📞 Halaman Kontak & Kantor',
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0F19] text-white overflow-hidden font-sans select-none">
      
      {/* ========================================================================= */}
      {/* TOPBAR CONTROLS                                                           */}
      {/* ========================================================================= */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        
        {/* Left Section: Brand, Badges & Page Switcher */}
        <div className="flex items-center gap-3">
          <Link 
            href="/admin" 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700"
            title="Kembali ke Dashboard Formulir Admin"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mode Formulir</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-serif-title font-bold text-sm tracking-wider text-amber-300">
              SELECO
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full hidden md:inline">
              Visual Editor
            </span>
          </div>

          {/* Page Switcher Dropdown */}
          <div className="relative" ref={pageDropdownRef}>
            <button
              onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all shadow-sm"
              title="Pilih Halaman Website yang Ingin Diedit"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="max-w-[130px] sm:max-w-none truncate">{pageNames[activePage]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${pageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {pageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-900 border border-amber-400/40 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Pilih Halaman Diedit:
                </div>
                {(['home', 'about', 'services', 'insight', 'contact'] as PreviewPageOption[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSelectPage(p)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                      activePage === p 
                        ? 'bg-amber-400 text-slate-950 font-bold' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{pageNames[p]}</span>
                    {activePage === p && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Switcher Dropdown */}
          <div className="relative" ref={sectionDropdownRef}>
            <button
              onClick={() => setSectionDropdownOpen(!sectionDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/40 text-slate-200 hover:text-amber-300 text-xs font-bold transition-all shadow-sm"
              title="Lompat Langsung ke Section yang Ingin Diedit (Navbar, Hero, Layanan, Kontak, dll)"
            >
              <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Pilih Section</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sectionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sectionDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900 border border-amber-400/50 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                  <span>Lompat ke Section:</span>
                  <span className="text-amber-300 text-[9px] font-normal">Auto Scroll &amp; Focus</span>
                </div>
                {sectionsList.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec)}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors text-slate-300 hover:bg-amber-400/20 hover:text-amber-300 group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm group-hover:scale-125 transition-transform">{sec.icon}</span>
                      <span className="font-medium">{sec.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400">
                      #{sec.id}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Section: Responsive Device Preview Switcher */}
        <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'desktop' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Desktop (100% Layar Penuh)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'tablet' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'mobile' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Smartphone (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Right Section: Import/Export, Live Website, & Save Button */}
        <div className="flex items-center gap-2">
          
          {/* Import JSON */}
          <input
            type="file"
            ref={importInputRef}
            onChange={handleImportJson}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => importInputRef.current?.click()}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Import Isi Web dari File JSON"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Import</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Export Backup Isi Web ke File JSON"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* View Live Website in New Tab */}
          <Link
            href="/?preview=true"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700 flex items-center gap-1.5"
            title="Buka Pratinjau Website Publik di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Live Web</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isSaving
                ? 'bg-amber-500/50 text-slate-900 cursor-not-allowed'
                : hasUnsavedChanges
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
            title="Simpan Perubahan Permanen ke Server VPS"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Web</span>
              </>
            )}
          </button>
        </div>

      </header>

      {/* Success Notification Bar */}
      {saveSuccessMessage && (
        <div className="bg-emerald-600/90 text-white text-xs px-4 py-1.5 flex items-center justify-between animate-in slide-in-from-top duration-200 z-40">
          <div className="flex items-center gap-2 mx-auto">
            <Check className="w-4 h-4 text-white shrink-0" />
            <span className="font-semibold">{saveSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && !saveSuccessMessage && (
        <div className="bg-amber-500/20 border-b border-amber-400/30 text-amber-300 text-[11px] px-4 py-1 flex items-center justify-center gap-2 z-20">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Anda memiliki perubahan teks/gaya yang belum disimpan permanen ke server. Klik <strong>"Simpan Web"</strong> untuk menerapkan ke VPS.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CANVAS VIEWPORT                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1 bg-[#070A11] flex items-center justify-center p-0 md:p-3 overflow-hidden relative">
        
        {/* Device Container */}
        <div 
          className={`h-full transition-all duration-300 flex flex-col bg-white overflow-hidden ${
            deviceMode === 'desktop' 
              ? 'w-full max-w-full rounded-none md:rounded-xl shadow-2xl border-0 md:border border-slate-800' 
              : deviceMode === 'tablet' 
              ? 'w-[768px] max-w-full rounded-2xl shadow-2xl border-2 border-slate-700 my-auto h-[95%]' 
              : 'w-[375px] max-w-full rounded-2xl shadow-2xl border-2 border-slate-700 my-auto h-[95%]'
          }`}
        >
          {/* Visual Indicator Topbar on Tablet/Mobile */}
          {deviceMode !== 'desktop' && (
            <div className="h-6 bg-slate-900 flex items-center justify-center border-b border-slate-800 text-[10px] text-slate-400">
              <span>Preview Mode: {deviceMode.toUpperCase()} ({deviceMode === 'tablet' ? '768px' : '375px'})</span>
            </div>
          )}

          {/* Iframe pointing to /admin/preview with mode=click_to_edit */}
          <iframe
            ref={iframeRef}
            src={`/admin/preview?page=${activePage}&mode=click_to_edit`}
            className="w-full flex-1 border-0 bg-white"
            title="SELECO Visual Website Live Editor"
          />
        </div>

      </main>

    </div>
  );
}
