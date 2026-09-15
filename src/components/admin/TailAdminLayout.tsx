'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Globe,
  FileText,
  Users,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  Settings,
  Radio,
  Sliders
} from 'lucide-react';

interface TailAdminLayoutProps {
  children: React.ReactNode;
  activeNav: 'editor' | 'articles' | 'users';
  title?: string;
  subtitle?: string;
  headerActions?: React.ReactNode;
  siteMode?: 'maintenance' | 'live';
  onSiteModeChange?: (mode: 'maintenance' | 'live') => void;
  fullHeight?: boolean;
  hideSidebar?: boolean;
  onToggleHideSidebar?: () => void;
}

export default function TailAdminLayout({
  children,
  activeNav,
  title,
  subtitle,
  headerActions,
  siteMode: propSiteMode,
  onSiteModeChange,
  fullHeight = false,
  hideSidebar = false,
  onToggleHideSidebar,
}: TailAdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ id?: string; username: string; name: string; role: string } | null>(null);

  // Login Form State
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Sidebar & Layout State
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  // Site Mode State
  const [currentSiteMode, setCurrentSiteMode] = useState<'maintenance' | 'live'>('maintenance');
  const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check auth and initial siteMode
  useEffect(() => {
    const auth = sessionStorage.getItem('seleco_admin_auth');
    const storedUser = sessionStorage.getItem('seleco_admin_user');
    if (auth === 'true') {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    }
    setCheckingAuth(false);

    // Fetch siteMode if not provided as prop
    fetch('/api/admin/content', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.siteMode?.status) {
          setCurrentSiteMode(data.content.siteMode.status);
        }
      })
      .catch(() => {});
  }, []);

  // Sync propSiteMode if passed from parent
  useEffect(() => {
    if (propSiteMode) {
      setCurrentSiteMode(propSiteMode);
    }
  }, [propSiteMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('seleco_admin_auth', 'true');
        if (data.user) {
          sessionStorage.setItem('seleco_admin_user', JSON.stringify(data.user));
          setCurrentUser(data.user);
        }
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Username atau Password salah!');
      }
    } catch (err) {
      setAuthError('Gagal terhubung ke server autentikasi.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('seleco_admin_auth');
    sessionStorage.removeItem('seleco_admin_user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleToggleMode = async (mode: 'maintenance' | 'live') => {
    if (onSiteModeChange) {
      onSiteModeChange(mode);
      setCurrentSiteMode(mode);
      return;
    }

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
        setCurrentSiteMode(mode);
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

  // Loading screen while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#1A222C] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  // TailAdmin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1A222C] text-[#DEE4EE] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#24303F] border border-[#2E3A47] rounded-2xl shadow-2xl p-8">
          {/* Logo & Brand */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C9A227] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
              <ShieldCheck className="w-8 h-8 text-[#1C2434]" />
            </div>
            <h1 className="font-serif-title text-2xl font-bold text-white tracking-wide">
              Seleco
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
              Sedana legal consultant
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-[#1C2434] border border-[#2E3A47] rounded-full text-[11px] text-[#8A99AD]">
              TailAdmin Control Portal
            </div>
          </div>

          {authError && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-2">
                Username Admin
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 bg-[#1C2434] border border-[#2E3A47] rounded-xl text-white placeholder-[#8A99AD] text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  autoFocus
                  required
                />
                <Users className="w-4 h-4 text-[#8A99AD] absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8A99AD] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-3 bg-[#1C2434] border border-[#2E3A47] rounded-xl text-white placeholder-[#8A99AD] text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-[#8A99AD] absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <div className="mt-2 p-2.5 bg-[#1C2434]/80 rounded-lg border border-[#2E3A47] text-[11px] text-[#8A99AD] leading-relaxed">
                <span>Default Akun: </span>
                <span className="text-[#D4AF37] font-mono">admin</span> / <span className="text-[#D4AF37] font-mono">admin</span> (atau <span className="text-[#D4AF37] font-mono">seleco2026</span>)
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C9A227] hover:brightness-110 text-[#1C2434] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 mt-2"
            >
              {isAuthenticating ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Masuk TailAdmin Portal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    {
      id: 'editor',
      title: 'Editor Web',
      subtitle: 'Visual Builder & Konten',
      href: '/admin',
      icon: LayoutGrid,
    },
    {
      id: 'articles',
      title: 'Dashboard Artikel',
      subtitle: 'Gutenberg Block Workspace',
      href: '/admin/articles',
      icon: FileText,
    },
    {
      id: 'users',
      title: 'Kelola Pengguna',
      subtitle: 'Hak Akses & Admin',
      href: '/admin/users',
      icon: Users,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#1A222C] text-[#DEE4EE]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-[9999] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
            : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* TAILADMIN SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1C2434] border-r border-[#2E3A47] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${hideSidebar ? 'lg:hidden w-0 border-r-0 overflow-hidden' : sidebarOpen ? 'lg:w-72' : 'lg:w-20'}`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#2E3A47] bg-[#1C2434]">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#C9A227] flex items-center justify-center shrink-0 shadow-md shadow-[#D4AF37]/20">
              <ShieldCheck className="w-6 h-6 text-[#1C2434]" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif-title text-lg font-bold text-white tracking-wider leading-tight truncate">
                  Seleco
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-medium truncate">
                  Sedana legal consultant
                </span>
              </div>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 text-[#8A99AD] hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Section: MENU UTAMA */}
          <div>
            {sidebarOpen ? (
              <div className="px-3 mb-2 text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider">
                Menu Utama
              </div>
            ) : (
              <div className="h-4" />
            )}

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#333A48] text-white shadow-sm border-l-4 border-[#D4AF37]'
                        : 'text-[#DEE4EE] hover:bg-[#333A48]/60 hover:text-white'
                    }`}
                    title={item.title}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-[#8A99AD]'}`} />
                    {sidebarOpen && (
                      <div className="flex flex-col truncate">
                        <span className="truncate">{item.title}</span>
                        <span className="text-[10px] text-[#8A99AD] font-normal truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: SISTEM & STATUS SITUS */}
          {sidebarOpen && (
            <div className="pt-4 border-t border-[#2E3A47] space-y-4">
              <div className="px-3 text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider">
                Status Website
              </div>

              {/* Site Mode Switcher Widget */}
              <div className="bg-[#24303F] border border-[#2E3A47] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] text-[#8A99AD] uppercase font-semibold">Mode Akses:</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    currentSiteMode === 'live'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {currentSiteMode === 'live' ? 'Tayang (Live)' : 'Pengembangan'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1C2434] rounded-lg border border-[#2E3A47]">
                  <button
                    onClick={() => handleToggleMode('maintenance')}
                    disabled={isSwitchingMode}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      currentSiteMode === 'maintenance'
                        ? 'bg-amber-400 text-[#1C2434] shadow'
                        : 'text-[#8A99AD] hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${currentSiteMode === 'maintenance' ? 'bg-[#1C2434]' : 'bg-amber-400'}`} />
                    <span>Dev Mode</span>
                  </button>

                  <button
                    onClick={() => handleToggleMode('live')}
                    disabled={isSwitchingMode}
                    className={`py-1.5 px-2 rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      currentSiteMode === 'live'
                        ? 'bg-emerald-500 text-[#1C2434] shadow'
                        : 'text-[#8A99AD] hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${currentSiteMode === 'live' ? 'bg-[#1C2434]' : 'bg-emerald-400'}`} />
                    <span>Live</span>
                  </button>
                </div>
              </div>

              {/* External Live Preview */}
              <Link
                href="/?preview=true"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 bg-[#24303F] hover:bg-[#333A48] border border-[#2E3A47] rounded-xl text-xs font-semibold text-[#DEE4EE] transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pratinjau Publik</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8A99AD] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer: User Profile & Collapse Toggle */}
        <div className="p-4 border-t border-[#2E3A47] bg-[#1C2434]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-[#333A48] border border-[#2E3A47] flex items-center justify-center font-bold text-xs text-[#D4AF37] shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              {sidebarOpen && (
                <div className="flex flex-col truncate">
                  <span className="text-xs font-bold text-white truncate">
                    {currentUser?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-[#8A99AD] font-mono truncate">
                    @{currentUser?.username || 'admin'}
                  </span>
                </div>
              )}
            </div>

            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-2 text-[#8A99AD] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR / HEADER */}
        <header className="h-16 bg-[#1C2434] border-b border-[#2E3A47] px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
          {/* Left: Sidebar Toggle & Page Title */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-[#8A99AD] hover:text-white rounded-lg hover:bg-[#333A48] lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => {
                if (onToggleHideSidebar) {
                  onToggleHideSidebar();
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-2 text-[#8A99AD] hover:text-white rounded-lg hover:bg-[#333A48] hidden lg:block"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title / Breadcrumb */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8A99AD]">
                <span>Seleco Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-medium">
                  {title || (activeNav === 'editor' ? 'Editor Web' : activeNav === 'articles' ? 'Dashboard Artikel' : 'Kelola Pengguna')}
                </span>
              </div>
              {subtitle && (
                <p className="text-xs text-[#8A99AD] hidden sm:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: Custom Page Actions & Status Pill & User Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Custom page actions (e.g. Save button, device switcher, etc.) */}
            {headerActions && (
              <div className="flex items-center gap-2">
                {headerActions}
              </div>
            )}

            {/* Quick Status Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24303F] border border-[#2E3A47]">
              <span className={`w-2 h-2 rounded-full ${
                currentSiteMode === 'live' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`} />
              <span className="text-xs font-semibold text-[#DEE4EE]">
                {currentSiteMode === 'live' ? 'Mode Tayang' : 'Pengembangan'}
              </span>
            </div>

            {/* External Preview Link Button */}
            <Link
              href="/?preview=true"
              target="_blank"
              className="p-2 text-[#8A99AD] hover:text-white hover:bg-[#333A48] rounded-xl transition-colors hidden sm:flex items-center"
              title="Buka Pratinjau Website"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#333A48] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#333A48] border border-[#2E3A47] flex items-center justify-center font-bold text-xs text-[#D4AF37]">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-white truncate max-w-[100px]">
                    {currentUser?.name || 'Admin'}
                  </span>
                  <span className="text-[10px] text-[#8A99AD] uppercase font-mono">
                    {currentUser?.role || 'Superadmin'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A99AD] hidden xl:block" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-[#24303F] border border-[#2E3A47] rounded-xl shadow-2xl py-1.5 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2 border-b border-[#2E3A47]">
                    <div className="text-xs font-bold text-white">
                      {currentUser?.name || 'Administrator'}
                    </div>
                    <div className="text-[11px] text-[#8A99AD] font-mono truncate">
                      @{currentUser?.username || 'admin'}
                    </div>
                  </div>
                  <Link
                    href="/admin/users"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#DEE4EE] hover:bg-[#333A48] transition-colors"
                  >
                    <Users className="w-4 h-4 text-[#8A99AD]" />
                    <span>Kelola Pengguna</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className={`flex-1 min-w-0 bg-[#1A222C] ${fullHeight ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
