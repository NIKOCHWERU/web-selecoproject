import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'SELECO | Sedana Corporate Consultant — Perizinan, Imigrasi, Pajak, Pertanahan & SDM',
  description: 'SELECO (Sedana Corporate Consultant) menyediakan 5 pilar konsultan profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM.',
  keywords: 'konsultan perizinan usaha, konsultan imigrasi kitas tka, konsultan pajak spt badan, konsultan pertanahan bpn, konsultan sdm ketenagakerjaan, seleco corporate consultant',
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
    title: 'SELECO — Sedana Corporate Consultant',
    description: '5 Pilar Konsultan Korporasi: Perizinan, Imigrasi, Pajak, Pertanahan & SDM (445+ Solusi Layanan)',
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

import React from 'react';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/contentService';
import SiteWrapper from '@/components/SiteWrapper';

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
          <React.Suspense fallback={<div className="min-h-screen bg-[#0B0F19]" />}>
            <SiteWrapper>{children}</SiteWrapper>
          </React.Suspense>
        </ContentProvider>
      </body>
    </html>
  );
}
