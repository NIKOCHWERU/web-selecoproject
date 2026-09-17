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
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const hasAdminSession = sessionStorage.getItem('seleco_admin_auth') === 'true';
    const hasPreviewParam = searchParams.get('preview') === 'true';

    // Only allow full website access if explicitly in preview mode or with active admin session
    if (hasAdminSession || hasPreviewParam) {
      setIsAdminOrPreview(true);
    } else {
      setIsAdminOrPreview(false);
    }
  }, [searchParams]);

  // Always render children directly for admin, edit-view, and api routes
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/edit-view') || 
    pathname.startsWith('/api')
  ) {
    return <>{children}</>;
  }

  // Site is in maintenance mode unless explicitly set to 'live'
  const isMaintenance = content?.siteMode?.status !== 'live';

  // If in maintenance mode and user is not admin previewing
  if (isMaintenance && !isAdminOrPreview) {
    return <MaintenancePage content={content} />;
  }

  // If in maintenance mode BUT user is previewing as admin
  return (
    <>
      {isMaintenance && isAdminOrPreview && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              MODE PRATINJAU ADMIN: Situs berstatus &quot;Dalam Pengembangan&quot; untuk publik. Pengunjung biasa melihat halaman pemeliharaan.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/edit-view"
              className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1"
            >
              <span>Editor Visual (/edit-view)</span>
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1"
            >
              <Sliders className="w-3 h-3 text-amber-300" />
              <span>Dashboard Admin</span>
            </Link>
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
