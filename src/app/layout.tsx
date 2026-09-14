import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'SELECO | Sedana Corporate & Legal Consultant — Licensing & Corporate Services',
  description: 'SELECO (Sedana Legal Consultant) memberikan layanan pendampingan legalitas bisnis, pendirian badan usaha, kepatuhan regulasi, serta 411+ perizinan usaha OSS RBA di Indonesia.',
  keywords: 'konsultan perizinan usaha, corporate legal consultant, 411 perizinan usaha OSS RBA, pendirian PT CV PMA, BPOM Halal SNI, legal retainer perusahaan, konsultan perizinan Jakarta',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SELECO — Sedana Corporate & Legal Consultant',
    description: 'Konsultan Legalitas & Direktorat Perizinan Usaha Indonesia (445+ Layanan & Perizinan OSS RBA)',
    url: `https://${process.env.NEXT_PUBLIC_DOMAIN || 'selecoproject.com'}`,
    siteName: 'SELECO Corporate Consultant',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SELECO Corporate Office',
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
