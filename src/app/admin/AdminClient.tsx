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
  ShieldCheck
} from 'lucide-react';
import { SiteContent, defaultSiteContent } from '@/data/defaultSiteContent';
import { ContentContext, useContent } from '@/context/ContentContext';

// Import public components for real-time live preview inside the editor
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RetainerSection from '@/components/RetainerSection';
import TeamSection from '@/components/TeamSection';
import InsightsSection from '@/components/InsightsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Content state inside builder
  const [editorContent, setEditorContent] = useState<SiteContent>(defaultSiteContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'retainer' | 'team' | 'insights' | 'faq' | 'global'>('hero');
  const [activeSection, setActiveSection] = useState<string>('hero-text');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Check auth session on load
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('seleco_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
      fetchCurrentContent();
    }
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('seleco_admin_auth', 'true');
        setIsAuthenticated(true);
        fetchCurrentContent();
      } else {
        setAuthError(data.error || 'Password salah!');
      }
    } catch (err: any) {
      setAuthError('Gagal terhubung ke server.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('seleco_admin_auth');
    setIsAuthenticated(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
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
      triggerToast('Konten dikembalikan ke default. Klik "Simpan" jika ingin menerapkannya ke website.', 'success');
    }
  };

  const triggerToast = (message: string, type: 'success' | 'error') => {
    setSaveToast({ show: true, message, type });
    setTimeout(() => {
      setSaveToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Image Upload Handler
  const handleFileUpload = async (file: File, onUploaded: (url: string) => void, fieldKey: string) => {
    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        onUploaded(data.url);
        triggerToast('Gambar berhasil diunggah!', 'success');
      } else {
        alert(data.error || 'Gagal mengunggah gambar');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat upload gambar');
    } finally {
      setUploadingField(null);
    }
  };

  // Helper update functions
  const updateGlobal = (key: keyof SiteContent['global'], value: string) => {
    setEditorContent((prev) => ({
      ...prev,
      global: { ...prev.global, [key]: value },
    }));
  };

  const updateHero = (key: keyof SiteContent['hero'], value: any) => {
    setEditorContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
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

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[999] bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-slate-900 border border-amber-400/30 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl relative z-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-inner">
              <Scale className="w-8 h-8" />
            </div>
            <h1 className="font-serif-title text-3xl font-bold text-white tracking-wide">
              SELECO Visual Builder
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              Panel Pengelola Konten Website
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password Admin
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  autoFocus
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                *Default: <code className="text-amber-300/80 bg-slate-950 px-1.5 py-0.5 rounded">seleco2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-gold flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Buka Panel Editor</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ELEMENTOR BUILDER INTERFACE
  return (
    <div className="fixed inset-0 z-[999] h-screen w-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden select-none">
      
      {/* TOP HEADER / TOOLBAR */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-40 shrink-0">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif-title text-base font-bold text-white tracking-wider">SELECO</span>
              <span className="text-[10px] text-amber-400 uppercase font-bold ml-1.5 px-1.5 py-0.5 bg-amber-400/10 rounded">Builder</span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Quick External Preview */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>Buka Website Asli</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Center: Device Switcher */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceView === 'desktop'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceView === 'tablet'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              deviceView === 'mobile'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset ke Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            {isSaving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* BODY: DUAL PANEL (SIDEBAR + LIVE PREVIEW) */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* LEFT PANEL: ELEMENTOR CONTROL SIDEBAR (W-96 / 384px) */}
        <aside className="w-full sm:w-96 md:w-[420px] bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 z-30 overflow-hidden">
          
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
              onClick={() => { setActiveTab('team'); setActiveSection('team-members'); }}
              className={`px-1.5 py-1.5 rounded-lg text-[11px] font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                activeTab === 'team' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Tim</span>
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
                    Edit cerita firma, nilai inti, dan foto kolase hukum.
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
                  <span className="text-xs font-bold text-amber-300 block">Foto Kolase 1 (Patung Keadilan)</span>
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
                  <span className="text-xs font-bold text-amber-300 block">Foto Kolase 2 (Palu Sidang)</span>
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
                    <span>Layanan &amp; Spesialisasi Hukum</span>
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
                    <span>Corporate Legal Retainer</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Edit penawaran retainer korporasi untuk proteksi hukum bulanan perusahaan.
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

            {/* TAB: TEAM MEMBERS */}
            {activeTab === 'team' && (
              <div className="space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Tim Advokat &amp; Konsultan</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Kelola profil advokat dan partner firma.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...editorContent.team.members];
                      updated.push({
                        id: String(Date.now()),
                        name: 'Nama Advokat, S.H.',
                        role: 'Legal Consultant',
                        specialization: 'Spesialisasi Hukum',
                        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
                        bio: 'Profil singkat advokat...',
                      });
                      updateTeam('members', updated);
                    }}
                    className="px-2.5 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-lg text-xs flex items-center gap-1 hover:bg-amber-400/30 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah
                  </button>
                </div>

                {editorContent.team.members.map((member, idx) => (
                  <div key={member.id || idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">Advokat #{idx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = editorContent.team.members.filter((_, i) => i !== idx);
                          updateTeam('members', updated);
                        }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Hapus Advokat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const updated = [...editorContent.team.members];
                            updated[idx].name = e.target.value;
                            updateTeam('members', updated);
                          }}
                          placeholder="Nama lengkap + gelar"
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => {
                            const updated = [...editorContent.team.members];
                            updated[idx].role = e.target.value;
                            updateTeam('members', updated);
                          }}
                          placeholder="Jabatan (e.g. Managing Partner)"
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                        <label className="block py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-center text-slate-200 cursor-pointer">
                          <span>Ganti Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  const updated = [...editorContent.team.members];
                                  updated[idx].image = url;
                                  updateTeam('members', updated);
                                }, `team-${idx}`);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400">Bidang Fokus / Spesialisasi</span>
                      <textarea
                        rows={2}
                        value={member.specialization || member.bio}
                        onChange={(e) => {
                          const updated = [...editorContent.team.members];
                          updated[idx].specialization = e.target.value;
                          updateTeam('members', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
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
                    <p className="text-xs text-slate-400 mt-1">Kelola artikel editorial hukum di website.</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = [...editorContent.insights.articles];
                      updated.unshift({
                        id: String(Date.now()),
                        title: 'Judul Artikel Baru',
                        tag: 'Hukum Bisnis',
                        date: 'Hari Ini',
                        readTime: '5 min',
                        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
                        excerpt: 'Ringkasan artikel hukum...',
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

        {/* RIGHT PANEL: LIVE RESPONSIVE CANVAS PREVIEW */}
        <main className="flex-grow bg-slate-950/90 flex flex-col items-center justify-start overflow-hidden p-4 sm:p-6">
          
          {/* Canvas Wrapper */}
          <div 
            className={`h-full bg-white text-slate-900 rounded-2xl shadow-2xl overflow-y-auto transition-all duration-300 border border-slate-800/80 relative custom-scrollbar ${
              deviceView === 'desktop'
                ? 'w-full max-w-full'
                : deviceView === 'tablet'
                ? 'w-[768px] max-w-full border-8 border-slate-800 rounded-[32px]'
                : 'w-[375px] max-w-full border-[10px] border-slate-800 rounded-[40px]'
            }`}
          >
            {/* Real-Time Live Render with Direct ContentContext.Provider */}
            <ContentContext.Provider
              value={{
                content: editorContent,
                setContent: setEditorContent,
                updateSection: (section, data) =>
                  setEditorContent((prev) => ({
                    ...prev,
                    [section]: {
                      ...prev[section],
                      ...data,
                    },
                  })),
                saveToServer: async () => {
                  await handleSave();
                  return { success: true };
                },
                reloadContent: fetchCurrentContent,
                isLoading: false,
              }}
            >
              <div className="pointer-events-auto">
                <Navbar />
                <Hero />
                <AboutSection showMoreLink={true} />
                <ServicesSection />
                <RetainerSection />
                <TeamSection />
                <InsightsSection />
                <FAQSection />
                <ContactSection />
                <Footer />
              </div>
            </ContentContext.Provider>
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

    </div>
  );
}
