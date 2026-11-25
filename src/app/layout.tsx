import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
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

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'SELECO | Konsultan Hukum, Perizinan, Imigrasi, Pajak & SDM se-Indonesia',
  description: 'PT SELECO SWAKARYA NUSANTARA (SELECO) - layanan komprehensif dan terintegrasi untuk perizinan OSS RBA, imigrasi, pajak, pertanahan, dan ketenagakerjaan. Solusi efektif dan pasti, #YouBetterWithUs.',
  keywords: 'konsultan perizinan usaha, konsultan imigrasi kitas tka, konsultan pajak spt badan, konsultan pertanahan bpn, konsultan sdm ketenagakerjaan, seleco sedana legal consultant, pt seleco swakarya nusantara',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: 'SELECO | Konsultan Hukum, Perizinan, Imigrasi, Pajak & SDM se-Indonesia',
    description: 'PT SELECO SWAKARYA NUSANTARA (SELECO) - layanan komprehensif dan terintegrasi untuk perizinan OSS RBA, imigrasi, pajak, pertanahan, dan ketenagakerjaan. Solusi efektif dan pasti, #YouBetterWithUs.',
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
    <html lang="id" className={`${inter.variable} ${playfairDisplay.variable} scroll-smooth`}>
      <body className={`${inter.className} bg-gray-50 text-[#0a1420] antialiased min-h-screen flex flex-col justify-between selection:bg-[#dfa82e]/20 selection:text-[#0a1420]`}>
        <ContentProvider initialContent={initialContent}>
          <SiteWrapper>{children}</SiteWrapper>
        </ContentProvider>
      </body>
    </html>
  );
}
