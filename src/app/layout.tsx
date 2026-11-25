import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import React from 'react';
import { ContentProvider } from '@/context/ContentContext';
import { getSiteContent } from '@/lib/contentService';
import SiteWrapper from '@/components/SiteWrapper';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'SELECO | SEDANA LEGAL CONSULTANT | Perizinan, Imigrasi, Pajak, Pertanahan & SDM',
  description: 'SELECO (SEDANA LEGAL CONSULTANT) menyediakan 5 pilar konsultan profesional: Konsultan Perizinan, Konsultan Imigrasi, Konsultan Pajak, Konsultan Pertanahan, dan Konsultan SDM.',
  keywords: 'konsultan perizinan usaha, konsultan imigrasi kitas tka, konsultan pajak spt badan, konsultan pertanahan bpn, konsultan sdm ketenagakerjaan, seleco sedana legal consultant',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'SELECO | SEDANA LEGAL CONSULTANT',
    description: '5 Pilar Konsultan: Perizinan, Imigrasi, Pajak, Pertanahan & SDM (445+ Solusi Layanan)',
    url: `https://${process.env.NEXT_PUBLIC_DOMAIN || 'selecoproject.com'}`,
    siteName: 'SELECO',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SELECO Corporate Office',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=20261124' },
      { url: '/logo-icon.png?v=20261124', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=20261124',
    apple: [
      { url: '/apple-touch-icon.png?v=20261124', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContent = getSiteContent();

  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} scroll-smooth`}>
      <body className={`${plusJakartaSans.className} bg-white text-slate-900 antialiased min-h-screen flex flex-col justify-between selection:bg-[#dfa82e]/20 selection:text-[#0a1420]`}>
        <ContentProvider initialContent={initialContent}>
          <SiteWrapper>{children}</SiteWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
