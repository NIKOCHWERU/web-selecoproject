'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/layout/admin-sidebar';
import AdminHeader from '@/components/layout/admin-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeNav?: 'hub' | 'editor' | 'articles' | 'users';
  title?: string;
  subtitle?: string;
  breadcrumbTitle?: string;
  breadcrumbHref?: string;
  authNamespace?: 'editor' | 'articles' | 'users' | 'hub';
}

export default function AdminLayout({
  children,
  activeNav = 'hub',
  title = 'Dashboard',
  subtitle,
  breadcrumbTitle = 'Admin Hub',
  breadcrumbHref = '/admin',
  authNamespace = 'hub',
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Auth State
  const AUTH_KEY = `seleco_admin_auth_${authNamespace}`;
  const USER_KEY = `seleco_admin_user_${authNamespace}`;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ id?: string; username: string; name: string; role: string } | null>(null);

  // Login Form State
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Site Mode State
  const [siteMode, setSiteMode] = useState<'maintenance' | 'live'>('maintenance');
  const [isSwitchingMode, setIsSwitchingMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    // Check global or namespace auth
    const auth = sessionStorage.getItem(AUTH_KEY) || sessionStorage.getItem('seleco_admin_auth');
    const storedUser = sessionStorage.getItem(USER_KEY) || sessionStorage.getItem('seleco_admin_user');

    if (auth === 'true') {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {}
      }
    }
    setCheckingAuth(false);

    // Fetch site status
    fetch('/api/admin/content', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.content?.siteMode?.status) {
          setSiteMode(data.content.siteMode.status);
        }
      })
      .catch(() => {});
  }, [AUTH_KEY, USER_KEY]);

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
        sessionStorage.setItem('seleco_admin_auth_editor', 'true');
        sessionStorage.setItem('seleco_admin_auth_articles', 'true');
        sessionStorage.setItem('seleco_admin_auth_users', 'true');
        sessionStorage.setItem(AUTH_KEY, 'true');

        if (data.user) {
          sessionStorage.setItem('seleco_admin_user', JSON.stringify(data.user));
          sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
          setCurrentUser(data.user);
        }
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Username atau password tidak sesuai.');
      }
    } catch (err) {
      setAuthError('Gagal terhubung ke server autentikasi.');
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
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
  };

  const handleToggleSiteMode = async (mode: 'maintenance' | 'live') => {
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

  // Loading Screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icons.spinner className="size-8 animate-spin text-[#dfa82e]" />
      </div>
    );
  }

  // Shadcn Login Card matching template
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border bg-card shadow-2xl p-6 sm:p-8">
          <CardHeader className="text-center pb-6">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white p-2 border border-border mx-auto mb-3 shadow-md">
              <img
                src="/logo-seleco.png"
                alt="SELECO"
                className="size-10 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              SELECO Admin Hub
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Sedana Legal Consultant • Dashboard Management System
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/15 p-3 text-xs text-red-400">
                <Icons.alertCircle className="size-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Username</label>
                <Input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isAuthenticating}
                className="w-full mt-2 font-bold"
              >
                {isAuthenticating ? (
                  <Icons.spinner className="size-4 animate-spin mr-2" />
                ) : (
                  <Icons.lock className="size-4 mr-2" />
                )}
                <span>Masuk ke Dashboard</span>
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center text-center text-[11px] text-muted-foreground pt-4 border-t border-border">
            Sistem Administrasi Khusus Tim Legal &amp; Manajemen SELECO
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Authenticated Layout with Shadcn Sidebar & Header
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-medium shadow-2xl border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/50'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <Icons.circleCheck className="size-4 text-emerald-400" />
          ) : (
            <Icons.alertCircle className="size-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Modern Shadcn Sidebar */}
      <AdminSidebar currentUser={currentUser} onLogout={handleLogout} />

      {/* Main Content Area */}
      <SidebarInset id="main-content">
        <AdminHeader
          breadcrumbTitle={breadcrumbTitle}
          breadcrumbHref={breadcrumbHref}
          currentPageTitle={title}
          siteMode={siteMode}
          onToggleSiteMode={handleToggleSiteMode}
          isSwitchingMode={isSwitchingMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
