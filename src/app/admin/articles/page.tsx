import { Metadata } from 'next';
import TailAdminLayout from '@/components/admin/TailAdminLayout';
import ArticleDashboard from '@/components/admin/ArticleDashboard';

export const metadata: Metadata = {
  title: 'Dashboard Artikel & Gutenberg Workspace | Seleco Admin',
  description: 'Kelola artikel regulasi, berita perizinan, imigrasi, perpajakan, pertanahan, dan SDM dengan Gutenberg Block Workspace.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArticlesAdminPage() {
  return (
    <TailAdminLayout
      activeNav="articles"
      title="Dashboard Artikel"
      subtitle="Kelola publikasi dan tulis artikel dengan editor blok Gutenberg"
    >
      <ArticleDashboard />
    </TailAdminLayout>
  );
}
