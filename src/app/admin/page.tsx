import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'SELECO Visual Builder & Website Editor | /admin',
  description: 'Panel visual editor ala Elementor untuk mengelola teks, foto, statistik, artikel, dan kontak website SELECO.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}
