'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
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

function PreviewDetector({ onDetect }: { onDetect: (isPreview: boolean) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const hasAdminSession = typeof window !== 'undefined' && sessionStorage.getItem('seleco_admin_auth') === 'true';
    const hasPreviewParam = searchParams.get('preview') === 'true';
    onDetect(hasAdminSession || hasPreviewParam);
  }, [searchParams, onDetect]);
  return null;
}

export default function SiteWrapper({ children }: SiteWrapperProps) {
  const { content } = useContent();
  const pathname = usePathname();
  const [isAdminOrPreview, setIsAdminOrPreview] = useState<boolean>(false);

  const handleDetect = useCallback((status: boolean) => {
    setIsAdminOrPreview(status);
  }, []);

  // Always render children directly for admin, edit-view, and api routes
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/edit-view') || 
    pathname.startsWith('/api')
  ) {
    return <>{children}</>;
  }

  // Site is in maintenance mode only if status is explicitly 'maintenance'
  const isMaintenance = content?.siteMode?.status === 'maintenance';

  // If in maintenance mode and user is not admin previewing
  if (isMaintenance && !isAdminOrPreview) {
    return (
      <>
        <Suspense fallback={null}>
          <PreviewDetector onDetect={handleDetect} />
        </Suspense>
        <MaintenancePage content={content} />
      </>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <PreviewDetector onDetect={handleDetect} />
      </Suspense>

      {isMaintenance && isAdminOrPreview && (
        <div className="bg-[#b88917] text-[#0f2034] px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#0f2034] shrink-0" />
            <span>
              MODE PRATINJAU ADMIN: Situs berstatus &quot;Dalam Pengembangan&quot; untuk publik. Pengunjung biasa melihat halaman pemeliharaan.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin/editor"
              className="px-2.5 py-1 bg-[#0f2034] text-white rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1"
            >
              <span>Editor Web</span>
            </Link>
            <Link
              href="/admin"
              className="px-2.5 py-1 bg-white/20 text-[#0f2034] rounded text-[11px] font-bold hover:brightness-125 transition-all flex items-center gap-1"
            >
              <Sliders className="w-3 h-3 text-[#0f2034]" />
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
