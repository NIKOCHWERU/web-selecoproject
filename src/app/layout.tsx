import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/contentService';
import SiteWrapper from '@/components/SiteWrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'SELECO | SEDANA LEGAL CONSULTANT — Perizinan, Imigrasi, Pajak, Pertanahan & SDM',
  description: 'SELECO (SEDANA LEGAL CONSULTANT) menyediakan 5 pilar konsultan profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM.',
  keywords: 'konsultan perizinan usaha, konsultan imigrasi kitas tka, konsultan pajak spt badan, konsultan pertanahan bpn, konsultan sdm ketenagakerjaan, seleco sedana legal consultant',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'SELECO — SEDANA LEGAL CONSULTANT',
    description: '5 Pilar Konsultan: Perizinan, Imigrasi, Pajak, Pertanahan & SDM (445+ Solusi Layanan)',
    url: `https://${process.env.NEXT_PUBLIC_DOMAIN || 'selecoproject.com'}`,
    siteName: 'SELECO',
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
  icons: {
    icon: '/logo-seleco.png',
    shortcut: '/logo-seleco.png',
    apple: '/logo-seleco.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = getSiteContent();

  return (
    <html lang="id" className={`${inter.variable} ${cormorantGaramond.variable} scroll-smooth`}>
      <body className={`${inter.className} bg-[#0a1420] text-slate-100 antialiased min-h-screen flex flex-col justify-between selection:bg-[#b88917] selection:text-white`}>
        <ContentProvider initialContent={initialContent}>
          <SiteWrapper>{children}</SiteWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
