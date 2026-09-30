import { Metadata } from 'next';
import ElementorEditorClient from './ElementorEditorClient';

export const metadata: Metadata = {
  title: 'SELECO Elementor-Style Web Builder | /admin/editor',
  description: 'Visual builder ala Elementor untuk mengedit teks, foto, statistik, dan tata letak website SELECO secara langsung.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ElementorEditorPage() {
  return <ElementorEditorClient />;
}
