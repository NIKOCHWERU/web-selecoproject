'use client';

import React from 'react';
import AdminLayout from '@/components/layout/admin-layout';

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
  authNamespace?: 'editor' | 'articles' | 'users';
}

export default function TailAdminLayout({
  children,
  activeNav,
  title = 'Dashboard',
  subtitle,
  authNamespace = 'editor',
}: TailAdminLayoutProps) {
  return (
    <AdminLayout
      activeNav={activeNav}
      title={title}
      subtitle={subtitle}
      breadcrumbTitle="Admin"
      breadcrumbHref="/admin"
      authNamespace={authNamespace}
    >
      {children}
    </AdminLayout>
  );
}
