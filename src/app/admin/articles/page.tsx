import { Metadata } from 'next';
import AdminLayout from '@/components/layout/admin-layout';
import ArticleDashboard from '@/components/admin/ArticleDashboard';

export const metadata: Metadata = {
  title: 'Dashboard Artikel & Gutenberg Workspace | SELECO Admin',
  description: 'Kelola artikel regulasi, berita perizinan, imigrasi, perpajakan, pertanahan, dan SDM dengan Gutenberg Block Workspace.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArticlesAdminPage() {
  return (
    <AdminLayout
      activeNav="articles"
      title="Dashboard Artikel"
      breadcrumbTitle="Admin"
      breadcrumbHref="/admin"
      authNamespace="articles"
    >
      <ArticleDashboard />
    </AdminLayout>
  );
}
