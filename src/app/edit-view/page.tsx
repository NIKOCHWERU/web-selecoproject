import { Metadata } from 'next';
import EditViewClient from './EditViewClient';

export const metadata: Metadata = {
  title: 'SELECO Visual Live Editor | /edit-view',
  description: 'Panel visual live editor ala Elementor untuk mengedit teks, link, foto, dan tata letak website SELECO secara langsung.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditViewPage() {
  return <EditViewClient />;
}
