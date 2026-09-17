'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Save, 
  RotateCcw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  LogOut,
  Image as ImageIcon,
  Sparkles,
  Layers,
  FileText,
  Users,
  HelpCircle,
  Phone,
  Scale,
  Briefcase,
  ShieldCheck,
  MousePointerClick,
  Sliders,
  Maximize2,
  Minimize2,
  Home,
  Compass,
  Building2,
  Download,
  UploadCloud,
  FileJson,
  CheckSquare
} from 'lucide-react';
import TailAdminLayout from '@/components/admin/TailAdminLayout';
import { SiteContent, defaultSiteContent } from '@/data/defaultSiteContent';
import { compressImageToDataUrl } from '@/lib/imageUtils';

export type PreviewPageOption = 'home' | 'about' | 'services' | 'insight' | 'contact';

export default function AdminClient() {

  // Content state inside builder
  const [editorContent, setEditorContent] = useState<SiteContent>(defaultSiteContent);
  const [editorMode, setEditorMode] = useState<'sidebar' | 'click_to_edit'>('sidebar');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<PreviewPageOption>('home');
  const [pageDropdownOpen, setPageDropdownOpen] = useState<boolean>(false);
  const pageDropdownRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'retainer' | 'insights' | 'faq' | 'global' | 'import_export'>('hero');
  const [activeSection, setActiveSection] = useState<string>('hero-text');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Responsive Iframe Reference & Sync
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  const sendPageToIframe = (page: PreviewPageOption) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SET_PREVIEW_PAGE',
        page: page,
      }, '*');
    }
  };

  const handleSelectPage = (page: PreviewPageOption) => {
    setActivePage(page);
    setPageDropdownOpen(false);
    sendPageToIframe(page);

    // Also auto-switch form tab to relevant section for seamless experience
    if (page === 'home') {
      setActiveTab('hero');
    } else if (page === 'about') {
      setActiveTab('about');
    } else if (page === 'services') {
      setActiveTab('services');
    } else if (page === 'insight') {
      setActiveTab('insights');
    } else if (page === 'contact') {
      setActiveTab('global');
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pageDropdownRef.current && !pageDropdownRef.current.contains(e.target as Node)) {
        setPageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sendContentToIframe = (contentToSend: SiteContent) => {
    try {
      sessionStorage.setItem('seleco_live_preview_content', JSON.stringify(contentToSend));
      sessionStorage.setItem('seleco_editor_mode', editorMode);
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'UPDATE_SITE_CONTENT',
          content: contentToSend,
        }, '*');
        iframeRef.current.contentWindow.postMessage({
          type: 'SET_EDITOR_MODE',
          mode: editorMode,
        }, '*');
      }
    } catch (e) {
      console.error('Error broadcasting to preview iframe:', e);
    }
  };

  // Broadcast to iframe on every single keystroke / content change or mode change
  useEffect(() => {
    sendContentToIframe(editorContent);
  }, [editorContent, editorMode]);

  // Listen to iframe ready signal & inline edits from click-to-edit
  useEffect(() => {
    const handleIframeMessage = (e: MessageEvent) => {
      if (e.data?.type === 'PREVIEW_IFRAME_READY') {
        setIframeLoaded(true);
        sendContentToIframe(editorContent);
        sendPageToIframe(activePage);
      }
      if (e.data?.type === 'ON_ELEMENT_UPDATED' && e.data.content) {
        setEditorContent(e.data.content);
      }
    };
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [editorContent, editorMode, activePage]);

  // Load content on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('seleco_site_content');
      if (cached) {
        setEditorContent(JSON.parse(cached));
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
          setEditorContent(data.content);
        }
      }
    } catch (err) {
      console.error('Error loading content in admin:', err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Instantly save in localStorage and dispatch cross-tab sync event
      try {
        localStorage.setItem('seleco_site_content', JSON.stringify(editorContent));
        window.dispatchEvent(new CustomEvent('seleco_content_updated', { detail: editorContent }));
      } catch (e) {}

      // 2. Persist to server
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editorContent }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast('Semua perubahan berhasil disimpan dan telah aktif di website!', 'success');
      } else {
        triggerToast(data.error || 'Gagal menyimpan perubahan', 'error');
      }
    } catch (err: any) {
      triggerToast('Terjadi kesalahan jaringan saat menyimpan', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh konten ke template bawaan (default)? Semua perubahan yang belum disimpan akan hilang.')) {
      setEditorContent(defaultSiteContent);
      try {
        localStorage.setItem('seleco_site_content', JSON.stringify(defaultSiteContent));
        window.dispatchEvent(new CustomEvent('seleco_content_updated', { detail: defaultSiteContent }));
      } catch (e) {}
      triggerToast('Konten dikembalikan ke default. Klik "Simpan" jika ingin menerapkannya ke website.', 'success');
    }
  };

  // Export seluruh konten website ke file JSON (dapat dibuka/diedit di Text Editor / Word)
  const handleExportContent = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editorContent, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `seleco-konten-lengkap-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast('File template konten website berhasil didownload!', 'success');
    } catch (e) {
      triggerToast('Gagal mengekspor file konten', 'error');
    }
  };

  // Import file JSON untuk mengisi seluruh konten website secara instan
  const handleImportContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Format file tidak valid');
        }

        // Validate structure
        const merged = { ...defaultSiteContent, ...parsed };
        setEditorContent(merged);

        // Instantly sync
        try {
          localStorage.setItem('seleco_site_content', JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent('seleco_content_updated', { detail: merged }));
        } catch (err) {}

        // Auto-save to server
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: merged }),
        });

        if (res.ok) {
          triggerToast('Seluruh konten website berhasil di-import & langsung aktif!', 'success');
        } else {
          triggerToast('Konten berhasil dimuat ke editor. Klik "Simpan" untuk menerapkan.', 'success');
        }
      } catch (err: any) {
        console.error('Import error:', err);
        triggerToast('Gagal memproses file JSON. Pastikan file berformat JSON yang valid.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can upload again if desired
    e.target.value = '';
  };

  const handleToggleSiteMode = async (mode: 'maintenance' | 'live') => {
    const updated = {
      ...editorContent,
      siteMode: {
        ...(editorContent.siteMode || {
          badgeText: 'Website Dalam Pengembangan',
          title: 'Website Resmi SELECO Sedang Dalam Pengembangan',
          subtitle: 'Kami sedang mempersiapkan sistem dan direktori layanan konsultan korporasi terbaik untuk Anda. Untuk konsultasi perizinan, imigrasi, pajak, pertanahan, atau SDM, tim konsultan SELECO tetap aktif melayani Anda via WhatsApp dan Email resmi.',
          estimatedDate: 'Segera Hadir (Coming Soon)',
          whatsappText: 'Konsultasi Sekarang via WhatsApp',
        }),
        status: mode,
      },
    };
    setEditorContent(updated);

    try {
      localStorage.setItem('seleco_site_content', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('seleco_content_updated', { detail: updated }));
    } catch (e) {}

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updated }),
      });
      if (res.ok) {
        triggerToast(
          mode === 'maintenance'
            ? 'Status Situs: "DALAM PENGEMBANGAN". Pengunjung umum akan melihat halaman Under Construction.'
            : 'Status Situs: "TAYANG (LIVE)"! Seluruh website sekarang dapat diakses bebas oleh publik & Google.',
          'success'
        );
      }
    } catch (e) {
      triggerToast('Gagal memperbarui status situs', 'error');
    }
  };

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setSaveToast({ show: true, message, type });
    setTimeout(() => {
      setSaveToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Image Upload Handler (100% Zero 404 Guarantee)
  const handleFileUpload = async (file: File, onUploaded: (url: string) => void, fieldKey: string) => {
    setUploadingField(fieldKey);
    try {
      // 1. Immediately compress on client to lightweight, high quality Base64 Data URL
      // This works 100% offline, on serverless, on local dev, and NEVER throws 404!
      const dataUrl = await compressImageToDataUrl(file);
      onUploaded(dataUrl);

      // 2. Also attempt upload to server in background to save on disk
      try {
        const formData = new FormData();
        formData.append('file', file);
        await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (serverErr) {
        console.warn('Server upload background notice:', serverErr);
      }

      triggerToast('Foto berhasil diproses & diterapkan secara live!', 'success');
    } catch (err) {
      console.error('Upload processing error:', err);
      triggerToast('Terjadi kesalahan saat memproses gambar', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  // Helper update functions with Auto-Propagation
  const updateGlobal = (key: keyof SiteContent['global'], value: string) => {
    setEditorContent((prev) => {
      const updated = {
        ...prev,
        global: { ...prev.global, [key]: value },
      };

      // Auto-propagate totalServices changes
      if (key === 'totalServices') {
        const oldNum = prev.global?.totalServices || prev.hero?.stat2Number || '445+';
        const newNum = value;
        updated.hero = { ...updated.hero, stat2Number: newNum };
        if (updated.hero.ctaButton1Text && updated.hero.ctaButton1Text.includes(oldNum)) {
          updated.hero.ctaButton1Text = updated.hero.ctaButton1Text.replaceAll(oldNum, newNum);
        }
        if (updated.services.title && updated.services.title.includes(oldNum)) {
          updated.services.title = updated.services.title.replaceAll(oldNum, newNum);
        }
        if (updated.services.ctaBannerButtonText && updated.services.ctaBannerButtonText.includes(oldNum)) {
          updated.services.ctaBannerButtonText = updated.services.ctaBannerButtonText.replaceAll(oldNum, newNum);
        }
      }

      return updated;
    });
  };

  const updateHero = (key: keyof SiteContent['hero'], value: any) => {
    setEditorContent((prev) => {
      const updated = {
        ...prev,
        hero: { ...prev.hero, [key]: value },
      };

      // If user edits stat2Number in Hero (e.g. from 445+ to 400+), auto-propagate to all pages!
      if (key === 'stat2Number' && typeof value === 'string') {
        const oldNum = prev.hero?.stat2Number || prev.global?.totalServices || '445+';
        const newNum = value;
        updated.global = {
          ...updated.global,
          totalServices: newNum,
        };
        if (updated.hero.ctaButton1Text && updated.hero.ctaButton1Text.includes(oldNum)) {
          updated.hero.ctaButton1Text = updated.hero.ctaButton1Text.replaceAll(oldNum, newNum);
        }
        if (updated.services.title && updated.services.title.includes(oldNum)) {
          updated.services.title = updated.services.title.replaceAll(oldNum, newNum);
        }
        if (updated.services.ctaBannerButtonText && updated.services.ctaBannerButtonText.includes(oldNum)) {
          updated.services.ctaBannerButtonText = updated.services.ctaBannerButtonText.replaceAll(oldNum, newNum);
        }
      }

      return updated;
    });
  };

  const updateAbout = (key: keyof SiteContent['about'], value: any) => {
    setEditorContent((prev) => ({
      ...prev,
      about: { ...prev.about, [key]: value },
    }));
  };

  const updateServices = (key: keyof SiteContent['services'], value: string) => {
    setEditorContent((prev) => ({
      ...prev,
      services: { ...prev.services, [key]: value },
    }));
  };

  const updateRetainer = (key: keyof SiteContent['retainer'], value: string) => {
    setEditorContent((prev) => ({
      ...prev,
      retainer: { ...prev.retainer, [key]: value },
    }));
  };

  const updateContact = (key: keyof SiteContent['contact'], value: string) => {
    setEditorContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: value },
    }));
  };

  const updateTeam = (key: keyof SiteContent['team'], value: any) => {
    setEditorContent((prev) => ({
      ...prev,
      team: { ...prev.team, [key]: value },
    }));
  };

  const updateInsights = (key: keyof SiteContent['insights'], value: any) => {
    setEditorContent((prev) => ({
      ...prev,
      insights: { ...prev.insights, [key]: value },
    }));
  };

  const updateFaq = (key: keyof SiteContent['faq'], value: any) => {
    setEditorContent((prev) => ({
      ...prev,
      faq: { ...prev.faq, [key]: value },
    }));
  };

  const updateFooter = (key: keyof SiteContent['footer'], value: string) => {
    setEditorContent((prev) => ({
      ...prev,
      footer: { ...prev.footer, [key]: value },
    }));
  };

  return (
    <TailAdminLayout
      activeNav="editor"
      title="Editor Web"
      subtitle="Visual Page Builder & Pengaturan Konten Website"
      fullHeight={true}
      hideSidebar={editorMode === 'click_to_edit' || isFullscreen}
      onToggleHideSidebar={() => setIsFullscreen(!isFullscreen)}
      siteMode={editorContent.siteMode?.status || 'maintenance'}
      onSiteModeChange={handleToggleSiteMode}
      headerActions={
        <div className="flex items-center gap-2">
          {/* Pilih Halaman Menu Dropdown */}
          <div className="relative" ref={pageDropdownRef}>
            <button
              onClick={() => setPageDropdownOpen(!pageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1C2434] hover:bg-[#24303F] border border-[#2E3A47] hover:border-[#D4AF37]/50 rounded-xl text-xs font-semibold text-white transition-all shadow-sm"
              title="Pilih Halaman Menu yang Ingin Diedit"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline text-[#8A99AD] text-[11px] uppercase tracking-wider">Halaman:</span>
              <span className="text-[#D4AF37] font-bold">
                {activePage === 'home' && '🏠 Beranda'}
                {activePage === 'about' && '🏢 Tentang Kami'}
                {activePage === 'services' && '💼 Layanan'}
                {activePage === 'insight' && '📰 Insight'}
                {activePage === 'contact' && '📞 Kontak'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8A99AD] transition-transform duration-200 ${pageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {pageDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-[#1C2434] border border-[#2E3A47] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8A99AD] border-b border-[#2E3A47]/60">
                  Pilih Halaman Menu
                </div>
                {[
                  { id: 'home', label: 'Beranda (Home)', icon: Home, route: '/' },
                  { id: 'about', label: 'Tentang Kami', icon: Building2, route: '/tentang' },
                  { id: 'services', label: '5 Pilar Layanan', icon: Briefcase, route: '/layanan' },
                  { id: 'insight', label: 'Insight & Regulasi', icon: FileText, route: '/insight' },
                  { id: 'contact', label: 'Kontak & Konsultasi', icon: Phone, route: '/kontak' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectPage(item.id as PreviewPageOption)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-[#333A48] text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                          : 'text-[#CBD5E1] hover:bg-[#24303F] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-[#8A99AD]'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono">{item.route}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="hidden lg:flex items-center bg-[#1C2434] p-1 rounded-xl border border-[#2E3A47]">
            <button
              onClick={() => {
                setEditorMode('sidebar');
                setIsFullscreen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                editorMode === 'sidebar'
                  ? 'bg-[#333A48] text-[#D4AF37] font-bold shadow-sm'
                  : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Mode Formulir Lengkap: Edit seluruh teks & upload foto per bagian seperti form"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Mode Formulir</span>
            </button>
            <button
              onClick={() => {
                setEditorMode('click_to_edit');
                setIsFullscreen(true);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                editorMode === 'click_to_edit'
                  ? 'bg-[#333A48] text-[#D4AF37] font-bold shadow-sm'
                  : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Mode Visual Langsung (Full View): Klik teks atau tombol pada website langsung untuk edit"
            >
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Mode Visual</span>
            </button>
          </div>

          {/* Device Switcher */}
          <div className="hidden md:flex items-center bg-[#1C2434] p-1 rounded-xl border border-[#2E3A47]">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceView === 'desktop' ? 'bg-[#333A48] text-[#D4AF37]' : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Desktop (100% Full Width)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceView === 'tablet' ? 'bg-[#333A48] text-[#D4AF37]' : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-lg transition-all ${
                deviceView === 'mobile' ? 'bg-[#333A48] text-[#D4AF37]' : 'text-[#8A99AD] hover:text-white'
              }`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Full Screen Toggle Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen || editorMode === 'click_to_edit'
                ? 'text-[#D4AF37] bg-[#333A48]'
                : 'text-[#8A99AD] hover:text-white hover:bg-[#1C2434]'
            }`}
            title={isFullscreen ? 'Tutup Layar Penuh' : 'Mode Layar Penuh (Full Screen)'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Export & Import Konten Lengkap */}
          <div className="hidden sm:flex items-center gap-1 bg-[#1C2434] p-1 rounded-xl border border-[#2E3A47]">
            <button
              onClick={handleExportContent}
              className="px-2.5 py-1 text-[#CBD5E1] hover:text-[#D4AF37] hover:bg-[#24303F] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download Template Seluruh Konten Web (.json)"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden xl:inline">Export</span>
            </button>
            <label
              className="px-2.5 py-1 text-[#CBD5E1] hover:text-emerald-400 hover:bg-[#24303F] rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Import File Konten Website (.json) untuk update instan tanpa coding"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden xl:inline">Import</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportContent}
              />
            </label>
          </div>

          {/* Reset to Default */}
          <button
            onClick={handleResetToDefault}
            className="p-2 text-[#8A99AD] hover:text-amber-400 hover:bg-[#1C2434] rounded-lg transition-colors"
            title="Reset Konten ke Template Bawaan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-[#1C2434] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
          >
            {isSaving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Simpan</span>
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="flex-grow flex h-full overflow-hidden">
        
        {/* LEFT PANEL: ELEMENTOR CONTROL SIDEBAR (W-96 / 420px) */}
        <aside className={`bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 overflow-hidden transition-all duration-300 ${
          editorMode === 'click_to_edit'
            ? 'w-0 sm:w-0 border-r-0 opacity-0 pointer-events-none'
            : 'w-full sm:w-96 md:w-[420px] opacity-100'
        }`}>
          
          {/* Main Tab Category Navigation */}
          <div className="p-2 border-b border-slate-800 grid grid-cols-4 gap-1 bg-slate-900/60">
            <button
              onClick={() => { setActiveTab('hero'); setActiveSection('hero-text'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'hero' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hero</span>
            </button>
            <button
              onClick={() => { setActiveTab('about'); setActiveSection('about-text'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'about' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tentang</span>
            </button>
            <button
              onClick={() => { setActiveTab('services'); setActiveSection('services-text'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'services' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Layanan</span>
            </button>
            <button
              onClick={() => { setActiveTab('retainer'); setActiveSection('retainer-text'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'retainer' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Retainer</span>
            </button>
            <button
              onClick={() => { setActiveTab('insights'); setActiveSection('insights-articles'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'insights' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Insight</span>
            </button>
            <button
              onClick={() => { setActiveTab('faq'); setActiveSection('faq-items'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'faq' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => { setActiveTab('global'); setActiveSection('global-contacts'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'global' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Kontak</span>
            </button>
            <button
              onClick={() => { setActiveTab('import_export' as any); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === ('import_export' as any) ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import/Export</span>
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-6 select-text custom-scrollbar">
            
            {/* TAB: HERO SECTION */}
            {activeTab === 'hero' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Hero Section (Layar Utama Atas)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit tulisan, background gambar, tombol, dan statistik di layar pertama.
                  </p>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Lencana Kecil (Badge Atas)
                  </label>
                  <input
                    type="text"
                    value={editorContent.hero.topBadge}
                    onChange={(e) => updateHero('topBadge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Headline Part 1 */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Judul Utama (Teks Putih)
                  </label>
                  <input
                    type="text"
                    value={editorContent.hero.headlinePart1}
                    onChange={(e) => updateHero('headlinePart1', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Headline Italic Gold */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Judul Utama (Teks Emas Miring)
                  </label>
                  <input
                    type="text"
                    value={editorContent.hero.headlineItalic}
                    onChange={(e) => updateHero('headlineItalic', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 text-xs focus:outline-none focus:border-amber-400 italic"
                  />
                </div>

                {/* Subheadline */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Paragraf Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={editorContent.hero.subheadline}
                    onChange={(e) => updateHero('subheadline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                {/* Background Image Upload / URL */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <label className="block text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>Background Foto Kantor</span>
                    <ImageIcon className="w-3.5 h-3.5" />
                  </label>
                  
                  {/* Current Image Preview */}
                  <div className="h-28 rounded-lg overflow-hidden border border-slate-700 relative group">
                    <img
                      src={editorContent.hero.bgImage}
                      alt="Hero Background Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] bg-slate-900 text-white px-2 py-1 rounded">Preview Gambar</span>
                    </div>
                  </div>

                  {/* Upload button */}
                  <div>
                    <label className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{uploadingField === 'hero-bg' ? 'Mengunggah...' : 'Pilih Foto dari Komputer/HP'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, (url) => updateHero('bgImage', url), 'hero-bg');
                        }}
                      />
                    </label>
                  </div>

                  {/* Manual URL Input */}
                  <div>
                    <span className="text-[10px] text-slate-400">Atau masukkan URL gambar CDN langsung:</span>
                    <input
                      type="text"
                      value={editorContent.hero.bgImage}
                      onChange={(e) => updateHero('bgImage', e.target.value)}
                      className="w-full px-3 py-1.5 mt-1 bg-slate-950 border border-slate-700 rounded text-slate-300 text-[11px] focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Tombol Tindakan (CTA)</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Teks Tombol 1</span>
                      <input
                        type="text"
                        value={editorContent.hero.ctaButton1Text}
                        onChange={(e) => updateHero('ctaButton1Text', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Link Tujuan 1</span>
                      <input
                        type="text"
                        value={editorContent.hero.ctaButton1Link}
                        onChange={(e) => updateHero('ctaButton1Link', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Teks Tombol 2</span>
                      <input
                        type="text"
                        value={editorContent.hero.ctaButton2Text}
                        onChange={(e) => updateHero('ctaButton2Text', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Link Tujuan 2</span>
                      <input
                        type="text"
                        value={editorContent.hero.ctaButton2Link}
                        onChange={(e) => updateHero('ctaButton2Link', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Pills */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">Pills / Label Keunggulan Bawah</span>
                    <button
                      onClick={() => {
                        const current = [...(editorContent.hero.featurePills || [])];
                        current.push('Keunggulan Baru');
                        updateHero('featurePills', current);
                      }}
                      className="text-[10px] px-2 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded flex items-center gap-1 hover:bg-amber-400/30"
                    >
                      <Plus className="w-3 h-3" /> Tambah
                    </button>
                  </div>
                  {editorContent.hero.featurePills.map((pill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pill}
                        onChange={(e) => {
                          const updated = [...editorContent.hero.featurePills];
                          updated[idx] = e.target.value;
                          updateHero('featurePills', updated);
                        }}
                        className="flex-grow px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => {
                          const updated = editorContent.hero.featurePills.filter((_, i) => i !== idx);
                          updateHero('featurePills', updated);
                        }}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                        title="Hapus Pill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Right Floating Seal Box */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Kotak Segel Kanan (Stats & Kutipan)</span>
                  <div>
                    <span className="text-[10px] text-slate-400">Kutipan Slogan</span>
                    <input
                      type="text"
                      value={editorContent.hero.sealQuote}
                      onChange={(e) => updateHero('sealQuote', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Deskripsi Singkat Segel</span>
                    <textarea
                      rows={2}
                      value={editorContent.hero.sealDescription}
                      onChange={(e) => updateHero('sealDescription', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400">Statistik 1 (Angka)</span>
                      <input
                        type="text"
                        value={editorContent.hero.stat1Number}
                        onChange={(e) => updateHero('stat1Number', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Label Statistik 1</span>
                      <input
                        type="text"
                        value={editorContent.hero.stat1Label}
                        onChange={(e) => updateHero('stat1Label', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Statistik 2 (Angka)</span>
                      <input
                        type="text"
                        value={editorContent.hero.stat2Number}
                        onChange={(e) => updateHero('stat2Number', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Label Statistik 2</span>
                      <input
                        type="text"
                        value={editorContent.hero.stat2Label}
                        onChange={(e) => updateHero('stat2Label', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ABOUT SECTION */}
            {activeTab === 'about' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Bagian Tentang Kami (Profil)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit cerita korporasi, nilai inti, dan foto profil konsultan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lencana</label>
                  <input
                    type="text"
                    value={editorContent.about.badge}
                    onChange={(e) => updateAbout('badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Utama</label>
                  <input
                    type="text"
                    value={editorContent.about.title}
                    onChange={(e) => updateAbout('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Paragraf 1</label>
                  <textarea
                    rows={3}
                    value={editorContent.about.paragraph1}
                    onChange={(e) => updateAbout('paragraph1', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Paragraf 2</label>
                  <textarea
                    rows={3}
                    value={editorContent.about.paragraph2}
                    onChange={(e) => updateAbout('paragraph2', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Kolase Foto */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Foto Kolase 1 (Gedung &amp; Kantor)</span>
                  <div className="h-24 rounded-lg overflow-hidden border border-slate-700">
                    <img src={editorContent.about.image1} alt="Preview 1" className="w-full h-full object-cover" />
                  </div>
                  <label className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Foto 1</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => updateAbout('image1', url), 'about-1');
                      }}
                    />
                  </label>
                </div>

                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Foto Kolase 2 (Kerja Sama Korporasi)</span>
                  <div className="h-24 rounded-lg overflow-hidden border border-slate-700">
                    <img src={editorContent.about.image2} alt="Preview 2" className="w-full h-full object-cover" />
                  </div>
                  <label className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Foto 2</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => updateAbout('image2', url), 'about-2');
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: SERVICES SECTION */}
            {activeTab === 'services' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>5 Pilar Layanan Konsultan</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit lencana, judul utama direktori, dan teks banner konsultasi layanan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lencana / Badge</label>
                  <input
                    type="text"
                    value={editorContent.services?.badge || ''}
                    onChange={(e) => updateServices('badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Utama Layanan</label>
                  <input
                    type="text"
                    value={editorContent.services?.title || ''}
                    onChange={(e) => updateServices('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subjudul / Deskripsi</label>
                  <textarea
                    rows={2}
                    value={editorContent.services?.subtitle || ''}
                    onChange={(e) => updateServices('subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Banner Direktori Bawah</span>
                  <div>
                    <span className="text-[10px] text-slate-400">Judul Banner</span>
                    <input
                      type="text"
                      value={editorContent.services?.ctaBannerTitle || ''}
                      onChange={(e) => updateServices('ctaBannerTitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Deskripsi Banner</span>
                    <textarea
                      rows={2}
                      value={editorContent.services?.ctaBannerSubtitle || ''}
                      onChange={(e) => updateServices('ctaBannerSubtitle', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Teks Tombol Banner</span>
                    <input
                      type="text"
                      value={editorContent.services?.ctaBannerButtonText || ''}
                      onChange={(e) => updateServices('ctaBannerButtonText', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RETAINER SECTION */}
            {activeTab === 'retainer' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Corporate Retainer Program</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit penawaran retainer korporasi untuk pendampingan konsultan bulanan perusahaan.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lencana / Badge</label>
                  <input
                    type="text"
                    value={editorContent.retainer?.badge || ''}
                    onChange={(e) => updateRetainer('badge', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Judul Utama</label>
                  <input
                    type="text"
                    value={editorContent.retainer?.title || ''}
                    onChange={(e) => updateRetainer('title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deskripsi / Penjelasan Retainer</label>
                  <textarea
                    rows={4}
                    value={editorContent.retainer?.subtitle || ''}
                    onChange={(e) => updateRetainer('subtitle', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB: INSIGHT ARTICLES */}
            {activeTab === 'insights' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Publikasi Artikel Insight</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Kelola artikel insight dan publikasi regulasi di website.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...editorContent.insights.articles];
                      updated.unshift({
                        id: String(Date.now()),
                        title: 'Judul Artikel Baru',
                        tag: 'Regulasi Bisnis',
                        date: 'Hari Ini',
                        readTime: '5 min',
                        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
                        excerpt: 'Ringkasan artikel korporasi...',
                      });
                      updateInsights('articles', updated);
                    }}
                    className="px-2.5 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs flex items-center gap-1 hover:bg-amber-400/30 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Artikel
                  </button>
                </div>

                {editorContent.insights.articles.map((art, idx) => (
                  <div key={art.id || idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">Artikel #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = editorContent.insights.articles.filter((_, i) => i !== idx);
                          updateInsights('articles', updated);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-24 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <label className="block py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-center text-slate-200 cursor-pointer">
                          <span>Ganti Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  const updated = [...editorContent.insights.articles];
                                  updated[idx].image = url;
                                  updateInsights('articles', updated);
                                }, `art-${idx}`);
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={art.tag}
                          onChange={(e) => {
                            const updated = [...editorContent.insights.articles];
                            updated[idx].tag = e.target.value;
                            updateInsights('articles', updated);
                          }}
                          placeholder="Tag / Kategori"
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-amber-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Judul Artikel</span>
                      <input
                        type="text"
                        value={art.title}
                        onChange={(e) => {
                          const updated = [...editorContent.insights.articles];
                          updated[idx].title = e.target.value;
                          updateInsights('articles', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Ringkasan (Excerpt)</span>
                      <textarea
                        rows={2}
                        value={art.excerpt}
                        onChange={(e) => {
                          const updated = [...editorContent.insights.articles];
                          updated[idx].excerpt = e.target.value;
                          updateInsights('articles', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>FAQ (Pertanyaan Umum)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Kelola pertanyaan &amp; jawaban seputar layanan.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...editorContent.faq.items];
                      updated.push({
                        question: 'Pertanyaan Baru?',
                        answer: 'Jawaban detail pertanyaan...',
                      });
                      updateFaq('items', updated);
                    }}
                    className="px-2.5 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs flex items-center gap-1 hover:bg-amber-400/30 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah FAQ
                  </button>
                </div>

                {editorContent.faq.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">FAQ #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = editorContent.faq.items.filter((_, i) => i !== idx);
                          updateFaq('items', updated);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Pertanyaan</span>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => {
                          const updated = [...editorContent.faq.items];
                          updated[idx].question = e.target.value;
                          updateFaq('items', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Jawaban</span>
                      <textarea
                        rows={3}
                        value={item.answer}
                        onChange={(e) => {
                          const updated = [...editorContent.faq.items];
                          updated[idx].answer = e.target.value;
                          updateFaq('items', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: GLOBAL & CONTACT */}
            {activeTab === 'global' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Kontak, WhatsApp &amp; Identitas</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Kelola nomor telepon, WA floating, email, dan alamat kantor.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Brand Firma</label>
                  <input
                    type="text"
                    value={editorContent.global.brandName}
                    onChange={(e) => updateGlobal('brandName', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline Brand</label>
                  <input
                    type="text"
                    value={editorContent.global.brandTagline}
                    onChange={(e) => updateGlobal('brandTagline', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 text-xs focus:outline-none focus:border-amber-400 uppercase tracking-wider"
                  />
                </div>

                {/* Logo Brand Uploader */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Logo Brand Resmi (Navbar, Footer, Admin)</span>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white p-1 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-md">
                      <img
                        src={editorContent.global.logo || '/logo-seleco.png'}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Ganti Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(
                                file,
                                (url) => updateGlobal('logo' as any, url),
                                'global.logo'
                              );
                            }
                          }}
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">Format PNG/JPEG/SVG. Otomatis dikompres & diterapkan secara langsung.</p>
                    </div>
                  </div>
                </div>

                {/* Global Key Stats & Numbers */}
                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">Statistik Layanan Global Website</span>
                  <div>
                    <span className="text-[10px] text-slate-400">Total Layanan &amp; Perizinan (Otomatis sinkron ke Hero, Layanan, Footer, &amp; Direktori)</span>
                    <input
                      type="text"
                      value={editorContent.global.totalServices || editorContent.hero?.stat2Number || '445+'}
                      onChange={(e) => updateGlobal('totalServices', e.target.value)}
                      placeholder="445+ atau 400+"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Layanan SDM &amp; Korporasi</span>
                      <input
                        type="text"
                        value={editorContent.global.litigationCount || '34'}
                        onChange={(e) => updateGlobal('litigationCount', e.target.value)}
                        placeholder="34"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Perizinan OSS RBA</span>
                      <input
                        type="text"
                        value={editorContent.global.ossLicenseCount || '411+'}
                        onChange={(e) => updateGlobal('ossLicenseCount', e.target.value)}
                        placeholder="411+"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-amber-300 block">WhatsApp Resmi (Floating Button &amp; CTA)</span>
                  <div>
                    <span className="text-[10px] text-slate-400">Nomor WhatsApp Teknis (Awali dengan kode negara 62)</span>
                    <input
                      type="text"
                      value={editorContent.global.whatsappNumber}
                      onChange={(e) => updateGlobal('whatsappNumber', e.target.value)}
                      placeholder="6282211020022"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-green-400 font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Tampilan Nomor di Website</span>
                    <input
                      type="text"
                      value={editorContent.global.whatsappDisplay}
                      onChange={(e) => updateGlobal('whatsappDisplay', e.target.value)}
                      placeholder="0822-1102-0022"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Kantor</label>
                  <input
                    type="email"
                    value={editorContent.global.email}
                    onChange={(e) => updateGlobal('email', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Kantor Utama</label>
                  <textarea
                    rows={2}
                    value={editorContent.global.address}
                    onChange={(e) => updateGlobal('address', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teks Hak Cipta Footer</label>
                  <input
                    type="text"
                    value={editorContent.footer.copyright}
                    onChange={(e) => updateFooter('copyright', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* TAB: IMPORT & EXPORT KONTEN LENGKAP */}
            {(activeTab as string) === 'import_export' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-emerald-400" />
                    <span>Import &amp; Export Konten Lengkap</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Kelola seluruh tulisan, teks header, isi bagian, nomor telepon, dan link website dalam satu file JSON tanpa perlu menyentuh kode program.
                  </p>
                </div>

                {/* Card Export */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                    <Download className="w-4 h-4" />
                    <span>1. Download Template / Backup Konten</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Download seluruh data website saat ini menjadi 1 file <strong className="text-white font-mono">seleco-konten-lengkap.json</strong>. Anda dapat mengedit teksnya dengan mudah menggunakan Microsoft Word, Notepad, VS Code, atau Text Editor lainnya.
                  </p>
                  <button
                    onClick={handleExportContent}
                    className="w-full py-2.5 px-4 bg-[#1C2434] hover:bg-[#24303F] border border-[#2E3A47] hover:border-[#D4AF37]/60 text-[#D4AF37] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File Template (.json)</span>
                  </button>
                </div>

                {/* Card Import */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <UploadCloud className="w-4 h-4" />
                    <span>2. Unggah &amp; Terapkan Konten (Import)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pilih file JSON yang sudah Anda edit isinya. Seluruh teks mulai dari header, subjudul, direktori, FAQ, tentang kami, hingga kontak akan otomatis langsung terisi dan diperbarui di website.
                  </p>
                  <label className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <UploadCloud className="w-4 h-4" />
                    <span>Pilih &amp; Import File Konten (.json)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleImportContent}
                    />
                  </label>
                </div>

                {/* Petunjuk Penggunaan Seperti Word */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-2.5 text-xs text-slate-400">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                    💡 Cara Pengisian Sangat Mudah:
                  </span>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Download file dengan klik tombol <strong>"Download File Template"</strong> di atas.</li>
                    <li>Buka file tersebut dengan Text Editor / Word. Anda akan melihat bagian-bagian teks yang sangat jelas seperti <code className="text-amber-300 font-mono">"title"</code>, <code className="text-amber-300 font-mono">"subtitle"</code>, <code className="text-amber-300 font-mono">"description"</code>.</li>
                    <li>Ganti tulisan di dalam tanda kutip sesuai konten baru yang Anda inginkan.</li>
                    <li>Simpan file, lalu klik <strong>"Pilih &amp; Import File Konten"</strong>. Website akan seketika terisi otomatis!</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Bottom Quick Save */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Status: Siap disimpan</span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>
          </div>

        </aside>

        {/* RIGHT PANEL: LIVE RESPONSIVE CANVAS PREVIEW (AUTHENTIC IFRAME VIEWPORT) */}
        <main className={`flex-grow bg-[#1A222C] flex flex-col items-center justify-center overflow-hidden relative transition-all duration-300 ${
          deviceView === 'desktop' ? 'p-0' : 'p-2 sm:p-4 md:p-6'
        }`}>
          
          {/* Viewport Dimension & Mode Info Badge */}
          <div className="absolute top-2 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {editorMode === 'click_to_edit' ? (
              <div className="flex items-center gap-2 text-xs bg-amber-400 text-slate-950 font-bold px-3.5 py-1 rounded-full shadow-lg pointer-events-auto opacity-95">
                <MousePointerClick className="w-3.5 h-3.5" />
                <span>Mode Visual: Klik teks/tombol untuk mengedit. Navigasi link dinonaktifkan.</span>
              </div>
            ) : null}

            {deviceView !== 'desktop' && (
              <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800 shadow-md">
                <span>Resolusi Layar:</span>
                <span className="font-mono text-amber-300 font-semibold">
                  {deviceView === 'tablet' ? '768px (Tablet)' : '375px (Mobile)'}
                </span>
              </div>
            )}
          </div>

          {/* Device Mockup Frame */}
          <div 
            className={`transition-all duration-300 relative flex flex-col items-center justify-center ${
              deviceView === 'desktop'
                ? 'w-full h-full max-w-full rounded-none border-0 bg-white overflow-hidden'
                : deviceView === 'tablet'
                ? 'w-[768px] max-w-full h-full max-h-[92vh] bg-slate-900 p-3 rounded-[36px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-800 flex flex-col items-center'
                : 'w-[375px] max-w-full h-full max-h-[92vh] bg-slate-900 p-2.5 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-800 flex flex-col items-center'
            }`}
          >
            {/* Tablet Camera Mockup */}
            {deviceView === 'tablet' && (
              <div className="w-full flex items-center justify-center pb-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                </div>
              </div>
            )}

            {/* Mobile Dynamic Island / Camera Mockup */}
            {deviceView === 'mobile' && (
              <div className="w-full flex items-center justify-center pb-2 shrink-0">
                <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 shadow-inner border border-slate-800/50">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </div>
              </div>
            )}

            {/* Genuine Responsive Iframe */}
            <div className={`w-full h-full overflow-hidden flex-grow relative bg-white ${
              deviceView === 'desktop' ? 'rounded-none' : 'rounded-xl'
            }`}>
              <iframe
                ref={iframeRef}
                src="/admin/preview"
                title="SELECO Live Responsive Preview"
                onLoad={() => {
                  setIframeLoaded(true);
                  sendContentToIframe(editorContent);
                }}
                className="w-full h-full bg-white border-0"
              />
            </div>

            {/* Mobile Home Indicator Bar Mockup */}
            {deviceView === 'mobile' && (
              <div className="w-full flex items-center justify-center pt-2 shrink-0">
                <div className="w-28 h-1 bg-slate-700 rounded-full" />
              </div>
            )}
          </div>

        </main>

      </div>

      {/* TOAST NOTIFICATION */}
      {saveToast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl border transition-all animate-bounce ${
          saveToast.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
            : 'bg-red-950/90 text-red-300 border-red-500/40'
        }`}>
          {saveToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{saveToast.message}</span>
        </div>
      )}

    </TailAdminLayout>
  );
}
