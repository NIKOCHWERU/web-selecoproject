'use client';

import React, { useEffect } from 'react';
import { useContent } from '@/context/ContentContext';

import Hero from '@/components/Hero';
import TrustStatsBanner from '@/components/TrustStatsBanner';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import RetainerSection from '@/components/RetainerSection';
import TeamSection from '@/components/TeamSection';
import InsightsSection from '@/components/InsightsSection';
import FAQSection from '@/components/FAQSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function AdminPreviewPage() {
  const { setContent } = useContent();

  useEffect(() => {
    // 1. Initial check from sessionStorage
    try {
      const cached = sessionStorage.getItem('seleco_live_preview_content');
      if (cached) {
        const parsed = JSON.parse(cached);
        setContent(parsed);
      }
    } catch (e) {
      console.error('Failed to read cached content:', e);
    }

    // 2. Listen to real-time sync messages from /admin parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_SITE_CONTENT' && event.data.content) {
        setContent(event.data.content);
      }
    };

    window.addEventListener('message', handleMessage);

    // 3. Notify parent that iframe is ready to receive content
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_IFRAME_READY' }, '*');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setContent]);

  return (
    <div className="w-full bg-white text-slate-900 overflow-x-hidden">
      <Hero />
      <TrustStatsBanner />
      <AboutSection showMoreLink={true} />
      <ServicesSection />
      <RetainerSection />
      <TeamSection />
      <InsightsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
