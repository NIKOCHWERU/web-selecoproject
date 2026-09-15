'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import MaintenancePage from '@/components/MaintenancePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWA from '@/components/FloatingWA';
import { Sliders, ShieldAlert, Code2, EyeOff } from 'lucide-react';

interface SiteWrapperProps {
  children: React.ReactNode;
}

export default function SiteWrapper({ children }: SiteWrapperProps) {
  const { content } = useContent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isAdminOrPreview, setIsAdminOrPreview] = useState<boolean>(false);
  const [isDevAccess, setIsDevAccess] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const hasAdminSession = sessionStorage.getItem('seleco_admin_auth') === 'true';
    const hasPreviewParam = searchParams.get('preview') === 'true';
    const hasDevStorage = localStorage.getItem('seleco_dev_mode') === 'true';

    if (hasDevStorage) {
      setIsDevAccess(true);
    }
    if (hasAdminSession || hasPreviewParam || hasDevStorage) {
      setIsAdminOrPreview(true);
    }
  }, [searchParams]);

  const handleExitDevMode = () => {
    localStorage.removeItem('seleco_dev_mode');
    setIsDevAccess(false);
    setIsAdminOrPreview(false);
    window.location.href = '/';
  };

  // Always render children directly for admin, api, and dev routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/dev')) {
    return <>{children}</>;
  }

  const isMaintenance = content?.siteMode?.status === 'maintenance';

  // If in maintenance mode and user is not admin/developer previewing
  if (isMaintenance && !isAdminOrPreview) {
    return <MaintenancePage content={content} />;
  }

  // If in maintenance mode BUT user is previewing as admin or developer
  return (
    <>
      {isMaintenance && isAdminOrPreview && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            {isDevAccess ? <Code2 className="w-4 h-4 text-slate-950" /> : <ShieldAlert className="w-4 h-4 text-slate-950" />}
            <span>
              {isDevAccess
                ? 'MODE DEVELOPER AKTIF: Anda sedang melihat website penuh. Pengunjung publik melihat halaman "Dalam Pengembangan".'
                : 'MODE PRATINJAU: Situs berstatus "Dalam Pengembangan" untuk publik. Hanya Anda yang dapat melihat pratinjau ini.'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin"
              className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>Dashboard Admin</span>
            </Link>
            {isDevAccess && (
              <button
                onClick={handleExitDevMode}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 border border-slate-950/20 rounded text-[11px] font-bold transition-all flex items-center gap-1"
                title="Keluar dari Developer Mode dan lihat halaman publik"
              >
                <EyeOff className="w-3 h-3" />
                <span>Kunci / Keluar Dev Mode</span>
              </button>
            )}
          </div>
        </div>
      )}

      <Navbar />
      <main className="flex-grow">{children}</main>
      <FloatingWA />
      <Footer />
    </>
  );
}
