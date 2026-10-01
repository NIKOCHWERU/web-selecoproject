'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  FileText, 
  Users, 
  ExternalLink, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  LogOut, 
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Eye,
  Sliders,
  PlaySquare,
  Newspaper,
  Edit3
} from 'lucide-react';

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Site Mode state (Live vs Maintenance)
  const [siteMode, setSiteMode] = useState<'maintenance' | 'live'>('maintenance');
  const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Quick stats
  const [articleCount, setArticleCount] = useState<number>(0);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    // Check authentication
    const auth = sessionStorage.getItem('seleco_admin_auth') || sessionStorage.getItem('seleco_admin_auth_editor');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);

    // Fetch site mode & stats
    fetchSiteStatus();
  }, []);

  const fetchSiteStatus = async () => {
    try {
      const [contentRes, articlesRes] = await Promise.all([
        fetch('/api/admin/content', { cache: 'no-store' }),
        fetch('/api/admin/articles', { cache: 'no-store' })
      ]);

      if (contentRes.ok) {
        const data = await contentRes.json();
        if (data.content?.siteMode?.status) {
          setSiteMode(data.content.siteMode.status);
        }
      }

      if (articlesRes.ok) {
        const artData = await articlesRes.json();
        if (artData.articles) {
          setArticleCount(artData.articles.length);
        }
      }
    } catch (e) {
      console.error('Failed to load admin stats:', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Set all module sessions so user never has to re-login across dashboards
        sessionStorage.setItem('seleco_admin_auth', 'true');
        sessionStorage.setItem('seleco_admin_auth_editor', 'true');
        sessionStorage.setItem('seleco_admin_auth_articles', 'true');
        sessionStorage.setItem('seleco_admin_auth_users', 'true');
        if (data.user) {
          sessionStorage.setItem('seleco_admin_user', JSON.stringify(data.user));
        }
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Username atau password salah');
      }
    } catch (err) {
      setAuthError('Gagal terhubung ke server autentikasi');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('seleco_admin_auth');
    sessionStorage.removeItem('seleco_admin_auth_editor');
    sessionStorage.removeItem('seleco_admin_auth_articles');
    sessionStorage.removeItem('seleco_admin_auth_users');
    sessionStorage.removeItem('seleco_admin_user');
    setIsAuthenticated(false);
  };

  const handleToggleMode = async (mode: 'maintenance' | 'live') => {
    setIsSwitchingMode(true);
    try {
      const res = await fetch('/api/admin/content', { cache: 'no-store' });
      const data = await res.json();
      const currentContent = data.content || {};

      const updated = {
        ...currentContent,
        siteMode: {
          ...(currentContent.siteMode || {}),
          status: mode,
        },
      };

      const saveRes = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: updated }),
      });

      if (saveRes.ok) {
        setSiteMode(mode);
        try {
          localStorage.setItem('seleco_site_content', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('seleco_content_updated', { detail: updated }));
        } catch (e) {}

        showToast(
          mode === 'maintenance'
            ? 'Status: Website dalam Mode Pengembangan'
            : 'Status: Website TAYANG (LIVE) untuk publik & Google!',
          'success'
        );
      } else {
        showToast('Gagal mengubah status website', 'error');
      }
    } catch (e) {
      showToast('Terjadi kesalahan jaringan', 'error');
    } finally {
      setIsSwitchingMode(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a1420] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#dfa82e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── 1. LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070e17] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0f2034] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#dfa82e]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-[#dfa82e]/40 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <img
                src="/logo-seleco.png"
                alt="Seleco Project"
                style={{ maxWidth: '52px', maxHeight: '52px', width: 'auto', height: 'auto' }}
                className="object-contain"
              />
            </div>
            <h1 className="font-serif-title text-2xl font-bold text-white tracking-wide">
              SELECO Admin Hub
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#dfa82e] font-semibold mt-1">
              Sedana Legal Consultant
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Masuk untuk mengelola Editor Web dan Portal Artikel
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 bg-[#0a1420] border border-white/15 focus:border-[#dfa82e] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#dfa82e] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-[#0a1420] border border-white/15 focus:border-[#dfa82e] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#dfa82e] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-[#0a1420] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#dfa82e]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuthenticating ? (
                <div className="w-4 h-4 border-2 border-[#0a1420] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-[11px] text-slate-400">
            Akses internal khusus tim konsultan dan editor SELECO.
          </div>
        </div>
      </div>
    );
  }

  // ── 2. ADMIN COMMAND CENTER (2 DASHBOARD TERPISAH) ───────────────────────────
  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col justify-between">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar Header */}
      <header className="h-20 bg-[#0f2034] border-b border-white/10 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-[#dfa82e]/40 flex items-center justify-center shrink-0 shadow-md">
            <img
              src="/logo-seleco.png"
              alt="Seleco"
              style={{ maxWidth: '34px', maxHeight: '34px', width: 'auto', height: 'auto' }}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif-title text-lg sm:text-xl font-bold text-white tracking-wider leading-tight">
              SELECO <span className="text-[#dfa82e]">Command Center</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Pusat Manajemen Web &amp; Portal Artikel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#dfa82e]" />
            <span>Lihat Web Publik</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full flex-grow">
        
        {/* Welcome & Site Status Strip */}
        <div className="mb-10 bg-[#0f2034]/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dfa82e]/10 border border-[#dfa82e]/30 text-xs font-bold text-[#dfa82e] mb-2 uppercase tracking-widest">
              Portal Terpadu
            </div>
            <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              Selamat Datang di Admin SELECO
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Silakan pilih dashboard yang ingin Anda kelola di bawah ini: <strong>Visual Builder Web</strong> untuk tata letak halaman, atau <strong>Dashboard Artikel</strong> untuk penulisan berita.
            </p>
          </div>

          {/* Site Mode Switcher */}
          <div className="bg-[#0a1420] border border-white/15 rounded-2xl p-4 flex flex-col gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#dfa82e]" /> Status Akses Website:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleMode('maintenance')}
                disabled={isSwitchingMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  siteMode === 'maintenance'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                Dev Mode
              </button>
              <button
                onClick={() => handleToggleMode('live')}
                disabled={isSwitchingMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  siteMode === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                Live (Tayang)
              </button>
            </div>
          </div>
        </div>

        {/* ── 2 MAJOR DEDICATED DASHBOARDS ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* DASHBOARD 1: EDIT WEB (VISUAL BUILDER ALA ELEMENTOR) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0f2034] to-[#0c1a2b] border border-white/15 hover:border-[#dfa82e]/50 p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#dfa82e]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#dfa82e]/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#dfa82e]/15 border border-[#dfa82e]/30 flex items-center justify-center text-[#dfa82e] group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-[#dfa82e]">
                  Visual Builder WYSIWYG
                </span>
              </div>

              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white group-hover:text-[#dfa82e] transition-colors mb-3">
                1. Editor Web (Ala Elementor)
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Editor visual langsung seperti Elementor di WordPress. Sangat mudah digunakan oleh orang awam: klik teks langsung ganti, ubah video latar belakang ruang kantor di hero, ganti foto dokumen/kantor, ubah 5 pilar layanan, nomor kontak &amp; WhatsApp.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2.5 mb-8 border-t border-white/10 pt-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfa82e] shrink-0" />
                  <span><strong>Visual Live Preview:</strong> Tampilan langsung Desktop, Tablet, dan Mobile.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfa82e] shrink-0" />
                  <span><strong>Ganti Video Latar:</strong> Ubah link video kantor &amp; atur tingkat kegelapan.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfa82e] shrink-0" />
                  <span><strong>Edit 5 Pilar:</strong> Ubah nama layanan, deskripsi, dan badge jumlah item.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#dfa82e] shrink-0" />
                  <span><strong>1-Click Publish:</strong> Sekali klik simpan, perubahan langsung aktif di web.</span>
                </div>
              </div>
            </div>

            {/* Direct Entry Button */}
            <Link
              href="/admin/editor"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#dfa82e] to-[#b88917] hover:brightness-110 text-[#0a1420] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#dfa82e]/20 transition-all flex items-center justify-center gap-3 group-hover:gap-4"
            >
              <span>Buka Editor Web (Visual Builder)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* DASHBOARD 2: EDIT ARTIKEL (PORTAL BERITA & KONTEN) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#0f2034] to-[#0c1a2b] border border-white/15 hover:border-emerald-500/50 p-8 sm:p-10 shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
            {/* Top Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Newspaper className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 text-emerald-400">
                  Newsroom Portal Berita
                </span>
              </div>

              <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                2. Dashboard Artikel (Portal Berita)
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Dashboard khusus editorial berita dan insight hukum/bisnis. Tulis artikel baru dengan Gutenberg block editor, unggah thumbnail berita, kategorikan ke Perizinan, Imigrasi, Pajak, Pertanahan, atau SDM, serta kelola draft dan terbitan.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-2.5 mb-8 border-t border-white/10 pt-6 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Newsroom Layout:</strong> Tabel berita lengkap dengan status, tanggal, &amp; penulis.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Gutenberg Block Editor:</strong> Penulisan paragraf, heading, kutipan, dan gambar.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Kategori 5 Pilar:</strong> Klasifikasi perizinan, imigrasi, pajak, pertanahan, &amp; SDM.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Total Terdata:</strong> Saat ini ada <strong>{articleCount} artikel</strong> tersimpan di sistem.</span>
                </div>
              </div>
            </div>

            {/* Direct Entry Button */}
            <Link
              href="/admin/articles"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 group-hover:gap-4"
            >
              <span>Buka Dashboard Artikel &amp; Berita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* ── SECONDARY CARD: USER MANAGEMENT ─────────────────────────────────── */}
        <div className="rounded-2xl bg-[#0f2034]/60 border border-white/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Kelola Pengguna &amp; Hak Akses Admin</h4>
              <p className="text-xs text-slate-400">Atur akun administrator, ganti password login, atau tambah editor baru.</p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all whitespace-nowrap"
          >
            Buka Kelola Pengguna →
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-4 text-center text-xs text-slate-500 bg-[#070e17]">
        SELECO (Sedana Legal Consultant) © 2026. Portal Administrasi Website &amp; Editorial Insight.
      </footer>
    </div>
  );
}
