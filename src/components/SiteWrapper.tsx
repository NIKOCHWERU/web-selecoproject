'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import MaintenancePage from '@/components/MaintenancePage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWA from '@/components/FloatingWA';
import { Sliders, ShieldAlert } from 'lucide-react';

interface SiteWrapperProps {
  children: React.ReactNode;
}

export default function SiteWrapper({ children }: SiteWrapperProps) {
  const { content } = useContent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isAdminOrPreview, setIsAdminOrPreview] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const hasAdminSession = sessionStorage.getItem('seleco_admin_auth') === 'true';
    const hasPreviewParam = searchParams.get('preview') === 'true';
    if (hasAdminSession || hasPreviewParam) {
      setIsAdminOrPreview(true);
    }
  }, [searchParams]);

  // Always render children directly for admin and internal routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return <>{children}</>;
  }

  const isMaintenance = content?.siteMode?.status === 'maintenance';

  // If in maintenance mode and user is not admin/previewing
  if (isMaintenance && !isAdminOrPreview) {
    return <MaintenancePage content={content} />;
  }

  // If in maintenance mode BUT user is previewing as admin
  return (
    <>
      {isMaintenance && isAdminOrPreview && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>
              MODE PRATINJAU: Situs berstatus &quot;Dalam Pengembangan&quot; untuk publik. Hanya Anda yang dapat melihat pratinjau ini.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-2.5 py-1 bg-slate-950 text-amber-300 rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1 shrink-0"
          >
            <Sliders className="w-3 h-3" />
            <span>Atur Mode di Admin</span>
          </Link>
        </div>
      )}

      <Navbar />
      <main className="flex-grow">{children}</main>
      <FloatingWA />
      <Footer />
    </>
  );
}
