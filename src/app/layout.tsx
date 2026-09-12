import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'SELECO | Sedana Legal Consultant — Strategic Legal Counsel & Licensing Directory',
  description: 'SELECO (Sedana Legal Consultant) memberikan pendampingan hukum strategis, perancangan kontrak bisnis, kepatuhan regulasi, 34 perkara litigasi/non-litigasi, serta 411+ perizinan & legalitas usaha di Indonesia.',
  keywords: 'legal consultant Indonesia, corporate legal consultant, 411 perizinan usaha OSS, perizinan BPOM Halal SNI, perkara hukum litigasi non litigasi, legal retainer, konsultan hukum Jakarta',
  openGraph: {
    title: 'SELECO — Sedana Legal Consultant',
    description: 'Pendampingan Hukum Strategis & Direktorat Perizinan Usaha Indonesia (445+ Layanan Hukum & Legalitas)',
    url: `https://${process.env.NEXT_PUBLIC_DOMAIN || 'selecoproject.com'}`,
    siteName: 'SELECO Law Firm',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SELECO Lady Justice Dewi Keadilan',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

import FloatingWA from '@/components/FloatingWA';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/contentService';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = getSiteContent();

  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-white text-slate-900 antialiased min-h-screen flex flex-col justify-between selection:bg-gold-accent selection:text-navy-deep">
        <ContentProvider initialContent={initialContent}>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <FloatingWA />
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
